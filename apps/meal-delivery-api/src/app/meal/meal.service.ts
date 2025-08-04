import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Meal as MealModel, MealDocument } from '../schema/meal.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MealInfo, ResourceId } from '@md/data';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import {
  StudentHouse,
  StudentHouseDocument,
} from '../schema/studentHouse.schema';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(MealModel.name) private mealModel: Model<MealDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(StudentHouse.name)
    private studentHouseModel: Model<StudentHouseDocument>,
    private neo4j: Neo4jService
  ) {}

  async createMeal(mealInfo: MealInfo, ownerId: string): Promise<ResourceId> {
    const owner = await this.userModel
      .findOne({ id: ownerId })
      .select('_id role');

    if (!owner || owner.role === 'student') {
      throw new HttpException(
        owner
          ? `You must be a cook or admin to create a meal`
          : `Owner with ID ${ownerId} not found`,
        HttpStatus.BAD_REQUEST
      );
    }

    const studentHouse = await this.studentHouseModel.findOne({
      id: mealInfo.studentHouseId,
    });
    const meal = new this.mealModel({
      id: mealInfo.id,
      name: mealInfo.name,
      price: mealInfo.price,
      deliveryTime: mealInfo.deliveryTime,
      deliveryDate: mealInfo.deliveryDate,
      ownerRef: owner._id,
      studentHouse: studentHouse,
    });
    await meal.save();
    const mealId = meal.id;
    await this.neo4j.singleWrite(
      'CREATE (:Meal {id: $mealId, name: $mealName})',
      { mealId, mealName: mealInfo.name }
    );
    return mealId;
  }

  async getAll(): Promise<MealInfo[]> {
    return this.mealModel
      .find({}, { _id: 0, __v: 0 })
      .populate('ownerRef', { _id: 0, __v: 0 });
  }

  async getOne(mealId: string): Promise<MealInfo> {
    // Used aggregate to find meal and populate owner because Type '(Document<unknown, any, Meal> & Meal & { _id: ObjectId; } & Required<{ _id: ObjectId; }>)[]' is missing the following properties from type 'MealInfo': id, name, price, deliveryTime, and 3 more.
    const meals = await this.mealModel.aggregate([
      { $match: { id: mealId } },
      { $project: { _id: 0, __v: 0 } },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerRef',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $project: { owner: { _id: 0, __v: 0 } } },
    ]);
    return meals[0];
  }

  async updateMeal(
    mealId: string,
    mealInfo: MealInfo,
    ownerId: string
  ): Promise<MealInfo> {
    const meal = await this.mealModel
      .findOne({ id: mealId })
      .populate('ownerRef');
    const owner = await this.userModel.findOne({ id: ownerId });

    if (!owner) {
      throw new HttpException('Owner not found', HttpStatus.BAD_REQUEST);
    }
    if (owner.role !== 'admin' && ownerId !== meal?.ownerRef?.id) {
      throw new HttpException(
        'You are not the owner of this meal.',
        HttpStatus.BAD_REQUEST
      );
    }
    if (!meal) {
      throw new HttpException('Meal does not exist', HttpStatus.BAD_REQUEST);
    }

    try {
      const { ownerRef } = meal;
      await this.mealModel.updateOne(
        { id: mealId },
        {
          $set: {
            name: mealInfo.name,
            price: mealInfo.price,
            deliveryTime: mealInfo.deliveryTime,
            deliveryDate: mealInfo.deliveryDate,
            owner: mealInfo.owner,
            ownerRef: ownerRef,
          },
        }
      );
    } catch (e) {
      let errorMessage = 'Failed to do something exceptional';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    return mealInfo;
  }

  async deleteOne(mealId: string, ownerId: string) {
    const { owner, ...meal } = await this.getOne(mealId);
    const foundOwner = await this.userModel.findOne({ id: ownerId });

    if (!meal) {
      throw new HttpException('Meal does not exist', HttpStatus.BAD_REQUEST);
    }
    if (!foundOwner) {
      throw new HttpException('Owner not found', HttpStatus.BAD_REQUEST);
    }
    if (owner![0].id !== ownerId) {
      throw new HttpException(
        'You are not the owner of this meal.',
        HttpStatus.BAD_REQUEST
      );
    }

    await this.mealModel.deleteOne({ id: mealId });
    const query = `MATCH (m:Meal {id: '${mealId}'}) DELETE m`;
    await this.neo4j.singleWrite(query);
  }
}

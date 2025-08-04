import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  StudentHouse as StudentHouseModel,
  StudentHouseDocument,
} from '../schema/studentHouse.schema';
import { InjectModel } from '@nestjs/mongoose';
import { StudentHouseInfo, ResourceId } from '@md/data';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class StudentHouseService {
  constructor(
    @InjectModel(StudentHouseModel.name)
    private studentHouseModel: Model<StudentHouseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createStudentHouse(
    studentHouseInfo: StudentHouseInfo
  ): Promise<ResourceId> {
    const studentHouse = new this.studentHouseModel({
      id: studentHouseInfo.id,
      streetAndNmr: studentHouseInfo.streetAndNmr,
      city: studentHouseInfo.city,
      postcode: studentHouseInfo.postcode,
    });
    await studentHouse.save();
    return studentHouse.id;
  }

  async getAll(): Promise<StudentHouseInfo[]> {
    return this.studentHouseModel.find({}, { _id: 0, __v: 0 });
  }

  async getOne(studentHouseId: string): Promise<StudentHouseInfo> {
    const studentHouses = await this.studentHouseModel.aggregate([
      { $match: { id: studentHouseId } },
    ]);
    return studentHouses[0];
  }

  async updateStudentHouse(
    studentHouseId: string,
    studentHouseInfo: StudentHouseInfo,
    studentId: string
  ): Promise<StudentHouseInfo> {
    const studentHouse = await this.studentHouseModel.findOne({
      id: studentHouseId,
    });
    const student = await this.userModel.findOne({ id: studentId });
    if (!student) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (studentHouse) {
      try {
        await this.studentHouseModel.updateOne({ id: studentHouseId }, [
          {
            $set: {
              id: studentHouseId,
              streetAndNmr: studentHouseInfo.streetAndNmr,
              city: studentHouseInfo.city,
              postcode: studentHouseInfo.postcode,
            },
          },
        ]);
      } catch (e) {
        let errorMessage = 'Failed to do something exceptional';
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException(
        'StudentHouse does not exist',
        HttpStatus.BAD_REQUEST
      );
    }

    return studentHouseInfo;
  }

  async deleteOne(studentHouseId: string) {
    const studentHouse = await this.getOne(studentHouseId);
    if (studentHouse) {
      await this.studentHouseModel.deleteOne({ id: studentHouseId });
    } else {
      throw new HttpException(
        'StudentHouse does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userInfo } from 'os';
// import {User, Gender} from '../meals.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  componentId: string | null | undefined;
  componentExists: boolean = false;
  // user: User | undefined;
  // HIJ HEEFT HIER ZOVEEL DINGEN WTF
  // moet ook models ergens halen

  // meals.service.ts ergens vandaan halen
  // constructor() {private route: ActivatedRoute, private router: Router, private userService: ComponentAService}
  constructor() {}

  ngOnInit(): void {
    console.log('Edit component ingeladen');

    // this.route.paramMap.subscribe(params)=>{
    //   this.componentId = params.get("id");
    //   if(this.componentId){
    //     this.componentExists = true;
    //   }else{
    //     console.log("Nieuwe component");
    //     this.componentExists = false;

    //     this.user = {
    //       firstName: "",
    //       lastName: "",
    //       emailAddress: "",
    //       birthDate: new Date(),
    //       // gender: Gender.unknown
    //     }
    // }
  }

  onSubmit() {
    console.log('Submitting the form.');
    // // User toevoegen aan UserArray.
    // if (this.componentExists) {
    //   // Update bestaande entry in arraylist
    //   this.userService.updateUser(this.user);
    // } else {
    //   // Create new entry
    //   this.userService.addUser(this.user);
    //   this.router.navigate(['..']);
    // }
  }

  // // SERVICE A COMPONENT:::::
  // getAllUsers() User[]{
  //   return this.users;
  // }

  // getUserById(id: string): User{
  //   return this.users.filter((user: User))=> userInfo.id === id[0];
  // }

  // addUser(user: User){

  // }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
  users: User[] | undefined;

  constructor(private aService: UserService) {}

  ngOnInit(): void {
    this.users = this.aService.getAllUsers();
    console.log(this.users.length + ' users found.');
  }

  ngOnDestroy(): void {
    console.log('ListComponent.ngOnDestroy');
  }
}

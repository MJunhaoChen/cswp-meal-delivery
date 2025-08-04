import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SaveEditedWorkGuard } from '../../../auth/auth.guards';
import { StudentHouse } from '../studentHouse.model';
import { StudentHouseService } from '../studentHouse.service';

@Component({
  selector: 'studentHouse-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  studentHouses$!: Observable<StudentHouse[] | null | undefined>;

  constructor(
    private studentHouseService: StudentHouseService,
    private saveEditedWorkGuard: SaveEditedWorkGuard
  ) {}

  ngOnInit(): void {
    this.studentHouses$ = this.studentHouseService.getAllStudentHouses();
  }

  deleteStudentHouse(id: string) {
    this.saveEditedWorkGuard.canDeactivate().then((result) => {
      if (result) {
        this.studentHouseService.deleteStudentHouse(id).subscribe(() => {
          this.studentHouses$ = this.studentHouseService.getAllStudentHouses();
        });
      }
    });
  }
}

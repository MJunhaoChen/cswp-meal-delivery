import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { StudentHouse } from '../studentHouse.model';
import { StudentHouseService } from '../studentHouse.service';

@Component({
  selector: 'studentHouse-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  studentHouse$!: Observable<StudentHouse | null | undefined>;

  constructor(
    private route: ActivatedRoute,
    private studentHouseService: StudentHouseService
  ) {}

  ngOnInit(): void {
    this.studentHouse$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.studentHouseService.getStudentHouseById(params.get('id')!)
      )
    );
  }
}

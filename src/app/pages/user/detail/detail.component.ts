import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from "../user.model";
import {UserService} from "../user.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  componentId: string | null | undefined;
  user: User | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.componentId = params.get("id");
      if (this.componentId) {
        // Bestaande user
        console.log("Bestaande component");
        this.user = this.userService.getUserById(this.componentId);
      } else {
        // Nieuwe user
        console.log("Nieuwe component");
      }
    });
  }
}

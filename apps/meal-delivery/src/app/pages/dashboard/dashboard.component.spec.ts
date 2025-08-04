import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../environments/environment';
import { ConfigModule } from '../../shared/moduleconfig/config.module';
import { jest } from '@jest/globals';

import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';
import { UserInfo } from '@md/data';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const loggedInUser: UserInfo = {
    id: '20985b89-697d-4656-8455-c71f403e2774',
    emailAddress: 'testuser@hotmail.com',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpb24iLCJpZCI6IjIwOTg1Yjg5LTY5N2QtNDY1Ni04NDU1LWM3MWY0MDNlMjc3NCIsImlhdCI6MTY2NzIxMzE2MX0.rWTA4V_iE662T03Oty7bK2YmGxP5kc1h6IH9z_fArV0',
    username: 'testuser',
    isGraduated: false,
    role: 'student',
  };

  const authServiceSpy = {
    login: jest.fn(),
    logout: jest.fn(),
    getFromLocalStorage: jest.fn(),
    currentUserInfo$: of(loggedInUser),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ConfigModule.forRoot({ apiEndpoint: environment.SERVER_API_URL }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.apiUrl).toBe('http://localhost:3333/');
    component.loggedInUser$.subscribe((user) => {
      if (!user) fail();
      if (user) {
        expect(user.emailAddress).toBe(loggedInUser.emailAddress);
      }
    });
  });
});

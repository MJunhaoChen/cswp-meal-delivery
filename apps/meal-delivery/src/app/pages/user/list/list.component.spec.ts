import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IToken } from '@md/data';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SaveEditedWorkGuard } from '../../../auth/auth.guards';
import { AuthService } from '../../../auth/auth.service';
import { ConfigModule } from '../../../shared/moduleconfig/config.module';
import { UserService } from '../user.service';

import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let userServiceSpy: UserService;
  let authServiceSpy: AuthService;
  let expectedUserData = {
    id: 'mockId',
    emailAddress: 'mockEmail',
    token: 'mockToken',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ConfigModule.forRoot({ apiEndpoint: environment.SERVER_API_URL }),
      ],
      providers: [SaveEditedWorkGuard],
    }).compileComponents();
  });

  beforeEach(() => {
    // authServiceSpy = jasmine.createSpyObj('AuthService', [
    //   'decodeJwtToken',
    //   'checkIsOwner',
    //   'checkIsAdmin',
    //   'checkIsStudent',
    //   'login',
    //   'register',
    //   'logout',
    //   'getUserFromLocalStorage',
    //   'getAuthorizationToken',
    //   'getCurrentUserId',
    // ]);

    // const mockUser$ = new BehaviorSubject<IToken | undefined>(expectedUserData);
    // authServiceSpy.currentUser$ = mockUser$;

    // userServiceSpy = jasmine.createSpyObj('UserService', [
    //   'getAllUsers',
    //   'getUserById',
    //   'addUser',
    //   'updateUser',
    //   'deleteUser',
    // ]);

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

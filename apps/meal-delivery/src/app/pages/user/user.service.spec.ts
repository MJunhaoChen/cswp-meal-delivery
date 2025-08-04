import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ConfigModule } from '../../shared/moduleconfig/config.module';
import { UserService } from './user.service';
import { httpInterceptorProviders } from '../../token.interceptor';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({ apiEndpoint: environment.SERVER_API_URL }),
      ],
      providers: [{ provide: HttpClient }, httpInterceptorProviders],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of users', (done: DoneFn) => {
    service.getAllUsers().subscribe((users) => {
      expect(users).toBeInstanceOf(Array);
      expect(users).toBeGreaterThan(0);
    });
    done();
  });

  it('should return user', (done: DoneFn) => {
    service
      .getUserById('c311ac5b-21fb-46bf-ab6d-7ed503a260d2')
      .subscribe((user) => {
        expect(user!.username).toEqual('John');
        expect(user!.emailAddress).toEqual('john@example.com');
        expect(user!.isGraduated).toBeFalse();
        expect(user!.role).toEqual('student');
      });
    done();
  });

  it('should add a user', (done: DoneFn) => {
    const newUser = {
      id: '1',
      username: 'John',
      emailAddress: 'john@example.com',
      isGraduated: false,
      role: 'student',
      token: 'secret_token',
    };
    service.addUser(newUser);
    service
      .getUserById('c311ac5b-21fb-46bf-ab6d-7ed503a260d2')
      .subscribe((user) => {
        expect(user).toEqual(newUser);
      });
    done();
  });

  it('should update a user', (done: DoneFn) => {
    const updatedUser = {
      id: '1',
      username: 'John',
      emailAddress: 'john@example.com',
      isGraduated: false,
      role: 'student',
      token: 'secret_token',
    };
    service.updateUser(updatedUser);
    done();
  });

  it('should delete a user', (done: DoneFn) => {
    service.deleteUser('c311ac5b-21fb-46bf-ab6d-7ed503a260d2');
    service
      .getUserById('c311ac5b-21fb-46bf-ab6d-7ed503a260d2')
      .subscribe((user) => {
        expect(user).toBeNull();
      });
    done();
  });
});

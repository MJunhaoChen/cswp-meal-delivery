import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ConfigModule } from '../../shared/moduleconfig/config.module';
import { httpInterceptorProviders } from '../../token.interceptor';
import { StudentHouseService } from './studentHouse.service';

describe('StudentHouseService', () => {
  let service: StudentHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({ apiEndpoint: environment.SERVER_API_URL }),
      ],
      providers: [{ provide: HttpClient }, httpInterceptorProviders],
    });
    service = TestBed.inject(StudentHouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of studentHouses', (done: DoneFn) => {
    const studentHouses = service.getAllStudentHouses();
    done();
  });

  it('should return Lovensdijkstraat 67', (done: DoneFn) => {
    const studentHouse = service.getStudentHouseById('12345-123-17');
    done();
  });

  it('should add a studentHouse', (done: DoneFn) => {
    const newStudentHouse = {
      id: '12345-123-20',
      streetAndNmr: 'Lovensdijkstraat 69',
      city: 'Breda',
      postcode: '4818 AJ',
    };
    service.addStudentHouse(newStudentHouse);
    done();
  });

  it('should update a studentHouse', (done: DoneFn) => {
    const newStudentHouse = {
      id: '12345-123-12',
      streetAndNmr: 'Lovensdijkstraat 100',
      city: 'Breda',
      postcode: '4818 AJ',
    };
    service.updateStudentHouse(newStudentHouse);
    done();
  });

  it('should delete a studentHouse', (done: DoneFn) => {
    service.deleteStudentHouse('12345-123-18');
    done();
  });
});

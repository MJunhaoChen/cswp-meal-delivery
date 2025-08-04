import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../environments/environment';
import { SaveEditedWorkGuard } from '../../../auth/auth.guards';
import { ConfigModule } from '../../../shared/moduleconfig/config.module';

import { OrderListComponent } from './orderlist.component';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderListComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ConfigModule.forRoot({ apiEndpoint: environment.SERVER_API_URL }),
      ],
      providers: [SaveEditedWorkGuard],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

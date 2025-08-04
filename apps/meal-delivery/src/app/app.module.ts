import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  LOCALE_ID,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './shared/nav/nav.component';
import { MealComponent } from './pages/meal/meal.component';
import { ListComponent as ListComponentMeal } from './pages/meal/list/list.component';
import { DetailComponent as DetailComponentMeal } from './pages/meal/detail/detail.component';
import { EditComponent as EditComponentMeal } from './pages/meal/edit/edit.component';
import { OrderListComponent } from './pages/meal/orderlist/orderlist.component';
import { AboutComponent } from './pages/about/about.component';
import { UserComponent } from './pages/user/user.component';
import { ListComponent as ListComponentUser } from './pages/user/list/list.component';
import { DetailComponent as DetailComponentUser } from './pages/user/detail/detail.component';
import { EditComponent as EditComponentUser } from './pages/user/edit/edit.component';
import { ProductComponent } from './pages/product/product.component';
import { ListComponent as ListComponentProduct } from './pages/product/list/list.component';
import { DetailComponent as DetailComponentProduct } from './pages/product/detail/detail.component';
import { EditComponent as EditComponentProduct } from './pages/product/edit/edit.component';
import { StudentHouseComponent } from './pages/studentHouse/studentHouse.component';
import { ListComponent as ListComponentStudentHouse } from './pages/studentHouse/list/list.component';
import { DetailComponent as DetailComponentStudentHouse } from './pages/studentHouse/detail/detail.component';
import { EditComponent as EditComponentStudentHouse } from './pages/studentHouse/edit/edit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import localeNl from '@angular/common/locales/nl';
import { LoggedInAuthGuard, SaveEditedWorkGuard } from './auth/auth.guards';
import { ConfigModule } from './shared/moduleconfig/config.module';
import { ModalConfirmYesNoComponent } from './auth/modal/modal.confirm-yes-no.component';
import { ModalLeaveYesNoComponent } from './auth/modal/modal.leave-yes-no.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './shared/alert/alert.component';
import { httpInterceptorProviders } from './token.interceptor';
registerLocaleData(localeNl, 'nl');

@NgModule({
  declarations: [
    AppComponent,
    ModalConfirmYesNoComponent,
    ModalLeaveYesNoComponent,
    NavComponent,
    MealComponent,
    ListComponentMeal,
    DetailComponentMeal,
    EditComponentMeal,
    OrderListComponent,
    AboutComponent,
    UserComponent,
    ListComponentUser,
    DetailComponentUser,
    EditComponentUser,
    ProductComponent,
    ListComponentProduct,
    DetailComponentProduct,
    EditComponentProduct,
    StudentHouseComponent,
    ListComponentStudentHouse,
    DetailComponentStudentHouse,
    EditComponentStudentHouse,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    MealComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ConfigModule.forRoot({ apiEndpoint: environment.SERVER_API_URL }),
    NgbModule,
    HttpClientModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    { provide: LOCALE_ID, useValue: 'nl' },
    LoggedInAuthGuard,
    SaveEditedWorkGuard,
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

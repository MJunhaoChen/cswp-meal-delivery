import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavComponent } from './shared/nav/nav.component';
import { AComponent } from './pages/a/a.component';
import { BComponent } from './pages/b/b.component';
import { EntityComponent } from './pages/entity/entity.component';
import { ListComponent } from './pages/entity/list/list.component';
import { DetailComponent } from './pages/entity/detail/detail.component';
import { EditComponent } from './pages/entity/edit/edit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AComponent,
    BComponent,
    EntityComponent,
    ListComponent,
    DetailComponent,
    EditComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

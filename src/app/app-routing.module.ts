import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MealComponent } from './pages/meal/meal.component';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DetailComponent } from './pages/user/detail/detail.component';
import { EditComponent } from './pages/user/edit/edit.component';
import { ListComponent } from './pages/user/list/list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },
  { path: 'meals', pathMatch: 'full', component: MealComponent },
  { path: 'about-us', pathMatch: 'full', component: AboutComponent },

  { path: 'user', pathMatch: 'full', component: ListComponent },
  { path: 'user/new', pathMatch: 'full', component: EditComponent },
  { path: 'user/:id', pathMatch: 'full', component: DetailComponent },
  { path: 'user/:id/edit', pathMatch: 'full', component: EditComponent },

  { path: 'register', pathMatch: 'full', component: RegisterComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

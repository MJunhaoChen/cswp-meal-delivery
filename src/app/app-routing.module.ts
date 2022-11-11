import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AComponent } from './pages/a/a.component';
import { BComponent } from './pages/b/b.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DetailComponent } from './pages/entity/detail/detail.component';
import { EditComponent } from './pages/entity/edit/edit.component';
import { EntityComponent } from './pages/entity/entity.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },
  { path: 'component-a', pathMatch: 'full', component: AComponent },
  { path: 'component-b', pathMatch: 'full', component: BComponent },
  {
    path: 'users',
    component: EntityComponent,
    children: [
      { path: ':id', pathMatch: 'full', component: DetailComponent },
      { path: ':id/edit', pathMatch: 'full', component: EditComponent },
    ],
  },
  { path: 'register', pathMatch: 'full', component: RegisterComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

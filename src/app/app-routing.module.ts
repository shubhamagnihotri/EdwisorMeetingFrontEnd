import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './user-management/auth/auth.component';
import { ForgetPasswordComponent } from './user-management/forget-password/forget-password.component';
import { DefaultComponent } from './layouts/default/default.component';
import { DashbaordComponent } from './modules/dashbaord/dashbaord.component';
import { AllUsersComponent } from './modules/all-users/all-users.component';
import { UserCalendarComponent } from './modules/user-calendar/user-calendar.component';
import { AuthGuard } from './guard/auth.guard';
import {NotFoundComponent} from "../app/not-found/not-found.component"
const routes: Routes = [
  {
    path:'auth',component:AuthComponent,pathMatch: 'full' 
  },
  {path:'auth/forget-passwod',component:ForgetPasswordComponent},
  { path: 'auth/forget-passwod/authPage', redirectTo: 'auth', pathMatch: 'full' },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { 
    path:'dashboard',
    component:DefaultComponent,
    canActivate:[AuthGuard],
    children:[
      {
        path:'view-user-all-meeting/:userId',
        component:DashbaordComponent
      },
      {
        path:'all-users',
        component:AllUsersComponent
      },
      {
        path:'user-calendar/:userId',
        component:UserCalendarComponent
      }
    ]
   },
   {path: '404', component: NotFoundComponent},
    {path: '**', redirectTo: '/404'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

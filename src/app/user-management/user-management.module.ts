import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent} from "./auth/auth.component";
import {  RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {AngularMaterialModuleModule} from "../angular-material-module/angular-material-module.module";
import { ForgetPasswordComponent } from './forget-password/forget-password.component'

@NgModule({
  declarations: [
    AuthComponent,
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModuleModule,
    RouterModule.forChild([
      // {path:'auth/forget-passwod',component:ForgetPasswordComponent},
      // { path: 'auth/forget-passwod/authPage', redirectTo: 'auth', pathMatch: 'full' },
    ])
  ]
})
export class UserManagementModule { }

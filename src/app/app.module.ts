import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { UserManagementModule } from "./user-management/user-management.module";

import {AngularMaterialModuleModule} from "./angular-material-module/angular-material-module.module";
import { DefaultComponent } from './layouts/default/default.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { DashbaordComponent } from './modules/dashbaord/dashbaord.component';
import { AllUsersComponent } from './modules/all-users/all-users.component';
import { UserCalendarComponent } from './modules/user-calendar/user-calendar.component';

import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import 'flatpickr/dist/flatpickr.css';
import { DialogOverviewExampleDialog} from './modules/user-calendar/user-calendar.component';

import { TokenInterceptorService } from '../app/services/token-interceptor.service';
import {AuthGuard} from "../../src/app/guard/auth.guard";
import { NotFoundComponent } from './not-found/not-found.component';
@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashbaordComponent,
    AllUsersComponent,
    UserCalendarComponent,
    DialogOverviewExampleDialog,
    NotFoundComponent
  ],
  imports: [

    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    UserManagementModule,
    AngularMaterialModuleModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    
  ],
  providers: [
    // {
    // provide:HTTP_INTERCEPTORS,
    // useClass: TokenInterceptorService,
    // multi:true
    // }
    AuthGuard 
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog]
})
export class AppModule { }

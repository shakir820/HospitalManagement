import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { User } from './models/user.model';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CookieService } from 'ngx-cookie-service';
import { ProfileComponent } from './profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { InitialLoadingComponent } from './loaders/initial-loading/initial-loading.component';
import { AdminDoctorListComponent } from './admin/admin-doctor-list/admin-doctor-list.component';
import { SpecialityTagComponent } from './custom_controls/speciality-tag/speciality-tag.component';
import { LanguageTagComponent } from './custom_controls/language-tag/language-tag.component';
import { ProfilePicPreviewComponent } from './custom_controls/profile-pic-preview/profile-pic-preview.component';
import { AdminDoctorDetailsComponent } from './admin/admin-doctor-details/admin-doctor-details.component';
import { WeekDayPipe } from './pipes/week-day.pipe';
import { DoctorAppointmentComponent } from './patient_pages/doctor-appointment/doctor-appointment.component';
import { DoctorListComponent } from './patient_pages/doctor-list/doctor-list.component';
import { AppointmentListComponent } from './patient_pages/appointment-list/appointment-list.component';
import { PatientListComponent } from './doctor_pages/patient-list/patient-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    ProfileComponent,
    AdminDashboardComponent,
    AdminLoginComponent,
    InitialLoadingComponent,
    AdminDoctorListComponent,
    SpecialityTagComponent,
    LanguageTagComponent,
    ProfilePicPreviewComponent,
    AdminDoctorDetailsComponent,
    WeekDayPipe,
    DoctorAppointmentComponent,
    DoctorListComponent,
    AppointmentListComponent,
    PatientListComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

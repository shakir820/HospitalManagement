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
import { PatientDetailsComponent } from './common_pages/patient-details/patient-details.component';
import { CreatePrescriptionComponent } from './common_pages/prescription/create-prescription/create-prescription.component';
import { EditMedicineDialogComponent } from './modal-dialogs/edit-medicine-dialog/edit-medicine-dialog.component';
import { PresEditComplainDialogComponent } from './modal-dialogs/pres-edit-complain-dialog/pres-edit-complain-dialog.component';
import { PresEditExaminationDialogComponent } from './modal-dialogs/pres-edit-examination-dialog/pres-edit-examination-dialog.component';
import { PresEditInvestigationDialogComponent } from './modal-dialogs/pres-edit-investigation-dialog/pres-edit-investigation-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PresEditNoteDialogComponent } from './modal-dialogs/pres-edit-note-dialog/pres-edit-note-dialog.component';
import { TodaysPatientComponent } from './doctor_pages/todays-patient/todays-patient.component';
import { ViewPrescriptionComponent } from './common_pages/prescription/view-prescription/view-prescription.component';
import { PrescriptionListComponent } from './common_pages/prescription/prescription-list/prescription-list.component';
import { StaffLoginComponent } from './staff/staff-login/staff-login.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { AdminStaffListComponent } from './admin/admin-staff-list/admin-staff-list.component';
import { NewStaffComponent } from './admin/admin-staff-list/new-staff/new-staff.component';
import { AdminUserListComponent } from './admin/admin-user-list/admin-user-list.component';
import { EditUserRoleDialogComponent } from './modal-dialogs/edit-user-role-dialog/edit-user-role-dialog.component';
import { MyInvestigationListComponent } from './common_pages/investigation/my-investigation-list/my-investigation-list.component';
import { RequesedInvestigationListComponent } from './common_pages/investigation/requesed-investigation-list/requesed-investigation-list.component';
import { AssignedInvestigationListComponent } from './common_pages/investigation/assigned-investigation-list/assigned-investigation-list.component';
import { RequestedInvestigationListComponent } from './common_pages/investigation/requested-investigation-list/requested-investigation-list.component';

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
    PatientListComponent,
    PatientDetailsComponent,
    CreatePrescriptionComponent,
    EditMedicineDialogComponent,
    PresEditComplainDialogComponent,
    PresEditExaminationDialogComponent,
    PresEditInvestigationDialogComponent,
    PresEditNoteDialogComponent,
    TodaysPatientComponent,
    ViewPrescriptionComponent,
    PrescriptionListComponent,
    StaffLoginComponent,
    StaffDashboardComponent,
    AdminStaffListComponent,
    NewStaffComponent,
    AdminUserListComponent,
    EditUserRoleDialogComponent,
    MyInvestigationListComponent,
    RequesedInvestigationListComponent,
    AssignedInvestigationListComponent,
    RequestedInvestigationListComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

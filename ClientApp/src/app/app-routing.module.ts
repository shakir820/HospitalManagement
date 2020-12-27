import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminDashboardComponent } from "./admin/admin-dashboard/admin-dashboard.component";
import { AdminDoctorDetailsComponent } from "./admin/admin-doctor-details/admin-doctor-details.component";
import { AdminDoctorListComponent } from "./admin/admin-doctor-list/admin-doctor-list.component";
import { AdminLoginComponent } from "./admin/admin-login/admin-login.component";
import { AdminProfileComponent } from "./admin/admin-profile/admin-profile.component";
import { AdminSettingsPageComponent } from "./admin/admin-settings-page/admin-settings-page.component";
import { AdminStaffListComponent } from "./admin/admin-staff-list/admin-staff-list.component";
import { NewStaffComponent } from "./admin/admin-staff-list/new-staff/new-staff.component";
import { AdminUserListComponent } from "./admin/admin-user-list/admin-user-list.component";
import { AssignedInvestigationListComponent } from "./common_pages/investigation/assigned-investigation-list/assigned-investigation-list.component";
import { InvestigationDetailsComponent } from "./common_pages/investigation/investigation-details/investigation-details.component";
import { MyInvestigationListComponent } from "./common_pages/investigation/my-investigation-list/my-investigation-list.component";
import { RequestedInvestigationListComponent } from "./common_pages/investigation/requested-investigation-list/requested-investigation-list.component";
import { PatientDetailsComponent } from "./common_pages/patient-details/patient-details.component";
import { CreatePrescriptionComponent } from "./common_pages/prescription/create-prescription/create-prescription.component";
import { PrescriptionListComponent } from "./common_pages/prescription/prescription-list/prescription-list.component";
import { ViewPrescriptionComponent } from "./common_pages/prescription/view-prescription/view-prescription.component";
import { SettingPageComponent } from "./common_pages/setting-page/setting-page.component";
import { CounterComponent } from "./counter/counter.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PatientListComponent } from "./doctor_pages/patient-list/patient-list.component";
import { TodaysPatientComponent } from "./doctor_pages/todays-patient/todays-patient.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { AppointmentListComponent } from "./patient_pages/appointment-list/appointment-list.component";
import { DoctorAppointmentComponent } from "./patient_pages/doctor-appointment/doctor-appointment.component";
import { DoctorListComponent } from "./patient_pages/doctor-list/doctor-list.component";
import { PatientDocumentListComponent } from "./patient_pages/patient-document-list/patient-document-list.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegistrationComponent } from "./registration/registration.component";
import { AdminLoginCanActivateService } from "./services/authGuard/admin-login-can-activate.service";
import { AdminPagesCanActivateService } from "./services/authGuard/admin-pages-can-activate.service";
import { StaffPagesCanActivateService } from "./services/authGuard/staff-pages-can-activate.service";
import { UserPagesCanActivateService } from "./services/authGuard/user-pages-can-activate.service";
import { DashboardPageCanActivateService } from "./services/dashboard-page-can-activate.service";
import { LoginPageCanActivateService } from "./services/login-page-can-activate.service";
import { StaffDashboardComponent } from "./staff/staff-dashboard/staff-dashboard.component";

export const appRoutes: Routes = [

  { path: "", component: HomeComponent, pathMatch: "full"},
  { path: 'login', component: LoginComponent , canActivate:[LoginPageCanActivateService]},
  { path: "register", component: RegistrationComponent , canActivate:[LoginPageCanActivateService]},
  { path: "dashboard", component: DashboardComponent, canActivate: [UserPagesCanActivateService] },
  { path: "profile", component: ProfileComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'admin', component: AdminLoginComponent, canActivate:[AdminLoginCanActivateService] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminPagesCanActivateService] },
  { path: 'staff/dashboard', component: StaffDashboardComponent, canActivate: [StaffPagesCanActivateService] },
  { path: 'admin/doctorList', component: AdminDoctorListComponent, canActivate: [AdminPagesCanActivateService] },
  { path: 'DoctorList', component: DoctorListComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'admin/doctorList/DoctorDetails', component: AdminDoctorDetailsComponent, canActivate: [AdminPagesCanActivateService] },
  { path: 'Appointment', component: AppointmentListComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'Appointment/NewAppointment', component: DoctorAppointmentComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'PatientList', component: PatientListComponent, canActivate: [UserPagesCanActivateService] },
  // { path: 'PatientList/PatientDetails', component: PatientDetailsComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'TodaysPatientList', component: TodaysPatientComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'Patients/PatientDetails', component: PatientDetailsComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'Prescription/CreatePrescription', component: CreatePrescriptionComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'Prescription/ViewPrescription', component: ViewPrescriptionComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'Prescription/PrescriptionList', component: PrescriptionListComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'admin/StaffList', component: AdminStaffListComponent, canActivate:[AdminPagesCanActivateService] },
  { path: 'admin/StaffList/CreateNewStaff', component: NewStaffComponent, canActivate: [AdminPagesCanActivateService]},
  { path: 'admin/UserList', component: AdminUserListComponent, canActivate: [AdminPagesCanActivateService]},
  { path: 'admin/Profile', component: AdminProfileComponent, canActivate: [AdminPagesCanActivateService]},
  { path: 'admin/SettingsPage', component: AdminSettingsPageComponent, canActivate: [AdminPagesCanActivateService]},
  { path: 'Investigation/MyInvestigationList', component: MyInvestigationListComponent, canActivate: [UserPagesCanActivateService]},
  { path: 'Investigation/AssignedInvestigationList', component: AssignedInvestigationListComponent, canActivate: [UserPagesCanActivateService]},
  { path: 'Investigation/RequestedInvestigationList', component: RequestedInvestigationListComponent, canActivate: [UserPagesCanActivateService]},
  { path: 'Investigation/InvestigationDetails', component:InvestigationDetailsComponent, canActivate: [UserPagesCanActivateService]},
  { path: 'Document/PatientDocumentList', component: PatientDocumentListComponent, canActivate: [UserPagesCanActivateService]},
  { path: 'SettingsPage', component: SettingPageComponent, canActivate: [UserPagesCanActivateService] },
  { path: '**', redirectTo: "" },
]

@NgModule({
  imports:[
    RouterModule.forRoot(appRoutes),
  ],
  exports:[RouterModule]
})
export class AppRoutingModule{

}

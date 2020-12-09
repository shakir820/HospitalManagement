import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminDashboardComponent } from "./admin/admin-dashboard/admin-dashboard.component";
import { AdminDoctorDetailsComponent } from "./admin/admin-doctor-details/admin-doctor-details.component";
import { AdminDoctorListComponent } from "./admin/admin-doctor-list/admin-doctor-list.component";
import { AdminLoginComponent } from "./admin/admin-login/admin-login.component";
import { AdminStaffListComponent } from "./admin/admin-staff-list/admin-staff-list.component";
import { PatientDetailsComponent } from "./common_pages/patient-details/patient-details.component";
import { CreatePrescriptionComponent } from "./common_pages/prescription/create-prescription/create-prescription.component";
import { PrescriptionListComponent } from "./common_pages/prescription/prescription-list/prescription-list.component";
import { ViewPrescriptionComponent } from "./common_pages/prescription/view-prescription/view-prescription.component";
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

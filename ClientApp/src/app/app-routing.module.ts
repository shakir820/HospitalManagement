import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminDashboardComponent } from "./admin/admin-dashboard/admin-dashboard.component";
import { AdminDoctorDetailsComponent } from "./admin/admin-doctor-details/admin-doctor-details.component";
import { AdminDoctorListComponent } from "./admin/admin-doctor-list/admin-doctor-list.component";
import { AdminLoginComponent } from "./admin/admin-login/admin-login.component";
import { CounterComponent } from "./counter/counter.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { DoctorListComponent } from "./patient_pages/doctor-list/doctor-list.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegistrationComponent } from "./registration/registration.component";
import { AdminLoginCanActivateService } from "./services/authGuard/admin-login-can-activate.service";
import { AdminPagesCanActivateService } from "./services/authGuard/admin-pages-can-activate.service";
import { UserPagesCanActivateService } from "./services/authGuard/user-pages-can-activate.service";
import { DashboardPageCanActivateService } from "./services/dashboard-page-can-activate.service";
import { LoginPageCanActivateService } from "./services/login-page-can-activate.service";

export const appRoutes: Routes = [

  { path: "", component: HomeComponent, pathMatch: "full"},
  { path: 'login', component: LoginComponent , canActivate:[LoginPageCanActivateService]},
  { path: "register", component: RegistrationComponent , canActivate:[LoginPageCanActivateService]},
  { path: "dashboard", component: DashboardComponent, canActivate: [UserPagesCanActivateService] },
  { path: "profile", component: ProfileComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'admin', component: AdminLoginComponent, canActivate:[AdminLoginCanActivateService] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminPagesCanActivateService] },
  { path: 'admin/doctorList', component: AdminDoctorListComponent, canActivate: [AdminPagesCanActivateService] },
  { path: 'DoctorList', component: DoctorListComponent, canActivate: [UserPagesCanActivateService] },
  { path: 'admin/doctorList/DoctorDetails', component: AdminDoctorDetailsComponent, canActivate: [AdminPagesCanActivateService] },
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

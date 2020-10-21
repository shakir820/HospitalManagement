import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { homedir } from "os";
import { CounterComponent } from "./counter/counter.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegistrationComponent } from "./registration/registration.component";
import { DashboardPageCanActivateService } from "./services/dashboard-page-can-activate.service";
import { LoginPageCanActivateService } from "./services/login-page-can-activate.service";

export const appRoutes: Routes = [

  { path: "", component: HomeComponent, pathMatch: "full"},
  { path: 'login', component: LoginComponent , canActivate:[LoginPageCanActivateService]},
  { path: "register", component: RegistrationComponent , canActivate:[LoginPageCanActivateService]},
  { path: "dashboard", component: DashboardComponent, canActivate: [DashboardPageCanActivateService] },
  { path: "profile", component: ProfileComponent },
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

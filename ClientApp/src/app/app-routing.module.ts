import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CounterComponent } from "./counter/counter.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  { path: "register", component: RegistrationComponent }
]

@NgModule({
  imports:[
    RouterModule.forRoot(appRoutes),
  ],
  exports:[RouterModule]
})
export class AppRoutingModule{

}

import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HomeComponent } from './home/home.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent  implements OnInit{
  title = 'app';

  constructor(public userService: UserService, private router: Router, private cookieService: CookieService){

  }

  disableBtns:boolean = true;
  disabledSidebarItems:boolean = false;
  initializing:boolean = true;
  isApproved:boolean = false;
  isDoctor:boolean = false;
  isAdmin:boolean = false;
  isPatient: boolean = false;
  ngOnInit(){

    this.userService.approvedChanged.subscribe((val)=>{
      this.isApproved = val;
    });

    this.userService.roleChanged.subscribe((roles: string[])=>{
      if(roles.length > 0){
        var adminRole = roles.find(a=>a == 'Admin');
        if(adminRole){
          this.isAdmin = true;
        }
        else{
          this.isAdmin = false;
        }
        var doctorRole = roles.find(a=>a == 'Doctor');
        if(doctorRole){
          this.isDoctor = true;
        }
        else{
          this.isDoctor = false;
        }

        var patientRole = roles.find(a=>a == 'Patient');
        if(patientRole){
          this.isPatient = true;
        }
        else{
          this.isPatient = false;
        }
      }
    });

    this.LoginUser();
  }

  async LoginUser(){
    this.initializing = true;
    var userLoggedIn:boolean = await this.userService.tryLoginUser();
    this.initializing = false;
    if(userLoggedIn){
    }
  }




  onActivate(route_event){
    if(route_event.title == "Home" || route_event.title == "login" || route_event.title == "register" || route_event.title == 'admin-login'){
      this.disableBtns = true;
      this.disabledSidebarItems = true;
    }
    else{
      this.disableBtns = false;
      this.disabledSidebarItems = false;
    }
  }





  onLogout(){
    this.userService.isLoggedIn = false;
    this.userService.clearUserData('/');
    this.userService.clearUserData('/admin');
    this.router.navigate(['']);
  }




  onDashboadClick(event_data){

    if(this.userService.isLoggedIn){
      var admin_role = this.userService.user.roles.find(a=>a == 'Admin');
      console.log(admin_role);
      if(admin_role){
        this.router.navigate(['admin/dashboard']);
      }
      else{
        this.router.navigate(['dashboard']);
      }
    }
  }
}

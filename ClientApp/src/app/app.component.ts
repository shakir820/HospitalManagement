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


  ngOnInit(){

    this.LoginUser();
    // this.router.navigate(['dashboard']);
    // this.userService.isLoggedIn = true;

  //   this.router.events.subscribe(value => {
  //     console.log(value);
  //     if(value instanceof NavigationStart){
  //       if(value.url == "/" || value.url == "/home" || value.url == "/login" || value.url == "/register"){
  //         this.disableBtns = true;
  //         this.disabledSidebarItems = true;
  //       }
  //       else{
  //         this.disableBtns = false;
  //         this.disabledSidebarItems = false;
  //       }
  //     }
  //     else if(value instanceof NavigationEnd){
  //       this.disableBtns = true;
  //       this.disabledSidebarItems = true;
  //     }

  // });
  }

  async LoginUser(){
    var userLoggedIn:boolean = this.userService.tryLoginUser();
    if(userLoggedIn){
      //this.router.navigate(['dashboard']);
    }
  }




  onActivate(route_event){
    if(route_event.title == "Home" || route_event.title == "login" || route_event.title == "register"){
      this.disableBtns = true;
      this.disabledSidebarItems = true;
    }
    else{
      this.disableBtns = false;
      this.disabledSidebarItems = false;
    }
  }

  // onDeactive(route_event){
  //   this.router.navigate[''];
  // }





  onLogout(){
    this.userService.isLoggedIn = false;
    this.userService.clearUserData();
    this.router.navigate(['']);
  }

}

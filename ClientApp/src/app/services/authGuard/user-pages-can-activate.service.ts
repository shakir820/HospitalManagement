import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class UserPagesCanActivateService {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    var promise = new Promise<boolean | UrlTree>(async (resolve, rejects)=>{

      if(this.userService.isLoggedIn){
        var user_roles = this.userService.user.roles;
        var admin_role = user_roles.find(a=> a === 'Admin');
        if(admin_role !== null && admin_role !== undefined){
          resolve(this.router.navigateByUrl('admin'));
          //resolve(true);
        }
        else{
          console.log("Navigating Home page");
          //resolve(this.router.navigateByUrl(''));
          resolve(true);
        }
      }
      else if(this.userService.loggingInProgress){
        while(this.userService.loggingInProgress){
          console.log("I am waiting");
            await this.delay(100);
        }
        if(this.userService.isLoggedIn){
          var user_roles = this.userService.user.roles;
          var admin_role = user_roles.find(a=> a === 'Admin');
          if(admin_role !== null && admin_role !== undefined){
            resolve(this.router.navigateByUrl('admin'));
          }
          else{

            resolve(true);
          }
        }
        else{
          //console.log("Navigating Home page");
          resolve(this.router.navigateByUrl(''));
        }
      }
      else{
        console.log("Navigating Home page");
        resolve(this.router.navigateByUrl(''));
      }
    });
    return promise;

  }



  delay(ms: number): Promise<boolean>{
    var promise = new Promise<boolean>((resolve, rejects)=>{
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
    return promise;
  }
}

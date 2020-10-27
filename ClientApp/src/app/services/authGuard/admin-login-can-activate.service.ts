import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginCanActivateService implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    var promise = new Promise<boolean | UrlTree>(async (resolve, rejects)=>{

      if(this.userService.isLoggedIn){
        var user_roles = this.userService.user.roles;
        var admin_role = user_roles.find(a=> a === 'Admin');
        if(admin_role !== null && admin_role !== undefined){
          resolve(this.router.navigateByUrl('admin/dashboard'));
          //resolve(false);
        }
        else{
          resolve(true);
        }

      }
      else if(this.userService.loggingInProgress){
        while(this.userService.loggingInProgress){
           await this.delay(100);
        }
        if(this.userService.isLoggedIn){
          var user_roles = this.userService.user.roles;
          var admin_role = user_roles.find(a=> a === 'Admin');
          if(admin_role !== null && admin_role !== undefined){
            resolve(this.router.navigateByUrl('admin/dashboard'));
            //resolve(false);
          }
          else{
            resolve(true);
          }
        }
        else{
          resolve(true);
        }
      }
      else{
        resolve(true);
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



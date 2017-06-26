 import { Injectable } from '@angular/core';
 import { CanActivate } from '@angular/router';
 import { AuthService } from '../auth/auth.service';

 @Injectable()
 export class LoggedInGuard implements CanActivate {
     constructor(private authService: AuthService) {}

     canActivate(): boolean {
         let aux = this.authService.isLoggedIn();
         console.log("isloggedin="+aux) ;
         return aux ;
    }
}

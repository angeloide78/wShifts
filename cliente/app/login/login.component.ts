import {Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Usuario } from '../usuario/usuario' ;
import { AuthService } from '../auth/auth.service' ;

@Component({
    templateUrl: 'app/login/login.html',
    providers: [ AuthService ]
})

export class LoginComponent {
    usuario : Usuario ;
    mensaje : string ;
    data : Object ;

    constructor(public authService: AuthService,
                private cdr: ChangeDetectorRef) {
        this.usuario = new Usuario(0,0,'','','','',0,'') ;
        this.mensaje = '' ;
    }

 login(username: string, password: string): boolean {
    this.authService.login(username, password) ;
    return true;
 }

 ngAfterViewInit(){
    setTimeout(() => this.cdr.reattach());
}
  getUser(): any {
   return this.authService.getUser()
  }

  logout(): boolean {
    this.authService.logout();
    this.authService.data = null ;
    // Se recarga la página...
    location.reload();
    return false;
  }
}

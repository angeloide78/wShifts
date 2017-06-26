import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, RequestMethod, Request, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Config } from '../config.service' ;

@Injectable()
export class AuthService {

  data: Object;
  loading: boolean;
  user : string = null;
  url_backend: string = null ;

  constructor(public http: Http) {
    let aux = new Config() ;
    this.url_backend = aux.auth() ; 
  }

  login(user: string, password: string): any {
      console.log("enviando " + user + " con password " + password) ;

      this.loading = true;

      var headers_ = new Headers() ;
      headers_.append("Content-Type", 'application/json') ;

      var requestoptions = new RequestOptions({
        method : RequestMethod.Post,
        url : "http://127.0.0.1:5000/login",
        headers : headers_,
        body : JSON.stringify({usuario : user, passwd : password})
      }) ;

      var request = new Request (requestoptions) ;

      this.http.request(request)
      .subscribe((res: Response) => {
        this.data = res.json();
        this.loading = false;
      });

      return this.data ;
  }

  setUser(user:string): any {
    this.logout() ;
    localStorage.setItem('usuarioTurnos', user);
    // Se recarga la página...
    location.reload();
    return true ;
  }

  logout(): any {
    localStorage.removeItem('usuarioTurnos');
  }

  getUser(): any {
    return localStorage.getItem('usuarioTurnos');
  }

  isLoggedIn(): boolean {
    let aux = this.getUser() ;
    if (aux == null || aux == undefined) {
      return false ;
    } else {
      if (aux.length == 0) { this.logout() ;}
      else { return true } ;
    }
  }
}

export var AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService,
    useClass: AuthService
  }
];

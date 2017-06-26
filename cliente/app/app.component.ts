import { Component } from '@angular/core';
import { Config } from './config.service' ;
import { AuthService } from './auth/auth.service' ;

@Component({
  selector: 'wShifts',
  templateUrl: 'app/app.html',
  providers: [ AuthService ]
})

export class AppComponent {
  title = Config.TITLE_PAGE ;
  usuario: string = null ;

  constructor(public authService: AuthService) {
    this.usuario = authService.getUser()
  }
}

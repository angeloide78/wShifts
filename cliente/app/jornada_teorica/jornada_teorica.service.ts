import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JornadaTeorica } from './jornada_teorica';
import { Config } from '../config.service' ;

@Injectable()
export class JornadaTeoricaService {

  path_url: string ;
  config: Config ;

  constructor(private http: Http) {
    this.config = new Config() ;
  }

  send_data(datos: any, tipo: string): Observable<JornadaTeorica[]> {

      // ALGG 22-12-2016 Configuración de cabecera, cuerpo y opciones.
      let headers = new Headers({"Content-Type" : 'application/json'}) ;
      let body = JSON.stringify({datos : datos}) ;
      let options = new RequestOptions({ headers: headers }) ;

      // Dependiendo del tipo, se selecciona una URL u otra.
      this.path_url = this.config.jornada_teorica(tipo) ;

      // Petición HTML.
      return this.http.post(this.path_url, body, options)
                 .map(this.extractData)
                 .catch(this.handleError) ;
  }

  private extractData(res: Response) {
      let body = res.json();
      return body || { };
  }

  private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg);
      return Observable.throw(errMsg);
  }
}

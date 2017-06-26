import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Ciclo } from './ciclo';
import { CicloSemana } from './cicloSemana' ;
import { Config } from '../config.service' ;
//import { HorasCiclo } from './horas_ciclo' ;

@Injectable()
export class CicloService {

  path_url: string ;
  config: Config ;

  constructor(private http: Http) {
    this.config = new Config() ;
  }

  send_data(datos: any, tipo: string): Observable<Ciclo[]> {

      // ALGG 19-11-2016 Configuración de cabecera, cuerpo y opciones.
      let headers = new Headers({"Content-Type" : 'application/json'}) ;
      let body = JSON.stringify({datos : datos}) ;
      let options = new RequestOptions({ headers: headers }) ;

      // Dependiendo del tipo, se selecciona una URL u otra.
      this.path_url = this.config.ciclo(tipo) ;

      // Petición HTML.
      return this.http.post(this.path_url, body, options)
                 .map(this.extractData)
                 .catch(this.handleError) ;
  }

  send_data2(id_ciclo: number): Observable<CicloSemana[]> {

      // ALGG 20-11-2016 Configuración de cabecera, cuerpo y opciones.
      let headers = new Headers({"Content-Type" : 'application/json'}) ;
      let body = JSON.stringify({id_ciclo : id_ciclo}) ;
      let options = new RequestOptions({ headers: headers }) ;

      this.path_url = this.config.ciclo(null) ;

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
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);
  }
}

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CoberturaServicio } from './cobertura_servicio';
import { Config } from '../config.service' ;

@Injectable()
export class CoberturaServicioService {

  path_url: string ;

  constructor(private http: Http) {
    let aux = new Config() ;
    this.path_url = aux.cobertura_servicio() ;
  }

  send_data(datos: any, tipo: string): Observable<CoberturaServicio[]> {

      let headers = new Headers({"Content-Type" : 'application/json'}) ;
      let body = JSON.stringify({datos : datos}) ;
      let options = new RequestOptions({ headers: headers }) ;

      // Dependiendo del tipo, se selecciona una URL u otra.
      //if ( tipo == 'recuperar') { this.path_url = "http://127.0.0.1:5000/cobertura_servicio" }

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
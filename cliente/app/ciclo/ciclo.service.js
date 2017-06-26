"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var config_service_1 = require('../config.service');
//import { HorasCiclo } from './horas_ciclo' ;
var CicloService = (function () {
    function CicloService(http) {
        this.http = http;
        this.config = new config_service_1.Config();
    }
    CicloService.prototype.send_data = function (datos, tipo) {
        // ALGG 19-11-2016 Configuración de cabecera, cuerpo y opciones.
        var headers = new http_1.Headers({ "Content-Type": 'application/json' });
        var body = JSON.stringify({ datos: datos });
        var options = new http_1.RequestOptions({ headers: headers });
        // Dependiendo del tipo, se selecciona una URL u otra.
        this.path_url = this.config.ciclo(tipo);
        // Petición HTML.
        return this.http.post(this.path_url, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CicloService.prototype.send_data2 = function (id_ciclo) {
        // ALGG 20-11-2016 Configuración de cabecera, cuerpo y opciones.
        var headers = new http_1.Headers({ "Content-Type": 'application/json' });
        var body = JSON.stringify({ id_ciclo: id_ciclo });
        var options = new http_1.RequestOptions({ headers: headers });
        this.path_url = this.config.ciclo(null);
        // Petición HTML.
        return this.http.post(this.path_url, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CicloService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    CicloService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    CicloService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CicloService);
    return CicloService;
}());
exports.CicloService = CicloService;
//# sourceMappingURL=ciclo.service.js.map
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
var CambioTurnoService = (function () {
    function CambioTurnoService(http) {
        this.http = http;
        var aux = new config_service_1.Config();
        this.path_url = aux.cambio_turno();
    }
    CambioTurnoService.prototype.send_data = function (datos, tipo) {
        // Configuración de cabecera, cuerpo y opciones.
        var headers = new http_1.Headers({ "Content-Type": 'application/json' });
        var body = JSON.stringify({ datos: datos });
        var options = new http_1.RequestOptions({ headers: headers });
        // if ( tipo == 'actualizar') { this.path_url = "http://127.0.0.1:5000/cambio_turno/update" }
        // Petición HTML.
        return this.http.post(this.path_url, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CambioTurnoService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    CambioTurnoService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    CambioTurnoService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CambioTurnoService);
    return CambioTurnoService;
}());
exports.CambioTurnoService = CambioTurnoService;
//# sourceMappingURL=cambio_turno.service.js.map
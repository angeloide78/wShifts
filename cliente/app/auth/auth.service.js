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
require('rxjs/Rx');
var config_service_1 = require('../config.service');
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.user = null;
        this.url_backend = null;
        var aux = new config_service_1.Config();
        this.url_backend = aux.auth();
    }
    AuthService.prototype.login = function (user, password) {
        var _this = this;
        console.log("enviando " + user + " con password " + password);
        this.loading = true;
        var headers_ = new http_1.Headers();
        headers_.append("Content-Type", 'application/json');
        var requestoptions = new http_1.RequestOptions({
            method: http_1.RequestMethod.Post,
            url: "http://127.0.0.1:5000/login",
            headers: headers_,
            body: JSON.stringify({ usuario: user, passwd: password })
        });
        var request = new http_1.Request(requestoptions);
        this.http.request(request)
            .subscribe(function (res) {
            _this.data = res.json();
            _this.loading = false;
        });
        return this.data;
    };
    AuthService.prototype.setUser = function (user) {
        this.logout();
        localStorage.setItem('usuarioTurnos', user);
        // Se recarga la página...
        location.reload();
        return true;
    };
    AuthService.prototype.logout = function () {
        localStorage.removeItem('usuarioTurnos');
    };
    AuthService.prototype.getUser = function () {
        return localStorage.getItem('usuarioTurnos');
    };
    AuthService.prototype.isLoggedIn = function () {
        var aux = this.getUser();
        if (aux == null || aux == undefined) {
            return false;
        }
        else {
            if (aux.length == 0) {
                this.logout();
            }
            else {
                return true;
            }
            ;
        }
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
exports.AUTH_PROVIDERS = [
    { provide: AuthService,
        useClass: AuthService
    }
];
//# sourceMappingURL=auth.service.js.map
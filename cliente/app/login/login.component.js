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
var usuario_1 = require('../usuario/usuario');
var auth_service_1 = require('../auth/auth.service');
var LoginComponent = (function () {
    function LoginComponent(authService, cdr) {
        this.authService = authService;
        this.cdr = cdr;
        this.usuario = new usuario_1.Usuario(0, 0, '', '', '', '', 0, '');
        this.mensaje = '';
    }
    LoginComponent.prototype.login = function (username, password) {
        this.authService.login(username, password);
        return true;
    };
    LoginComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.cdr.reattach(); });
    };
    LoginComponent.prototype.getUser = function () {
        return this.authService.getUser();
    };
    LoginComponent.prototype.logout = function () {
        this.authService.logout();
        this.authService.data = null;
        // Se recarga la página...
        location.reload();
        return false;
    };
    LoginComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/login/login.html',
            providers: [auth_service_1.AuthService]
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, core_1.ChangeDetectorRef])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map
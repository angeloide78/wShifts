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
var config_service_1 = require('./config.service');
var auth_service_1 = require('./auth/auth.service');
var AppComponent = (function () {
    function AppComponent(authService) {
        this.authService = authService;
        this.title = config_service_1.Config.TITLE_PAGE;
        this.usuario = null;
        this.usuario = authService.getUser();
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'wShifts',
            templateUrl: 'app/app.html',
            providers: [auth_service_1.AuthService]
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
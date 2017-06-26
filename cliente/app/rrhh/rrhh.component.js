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
var RRHHComponent = (function () {
    function RRHHComponent() {
        this.visualizar_disabled = true;
    }
    ;
    RRHHComponent.prototype.OnPerSel = function (perSel) {
        this.nombre = perSel.nombre;
        this.ape1 = perSel.ape1;
        this.ape2 = perSel.ape2;
        this.dni = perSel.dni;
        this.id = perSel.id;
        this.perSel = perSel;
        this.visualizar_disabled = false;
    };
    RRHHComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/rrhh/rrhh.html',
            styleUrls: ["../../styles.css"]
        }), 
        __metadata('design:paramtypes', [])
    ], RRHHComponent);
    return RRHHComponent;
}());
exports.RRHHComponent = RRHHComponent;
//# sourceMappingURL=rrhh.component.js.map
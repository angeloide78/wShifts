"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Componentes de Angular 2
var core_1 = require("@angular/core");
// Componentes de modelo y servicio.
var buscar_persona_service_1 = require("./buscar_persona.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
var PersonaSeleccionada = (function () {
    function PersonaSeleccionada(id, nombre, ape1, ape2, dni) {
        this.id = id;
        this.nombre = nombre;
        this.ape1 = ape1;
        this.ape2 = ape2;
        this.dni = dni;
    }
    return PersonaSeleccionada;
}());
exports.PersonaSeleccionada = PersonaSeleccionada;
// Grid.
var BuscarPersonaComponent = (function (_super) {
    __extends(BuscarPersonaComponent, _super);
    function BuscarPersonaComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Búsqueda de personas";
        this.nombre_fichero_csv = "buscarPersonas_wShifts.csv";
        this.OnPerSel = new core_1.EventEmitter();
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
    }
    BuscarPersonaComponent.prototype.showDialog = function () {
        this.display = true;
    };
    BuscarPersonaComponent.prototype.onRowClicked = function ($event) {
        // Se recuperan datos.
        var nombre = $event.node.data.nombre;
        var ape1 = $event.node.data.ape1;
        var ape2 = $event.node.data.ape2;
        var dni = $event.node.data.dni;
        var id = $event.node.data.id;
        // Se crea el objeto de la persona seleccionada.
        var persona_seleccionada = new PersonaSeleccionada(id, nombre, ape1, ape2, dni);
        // Y se emite por el manejador de eventos.
        this.OnPerSel.emit(persona_seleccionada);
    };
    BuscarPersonaComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 120 },
            { headerName: "Documento", field: "dni", width: 120 },
            { headerName: "Nombre", field: "nombre", width: 150 },
            { headerName: "Primer apellido", field: "ape1", width: 200 },
            { headerName: "Segundo apellido", field: "ape2", width: 200 }
        ];
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], BuscarPersonaComponent.prototype, "OnPerSel", void 0);
    BuscarPersonaComponent = __decorate([
        core_1.Component({
            selector: 'buscar_persona',
            templateUrl: 'app/buscar_persona/buscar_persona.html',
            providers: [buscar_persona_service_1.BuscarPersonaService]
        }), 
        __metadata('design:paramtypes', [buscar_persona_service_1.BuscarPersonaService])
    ], BuscarPersonaComponent);
    return BuscarPersonaComponent;
}(GridComponent_1.GridComponent));
exports.BuscarPersonaComponent = BuscarPersonaComponent;
//# sourceMappingURL=buscar_persona.component.js.map
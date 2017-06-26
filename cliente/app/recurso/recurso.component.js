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
var recurso_service_1 = require("./recurso.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var RecursoComponent = (function (_super) {
    __extends(RecursoComponent, _super);
    function RecursoComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Recursos del sistema";
        this.nombre_fichero_csv = "recursos_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        this.filtro_recuperar = { codigo: null, activo: null };
    }
    RecursoComponent.prototype.showDialog = function () {
        this.display = true;
    };
    RecursoComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Los campos usuario y contraseña son obligatorios';
        }
        return [ret, severity, summary, mensaje];
    };
    RecursoComponent.prototype.createColumnDefs = function () {
        return [{ headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "Código", field: "codigo", width: 100 },
            { headerName: "Descripción", field: "descripcion", width: 400 },
            { headerName: "Activo", field: "activo",
                cellEditor: "select", cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 70 },
            { headerName: "Observaciones", field: "observaciones", editable: true, width: 250 }
        ];
    };
    RecursoComponent = __decorate([
        core_1.Component({
            selector: 'recurso',
            templateUrl: 'app/recurso/recurso.html',
            providers: [recurso_service_1.RecursoService]
        }), 
        __metadata('design:paramtypes', [recurso_service_1.RecursoService])
    ], RecursoComponent);
    return RecursoComponent;
}(GridComponent_1.GridComponent));
exports.RecursoComponent = RecursoComponent;
//# sourceMappingURL=recurso.component.js.map
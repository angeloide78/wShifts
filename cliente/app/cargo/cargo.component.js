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
var cargo_service_1 = require("./cargo.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var CargoComponent = (function (_super) {
    __extends(CargoComponent, _super);
    function CargoComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de Cargos";
        this.nombre_fichero_csv = "cargos_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // ALGG 04-01-2017 Filtro de recuperación.
        this.filtro_recuperar = { id_: null, activo: null };
    }
    CargoComponent.prototype.showDialog = function () {
        this.display = true;
    };
    CargoComponent.prototype.insertarFila = function () {
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    };
    CargoComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Los campos código y descripción son obligatorios';
        }
        return [ret, severity, summary, mensaje];
    };
    CargoComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            if ((nodo_fila.data.codigo.length == 0) ||
                (nodo_fila.data.descripcion.length == 0)) {
                ret = false;
            }
            // Si no cumple la validación, nos vamos.
            if (!ret) {
                return [ret, bolsa];
            }
            ;
            // ALGG 02-12-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    codigo: nodo_fila.data.codigo,
                    descripcion: nodo_fila.data.descripcion,
                    observaciones: nodo_fila.data.observaciones,
                    activo: nodo_fila.data.activo });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    CargoComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {
            id: 0,
            codigo: "",
            descripcion: "",
            observaciones: "",
            activo: 'S'
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    CargoComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "Código", field: "codigo", width: 100, editable: true },
            { headerName: "Descripción", field: "descripcion", width: 400,
                editable: true },
            { headerName: "Observaciones", field: "observaciones", width: 400,
                editable: true, celleditor: "largeText" },
            { headerName: "Activo", field: "activo", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 }
        ];
    };
    CargoComponent = __decorate([
        core_1.Component({
            selector: 'cargo',
            templateUrl: 'app/cargo/cargo.html',
            providers: [cargo_service_1.CargoService]
        }), 
        __metadata('design:paramtypes', [cargo_service_1.CargoService])
    ], CargoComponent);
    return CargoComponent;
}(GridComponent_1.GridComponent));
exports.CargoComponent = CargoComponent;
//# sourceMappingURL=cargo.component.js.map
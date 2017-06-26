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
var servicio_service_1 = require("./servicio.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var ServicioComponent = (function (_super) {
    __extends(ServicioComponent, _super);
    function ServicioComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de servicios";
        this.nombre_fichero_csv = "servicios_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
    }
    ServicioComponent.prototype.recuperar = function () {
        this.filtro_recuperar = { activo: null, id: null, codigo: null,
            cf_id: null, asig_pend: 'N' };
        _super.prototype.recuperar.call(this);
    };
    ServicioComponent.prototype.showDialog = function () {
        this.display = true;
    };
    ServicioComponent.prototype.insertarFila = function () {
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    };
    ServicioComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Los campos código y descripción son obligatorios.';
        }
        return [ret, severity, summary, mensaje];
    };
    ServicioComponent.prototype.validaciones = function (modelo) {
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
            // ALGG 20-12-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    tipo_unit_id: nodo_fila.data.tipo_unit_id,
                    codigo: nodo_fila.data.codigo,
                    descripcion: nodo_fila.data.descripcion,
                    activo: nodo_fila.data.activo,
                    telefono1: nodo_fila.data.telefono1,
                    telefono2: nodo_fila.data.telefono2,
                    observaciones: nodo_fila.data.observaciones,
                    email: nodo_fila.data.email
                });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    ServicioComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {
            id: 0,
            tipo_unit_id: 2,
            codigo: "",
            descripcion: "",
            activo: 'S',
            telefono1: "",
            telefono2: "",
            observaciones: "",
            email: ""
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    ServicioComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "tipo_unit_id", field: "tipo_unit_id", width: 100, hide: true },
            { headerName: "Código", field: "codigo", width: 100, editable: true },
            { headerName: "Descripción", field: "descripcion", width: 200,
                editable: true },
            { headerName: "Activo", field: "activo", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 },
            { headerName: "1er teléfono", field: "telefono1", width: 200, editable: true },
            { headerName: "2do teléfono", field: "telefono2", width: 200, editable: true },
            { headerName: "Observaciones", field: "observaciones", width: 200, editable: true },
            { headerName: "e-mail", field: "email", width: 200, editable: true }
        ];
    };
    ServicioComponent = __decorate([
        core_1.Component({
            selector: 'servicio',
            templateUrl: 'app/servicio/servicio.html',
            providers: [servicio_service_1.ServicioService]
        }), 
        __metadata('design:paramtypes', [servicio_service_1.ServicioService])
    ], ServicioComponent);
    return ServicioComponent;
}(GridComponent_1.GridComponent));
exports.ServicioComponent = ServicioComponent;
//# sourceMappingURL=servicio.component.js.map
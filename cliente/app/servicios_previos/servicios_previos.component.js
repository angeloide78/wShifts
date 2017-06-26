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
// Componentes de ag-grid para edición de celdas.
//import { NumericEditorComponent } from '../grid-utils/editor.component' ;
// Componentes de modelo y servicio.
var servicios_previos_service_1 = require("./servicios_previos.service");
var buscar_persona_component_1 = require("../buscar_persona/buscar_persona.component");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var ServiciosPreviosComponent = (function (_super) {
    __extends(ServiciosPreviosComponent, _super);
    function ServiciosPreviosComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.persona_id = null;
        this.display = false;
        this.titulo = "Gestión de Servicios Previos";
        this.nombre_fichero_csv = "serviciosPrevios_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
    }
    ServiciosPreviosComponent.prototype.ngOnChanges = function (changes) {
        // Se detectan cambios...
        var dato;
        var perSel = changes['perSel'];
        // Se recuperan cambios...
        dato = perSel.currentValue;
        // Si no hay nada, salimos.
        if (dato == undefined) {
            return;
        }
        // Se recupera el id, que será con lo que se busque...
        var id = dato.id;
        this.persona_id = id;
        console.log("[SERVICIOS PREVIOS] Recuperando trabajador con DNI " + dato.dni);
        // Se recupera información.
        this.filtro_recuperar = { persona_id: id, anno: null };
        this.recuperar();
    };
    ServiciosPreviosComponent.prototype.showDialog = function () {
        this.display = true;
    };
    ServiciosPreviosComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Los campos año y horas son obligatorios';
        }
        return [ret, severity, summary, mensaje];
    };
    ServiciosPreviosComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            if ((nodo_fila.data.anno.length == 0) ||
                (nodo_fila.data.horas.length == 0)) {
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
                    persona_id: nodo_fila.data.persona_id,
                    anno: nodo_fila.data.anno,
                    horas: nodo_fila.data.horas });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    ServiciosPreviosComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {
            id: 0,
            persona_id: this.persona_id,
            anno: new Date().getFullYear(),
            horas: 0
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    ServiciosPreviosComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", width: 100, hide: true },
            { headerName: "persona_id", field: "persona_id", hide: true,
                width: 100, editable: true },
            { headerName: "Año", field: "anno", width: 200, editable: true },
            { headerName: "Horas", field: "horas", width: 200, editable: true }
        ];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', buscar_persona_component_1.PersonaSeleccionada)
    ], ServiciosPreviosComponent.prototype, "perSel", void 0);
    ServiciosPreviosComponent = __decorate([
        core_1.Component({
            selector: 'servicios_previos',
            templateUrl: 'app/servicios_previos/servicios_previos.html',
            providers: [servicios_previos_service_1.ServiciosPreviosService]
        }), 
        __metadata('design:paramtypes', [servicios_previos_service_1.ServiciosPreviosService])
    ], ServiciosPreviosComponent);
    return ServiciosPreviosComponent;
}(GridComponent_1.GridComponent));
exports.ServiciosPreviosComponent = ServiciosPreviosComponent;
//# sourceMappingURL=servicios_previos.component.js.map
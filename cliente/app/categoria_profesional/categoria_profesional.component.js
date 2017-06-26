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
var categoria_profesional_service_1 = require("./categoria_profesional.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var CategoriaProfesionalComponent = (function (_super) {
    __extends(CategoriaProfesionalComponent, _super);
    function CategoriaProfesionalComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de categorías profesionales";
        this.nombre_fichero_csv = "categoriasProfesionales_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // ALGG 04-01-2017 Filtro de recuperación.
        this.filtro_recuperar = { id_: null, activo: null };
    }
    CategoriaProfesionalComponent.prototype.showDialog = function () {
        this.display = true;
    };
    CategoriaProfesionalComponent.prototype.insertarFila = function () {
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    };
    CategoriaProfesionalComponent.prototype.mensajes2 = function (opcion) {
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
    CategoriaProfesionalComponent.prototype.validaciones = function (modelo) {
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
                    activo: nodo_fila.data.activo });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    CategoriaProfesionalComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {
            id: 0,
            codigo: "",
            descripcion: "",
            activo: 'S'
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    CategoriaProfesionalComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "Código", field: "codigo", width: 100, editable: true },
            { headerName: "Descripción", field: "descripcion", width: 630,
                editable: true },
            { headerName: "Activo", field: "activo", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 }
        ];
    };
    CategoriaProfesionalComponent = __decorate([
        core_1.Component({
            selector: 'categoria_profesional',
            templateUrl: 'app/categoria_profesional/categoria_profesional.html',
            providers: [categoria_profesional_service_1.CategoriaProfesionalService]
        }), 
        __metadata('design:paramtypes', [categoria_profesional_service_1.CategoriaProfesionalService])
    ], CategoriaProfesionalComponent);
    return CategoriaProfesionalComponent;
}(GridComponent_1.GridComponent));
exports.CategoriaProfesionalComponent = CategoriaProfesionalComponent;
//# sourceMappingURL=categoria_profesional.component.js.map
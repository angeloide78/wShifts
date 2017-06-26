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
var basica_service_1 = require("./basica.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var BasicaComponent = (function (_super) {
    __extends(BasicaComponent, _super);
    function BasicaComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.titulo = "Gestión de datos básicos de la aplicación";
        this.nombre_fichero_csv = "datosBasicos_wShifts.csv";
        this.display = false;
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
    }
    BasicaComponent.prototype.showDialog = function () {
        this.display = true;
    };
    BasicaComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // se seleccionan las filas nuevas para ser devueltas al backend.
        modelo.forEachNode(function (nodo_fila) {
            // ALGG 22-12-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    version: nodo_fila.data.cf_id,
                    revision: nodo_fila.data.cf_cod,
                    nombre: nodo_fila.data.cf_desc,
                    descripcion: nodo_fila.data.anno,
                    es_lunes_festivo: nodo_fila.data.es_lunes_festivo,
                    es_martes_festivo: nodo_fila.data.es_martes_festivo,
                    es_miercoles_festivo: nodo_fila.data.es_miercoles_festivo,
                    es_jueves_festivo: nodo_fila.data.es_jueves_festivo,
                    es_viernes_festivo: nodo_fila.data.es_viernes_festivo,
                    es_sabado_festivo: nodo_fila.data.es_sabado_festivo,
                    es_domingo_festivo: nodo_fila.data.es_domingo_festivo,
                    licencia: nodo_fila.data.licencia,
                    empresa: nodo_fila.data.empresa
                });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    BasicaComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "Versión", hide: true, field: "version", width: 100 },
            { headerName: "Aplicación", hide: true, field: "nombre", width: 150 },
            { headerName: "Descripción", hide: true, field: "descripcion", width: 250 },
            { headerName: "Empresa", field: "empresa", width: 200, editable: true },
            { headerName: "Lun. fest.", field: "es_lunes_festivo", width: 120,
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true },
            { headerName: "Mar. fest.", field: "es_martes_festivo", width: 100,
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true },
            { headerName: "Mié. fest.", field: "es_miercoles_festivo", width: 100,
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true },
            { headerName: "Jue. fest.", field: "es_jueves_festivo", width: 100,
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true },
            { headerName: "Vie. fest.", field: "es_viernes_festivo", width: 100,
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true },
            { headerName: "Sáb. fest.", field: "es_sabado_festivo", width: 100,
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true },
            { headerName: "Dom. fest.", field: "es_domingo_festivo", width: 100,
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true },
            { headerName: "Licencia", field: "licencia", width: 300, hide: true }
        ];
    };
    BasicaComponent = __decorate([
        core_1.Component({
            selector: 'basica',
            templateUrl: 'app/basica/basica.html',
            providers: [basica_service_1.BasicaService]
        }), 
        __metadata('design:paramtypes', [basica_service_1.BasicaService])
    ], BasicaComponent);
    return BasicaComponent;
}(GridComponent_1.GridComponent));
exports.BasicaComponent = BasicaComponent;
//# sourceMappingURL=basica.component.js.map
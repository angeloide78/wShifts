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
var ciclo_service_1 = require("./ciclo.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var cicloComponent = (function (_super) {
    __extends(cicloComponent, _super);
    function cicloComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.titulo = "Gestión de Ciclos";
        this.nombre_fichero_csv = "ciclo_wShifts.csv";
        this.nombre_fichero_csv2 = "cicloSemana_wShifts.csv";
        this.display = false;
        this.horas_ciclo = null;
        this.minutos_ciclo = null;
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se crea tipo.
        this.gridOptions2 = {};
        // Se definen columnas.
        this.gridOptions2.columnDefs = this.createDetailColumnDefs();
        // 20-11-2016 Configuración de visualización.
        this.gridOptions2.enableFilter = false;
        this.gridOptions2.enableSorting = false;
        this.gridOptions2.enableColResize = false;
        // Se desactiva opción de eliminar columnas.
        this.gridOptions2.suppressDragLeaveHidesColumns = true;
        // ALGG 18-02-2017 Mensaje para cuando aún no se haya cargado nada en el
        // grid.
        this.gridOptions2.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Seleccione ciclo en el grid de arriba para ver su expansión semanal</span>';
        this.gridOptions2.overlayNoRowsTemplate = '<span style="padding: 10px; border: 2px solid #444; ' +
            ' background: lightgoldenrodyellow;">No se han encontrado datos</span>';
    }
    cicloComponent.prototype.showDialog = function () {
        this.display = true;
    };
    cicloComponent.prototype.onRowSelected = function ($event) {
        var _this = this;
        // Identificador de la fila a partir del nodo.
        var datos = $event.node.data.id;
        var ret;
        var estado_backend;
        var mensaje_backend;
        // Si se está creando no se visualiza nada, por defecto se limpia.
        if (datos == 0) {
            this.gridOptions2.api.setRowData([]);
        }
        else {
            // Se llama a servicio de componente para recuperar información.
            this.objetoService.send_data2(datos)
                .subscribe(function (data) {
                _this.array_objetos2 = data;
                _this.rowData2 = _this.createRowData2(_this.array_objetos2);
                // Incluyo las horas y minutos del ciclo.
                _this.horas_ciclo = _this.rowData2[0]['horas'];
                _this.minutos_ciclo = _this.rowData2[0]['minutos'];
            }, function (error) {
                _this.errorMessage = error;
                _this.mensajes('error_guardar', 'Error de acceso a servidores');
            });
        }
    };
    cicloComponent.prototype.createRowData2 = function (d) {
        return d["data"];
    };
    cicloComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Los campos código, descripción y ciclo no pueden estar vacíos y el campo código no puede tener más de 5 caracteres';
        }
        return [ret, severity, summary, mensaje];
    };
    cicloComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // ALGG 20-11-2016 Se chequean que haya datos para celdas específicas.
            if ((nodo_fila.data.codigo_m.length == 0)
                || (nodo_fila.data.codigo_m.length > 5)
                || (nodo_fila.data.descripcion_m.length == 0)
                || (nodo_fila.data.ciclo_d.length == 0)) {
                ret = false;
            }
            // Si no cumple la validación, nos vamos.
            if (!ret) {
                return [ret, bolsa];
            }
            ;
            // ALGG 20-11-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    codigo_m: nodo_fila.data.codigo_m,
                    descripcion_m: nodo_fila.data.descripcion_m,
                    cuenta_festivo_m: nodo_fila.data.cuenta_festivo_m,
                    activo_m: nodo_fila.data.activo_m,
                    ciclo_d: nodo_fila.data.ciclo_d
                });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    cicloComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {
            id: 0,
            codigo_m: "",
            descripcion_m: "",
            cuenta_festivo_m: "N",
            activo_m: "S",
            ciclo_d: ''
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    cicloComponent.prototype.exportarCSV2 = function () {
        var params = {
            fileName: this.nombre_fichero_csv2
        };
        this.gridOptions2.api.exportDataAsCsv(params);
    };
    cicloComponent.prototype.createDetailColumnDefs = function () {
        return [{ headerName: "Semana", field: "semana", width: 80, cellStyle: { 'text-align': 'center' } },
            { headerName: "L", field: "lunes", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "M", field: "martes", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "X", field: "miercoles", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "J", field: "jueves", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "V", field: "viernes", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "S", field: "sabado", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "D", field: "domingo", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "horas", field: "horas", width: 50, hide: true, cellStyle: { 'text-align': 'center' } },
            { headerName: "minutos", field: "minutos", width: 50, hide: true, cellStyle: { 'text-align': 'center' } },
        ];
    };
    cicloComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id",
                field: "id",
                hide: true,
                width: 100,
            },
            { headerName: "Código",
                field: "codigo_m",
                headerTooltip: "Código de ciclo",
                //cellEditorFramework: {
                //component: StringEditorComponent,
                //moduleImports: [FormsModule]
                //},
                editable: true,
                width: 100
            },
            { headerName: "Descripción",
                field: "descripcion_m",
                headerTooltip: "Descripción de ciclo",
                //cellEditorFramework: {
                //component: StringEditorComponent,
                //moduleImports: [FormsModule]
                //},
                editable: true,
                width: 300,
                cellClassRules: { 'rag-red': 'id < 1' }
            },
            { headerName: "Festivo",
                field: "cuenta_festivo_m",
                headerTooltip: "Se tiene en cuenta festivos",
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true,
                width: 130
            },
            { headerName: "Activo",
                field: "activo_m",
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true,
                width: 70
            },
            { headerName: "Ciclo",
                field: "ciclo_d",
                headerTooltip: "Conjunto de turnos que se repiten entre semanas",
                width: 400,
                //cellEditorFramework: {
                //component: StringEditorComponent,
                //moduleImports: [FormsModule]
                //},
                editable: true
            }
        ];
    };
    cicloComponent = __decorate([
        core_1.Component({
            selector: 'ciclo',
            templateUrl: 'app/ciclo/ciclo.html',
            providers: [ciclo_service_1.CicloService]
        }), 
        __metadata('design:paramtypes', [ciclo_service_1.CicloService])
    ], cicloComponent);
    return cicloComponent;
}(GridComponent_1.GridComponent));
exports.cicloComponent = cicloComponent;
//# sourceMappingURL=ciclo.component.js.map
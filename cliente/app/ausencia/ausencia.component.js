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
//import { StringEditorComponent } from '../grid-utils/editor.component' ;
// Componentes de modelo y servicio.
var ausencia_service_1 = require("./ausencia.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var AusenciaComponent = (function (_super) {
    __extends(AusenciaComponent, _super);
    function AusenciaComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de tipos de ausencias";
        this.nombre_fichero_csv = "tipoAusencias_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        this.filtro_recuperar = { id: null, codigo: null, activo: null };
        // Se cargan los estados de devengo.
        this.cargarEstadoDevengo();
    }
    AusenciaComponent.prototype.onChangeEstadoDevengo = function ($event) {
        if (this.estado_devengo_sel != null) {
            // Se definen variables para control de modificaciones.
            var oldValue_1;
            var newValue_1 = this.estado_devengo_sel['code'];
            var field = "estado_devengo";
            var id_1;
            //console.log("estado_devengo_sel = ", this.estado_devengo_sel) ;
            // Nodos a actualizar.
            var nodos_a_actualizar_1 = [];
            // Se inserta fecha en las filas seleccionadas.
            var filaSel = this.gridOptions.api.getSelectedNodes();
            filaSel.forEach(function (nodo_fecha) {
                // Nos guardamos los valores...
                oldValue_1 = nodo_fecha.data.estado_devengo;
                id_1 = nodo_fecha.data.id;
                var data_nodo = nodo_fecha.data;
                data_nodo.estado_devengo = newValue_1;
                // Lo incluimos en la bolsa de nodos actualizados.
                nodos_a_actualizar_1.push(nodo_fecha);
            });
            // Se refresca el ag-grid...
            this.gridOptions.api.refreshRows(nodos_a_actualizar_1);
            // Y se actualiza la estructura de control de modificación.
            this.evaluarCeldaModificada(oldValue_1, newValue_1, id_1, field);
        }
    };
    AusenciaComponent.prototype.cargarEstadoDevengo = function () {
        this.estado_devengo = [];
        var aux = ['No definido',
            'Cuenta horas en año actual y resta horas en año anterior',
            'Cuenta horas en año actual y suma horas en año anterior',
            'Cuenta horas en año actual y no cuenta horas en año anterior',
            'No cuenta horas en año actual y resta horas en año anterior',
            'No cuenta horas en año actual y suma horas en año anterior',
            'No cuenta horas en año actual y no cuenta horas en año anterior'];
        var desc;
        var ident;
        // Se rellena el combo...
        for (var i = 0; i <= 6; i++) {
            ident = i;
            desc = aux[i];
            this.estado_devengo.push({ label: desc, value: { 'code': desc } });
        }
    };
    AusenciaComponent.prototype.showDialog = function () {
        this.display = true;
    };
    AusenciaComponent.prototype.insertarFila = function () {
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    };
    AusenciaComponent.prototype.mensajes2 = function (opcion) {
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
    AusenciaComponent.prototype.validaciones = function (modelo) {
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
                    cuenta_horas: nodo_fila.data.cuenta_horas,
                    cuenta_dias: nodo_fila.data.cuenta_dias,
                    max_ausencia_anual: nodo_fila.data.max_ausencia_anual,
                    activar_control_ausencia: nodo_fila.data.activar_control_ausencia,
                    forzar_ausencia: nodo_fila.data.forzar_ausencia,
                    observaciones: nodo_fila.data.observaciones,
                    activo: nodo_fila.data.activo,
                    estado_devengo: nodo_fila.data.estado_devengo });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    AusenciaComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {
            id: 0,
            codigo: "",
            descripcion: "",
            cuenta_horas: 'N',
            cuenta_dias: 'N',
            max_ausencia_anual: 0,
            activar_control_ausencia: 'N',
            forzar_ausencia: 'N',
            observaciones: "",
            activo: 'S',
            estado_devengo: 'No definido'
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    AusenciaComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "Código", field: "codigo", width: 100, editable: true },
            { headerName: "Descripción", field: "descripcion", width: 200,
                editable: true },
            { headerName: "Horas", field: "cuenta_horas", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 80 },
            { headerName: "Días", field: "cuenta_dias", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 80 },
            { headerName: "Tope días", field: "max_ausencia_anual",
                editable: true, width: 120 },
            { headerName: "Activar tope días", field: "activar_control_ausencia", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 160 },
            { headerName: "Forzar aus.", field: "forzar_ausencia", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 120 },
            { headerName: "Observaciones", field: "observaciones", width: 200,
                celleditor: "largeText", editable: true },
            { headerName: "Devengo anterior", field: "estado_devengo",
                editable: true, width: 240 },
            { headerName: "Activo", field: "activo", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 }
        ];
    };
    AusenciaComponent = __decorate([
        core_1.Component({
            selector: 'ausencia',
            templateUrl: 'app/ausencia/ausencia.html',
            providers: [ausencia_service_1.AusenciaService]
        }), 
        __metadata('design:paramtypes', [ausencia_service_1.AusenciaService])
    ], AusenciaComponent);
    return AusenciaComponent;
}(GridComponent_1.GridComponent));
exports.AusenciaComponent = AusenciaComponent;
//# sourceMappingURL=ausencia.component.js.map
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
var common_1 = require("@angular/common");
// Componentes de modelo y servicio.
var contrato_ausencia_service_1 = require("./contrato_ausencia.service");
var contrato_component_1 = require("../contrato/contrato.component");
var ausencia_service_1 = require("../ausencia/ausencia.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var ContratoAusenciaComponent = (function (_super) {
    __extends(ContratoAusenciaComponent, _super);
    function ContratoAusenciaComponent(objetoService, ausenciaService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.ausenciaService = ausenciaService;
        this.display = false;
        this.titulo = "Ausencias asociadas a un contrato";
        this.nombre_fichero_csv = "ausenciasContrato_wShifts.csv";
        this.contrato_id = null;
        this.hora_inicio = null;
        this.minuto_inicio = null;
        this.hora_fin = null;
        this.minuto_fin = null;
        this.fecha_desde = null;
        this.fecha_hasta = null;
        this.es = { firstDayOfWeek: 1,
            dayNames: ["lunes", "martes", "miércoles", "jueves",
                "viernes", "sábado", "domingo"],
            dayNamesShort: ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"],
            dayNamesMin: ["L", "M", "X", "J", "V", "S", "D"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre",
                "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul",
                "ago", "sep", "oct", "nov", "dic"]
        };
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se cargan ausencias.
        this.cargarAusencia();
    }
    ContratoAusenciaComponent.prototype.insertar_hora_inicio = function () {
        if (this.hora_inicio == null) {
            this.hora_inicio = 0;
        }
        if (this.minuto_inicio == null) {
            this.minuto_inicio = 0;
        }
        var h = String(this.hora_inicio);
        var m = String(this.minuto_inicio);
        if (h.length == 1) {
            h = '0' + h;
        }
        if (m.length == 1) {
            m = '0' + m;
        }
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "hora_inicio";
        var id;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.hora_inicio;
            newValue = h + ":" + m;
            id = nodo_fecha.data.id;
            nodo_fecha.data.hora_inicio = newValue;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field);
    };
    ContratoAusenciaComponent.prototype.insertar_hora_fin = function () {
        if (this.hora_fin == null) {
            this.hora_fin = 0;
        }
        if (this.minuto_fin == null) {
            this.minuto_fin = 0;
        }
        var h = String(this.hora_fin);
        var m = String(this.minuto_fin);
        if (h.length == 1) {
            h = '0' + h;
        }
        if (m.length == 1) {
            m = '0' + m;
        }
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "hora_fin";
        var id;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.hora_fin;
            newValue = h + ":" + m;
            id = nodo_fecha.data.id;
            nodo_fecha.data.hora_fin = newValue;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field);
    };
    ContratoAusenciaComponent.prototype.insertarAusencia = function () {
        // Primero se selecciona una fecha.
        if (this.ausencia_sel == null) {
            this.mensajes("error_ausencia");
            return;
        }
        // Se recupera la ausencia seleccionada.
        var ausencia_id = this.ausencia_sel['id'];
        var ausencia_cod = this.ausencia_sel['code'];
        var ausencia_desc = this.ausencia_sel['name'];
        // Se definen variables para control de modificaciones.
        var id;
        var oldValue_id;
        var newValue_id;
        var field_id = "aus_id";
        var oldValue_cod;
        var newValue_cod;
        var field_cod = "aus_cod";
        var oldValue_desc;
        var newValue_desc;
        var field_desc = "aus_desc";
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        // Se recuperan nodos seleccionados.
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo) {
            id = nodo.data.id;
            // Se actualiza id.
            oldValue_id = nodo.data.aus_id;
            newValue_id = ausencia_id;
            nodo.data.aus_id = newValue_id;
            // Se actualiza código.
            oldValue_cod = nodo.data.aus_cod;
            newValue_cod = ausencia_cod;
            nodo.data.aus_cod = newValue_cod;
            // Se actualiza descripción.
            oldValue_desc = nodo.data.aus_desc;
            newValue_desc = ausencia_desc;
            nodo.data.aus_desc = newValue_desc;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue_id, newValue_id, id, field_id);
        this.evaluarCeldaModificada(oldValue_cod, newValue_cod, id, field_cod);
        this.evaluarCeldaModificada(oldValue_desc, newValue_desc, id, field_desc);
    };
    ContratoAusenciaComponent.prototype.insertarFechaDesde = function () {
        // Primero se selecciona una fecha.
        if (this.fecha_desde == null) {
            this.mensajes("error_fechas2");
            return;
        }
        var partes_fecha = this.fecha_desde.split('/');
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "fecha_inicio";
        var id;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        // Se inserta fecha en las filas seleccionadas.
        var fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.fecha_inicio;
            newValue = fecha2;
            id = nodo_fecha.data.id;
            var data_nodo = nodo_fecha.data;
            data_nodo.fecha_inicio = fecha2;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field);
    };
    ContratoAusenciaComponent.prototype.insertarFechaHasta = function () {
        // Primero se selecciona una fecha.
        if (this.fecha_hasta == null) {
            this.mensajes("error_fechas2");
            return;
        }
        var partes_fecha;
        var fecha2;
        partes_fecha = this.fecha_hasta.split('/');
        fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "fecha_fin";
        var id;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        // Se inserta fecha en las filas seleccionadas.
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.fecha_fin;
            newValue = fecha2;
            id = nodo_fecha.data.id;
            var data_nodo = nodo_fecha.data;
            data_nodo.fecha_fin = fecha2;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field);
    };
    ContratoAusenciaComponent.prototype.cargarAusencia = function () {
        var _this = this;
        this.ausencia = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables para recoger texto e identificadores.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.ausenciaService.send_data({ id: null, codigo: null, activo: 'S' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_ausencia = data;
            aux = _this.createRowData(_this.array_ausencia);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.ausencia.push({ label: 'Seleccione ausencia', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = "(" + aux[i]['codigo'] + ") " + aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.ausencia.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    ContratoAusenciaComponent.prototype.ngOnChanges = function (changes) {
        // Se detectan cambios...
        var dato;
        var contratoSel = changes['contratoSel'];
        // Se recuperan cambios...
        dato = contratoSel.currentValue;
        // Si no hay nada, salimos.
        if (dato == undefined) {
            return;
        }
        // Se recupera el id, que será con lo que se busque...
        var id = dato.id;
        this.contrato_id = id;
        console.log("[CONTRATO-AUSENCIA] Recuperando contrato con id " + dato.id);
        // Se recupera información.
        this.filtro_recuperar = { contrato_id: id, activo: 'S' };
        this.recuperar();
    };
    ContratoAusenciaComponent.prototype.showDialog = function () {
        this.display = true;
    };
    ContratoAusenciaComponent.prototype.insertarFila = function () {
        if (this.fecha_desde == null || this.fecha_hasta == null) {
            this.mensajes("error_fechas");
            return;
        }
        if ((this.ausencia_sel == null)) {
            this.mensajes("error_insertar");
            return;
        }
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    };
    ContratoAusenciaComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Si la ausencia es parcial es necesario incluir hora de inicio y hora de fin';
        }
        if (opcion == 'error_ausencia') {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero la ausencia del combo";
        }
        if (opcion == 'error_fechas') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "Seleccione fecha de inicio y de finalización de ausencia";
        }
        if (opcion == 'error_fechas2') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero la fecha haciendo click en caja de fecha";
        }
        if (opcion == "error_insertar") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione primero la ausencia.';
        }
        return [ret, severity, summary, mensaje];
    };
    ContratoAusenciaComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            if ((nodo_fila.data.ausencia_parcial == 'S') &&
                ((nodo_fila.data.hora_inicio == null) ||
                    ((nodo_fila.data.hora_fin == null)))) {
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
                    contrato_id: nodo_fila.data.contrato_id,
                    aus_id: nodo_fila.data.aus_id,
                    aus_cod: nodo_fila.data.aus_cod,
                    aus_desc: nodo_fila.data.aus_desc,
                    fecha_inicio: nodo_fila.data.fecha_inicio,
                    fecha_fin: nodo_fila.data.fecha_fin,
                    anno_devengo: nodo_fila.data.anno_devengo,
                    activo: nodo_fila.data.activo,
                    ausencia_parcial: nodo_fila.data.ausencia_parcial,
                    hora_inicio: nodo_fila.data.hora_inicio,
                    hora_fin: nodo_fila.data.hora_fin });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    ContratoAusenciaComponent.prototype.crearNuevaFilaDatos = function () {
        var ausencia_id = this.ausencia_sel['id'];
        var ausencia_cod = this.ausencia_sel['code'];
        var ausencia_desc = this.ausencia_sel['name'];
        var partes_fecha = this.fecha_desde.split('/');
        var fecha_d = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        partes_fecha = this.fecha_hasta.split('/');
        var fecha_h = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        /*
        if ( this.hora_ausencia == null ) { this.hora_ausencia = 0 }
        if ( this.minuto_ausencia == null ) { this.minuto_ausencia = 0 }
  
        let h = String(this.hora_ausencia) ;
        let m = String(this.minuto_ausencia) ;
        if ( h.length == 1) { h = '0' + h }
        if ( m.length == 1) { m = '0' + m }
        */
        var nuevaFila = {
            id: 0,
            contrato_id: this.contrato_id,
            aus_id: ausencia_id,
            aus_cod: ausencia_cod,
            aus_desc: ausencia_desc,
            fecha_inicio: fecha_d,
            fecha_fin: fecha_h,
            anno_devengo: new Date().getFullYear(),
            activo: 'S',
            ausencia_parcial: 'N',
            hora_inicio: null,
            hora_fin: null
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    ContratoAusenciaComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "contrato_id", field: "contrato_id", hide: true,
                width: 100 },
            { headerName: "aus_id", field: "aus_id", hide: true, width: 100 },
            { headerName: "Cód.", field: "aus_cod", width: 70 },
            { headerName: "Descripción", field: "aus_desc", width: 300 },
            { headerName: "Desde", field: "fecha_inicio", width: 120,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "Hasta", field: "fecha_fin", width: 120,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "Año devengo", field: "anno_devengo", width: 130,
                editable: true },
            { headerName: "Parcial", field: "ausencia_parcial", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true,
                width: 80 },
            { headerName: "H. Inicio", field: "hora_inicio", width: 130 },
            { headerName: "H. Fin", field: "hora_fin", width: 130 },
            { headerName: "Activo", field: "activo", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, hide: true, editable: true,
                width: 100 }
        ];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', contrato_component_1.ContratoSeleccionado)
    ], ContratoAusenciaComponent.prototype, "contratoSel", void 0);
    ContratoAusenciaComponent = __decorate([
        core_1.Component({
            selector: 'contrato_ausencia',
            templateUrl: 'app/contrato_ausencia/contrato_ausencia.html',
            providers: [contrato_ausencia_service_1.ContratoAusenciaService, ausencia_service_1.AusenciaService]
        }), 
        __metadata('design:paramtypes', [contrato_ausencia_service_1.ContratoAusenciaService, ausencia_service_1.AusenciaService])
    ], ContratoAusenciaComponent);
    return ContratoAusenciaComponent;
}(GridComponent_1.GridComponent));
exports.ContratoAusenciaComponent = ContratoAusenciaComponent;
//# sourceMappingURL=contrato_ausencia.component.js.map
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
var cobertura_equipo_service_1 = require("./cobertura_equipo.service");
var equipo_service_1 = require("../equipo/equipo.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var CoberturaEquipoComponent = (function (_super) {
    __extends(CoberturaEquipoComponent, _super);
    function CoberturaEquipoComponent(objetoService, equipoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.equipoService = equipoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de coberturas de equipo";
        this.nombre_fichero_csv = "coberturasEquipo_wShifts.csv";
        this.fecha_inicio = null;
        this.fecha_fin = null;
        this.es = { firstDayOfWeek: 0,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves",
                "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre",
                "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul",
                "ago", "sep", "oct", "nov", "dic"]
        };
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se cargan combos.
        this.cargarEq();
    }
    CoberturaEquipoComponent.prototype.cargarEq = function () {
        var _this = this;
        this.eq = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        // Se llama a servicio de componente para recuperar información.
        this.equipoService.send_data({ id: null, codigo: null, activo: 'S',
            sf_id: null, asig_pend: 'N' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_eq = data;
            aux = _this.createRowData(_this.array_eq);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.eq.push({ label: 'Seleccione equipo de trabajo', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    codigo = aux[i]['codigo'];
                    desc = "(" + codigo + ") " + aux[i]['descripcion'];
                    _this.eq.push({ label: desc, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    CoberturaEquipoComponent.prototype.insertarFechaFin = function () {
        // Primero se selecciona una fecha.
        if (this.fecha_fin == null) {
            this.mensajes("error_fechas2");
            return;
        }
        var partes_fecha = this.fecha_fin.split('/');
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "fecha_fin";
        var id;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        var fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
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
    CoberturaEquipoComponent.prototype.insertarFila = function () {
        if (this.eq_sel == null || this.fecha_inicio == null) {
            this.mensajes('error_insertar_filas');
        }
        else {
            var nuevoElemento = this.crearNuevaFilaDatos();
            this.gridOptions.api.addItems([nuevoElemento]);
        }
    };
    CoberturaEquipoComponent.prototype.recuperar = function () {
        this.filtro_recuperar = { activo: "S", id: null, codigo: null };
        _super.prototype.recuperar.call(this);
    };
    CoberturaEquipoComponent.prototype.showDialog = function () {
        this.display = true;
    };
    CoberturaEquipoComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == 'error_fechas2') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero fecha de fin de cobertura";
        }
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'La fecha de inicio no puede ser mayor que la fecha de fin.';
        }
        if (opcion == "error_insertar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Es necesario seleccionar un equipo y la fecha de inicio de la cobertura.';
        }
        if (opcion == "error_eq_sel") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione primero un equipo de trabajo del combo.';
        }
        return [ret, severity, summary, mensaje];
    };
    CoberturaEquipoComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // se seleccionan las filas nuevas para ser devueltas al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            if ((nodo_fila.data.fecha_fin != null) &&
                (nodo_fila.data.fecha_inicio >
                    nodo_fila.data.fecha_fin)) {
                ret = false;
            }
            // Si no cumple la validación, nos vamos.
            if (!ret) {
                return [ret, bolsa];
            }
            ;
            // ALGG 22-12-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    fecha_inicio: nodo_fila.data.fecha_inicio,
                    fecha_fin: nodo_fila.data.fecha_fin,
                    eq_id: nodo_fila.data.eq_id,
                    eq_cod: nodo_fila.data.eq_cod,
                    eq_desc: nodo_fila.data.eq_desc,
                    lunes: nodo_fila.data.lunes,
                    martes: nodo_fila.data.martes,
                    miercoles: nodo_fila.data.miercoles,
                    jueves: nodo_fila.data.jueves,
                    viernes: nodo_fila.data.viernes,
                    sabado: nodo_fila.data.sabado,
                    domingo: nodo_fila.data.domingo
                });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    CoberturaEquipoComponent.prototype.crearNuevaFilaDatos = function () {
        var eq_id = this.eq_sel['id'];
        var eq_cod = this.eq_sel['code'];
        var eq_desc = this.eq_sel['name'];
        var partes_fecha = this.fecha_inicio.split('/');
        var fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        var nuevaFila = {
            id: 0,
            fecha_inicio: fecha2,
            fecha_fin: null,
            eq_id: eq_id,
            eq_cod: eq_cod,
            eq_desc: eq_desc,
            lunes: 0,
            martes: 0,
            miercoles: 0,
            jueves: 0,
            viernes: 0,
            sabado: 0,
            domingo: 0
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    CoberturaEquipoComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "F. inicio", field: "fecha_inicio", width: 100,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                } },
            { headerName: "F. fin", field: "fecha_fin", width: 100,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                } },
            { headerName: "eq_id", field: "eq_id", width: 100, hide: true },
            { headerName: "Cód. Eq.", field: "eq_cod", width: 100, hide: true },
            { headerName: "Equipo de trabajo", field: "eq_desc", width: 200 },
            { headerName: "Lunes", field: "lunes", editable: true, width: 100 },
            { headerName: "Martes", field: "martes", editable: true, width: 100 },
            { headerName: "Miércoles", field: "miercoles", editable: true, width: 100 },
            { headerName: "Jueves", field: "jueves", editable: true, width: 100 },
            { headerName: "Viernes", field: "viernes", editable: true, width: 100 },
            { headerName: "Sábado", field: "sabado", editable: true, width: 100 },
            { headerName: "Domingo", field: "domingo", editable: true, width: 100 }
        ];
    };
    CoberturaEquipoComponent = __decorate([
        core_1.Component({
            selector: 'cobertura_equipo',
            templateUrl: 'app/cobertura_equipo/cobertura_equipo.html',
            providers: [cobertura_equipo_service_1.CoberturaEquipoService, equipo_service_1.EquipoService]
        }), 
        __metadata('design:paramtypes', [cobertura_equipo_service_1.CoberturaEquipoService, equipo_service_1.EquipoService])
    ], CoberturaEquipoComponent);
    return CoberturaEquipoComponent;
}(GridComponent_1.GridComponent));
exports.CoberturaEquipoComponent = CoberturaEquipoComponent;
//# sourceMappingURL=cobertura_equipo.component.js.map
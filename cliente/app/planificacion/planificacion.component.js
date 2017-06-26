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
var planificacion_service_1 = require("./planificacion.service");
var puesto_ciclo_service_1 = require("../puesto_ciclo/puesto_ciclo.service");
var centro_fisico_service_1 = require("../centro_fisico/centro_fisico.service");
var servicio_service_1 = require("../servicio/servicio.service");
var equipo_service_1 = require("../equipo/equipo.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var PlanificacionComponent = (function (_super) {
    __extends(PlanificacionComponent, _super);
    function PlanificacionComponent(objetoService, puestoCicloService, centroFisicoService, servicioService, equipoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.puestoCicloService = puestoCicloService;
        this.centroFisicoService = centroFisicoService;
        this.servicioService = servicioService;
        this.equipoService = equipoService;
        this.anno = new Date().getFullYear();
        this.display = false;
        this.titulo = "Planificación de ciclos de puestos de trabajo";
        this.tipo_visualizacion = "estatica";
        this.nombre_fichero_csv = "planificacion_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se cargan los meses del año.
        this.cargarMes();
        // Se cargan los centros físicos.
        this.cargarCF();
        // Se cargan opciones de ver planilla por tramos o completa.
        this.cargarVerPlanilla();
    }
    PlanificacionComponent.prototype.cambiarDiasPlanilla = function () {
        // Mes actual.
        var mes = this.mes_sel['code'];
        // Año actual.
        var anno = this.anno;
        // Día actual.
        var dia = new Date(anno, mes + 1, 0).getDate();
        // Se buscan columnas y se ocultan o visualizan dependiendo de los días
        // del mes.
        if (dia == 28) {
            // Mes de Febrero: Se ocultan días 29,30,31
            this.gridOptions.columnApi.setColumnsVisible(['dia29', 'dia30', 'dia31'], false);
        }
        else {
            if (dia == 29) {
                // Mes de Febrero para año bisiesto: Se ocultan días 30,31 y se
                // visualizan del 1 al 29.
                this.gridOptions.columnApi.setColumnsVisible(['dia30', 'dia31'], false);
                this.gridOptions.columnApi.setColumnsVisible(['dia29'], true);
            }
            else {
                if (dia == 30) {
                    // Mes de 30 días: Se oculta día 31 y se visualizan del 1 al 30.
                    this.gridOptions.columnApi.setColumnsVisible(['dia31'], false);
                    this.gridOptions.columnApi.setColumnsVisible(['dia29', 'dia30'], true);
                }
                else {
                    if (dia == 31) {
                        // Mes de 31 días: Se visualizan todos los días.
                        this.gridOptions.columnApi.setColumnsVisible(['dia29', 'dia30', 'dia31'], true);
                    }
                }
            }
        }
    };
    PlanificacionComponent.prototype.onChangeMes = function ($event) {
        if (this.mes_sel != null) {
            if (this.eq_sel == null) {
                this.cambiarDiasPlanilla();
            }
            else {
                this.recuperar();
            }
        }
    };
    PlanificacionComponent.prototype.cargarCF = function () {
        var _this = this;
        this.cf = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.centroFisicoService.send_data({ id: null, activo: 'S' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_cf = data;
            aux = _this.createRowData(_this.array_cf);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.cf.push({ label: 'Seleccione centro físico', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = "(" + aux[i]['codigo'] + ") " + aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.cf.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    PlanificacionComponent.prototype.onChangeCF = function ($event) {
        // Se recupera el identificador del centro físico.
        //let cf_id = $event.value['id'] ;
        if (this.cf_sel != null) {
            // Se cargan los servicios que cuelgan del centro físico seleccionado.
            this.cargarServicio();
        }
    };
    PlanificacionComponent.prototype.cargarServicio = function () {
        var _this = this;
        this.sf = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.servicioService.send_data({ id: null, codigo: null, activo: 'S',
            cf_id: this.cf_sel['id'],
            asig_pend: 'N' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_sf = data;
            aux = _this.createRowData(_this.array_sf);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.sf.push({ label: 'Seleccione servicio', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = "(" + aux[i]['codigo'] + ") " + aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.sf.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    PlanificacionComponent.prototype.onChangeServicio = function ($event) {
        // Se recupera el identificador del servicio.
        //let sf_id = $event.value['id'] ;
        if (this.sf_sel != null) {
            // Se cargan los equipos que cuelgan del servicio seleccionado.
            this.cargarEquipo();
        }
    };
    PlanificacionComponent.prototype.cargarEquipo = function () {
        var _this = this;
        this.eq = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.equipoService.send_data({ id: null, codigo: null, activo: 'S',
            sf_id: this.sf_sel['id'],
            asig_pend: 'N' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_eq = data;
            aux = _this.createRowData(_this.array_eq);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.eq.push({ label: 'Seleccione equipo', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = "(" + aux[i]['codigo'] + ") " + aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.eq.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    PlanificacionComponent.prototype.cargarMes = function () {
        this.mes = [];
        var aux = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        var desc;
        var ident;
        // Se rellena el combo...
        this.mes.push({ label: 'Seleccione mes', value: null });
        for (var i = 0; i <= 12; i++) {
            ident = i;
            desc = aux[i];
            this.mes.push({ label: desc, value: { 'code': i } });
        }
    };
    PlanificacionComponent.prototype.cargarVerPlanilla = function () {
        this.ver_planilla = [];
        var aux = ["Por tramos", "Completo"];
        var desc;
        var ident;
        // Se rellena el combo...
        this.ver_planilla.push({ label: 'Seleccione visualización', value: null });
        for (var i = 0; i <= 2; i++) {
            ident = i;
            desc = aux[i];
            this.ver_planilla.push({ label: desc, value: i });
        }
    };
    PlanificacionComponent.prototype.recuperar = function () {
        var equipo_id;
        var mes;
        var anno;
        var visual;
        if ((this.mes_sel == null) ||
            (this.eq_sel == null)) {
            this.mensajes('error_recuperar');
            return;
        }
        if ((this.ver_planilla_sel == null)) {
            this.mensajes('error_recuperar3');
            return;
        }
        // Filtro de recuperación de datos.
        equipo_id = this.eq_sel['id'];
        mes = this.mes_sel['code'] + 1;
        anno = this.anno;
        visual = this.ver_planilla_sel;
        this.filtro_recuperar = { ver: visual, anno: anno, mes: mes,
            equipo_id: equipo_id };
        //console.log("Recuperando puesto " + equipo_id + " para año/mes = " + anno + "/" + mes) ;
        _super.prototype.recuperar.call(this);
        // ALGG 22012017 Y se intentan incluir los días de la semana.
        this.dias_semanas();
        // ALGG 10012017 Se visualizan los días correctos de la planilla.
        this.cambiarDiasPlanilla();
    };
    PlanificacionComponent.prototype.showDialog = function () {
        this.display = true;
    };
    PlanificacionComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_recuperar") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Es necesario especificar año, mes y equipo para recuperar las planificaciones de sus puestos';
        }
        if (opcion == "error_recuperar3") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione tipo de visualización: "Por tramos" visualiza puesto por ciclo ; "Completo" visualiza todo el mes por puesto en una única línea';
        }
        if (opcion == "error_planif1") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Es necesario seleccionar un turno libre que podría ser utilizado en la planificación';
        }
        if (opcion == "error_planif2") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Es necesario seleccionar un equipo al que planificarle los puestos de trabajo';
        }
        return [ret, severity, summary, mensaje];
    };
    PlanificacionComponent.prototype.dias_semanas = function () {
        this.gridOptions.api.setColumnDefs(this.createColumnDefs());
    };
    PlanificacionComponent.prototype.dia_semana = function (opcion) {
        if (opcion == 0) {
            return "D";
        }
        if (opcion == 1) {
            return "L";
        }
        if (opcion == 2) {
            return "M";
        }
        if (opcion == 3) {
            return "X";
        }
        if (opcion == 4) {
            return "J";
        }
        if (opcion == 5) {
            return "V";
        }
        if (opcion == 6) {
            return "S";
        }
    };
    PlanificacionComponent.prototype.poner_dias_semana = function (dia) {
        var mes = this.mes_sel['code'];
        var a = this.dia_semana(new Date(this.anno, mes, dia).getDay());
        return dia + "/" + a;
    };
    PlanificacionComponent.prototype.createColumnDefs = function () {
        var cab_template = function (params) {
            //let id: string = params.column.colId.substring(2) ;
            try {
                var id = params.value;
                console.log(id);
            }
            catch (Error) { }
            //if (this.mes_sel != undefined) {
            //  console.log(this.mes_sel['code']) ;
            //}
            var eCell = document.createElement('span');
            eCell.innerHTML = '<div style="text-align:center;font-size:12px;color:#10679F">' +
                '  <div id="agResizeBar" style="width: 4px; height: 100%; float: right; cursor: col-resize;"></div>' +
                '  <div style="padding: 4px; overflow: hidden; text-overflow: ellipsis;">' +
                '    <span id="agHeaderCellLabel">' +
                '      <span id="agText"></span>' +
                '      <span id="agSortAsc"><i class="fa fa-long-arrow-down"></i></span>' +
                '      <span id="agSortDesc"><i class="fa fa-long-arrow-up"></i></span>' +
                '      <span id="agNoSort"></span>' +
                '      <span id="agFilter"><i class="fa fa-filter"></i></span>' +
                '    </span>' +
                '  </div>' +
                '</div>';
            return eCell;
        };
        var tooltipRenderer = function (params) {
            return '<span title="' + params.value + '">' + params.value + '</span>';
        };
        var ayuda = function (params) {
            var aux = params.colDef.field + "_aus";
            if (params.data[aux] == null) {
                return params.value;
            }
            return '<span title="' + params.data[aux] + '">' + params.value + '</span>';
        };
        var color = function (params) {
            var aux = params.colDef.field + "_aus";
            if (params.data[aux] == null) {
                return { 'text-align': 'center', backgroundColor: 'white' };
            }
            else {
                return { 'text-align': 'center', backgroundColor: 'yellow' };
            }
        };
        var dia1 = "1";
        var dia2 = "2";
        var dia3 = "3";
        var dia4 = "4";
        var dia5 = "5";
        var dia6 = "6";
        var dia7 = "7";
        var dia8 = "8";
        var dia9 = "9";
        var dia10 = "10";
        var dia11 = "11";
        var dia12 = "12";
        var dia13 = "13";
        var dia14 = "14";
        var dia15 = "15";
        var dia16 = "16";
        var dia17 = "17";
        var dia18 = "18";
        var dia19 = "19";
        var dia20 = "20";
        var dia21 = "21";
        var dia22 = "22";
        var dia23 = "23";
        var dia24 = "24";
        var dia25 = "25";
        var dia26 = "26";
        var dia27 = "27";
        var dia28 = "28";
        var dia29 = "29";
        var dia30 = "30";
        var dia31 = "31";
        if (this.mes_sel != null) {
            dia1 = this.poner_dias_semana(1);
            dia2 = this.poner_dias_semana(2);
            dia3 = this.poner_dias_semana(3);
            dia4 = this.poner_dias_semana(4);
            dia5 = this.poner_dias_semana(5);
            dia6 = this.poner_dias_semana(6);
            dia7 = this.poner_dias_semana(7);
            dia8 = this.poner_dias_semana(8);
            dia9 = this.poner_dias_semana(9);
            dia10 = this.poner_dias_semana(10);
            dia11 = this.poner_dias_semana(11);
            dia12 = this.poner_dias_semana(12);
            dia13 = this.poner_dias_semana(13);
            dia14 = this.poner_dias_semana(14);
            dia15 = this.poner_dias_semana(15);
            dia16 = this.poner_dias_semana(16);
            dia17 = this.poner_dias_semana(17);
            dia18 = this.poner_dias_semana(18);
            dia19 = this.poner_dias_semana(19);
            dia20 = this.poner_dias_semana(20);
            dia21 = this.poner_dias_semana(21);
            dia22 = this.poner_dias_semana(22);
            dia23 = this.poner_dias_semana(23);
            dia24 = this.poner_dias_semana(24);
            dia25 = this.poner_dias_semana(25);
            dia26 = this.poner_dias_semana(26);
            dia27 = this.poner_dias_semana(27);
            dia28 = this.poner_dias_semana(28);
            dia29 = this.poner_dias_semana(29);
            dia30 = this.poner_dias_semana(30);
            dia31 = this.poner_dias_semana(31);
        }
        return [
            { headerName: "festivos", field: "festivos", hide: true, width: 100 },
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "mes", field: "mes", hide: true, width: 100 },
            { headerName: "anno", field: "anno", hide: true, width: 400 },
            { headerName: "puesto_id", field: "puesto_id", hide: true, width: 100 },
            { headerName: "puesto_cod", field: "puesto_cod", hide: true, width: 400 },
            { headerName: "Puesto", field: "puesto_desc", width: 120 },
            { headerName: "fecha_inicio", field: "fecha_inicio", hide: true, width: 200 },
            { headerName: "ciclo_master_id", field: "ciclo_master_id", hide: true, width: 200 },
            { headerName: "fecha_fin", field: "fecha_fin", hide: true, width: 200 },
            { headerName: "total_dias", field: "total_dias", hide: true, width: 200 },
            { headerName: "Sem.", field: "semana", width: 40, cellStyle: { 'text-align': 'center' } },
            { headerName: dia1, headerCellTemplate: cab_template, field: "dia1", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia2, headerCellTemplate: cab_template, field: "dia2", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia3, headerCellTemplate: cab_template, field: "dia3", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia4, headerCellTemplate: cab_template, field: "dia4", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia5, headerCellTemplate: cab_template, field: "dia5", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia6, headerCellTemplate: cab_template, field: "dia6", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia7, headerCellTemplate: cab_template, field: "dia7", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia8, headerCellTemplate: cab_template, field: "dia8", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia9, headerCellTemplate: cab_template, field: "dia9", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia10, headerCellTemplate: cab_template, field: "dia10", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia11, headerCellTemplate: cab_template, field: "dia11", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia12, headerCellTemplate: cab_template, field: "dia12", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia13, headerCellTemplate: cab_template, field: "dia13", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia14, headerCellTemplate: cab_template, field: "dia14", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia15, headerCellTemplate: cab_template, field: "dia15", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia16, headerCellTemplate: cab_template, field: "dia16", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia17, headerCellTemplate: cab_template, field: "dia17", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia18, headerCellTemplate: cab_template, field: "dia18", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia19, headerCellTemplate: cab_template, field: "dia19", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia20, headerCellTemplate: cab_template, field: "dia20", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia21, headerCellTemplate: cab_template, field: "dia21", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia22, headerCellTemplate: cab_template, field: "dia22", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia23, headerCellTemplate: cab_template, field: "dia23", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia24, headerCellTemplate: cab_template, field: "dia24", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia25, headerCellTemplate: cab_template, field: "dia25", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia26, headerCellTemplate: cab_template, field: "dia26", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia27, headerCellTemplate: cab_template, field: "dia27", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia28, headerCellTemplate: cab_template, field: "dia28", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia29, headerCellTemplate: cab_template, field: "dia29", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia30, headerCellTemplate: cab_template, field: "dia30", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia31, headerCellTemplate: cab_template, field: "dia31", width: 41, cellRenderer: ayuda, cellStyle: color }
        ];
    };
    PlanificacionComponent = __decorate([
        core_1.Component({
            selector: 'planificacion',
            templateUrl: 'app/planificacion/planificacion.html',
            providers: [puesto_ciclo_service_1.PuestoCicloService, planificacion_service_1.PlanificacionService, centro_fisico_service_1.CentroFisicoService,
                servicio_service_1.ServicioService, equipo_service_1.EquipoService]
        }), 
        __metadata('design:paramtypes', [planificacion_service_1.PlanificacionService, puesto_ciclo_service_1.PuestoCicloService, centro_fisico_service_1.CentroFisicoService, servicio_service_1.ServicioService, equipo_service_1.EquipoService])
    ], PlanificacionComponent);
    return PlanificacionComponent;
}(GridComponent_1.GridComponent));
exports.PlanificacionComponent = PlanificacionComponent;
//# sourceMappingURL=planificacion.component.js.map
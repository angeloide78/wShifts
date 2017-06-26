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
var balance_service_1 = require("./balance.service");
var puesto_ciclo_service_1 = require("../puesto_ciclo/puesto_ciclo.service");
var centro_fisico_service_1 = require("../centro_fisico/centro_fisico.service");
var servicio_service_1 = require("../servicio/servicio.service");
var equipo_service_1 = require("../equipo/equipo.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var BalanceComponent = (function (_super) {
    __extends(BalanceComponent, _super);
    function BalanceComponent(objetoService, puestoCicloService, centroFisicoService, servicioService, equipoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.puestoCicloService = puestoCicloService;
        this.centroFisicoService = centroFisicoService;
        this.servicioService = servicioService;
        this.equipoService = equipoService;
        this.anno = new Date().getFullYear();
        //ver_planilla: SelectItem[] ;
        //ver_planilla_sel: any ;
        this.desglose = false;
        this.selectedType = 'eq';
        this.display = false;
        this.titulo = "Balance horario de trabajadores";
        this.tipo_visualizacion = "estatica";
        this.nombre_fichero_csv = "balanceHorario_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se cargan los meses del año.
        this.cargarMes();
        // Se cargan los centros físicos.
        this.cargarCF();
        // Se cargan opciones de ver planilla por tramos o completa.
        //this.cargarVerPlanilla() ;
        // Se cargan opciones de cálculo.
        this.types = [];
        this.types.push({ label: 'Centro físico', value: 'cf' });
        this.types.push({ label: 'Servicio', value: 'sf' });
        this.types.push({ label: 'Equipo', value: 'eq' });
    }
    BalanceComponent.prototype.clear = function () {
        this.selectedType = 'eq';
    };
    BalanceComponent.prototype.calcularBalance = function () {
        this.recuperar();
    };
    BalanceComponent.prototype.handleChangeDesglose = function (e) {
        this.desglose = e.checked;
        /*if ( this.edicion && this.contrato_id != null) {
          // Se crea el objeto del contrato seleccionado.
          let contrato_seleccionado = new ContratoSeleccionado(this.contrato_id) ;
          this.contratoSel = contrato_seleccionado ;
          this.boton_actualizar = false ;
        }
        else {this.boton_actualizar = true}
        */
    };
    BalanceComponent.prototype.onChangeMes = function ($event) {
        if (this.mes_sel != null) {
            if (this.eq_sel == null) {
            }
            else {
                this.recuperar();
            }
        }
    };
    BalanceComponent.prototype.cargarCF = function () {
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
    BalanceComponent.prototype.onChangeCF = function ($event) {
        // Se recupera el identificador del centro físico.
        //let cf_id = $event.value['id'] ;
        if (this.cf_sel != null) {
            // Se cargan los servicios que cuelgan del centro físico seleccionado.
            this.cargarServicio();
        }
    };
    BalanceComponent.prototype.cargarServicio = function () {
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
    BalanceComponent.prototype.onChangeServicio = function ($event) {
        // Se recupera el identificador del servicio.
        //let sf_id = $event.value['id'] ;
        if (this.sf_sel != null) {
            // Se cargan los equipos que cuelgan del servicio seleccionado.
            this.cargarEquipo();
        }
    };
    BalanceComponent.prototype.cargarEquipo = function () {
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
    BalanceComponent.prototype.cargarMes = function () {
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
    BalanceComponent.prototype.recuperar = function () {
        var mes = null;
        var anno = null;
        var eq_id = null;
        var sf_id = null;
        var cf_id = null;
        if (this.selectedType == 'cf' && this.cf_sel != null) {
            // Se recupera por centro físico.
            cf_id = this.cf_sel['id'];
        }
        else if (this.selectedType == 'sf' && this.sf_sel != null) {
            // Se recupera por servicio funcional.
            sf_id = this.sf_sel['id'];
        }
        else if (this.selectedType == 'eq' && this.eq_sel != null) {
            // Se recupera por equipo de trabajo (grupo funcional).
            eq_id = this.eq_sel['id'];
        }
        else {
            this.mensajes('error_recuperar');
            return;
        }
        // Filtro de recuperación de fechas.
        anno = this.anno;
        this.filtro_recuperar = { mes: null, anno: anno, persona_id: null,
            fecha_inicio: null, fecha_fin: null,
            cf_id: cf_id, sf_id: sf_id, eq_id: eq_id,
            p_id: null };
        _super.prototype.recuperar.call(this);
    };
    BalanceComponent.prototype.showDialog = function () {
        this.display = true;
    };
    BalanceComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_recuperar") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Es necesario especificar año, centro físico, servicio y equipo para recuperar trabajadores';
        }
        return [ret, severity, summary, mensaje];
    };
    BalanceComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "Centro físico", field: "cf", width: 120 },
            { headerName: "Servicio funcional", field: "sf", width: 120 },
            { headerName: "Equipo de trabajo", field: "eq", width: 150 },
            { headerName: "Puesto", field: "p", width: 150 },
            { headerName: "Trabajador", field: "trabajador", width: 300 },
            { headerName: "Año", field: "anno", width: 70 },
            { headerName: "Mes", field: "mes", width: 100 },
            { headerName: "Total horas mes", field: "horas", width: 150 },
            { headerName: "Balance", field: "balance", width: 100 },
        ];
    };
    BalanceComponent = __decorate([
        core_1.Component({
            selector: 'balance',
            templateUrl: 'app/balance/balance.html',
            providers: [puesto_ciclo_service_1.PuestoCicloService, balance_service_1.BalanceService, centro_fisico_service_1.CentroFisicoService,
                servicio_service_1.ServicioService, equipo_service_1.EquipoService]
        }), 
        __metadata('design:paramtypes', [balance_service_1.BalanceService, puesto_ciclo_service_1.PuestoCicloService, centro_fisico_service_1.CentroFisicoService, servicio_service_1.ServicioService, equipo_service_1.EquipoService])
    ], BalanceComponent);
    return BalanceComponent;
}(GridComponent_1.GridComponent));
exports.BalanceComponent = BalanceComponent;
//# sourceMappingURL=balance.component.js.map
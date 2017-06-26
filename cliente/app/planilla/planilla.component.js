"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
// Modelo.
var centro_fisico_service_1 = require("../centro_fisico/centro_fisico.service");
var servicio_service_1 = require("../servicio/servicio.service");
var equipo_service_1 = require("../equipo/equipo.service");
// Equipo seleccionado.
var EquipoSeleccionado = (function () {
    function EquipoSeleccionado(id) {
        this.id = id;
    }
    return EquipoSeleccionado;
}());
exports.EquipoSeleccionado = EquipoSeleccionado;
var PlanillaComponent = (function () {
    function PlanillaComponent(centroFisicoService, servicioService, equipoService) {
        this.centroFisicoService = centroFisicoService;
        this.servicioService = servicioService;
        this.equipoService = equipoService;
        this.visualizar_disabled = true;
        this.msgs = [];
        // Se cargan los centros físicos.
        this.cargarCF();
    }
    PlanillaComponent.prototype.createRowData = function (d) {
        return d["data"];
    };
    PlanillaComponent.prototype.mensaje = function (opcion) {
        this.msgs = [];
        var severity;
        var summary;
        var detail;
        if (opcion == 'error_carga') {
            severity = 'error';
            summary = 'Gestor de Turnos informa:';
            detail = 'No se puede cargar estructura';
        }
        // Se lanza mensaje.
        this.msgs.push({ severity: severity, summary: summary, detail: detail });
    };
    PlanillaComponent.prototype.cargarCF = function () {
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
            _this.mensaje('error_carga');
        });
    };
    PlanillaComponent.prototype.onChangeCF = function ($event) {
        // Se recupera el identificador del centro físico.
        //let cf_id = $event.value['id'] ;
        if (this.cf_sel != null) {
            // Se cargan los servicios que cuelgan del centro físico seleccionado.
            this.cargarServicio();
        }
    };
    PlanillaComponent.prototype.cargarServicio = function () {
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
            _this.mensaje('error_carga');
        });
    };
    PlanillaComponent.prototype.onChangeServicio = function ($event) {
        // Se recupera el identificador del servicio.
        //let sf_id = $event.value['id'] ;
        if (this.sf_sel != null) {
            // Se cargan los equipos que cuelgan del servicio seleccionado.
            this.cargarEquipo();
        }
    };
    PlanillaComponent.prototype.cargarEquipo = function () {
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
            _this.mensaje('error_carga');
        });
    };
    PlanillaComponent.prototype.onChangeEquipo = function ($event) {
        if (this.eq_sel != null) {
            var eq_id = this.eq_sel['id'];
            this.equipoSel = new EquipoSeleccionado(eq_id);
        }
    };
    PlanillaComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/planilla/planilla.html',
            styleUrls: ["../../styles.css"],
            providers: [centro_fisico_service_1.CentroFisicoService, servicio_service_1.ServicioService, equipo_service_1.EquipoService]
        }), 
        __metadata('design:paramtypes', [centro_fisico_service_1.CentroFisicoService, servicio_service_1.ServicioService, equipo_service_1.EquipoService])
    ], PlanillaComponent);
    return PlanillaComponent;
}());
exports.PlanillaComponent = PlanillaComponent;
//# sourceMappingURL=planilla.component.js.map
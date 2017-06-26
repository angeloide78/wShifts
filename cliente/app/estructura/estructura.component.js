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
var estructura_service_1 = require("./estructura.service");
var centro_fisico_service_1 = require("../centro_fisico/centro_fisico.service");
var servicio_service_1 = require("../servicio/servicio.service");
var equipo_service_1 = require("../equipo/equipo.service");
var puesto_service_1 = require("../puesto/puesto.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var EstructuraComponent = (function (_super) {
    __extends(EstructuraComponent, _super);
    function EstructuraComponent(objetoService, centroFisicoService, servicioService, equipoService, puestoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.centroFisicoService = centroFisicoService;
        this.servicioService = servicioService;
        this.equipoService = equipoService;
        this.puestoService = puestoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de estructura organizativa";
        this.nombre_fichero_csv = "estructura_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se cargan combos.
        this.cargarCF();
        //this.cargarServicio() ;
        //this.cargarEq() ;
        //this.cargarPuesto() ;
    }
    EstructuraComponent.prototype.onChangeCF = function ($event) {
        // Se recupera el identificador del centro físico.
        //let cf_id = $event.value['id'] ;
        if (this.cf_sel != null) {
            // Se cargan los servicios que cuelgan del centro físico seleccionado.
            this.cargarServicio();
        }
        //else {
        this.sf_sel = null;
        this.eq_sel = null;
        this.p_sel = null;
        //}
    };
    EstructuraComponent.prototype.onChangeServicio = function ($event) {
        // Se recupera el identificador del servicio.
        //let sf_id = $event.value['id'] ;
        if (this.sf_sel != null) {
            // Se cargan los equipos que cuelgan del servicio seleccionado.
            this.cargarEq();
        }
        //else {
        this.eq_sel = null;
        this.p_sel = null;
        //}
    };
    EstructuraComponent.prototype.onChangeEquipo = function ($event) {
        // Se recupera el identificador del servicio.
        //let sf_id = $event.value['id'] ;
        if (this.eq_sel != null) {
            // Se cargan los equipos que cuelgan del servicio seleccionado.
            this.cargarPuesto();
        }
        //else {
        this.p_sel = null;
        //}
    };
    EstructuraComponent.prototype.cargarCF = function () {
        var _this = this;
        this.cf = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
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
                    codigo = aux[i]['codigo'];
                    desc = "(" + codigo + ") " + aux[i]['descripcion'];
                    _this.cf.push({ label: desc, value: { id: ident, name: desc, code: codigo } });
                }
            }
            else {
                _this.cf_sel = null;
            }
            ;
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    EstructuraComponent.prototype.cargarServicio = function () {
        var _this = this;
        this.sf = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        // Se llama a servicio de componente para recuperar información.
        this.servicioService.send_data({ id: null, codigo: null, activo: 'S',
            cf_id: this.cf_sel['id'],
            asig_pend: 'S' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_sf = data;
            aux = _this.createRowData(_this.array_sf);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.sf.push({ label: 'Seleccione servicio', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    codigo = aux[i]['codigo'];
                    desc = "(" + codigo + ") " + aux[i]['descripcion'];
                    _this.sf.push({ label: desc, value: { id: ident, name: desc, code: codigo } });
                }
            }
            else {
                _this.sf_sel = null;
            }
            ;
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    EstructuraComponent.prototype.cargarEq = function () {
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
            sf_id: this.sf_sel['id'],
            asig_pend: 'S' }, 'recuperar')
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
            else {
                _this.eq_sel = null;
            }
            ;
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    EstructuraComponent.prototype.cargarPuesto = function () {
        var _this = this;
        this.p = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        // Se llama a servicio de componente para recuperar información.
        this.puestoService.send_data({ id: null, codigo: null, activo: 'S',
            eq_id: this.eq_sel['id'],
            asig_pend: 'S' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_p = data;
            aux = _this.createRowData(_this.array_p);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.p.push({ label: 'Seleccione puesto', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    codigo = aux[i]['codigo'];
                    desc = "(" + codigo + ") " + aux[i]['descripcion'];
                    _this.p.push({ label: desc, value: { id: ident, name: desc, code: codigo } });
                }
            }
            else {
                _this.p_sel = null;
            }
            ;
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    EstructuraComponent.prototype.insertarFila = function () {
        if (this.cf_sel == null || this.sf_sel == null ||
            this.eq_sel == null || this.p_sel == null) {
            this.mensajes('error_guardar_filas');
        }
        else {
            var nuevoElemento = this.crearNuevaFilaDatos();
            this.gridOptions.api.addItems([nuevoElemento]);
        }
    };
    EstructuraComponent.prototype.recuperar = function () {
        this.filtro_recuperar = { activo: null, puesto_id: null };
        _super.prototype.recuperar.call(this);
    };
    EstructuraComponent.prototype.showDialog = function () {
        this.display = true;
    };
    EstructuraComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Es necesario seleccionar centro físico, servicio, equipo y puesto.';
        }
        if (opcion == "error_cf_sel") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione primero un centro físico del combo.';
        }
        if (opcion == "error_sf_sel") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione primero un servicio del combo.';
        }
        if (opcion == "error_eq_sel") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione primero un equipo de trabajo del combo.';
        }
        if (opcion == "error_p_sel") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione primero un puesto del combo.';
        }
        return [ret, severity, summary, mensaje];
    };
    EstructuraComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // se seleccionan las filas nuevas para ser devueltas al backend.
        modelo.forEachNode(function (nodo_fila) {
            // ALGG 21-12-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    cf_id: nodo_fila.data.cf_id,
                    cf_cod: nodo_fila.data.cf_cod,
                    cf_desc: nodo_fila.data.cf_desc,
                    sf_id: nodo_fila.data.sf_id,
                    sf_cod: nodo_fila.data.sf_cod,
                    sf_desc: nodo_fila.data.sf_desc,
                    eq_id: nodo_fila.data.eq_id,
                    eq_cod: nodo_fila.data.eq_cod,
                    eq_desc: nodo_fila.data.eq_desc,
                    p_id: nodo_fila.data.p_id,
                    p_cod: nodo_fila.data.p_cod,
                    p_desc: nodo_fila.data.p_desc,
                    observ: nodo_fila.data.observ,
                    activo: nodo_fila.data.activo
                });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    EstructuraComponent.prototype.crearNuevaFilaDatos = function () {
        var cf_id = this.cf_sel['id'];
        var cf_cod = this.cf_sel['code'];
        var cf_desc = this.cf_sel['name'];
        var sf_id = this.sf_sel['id'];
        var sf_cod = this.sf_sel['code'];
        var sf_desc = this.sf_sel['name'];
        var eq_id = this.eq_sel['id'];
        var eq_cod = this.eq_sel['code'];
        var eq_desc = this.eq_sel['name'];
        var p_id = this.p_sel['id'];
        var p_cod = this.p_sel['code'];
        var p_desc = this.p_sel['name'];
        var nuevaFila = {
            id: 0,
            cf_id: cf_id,
            cf_cod: cf_cod,
            cf_desc: cf_desc,
            sf_id: sf_id,
            sf_cod: sf_cod,
            sf_desc: sf_desc,
            eq_id: eq_id,
            eq_cod: eq_cod,
            eq_desc: eq_desc,
            p_id: p_id,
            p_cod: p_cod,
            p_desc: p_desc,
            observ: "",
            activo: 'S'
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    EstructuraComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "cf_id", field: "cf_id", width: 100, hide: true },
            { headerName: "Cód. CF", field: "cf_cod", width: 100 },
            { headerName: "Desc. CF", field: "cf_desc", width: 200 },
            { headerName: "sf_id", field: "cf_id", width: 100, hide: true },
            { headerName: "Cód. Serv.", field: "sf_cod", width: 100 },
            { headerName: "Desc. Serv.", field: "sf_desc", width: 200 },
            { headerName: "eq_id", field: "eq_id", width: 100, hide: true },
            { headerName: "Cód. Eq.", field: "eq_cod", width: 100 },
            { headerName: "Desc. Eq.", field: "eq_desc", width: 200 },
            { headerName: "p_id", field: "p_id", width: 100, hide: true },
            { headerName: "Cód. Puesto", field: "p_cod", width: 100 },
            { headerName: "Desc. Puesto", field: "p_desc", width: 200 },
            { headerName: "Observaciones", field: "observ", width: 200, editable: true },
            { headerName: "Activo", field: "activo", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 }
        ];
    };
    EstructuraComponent = __decorate([
        core_1.Component({
            selector: 'estructura',
            templateUrl: 'app/estructura/estructura.html',
            providers: [estructura_service_1.EstructuraService, centro_fisico_service_1.CentroFisicoService, servicio_service_1.ServicioService,
                equipo_service_1.EquipoService, puesto_service_1.PuestoService]
        }), 
        __metadata('design:paramtypes', [estructura_service_1.EstructuraService, centro_fisico_service_1.CentroFisicoService, servicio_service_1.ServicioService, equipo_service_1.EquipoService, puesto_service_1.PuestoService])
    ], EstructuraComponent);
    return EstructuraComponent;
}(GridComponent_1.GridComponent));
exports.EstructuraComponent = EstructuraComponent;
//# sourceMappingURL=estructura.component.js.map
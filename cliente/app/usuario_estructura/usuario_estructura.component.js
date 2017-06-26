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
var usuario_estructura_service_1 = require("./usuario_estructura.service");
var centro_fisico_service_1 = require("../centro_fisico/centro_fisico.service");
var servicio_service_1 = require("../servicio/servicio.service");
var equipo_service_1 = require("../equipo/equipo.service");
var usuario_service_1 = require("../usuario/usuario.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var UsuarioEstructuraComponent = (function (_super) {
    __extends(UsuarioEstructuraComponent, _super);
    function UsuarioEstructuraComponent(objetoService, centroFisicoService, servicioService, equipoService, usuarioService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.centroFisicoService = centroFisicoService;
        this.servicioService = servicioService;
        this.equipoService = equipoService;
        this.usuarioService = usuarioService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de asociación de usuarios con estructura organizativa";
        this.nombre_fichero_csv = "usuariosEstructura_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se carga combo de usuario y centro físico.
        this.cargarUsuario();
        this.cargarCF();
    }
    UsuarioEstructuraComponent.prototype.cargarCF = function () {
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
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    UsuarioEstructuraComponent.prototype.onChangeCF = function ($event) {
        // Se recupera el identificador del centro físico.
        //let cf_id = $event.value['id'] ;
        if (this.cf_sel != null) {
            // Se cargan los servicios que cuelgan del centro físico seleccionado.
            this.cargarServicio();
        }
        //else {
        this.sf_sel = null;
        this.eq_sel = null;
        //}
    };
    UsuarioEstructuraComponent.prototype.onChangeServicio = function ($event) {
        // Se recupera el identificador del servicio.
        //let sf_id = $event.value['id'] ;
        if (this.sf_sel != null) {
            // Se cargan los equipos que cuelgan del servicio seleccionado.
            this.cargarEq();
        }
        //else {
        this.eq_sel = null;
        //}
    };
    UsuarioEstructuraComponent.prototype.cargarServicio = function () {
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
            asig_pend: 'N' }, 'recuperar')
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
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    UsuarioEstructuraComponent.prototype.cargarEq = function () {
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
            asig_pend: 'N' }, 'recuperar')
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
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    UsuarioEstructuraComponent.prototype.cargarUsuario = function () {
        var _this = this;
        this.usuario = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        // Se llama a servicio de componente para recuperar información.
        this.usuarioService.send_data({ usuario: null, activo: 'S' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_usuario = data;
            aux = _this.createRowData(_this.array_usuario);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.usuario.push({ label: 'Seleccione usuario', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    codigo = aux[i]['nick'];
                    desc = aux[i]['nick'];
                    _this.usuario.push({ label: desc, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    UsuarioEstructuraComponent.prototype.insertarFila = function () {
        console.log(this.sf_sel);
        if (this.cf_sel == null || this.sf_sel == null ||
            this.eq_sel == null || this.usuario_sel == null) {
            this.mensajes('error_guardar_filas');
        }
        else {
            var nuevoElemento = this.crearNuevaFilaDatos();
            this.gridOptions.api.addItems([nuevoElemento]);
        }
    };
    UsuarioEstructuraComponent.prototype.recuperar = function () {
        this.filtro_recuperar = { usuario_id: null, cf_id: null, sf_id: null,
            eq_id: null, activo: null };
        _super.prototype.recuperar.call(this);
    };
    UsuarioEstructuraComponent.prototype.showDialog = function () {
        this.display = true;
    };
    UsuarioEstructuraComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Es necesario seleccionar usuario, centro físico, servicio y equipo de trabajo.';
        }
        return [ret, severity, summary, mensaje];
    };
    UsuarioEstructuraComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // se seleccionan las filas nuevas para ser devueltas al backend.
        modelo.forEachNode(function (nodo_fila) {
            // ALGG 11-02-2017 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    usuario_id: nodo_fila.data.usuario_id,
                    usuario: nodo_fila.data.usuario,
                    cf_id: nodo_fila.data.cf_id,
                    cf_cod: nodo_fila.data.cf_cod,
                    cf_desc: nodo_fila.data.cf_desc,
                    sf_id: nodo_fila.data.sf_id,
                    sf_cod: nodo_fila.data.sf_cod,
                    sf_desc: nodo_fila.data.sf_desc,
                    eq_id: nodo_fila.data.eq_id,
                    eq_cod: nodo_fila.data.eq_cod,
                    eq_desc: nodo_fila.data.eq_desc,
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
    UsuarioEstructuraComponent.prototype.crearNuevaFilaDatos = function () {
        var cf_id = this.cf_sel['id'];
        var cf_cod = this.cf_sel['code'];
        var cf_desc = this.cf_sel['name'];
        var sf_id = this.sf_sel['id'];
        var sf_cod = this.sf_sel['code'];
        var sf_desc = this.sf_sel['name'];
        var eq_id = this.eq_sel['id'];
        var eq_cod = this.eq_sel['code'];
        var eq_desc = this.eq_sel['name'];
        var usuario_id = this.usuario_sel['id'];
        var usuario = this.usuario_sel['name'];
        var nuevaFila = {
            id: 0,
            usuario_id: usuario_id,
            usuario: usuario,
            cf_id: cf_id,
            cf_cod: cf_cod,
            cf_desc: cf_desc,
            sf_id: sf_id,
            sf_cod: sf_cod,
            sf_desc: sf_desc,
            eq_id: eq_id,
            eq_cod: eq_cod,
            eq_desc: eq_desc,
            observ: "",
            activo: 'S'
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    UsuarioEstructuraComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "usuario_id", field: "usuario_id", hide: true, width: 120 },
            { headerName: "Usuario", field: "usuario", width: 120 },
            { headerName: "cf_id", field: "cf_id", width: 100, hide: true },
            { headerName: "Cód. CF", field: "cf_cod", width: 100, hide: true },
            { headerName: "Centro físico", field: "cf_desc", width: 300 },
            { headerName: "sf_id", field: "sf_id", width: 100, hide: true },
            { headerName: "Cód. Serv.", field: "sf_cod", width: 200, hide: true },
            { headerName: "Servicio", field: "sf_desc", width: 300 },
            { headerName: "eq_id", field: "eq_id", width: 100, hide: true },
            { headerName: "Cód. Eq.", field: "eq_cod", width: 100, hide: true },
            { headerName: "Equipo", field: "eq_desc", width: 300 },
            { headerName: "Observaciones", field: "observ", width: 300, editable: true },
            { headerName: "Activo", field: "activo", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 }
        ];
    };
    UsuarioEstructuraComponent = __decorate([
        core_1.Component({
            selector: 'usuario_estructura',
            templateUrl: 'app/usuario_estructura/usuario_estructura.html',
            providers: [usuario_estructura_service_1.UsuarioEstructuraService, centro_fisico_service_1.CentroFisicoService, servicio_service_1.ServicioService,
                equipo_service_1.EquipoService, usuario_service_1.UsuarioService]
        }), 
        __metadata('design:paramtypes', [usuario_estructura_service_1.UsuarioEstructuraService, centro_fisico_service_1.CentroFisicoService, servicio_service_1.ServicioService, equipo_service_1.EquipoService, usuario_service_1.UsuarioService])
    ], UsuarioEstructuraComponent);
    return UsuarioEstructuraComponent;
}(GridComponent_1.GridComponent));
exports.UsuarioEstructuraComponent = UsuarioEstructuraComponent;
//# sourceMappingURL=usuario_estructura.component.js.map
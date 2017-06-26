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
var rol_usuario_service_1 = require("./rol_usuario.service");
var rol_service_1 = require("../rol/rol.service");
var usuario_service_1 = require("../usuario/usuario.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var RolUsuarioComponent = (function (_super) {
    __extends(RolUsuarioComponent, _super);
    function RolUsuarioComponent(objetoService, rolService, usuarioService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.rolService = rolService;
        this.usuarioService = usuarioService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de asociación de roles y usuarios de aplicación";
        this.nombre_fichero_csv = "rolesUsuarios_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se cargan combos.
        this.cargarRol();
        this.cargarUsuario();
    }
    RolUsuarioComponent.prototype.cargarRol = function () {
        var _this = this;
        this.rol = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        // Se llama a servicio de componente para recuperar información.
        this.rolService.send_data({ codigo: null, activo: 'S' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_rol = data;
            aux = _this.createRowData(_this.array_rol);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.rol.push({ label: 'Seleccione rol', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    codigo = aux[i]['codigo'];
                    desc = "(" + codigo + ") " + aux[i]['descripcion'];
                    _this.rol.push({ label: desc, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    RolUsuarioComponent.prototype.cargarUsuario = function () {
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
    RolUsuarioComponent.prototype.showDialog = function () {
        this.display = true;
    };
    RolUsuarioComponent.prototype.insertarFila = function () {
        // ALGG 10-02-2017. Si no hay elegido rol y usuario, no se puede crear
        // la nueva relación.
        if (this.rol_sel == null || this.usuario_sel == null) {
            this.mensajes('error_insercion');
        }
        else {
            var nuevoElemento = this.crearNuevaFilaDatos();
            this.gridOptions.api.addItems([nuevoElemento]);
        }
    };
    RolUsuarioComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_insercion") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Se tiene que elegir antes rol y usuario';
        }
        return [ret, severity, summary, mensaje];
    };
    RolUsuarioComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            //if ((nodo_fila.data.rol_id.length == 0) ||
            //(nodo_fila.data.usuario_id.length == 0)) { ret = false ; }
            // Si no cumple la validación, nos vamos.
            //if ( !ret ) { return [ret, bolsa]} ;
            // ALGG 07-02-2017 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    rol_id: nodo_fila.data.rol_id,
                    rol_desc: nodo_fila.data.rol_desc,
                    usuario_id: nodo_fila.data.usuario_id,
                    usuario: nodo_fila.data.usuario,
                    observaciones: nodo_fila.data.observaciones,
                    activo: nodo_fila.data.activo });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    RolUsuarioComponent.prototype.crearNuevaFilaDatos = function () {
        var rol_id = this.rol_sel['id'];
        var rol_desc = this.rol_sel['name'];
        var usuario_id = this.usuario_sel['id'];
        var usuario = this.usuario_sel['name'];
        var nuevaFila = {
            id: 0,
            rol_id: rol_id,
            rol_desc: rol_desc,
            usuario_id: usuario_id,
            usuario: usuario,
            observaciones: "",
            activo: 'S'
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    RolUsuarioComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "rol_id", field: "rol_id", hide: true, width: 100 },
            { headerName: "Rol", field: "rol_desc", width: 300 },
            { headerName: "usuario_id", field: "usuario_id", hide: true, width: 100 },
            { headerName: "Usuario", field: "usuario", width: 150, editable: true },
            { headerName: "Observaciones", field: "observaciones", width: 450,
                editable: true, celleditor: "largeText" },
            { headerName: "Activo", field: "activo", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 }
        ];
    };
    RolUsuarioComponent = __decorate([
        core_1.Component({
            selector: 'rol_usuario',
            templateUrl: 'app/rol_usuario/rol_usuario.html',
            providers: [rol_usuario_service_1.RolUsuarioService, rol_service_1.RolService, usuario_service_1.UsuarioService]
        }), 
        __metadata('design:paramtypes', [rol_usuario_service_1.RolUsuarioService, rol_service_1.RolService, usuario_service_1.UsuarioService])
    ], RolUsuarioComponent);
    return RolUsuarioComponent;
}(GridComponent_1.GridComponent));
exports.RolUsuarioComponent = RolUsuarioComponent;
//# sourceMappingURL=rol_usuario.component.js.map
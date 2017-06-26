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
var rol_recurso_service_1 = require("./rol_recurso.service");
var rol_service_1 = require("../rol/rol.service");
var recurso_service_1 = require("../recurso/recurso.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var RolRecursoComponent = (function (_super) {
    __extends(RolRecursoComponent, _super);
    function RolRecursoComponent(objetoService, rolService, recursoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.rolService = rolService;
        this.recursoService = recursoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de asociación entreroles y recursos de la aplicación";
        this.nombre_fichero_csv = "rolRecurso_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se cargan combos.
        this.cargarRol();
        this.cargarRecurso();
    }
    RolRecursoComponent.prototype.cargarRol = function () {
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
    RolRecursoComponent.prototype.cargarRecurso = function () {
        var _this = this;
        this.recurso = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        // Se llama a servicio de componente para recuperar información.
        this.recursoService.send_data({ codigo: null, activo: 'S' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_recurso = data;
            aux = _this.createRowData(_this.array_recurso);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.recurso.push({ label: 'Seleccione recurso', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    codigo = aux[i]['codigo'];
                    desc = "(" + codigo + ") " + aux[i]['descripcion'];
                    _this.recurso.push({ label: desc, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    RolRecursoComponent.prototype.showDialog = function () {
        this.display = true;
    };
    RolRecursoComponent.prototype.insertarFila = function () {
        // ALGG 10-02-2017. Si no hay elegido rol y usuario, no se puede crear
        // la nueva relación.
        if (this.rol_sel == null || this.recurso_sel == null) {
            this.mensajes('error_insercion');
        }
        else {
            var nuevoElemento = this.crearNuevaFilaDatos();
            this.gridOptions.api.addItems([nuevoElemento]);
        }
    };
    RolRecursoComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_insercion") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Se tiene que elegir antes rol y recurso';
        }
        return [ret, severity, summary, mensaje];
    };
    RolRecursoComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // ALGG 07-02-2017 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    rol_id: nodo_fila.data.rol_id,
                    rol_desc: nodo_fila.data.rol_desc,
                    recurso_id: nodo_fila.data.recurso_id,
                    recurso_desc: nodo_fila.data.recurso_desc,
                    ejecucion: nodo_fila.data.ejecucion,
                    lectura: nodo_fila.data.lectura,
                    escritura: nodo_fila.data.escritura,
                    observaciones: nodo_fila.data.observaciones,
                    activo: nodo_fila.data.activo });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    RolRecursoComponent.prototype.crearNuevaFilaDatos = function () {
        var rol_id = this.rol_sel['id'];
        var rol_desc = this.rol_sel['name'];
        var recurso_id = this.recurso_sel['id'];
        var recurso_desc = this.recurso_sel['name'];
        var nuevaFila = {
            id: 0,
            rol_id: rol_id,
            rol_desc: rol_desc,
            recurso_id: recurso_id,
            recurso_desc: recurso_desc,
            ejecucion: "S",
            lectura: "S",
            escritura: "S",
            observaciones: "S",
            activo: "S"
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    RolRecursoComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "rol_id", field: "rol_id", hide: true, width: 100 },
            { headerName: "Rol", field: "rol_desc", width: 200 },
            { headerName: "recurso_id", field: "recurso_id", hide: true, width: 100 },
            { headerName: "Recurso", field: "recurso_desc", width: 200 },
            { headerName: "Ejecución", field: "ejecucion", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 },
            { headerName: "Lectura", field: "lectura", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 },
            { headerName: "Escritura", field: "escritura", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 },
            { headerName: "Observaciones", field: "observaciones", width: 400,
                editable: true, celleditor: "largeText" },
            { headerName: "Activo", field: "activo", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 }
        ];
    };
    RolRecursoComponent = __decorate([
        core_1.Component({
            selector: 'rol_recurso',
            templateUrl: 'app/rol_recurso/rol_recurso.html',
            providers: [rol_recurso_service_1.RolRecursoService, rol_service_1.RolService, recurso_service_1.RecursoService]
        }), 
        __metadata('design:paramtypes', [rol_recurso_service_1.RolRecursoService, rol_service_1.RolService, recurso_service_1.RecursoService])
    ], RolRecursoComponent);
    return RolRecursoComponent;
}(GridComponent_1.GridComponent));
exports.RolRecursoComponent = RolRecursoComponent;
//# sourceMappingURL=rol_recurso.component.js.map
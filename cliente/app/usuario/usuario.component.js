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
var usuario_service_1 = require("./usuario.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var UsuarioComponent = (function (_super) {
    __extends(UsuarioComponent, _super);
    function UsuarioComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Usuario del sistema";
        this.nombre_fichero_csv = "usuario_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        this.filtro_recuperar = { usuario: null, activo: null };
    }
    UsuarioComponent.prototype.showDialog = function () {
        this.display = true;
    };
    UsuarioComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Los campos usuario y contraseña son obligatorios';
        }
        return [ret, severity, summary, mensaje];
    };
    UsuarioComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            if ((nodo_fila.data.nick.length == 0)
                || (nodo_fila.data.passwd.length == 0)
                || (nodo_fila.data.intentos.toString().length == 0)) {
                ret = false;
            }
            // Si no cumple la validación, nos vamos.
            if (!ret) {
                return [ret, bolsa];
            }
            ;
            // Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    persona_id: nodo_fila.data.persona_id,
                    nick: nodo_fila.data.nick,
                    passwd: nodo_fila.data.passwd,
                    fecha_alta: nodo_fila.data.fecha_alta,
                    // fecha_alta : new Date(parseInt(nodo_fila.data.fecha_alta)),
                    fecha_baja: nodo_fila.data.fecha_baja,
                    intentos: nodo_fila.data.intentos,
                    activo: nodo_fila.data.activo
                });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    UsuarioComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {
            id: 0,
            persona_id: 0,
            nick: "",
            passwd: "",
            fecha_alta: Date.now(),
            fecha_baja: null,
            intentos: 5,
            activo: "S"
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    UsuarioComponent.prototype.createColumnDefs = function () {
        return [{ headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "persona_id", field: "persona_id", hide: true, width: 100 },
            { headerName: "Usuario", field: "nick", editable: true, width: 200 },
            { headerName: "Contraseña", field: "passwd", editable: true, width: 200 },
            { headerName: "Fecha de alta", field: "fecha_alta",
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                }, width: 150 },
            { headerName: "Nº intentos", field: "intentos", editable: true, width: 150 },
            { headerName: "Activo", field: "activo", cellEditor: "select", cellEditorParams: { values: ['S', 'N'] },
                editable: true, width: 70 }];
    };
    UsuarioComponent = __decorate([
        core_1.Component({
            selector: 'usuario',
            templateUrl: 'app/usuario/usuario.html',
            providers: [usuario_service_1.UsuarioService]
        }), 
        __metadata('design:paramtypes', [usuario_service_1.UsuarioService])
    ], UsuarioComponent);
    return UsuarioComponent;
}(GridComponent_1.GridComponent));
exports.UsuarioComponent = UsuarioComponent;
//# sourceMappingURL=usuario.component.js.map
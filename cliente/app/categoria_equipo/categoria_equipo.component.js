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
var categoria_equipo_service_1 = require("./categoria_equipo.service");
var equipo_service_1 = require("../equipo/equipo.service");
var categoria_profesional_service_1 = require("../categoria_profesional/categoria_profesional.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var CategoriaEquipoComponent = (function (_super) {
    __extends(CategoriaEquipoComponent, _super);
    function CategoriaEquipoComponent(objetoService, categoriaProfesionalServive, equipoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.categoriaProfesionalServive = categoriaProfesionalServive;
        this.equipoService = equipoService;
        this.display = false;
        this.titulo = "Gestión de relación entre equipos y categorías profesionales";
        this.nombre_fichero_csv = "equipoCategorias_wShifts.csv";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // ALGG 14-01-2017 Filtro de recuperación.
        this.filtro_recuperar = { eq_id: null, cat_id: null };
        // ... y se cargan datos en los combos de equipos y categorías...
        this.cargarCP();
        this.cargarEquipo();
    }
    CategoriaEquipoComponent.prototype.cargarEquipo = function () {
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
            sf_id: null, asig_pend: 'N' }, 'recuperar')
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
    CategoriaEquipoComponent.prototype.cargarCP = function () {
        var _this = this;
        this.cp = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.categoriaProfesionalServive.send_data({ id_: null, activo: 'S' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_cp = data;
            aux = _this.createRowData(_this.array_cp);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.cp.push({ label: 'Seleccione categoría', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = "(" + aux[i]['codigo'] + ") " + aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.cp.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    CategoriaEquipoComponent.prototype.showDialog = function () {
        this.display = true;
    };
    CategoriaEquipoComponent.prototype.insertarFila = function () {
        if (this.eq_sel == null || this.cp_sel == null) {
            this.mensajes('error_guardar_filas');
        }
        else {
            var nuevoElemento = this.crearNuevaFilaDatos();
            this.gridOptions.api.addItems([nuevoElemento]);
        }
    };
    CategoriaEquipoComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Es obligatorio insertar equipo y categoría';
        }
        return [ret, severity, summary, mensaje];
    };
    CategoriaEquipoComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            if ((nodo_fila.data.eq_id.length == 0) ||
                (nodo_fila.data.cat_id.length == 0)) {
                ret = false;
            }
            // Si no cumple la validación, nos vamos.
            if (!ret) {
                return [ret, bolsa];
            }
            ;
            // ALGG 14-01-2017 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    eq_id: nodo_fila.data.eq_id,
                    eq_cod: nodo_fila.data.eq_cod,
                    eq_desc: nodo_fila.data.eq_desc,
                    cat_id: nodo_fila.data.cat_id,
                    cat_cod: nodo_fila.data.cat_cod,
                    cat_desc: nodo_fila.data.cat_desc });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    CategoriaEquipoComponent.prototype.crearNuevaFilaDatos = function () {
        var eq_id = this.eq_sel['id'];
        var eq_cod = this.eq_sel['code'];
        var eq_desc = this.eq_sel['name'];
        var cp_id = this.cp_sel['id'];
        var cp_cod = this.cp_sel['code'];
        var cp_desc = this.cp_sel['name'];
        var nuevaFila = {
            id: 0,
            eq_id: eq_id,
            eq_cod: eq_cod,
            eq_desc: eq_desc,
            cat_id: cp_id,
            cat_cod: cp_cod,
            cat_desc: cp_desc
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    CategoriaEquipoComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "eq_id", field: "eq_id", hide: true, width: 100 },
            { headerName: "Código Equipo", field: "eq_cod", width: 130 },
            { headerName: "Descripción Equipo", field: "eq_desc", width: 300 },
            { headerName: "cat_id", field: "cat_id", hide: true, width: 100 },
            { headerName: "Cód. Categ.", field: "cat_cod", width: 130 },
            { headerName: "Descripción Categoría", field: "cat_desc", width: 300 }
        ];
    };
    CategoriaEquipoComponent = __decorate([
        core_1.Component({
            selector: 'categoria_equipo',
            templateUrl: 'app/categoria_equipo/categoria_equipo.html',
            providers: [categoria_equipo_service_1.CategoriaEquipoService, categoria_profesional_service_1.CategoriaProfesionalService,
                equipo_service_1.EquipoService]
        }), 
        __metadata('design:paramtypes', [categoria_equipo_service_1.CategoriaEquipoService, categoria_profesional_service_1.CategoriaProfesionalService, equipo_service_1.EquipoService])
    ], CategoriaEquipoComponent);
    return CategoriaEquipoComponent;
}(GridComponent_1.GridComponent));
exports.CategoriaEquipoComponent = CategoriaEquipoComponent;
//# sourceMappingURL=categoria_equipo.component.js.map
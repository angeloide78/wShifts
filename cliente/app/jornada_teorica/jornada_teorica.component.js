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
var jornada_teorica_service_1 = require("./jornada_teorica.service");
var centro_fisico_service_1 = require("../centro_fisico/centro_fisico.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var JornadaTeoricaComponent = (function (_super) {
    __extends(JornadaTeoricaComponent, _super);
    function JornadaTeoricaComponent(objetoService, centroFisicoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.centroFisicoService = centroFisicoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de jornadas teóricas";
        this.nombre_fichero_csv = "jornadaTeorica_wShifts.csv";
        this.anno = new Date().getFullYear();
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se cargan combos.
        this.cargarCF();
    }
    JornadaTeoricaComponent.prototype.cargarCF = function () {
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
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    JornadaTeoricaComponent.prototype.insertarFila = function () {
        if (this.cf_sel == null) {
            this.mensajes('error_guardar_filas');
        }
        else {
            var nuevoElemento = this.crearNuevaFilaDatos();
            this.gridOptions.api.addItems([nuevoElemento]);
        }
    };
    JornadaTeoricaComponent.prototype.recuperar = function () {
        var aux;
        //if ( this.cf_sel != null) { aux = this.cf_sel['id'] }
        //else { aux = null }
        this.filtro_recuperar = { cf_id: null, anno: null };
        _super.prototype.recuperar.call(this);
    };
    JornadaTeoricaComponent.prototype.showDialog = function () {
        this.display = true;
    };
    JornadaTeoricaComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Es necesario seleccionar un centro físico.';
        }
        if (opcion == "error_cf_sel") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione primero un centro físico del combo.';
        }
        return [ret, severity, summary, mensaje];
    };
    JornadaTeoricaComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // se seleccionan las filas nuevas para ser devueltas al backend.
        modelo.forEachNode(function (nodo_fila) {
            // ALGG 22-12-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    cf_id: nodo_fila.data.cf_id,
                    cf_cod: nodo_fila.data.cf_cod,
                    cf_desc: nodo_fila.data.cf_desc,
                    anno: nodo_fila.data.anno,
                    total_horas_anual: nodo_fila.data.total_horas_anual,
                    observaciones: nodo_fila.data.observaciones
                });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    JornadaTeoricaComponent.prototype.crearNuevaFilaDatos = function () {
        var cf_id = this.cf_sel['id'];
        var cf_cod = this.cf_sel['code'];
        var cf_desc = this.cf_sel['name'];
        var nuevaFila = {
            id: 0,
            cf_id: cf_id,
            cf_cod: cf_cod,
            cf_desc: cf_desc,
            anno: this.anno,
            total_horas_anual: 0,
            observaciones: ''
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    JornadaTeoricaComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            //{ headerName: "id", field: "id",  width: 100 },
            { headerName: "cf_id", field: "cf_id", width: 100, hide: true },
            { headerName: "Cód. CF", field: "cf_cod", width: 100, hide: true },
            { headerName: "Desc. CF", field: "cf_desc", width: 300 },
            { headerName: "Año", field: "anno", width: 100 },
            { headerName: "Horas anuales", field: "total_horas_anual", editable: true, width: 200 },
            { headerName: "Observaciones", field: "observaciones", editable: true, width: 250 },
        ];
    };
    JornadaTeoricaComponent = __decorate([
        core_1.Component({
            selector: 'jornada_teorica',
            templateUrl: 'app/jornada_teorica/jornada_teorica.html',
            providers: [jornada_teorica_service_1.JornadaTeoricaService, centro_fisico_service_1.CentroFisicoService]
        }), 
        __metadata('design:paramtypes', [jornada_teorica_service_1.JornadaTeoricaService, centro_fisico_service_1.CentroFisicoService])
    ], JornadaTeoricaComponent);
    return JornadaTeoricaComponent;
}(GridComponent_1.GridComponent));
exports.JornadaTeoricaComponent = JornadaTeoricaComponent;
//# sourceMappingURL=jornada_teorica.component.js.map
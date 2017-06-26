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
// Componentes de ag-grid para edición de celdas.
//import { StringEditorComponent } from '../grid-utils/editor.component' ;
// Componentes de modelo y servicio.
var calendario_service_1 = require("../calendario/calendario.service");
var centro_fisico_service_1 = require("../centro_fisico/centro_fisico.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var CalendarioComponent = (function (_super) {
    __extends(CalendarioComponent, _super);
    function CalendarioComponent(objetoService, centroFisicoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.centroFisicoService = centroFisicoService;
        // Atributos generales.
        this.recargar_despues_actualizacion = true;
        this.display = false;
        this.anno = new Date().getFullYear();
        this.fecha = null;
        this.titulo = "Gestión de Festivos";
        this.nombre_fichero_csv = "festivos_wShifts.csv";
        this.es = { firstDayOfWeek: 0,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves",
                "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre",
                "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul",
                "ago", "sep", "oct", "nov", "dic"]
        };
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // Se cargan los centros físicos.
        this.cargarUnit();
        // Filtro.
        //self.filtro_recuperar = {anno} ;
    }
    CalendarioComponent.prototype.recuperar = function () {
        if (this.centro_fisico_sel == null) {
            this.mensajes("error_cf_sel");
            return;
        }
        this.filtro_recuperar = { anno: this.anno, cf_id: this.centro_fisico_sel['id'] };
        _super.prototype.recuperar.call(this);
    };
    CalendarioComponent.prototype.cargarUnit = function () {
        var _this = this;
        this.centros_fisicos = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables para identificador, descripción y código de centros físicos.
        var ident;
        var descripcion;
        var codigo;
        // Se llama a servicio de componente para recuperar centros físicos
        // que están activos.
        this.centroFisicoService.send_data({ id: null, activo: 'S', codigo: null }, 'recuperar')
            .subscribe(function (data) {
            _this.array_centros_fisicos = data;
            aux = _this.createRowData(_this.array_centros_fisicos);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.centros_fisicos.push({ label: 'Seleccione centro físico', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    descripcion = aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    _this.centros_fisicos.push({ label: descripcion, value: { id: ident, name: descripcion, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    CalendarioComponent.prototype.showDialog = function () {
        this.display = true;
    };
    CalendarioComponent.prototype.insertarFecha = function () {
        // Primero se selecciona una fecha.
        if (this.fecha == null) {
            this.mensajes("error_fechas2");
            return;
        }
        // Se comprueba que el año de la fecha que se inserta es el mismo año
        // que se usa en la recuperación de datos.
        var partes_fecha = this.fecha.split('/');
        // En JavaScript el formato de fecha es YYYY-MM-DD, y el mes tiene un rango
        // entre 0 y 11, siendo 0 enero. Así que hacemos las conversiones necesarias...
        // let fecha_aux = new Date(partes_fecha[2], partes_fecha[1] - 1, partes_fecha[0]) ;
        if (this.anno != partes_fecha[2]) {
            this.mensajes("error_fechas");
        }
        else {
            // Se definen variables para control de modificaciones.
            var oldValue_1;
            var newValue_1;
            var field = "fecha_festivo";
            var id_1;
            // Nodos a actualizar.
            var nodos_a_actualizar_1 = [];
            // Se inserta fecha en las filas seleccionadas.
            //let fecha =  this.fecha ;
            //let fecha = new Date(partes_fecha[2], partes_fecha[1] - 1, partes_fecha[0]) ;
            var fecha2_1 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
            var filaSel = this.gridOptions.api.getSelectedNodes();
            filaSel.forEach(function (nodo_fecha) {
                // Nos guardamos los valores...
                oldValue_1 = nodo_fecha.data.fecha_festivo;
                newValue_1 = fecha2_1;
                id_1 = nodo_fecha.data.id;
                var data_nodo = nodo_fecha.data;
                data_nodo.fecha_festivo = fecha2_1;
                // Lo incluimos en la bolsa de nodos actualizados.
                nodos_a_actualizar_1.push(nodo_fecha);
            });
            // Se refresca el ag-grid...
            this.gridOptions.api.refreshRows(nodos_a_actualizar_1);
            // Y se actualiza la estructura de control de modificación.
            this.evaluarCeldaModificada(oldValue_1, newValue_1, id_1, field);
        }
    };
    CalendarioComponent.prototype.insertarCF = function () {
        if (this.centro_fisico_sel == null) {
            this.mensajes('error_cf_sel');
        }
        else {
            // Se definen variables para control de modificaciones.
            var oldValue_2;
            var newValue_2;
            var field = "centro_fisico_id";
            var id_2;
            // Datos del centro físico seleccionado.
            var cf_id_1 = this.centro_fisico_sel['id'];
            var cf_cod_1 = this.centro_fisico_sel['code'];
            var cf_desc_1 = this.centro_fisico_sel['name'];
            // Nodos a actualizar.
            var nodos_a_actualizar_2 = [];
            // Se obtienen filas seleccionadas.
            var filaSel = this.gridOptions.api.getSelectedNodes();
            filaSel.forEach(function (cf) {
                var data_nodo = cf.data;
                // Si se está modificando una fila no se modifica el id.
                // Nos guardamos los valores...
                oldValue_2 = data_nodo.centro_fisico_id;
                newValue_2 = cf_id_1;
                id_2 = data_nodo.id;
                // Hacemos el cambio.
                data_nodo.centro_fisico_id = cf_id_1;
                data_nodo.desc_cf = cf_desc_1;
                data_nodo.cod_cf = cf_cod_1;
                // Lo incluimos en la bolsa de nodos actualizados.
                nodos_a_actualizar_2.push(cf);
            });
            // Se refresca el ag-grid...
            this.gridOptions.api.refreshRows(nodos_a_actualizar_2);
            // Y se actualiza la estructura de control de modificación.
            this.evaluarCeldaModificada(oldValue_2, newValue_2, id_2, field);
        }
    };
    CalendarioComponent.prototype.insertarFila = function () {
        if (this.centro_fisico_sel == null || this.fecha == null) {
            this.mensajes('error_cf');
        }
        else {
            var nuevoElemento = this.crearNuevaFilaDatos();
            this.gridOptions.api.addItems([nuevoElemento]);
        }
    };
    CalendarioComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Los campos descripción, centro físico y fecha son obligatorios';
        }
        if (opcion == 'error_fechas') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "El año de recuperación de festivos no coincide con el año de la fecha de festivo";
        }
        if (opcion == 'error_fechas2') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero una fecha del calendario de festivos";
        }
        if (opcion == 'error_cf') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "Seleccione centro físico y fecha antes de crear un nuevo festivo";
        }
        if (opcion == 'error_cf_sel') {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero un centro físico";
        }
        return [ret, severity, summary, mensaje];
    };
    CalendarioComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            if (nodo_fila.data.desc_festivo.length == 0) {
                ret = false;
            }
            // Si no cumple la validación, nos vamos.
            if (!ret) {
                return [ret, bolsa];
            }
            ;
            // ALGG 27-11-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    centro_fisico_id: nodo_fila.data.centro_fisico_id,
                    cod_cf: nodo_fila.data.cod_cf,
                    desc_cf: nodo_fila.data.desc_cf,
                    anno: nodo_fila.data.anno,
                    fecha_festivo: nodo_fila.data.fecha_festivo,
                    desc_festivo: nodo_fila.data.desc_festivo,
                    observ_festivo: nodo_fila.data.observ_festivo });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    CalendarioComponent.prototype.crearNuevaFilaDatos = function () {
        // Para crear un nuevo registro antes se tiene haber elegido el centro
        // físico del combo.
        if (this.centro_fisico_sel == null) {
            this.mensajes('error_cf');
        }
        else {
            var partes_fecha = this.fecha.split('/');
            var fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
            var nuevaFila = {
                id: 0,
                centro_fisico_id: this.centro_fisico_sel['id'],
                cod_cf: this.centro_fisico_sel['code'],
                desc_cf: this.centro_fisico_sel['name'],
                activo: "S",
                anno: this.anno,
                fecha_festivo: fecha2,
                desc_festivo: '',
                observ_festivo: ''
            };
            // Se devuelven datos iniciales.
            return nuevaFila;
        }
    };
    CalendarioComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "centro_fisico_id", field: "centro_fisico_id",
                hide: true, width: 100 },
            { headerName: "Código Centro Físico", field: "cod_cf", hide: true,
                width: 100 },
            { headerName: "Centro Físico", field: "desc_cf", width: 200 },
            { headerName: "Año", hide: true, field: "anno", width: 70 },
            { headerName: "Fecha Festivo", field: "fecha_festivo",
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
                width: 120 },
            { headerName: "Descripción de festivo", field: "desc_festivo",
                editable: true, width: 200 },
            { headerName: "Observaciones", field: "observ_festivo", editable: true,
                width: 600 }
        ];
    };
    CalendarioComponent = __decorate([
        core_1.Component({
            selector: 'calendario-festivo',
            templateUrl: 'app/calendario/calendario.html',
            providers: [calendario_service_1.CalendarioFestivoService, centro_fisico_service_1.CentroFisicoService]
        }), 
        __metadata('design:paramtypes', [calendario_service_1.CalendarioFestivoService, centro_fisico_service_1.CentroFisicoService])
    ], CalendarioComponent);
    return CalendarioComponent;
}(GridComponent_1.GridComponent));
exports.CalendarioComponent = CalendarioComponent;
//# sourceMappingURL=calendario.component.js.map
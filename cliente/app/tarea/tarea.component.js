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
var tarea_service_1 = require("./tarea.service");
var planilla_component_1 = require("../planilla/planilla.component");
//import { CategoriaProfesionalService } from "../categoria_profesional/categoria_profesional.service" ;
//import { CategoriaProfesional } from "../categoria_profesional/categoria_profesional" ;
var puesto_service_1 = require("../puesto/puesto.service");
var asignar_trabajador_service_1 = require("../asignar_trabajador/asignar_trabajador.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Contrato seleccionado.
var ContratoSeleccionado = (function () {
    function ContratoSeleccionado(id) {
        this.id = id;
    }
    return ContratoSeleccionado;
}());
exports.ContratoSeleccionado = ContratoSeleccionado;
// Grid.
var TareaComponent = (function (_super) {
    __extends(TareaComponent, _super);
    function TareaComponent(objetoService, asignarTrabajadorService, puestoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.asignarTrabajadorService = asignarTrabajadorService;
        this.puestoService = puestoService;
        this.equipo_id = null;
        this.trab_id = null;
        this.trab_dni = null;
        this.trab_ape1 = null;
        this.trab_ape2 = null;
        this.trab_nombre = null;
        this.trab_contrato_id = null;
        this.trab_fini_c = null;
        this.trab_ffin_c = null;
        this.nombre = null;
        this.anno = new Date().getFullYear();
        this.fecha_desde = null;
        this.fecha_hasta = null;
        this.fecha_busqueda_trab = null;
        this.display = false;
        this.display2 = false;
        this.boton_actualizar = true;
        this.titulo = "Gestión de asignaciones";
        this.nombre_fichero_csv = "asignaciones_wShifts.csv";
        this.nombre_fichero_csv2 = "asignarTrabajadores_GestorTurnos.csv";
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
        // Solo se puede seleccionar una fila en este mantenimiento.
        this.gridOptions.rowSelection = 'single';
        // Se crea tipo.
        this.gridOptions2 = {};
        // 15-01-2017 Definición de columnas y configuración de visualización.
        this.gridOptions2.columnDefs = this.createDetailColumnDefs();
        // Se desactiva opción de eliminar columnas.
        this.gridOptions2.suppressDragLeaveHidesColumns = true;
        // Se activa filtro de columnas.
        this.gridOptions2.enableFilter = true;
        // Selección simple.
        this.gridOptions2.rowSelection = 'single';
        // Se activa la ordenación de columnas.
        this.gridOptions.enableSorting = true;
        // Se activa el redimensionamiento de columnas.
        this.gridOptions.enableColResize = true;
        // Se cargan puestos.
        this.cargarPuesto();
    }
    TareaComponent.prototype.buscar_trabajador = function () {
        var _this = this;
        if ((this.fecha_busqueda_trab == null) || (this.equipo_id == null)) {
            this.mensajes('error_buscar_trab');
            return;
        }
        console.log("Buscando trabajadores con contrato en vigor y categoría profesional adecuada");
        // Se llama a servicio de componente para recuperar información.
        this.asignarTrabajadorService.send_data({ equipo_id: this.equipo_id,
            fecha: this.fecha_busqueda_trab }, 'recuperar')
            .subscribe(function (data) {
            _this.array_objetos2 = data;
            _this.rowData2 = _this.createRowData(_this.array_objetos2);
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    TareaComponent.prototype.createRowData2 = function (d) {
        return d["data"];
    };
    TareaComponent.prototype.exportarCSV2 = function () {
        var params = {
            fileName: this.nombre_fichero_csv2
        };
        this.gridOptions2.api.exportDataAsCsv(params);
    };
    TareaComponent.prototype.createDetailColumnDefs = function () {
        return [
            { headerName: "trab_id", field: "trab_id", hide: true, width: 100 },
            { headerName: "1er Ap.", field: "ape1", width: 140 },
            { headerName: "2do Ap.", field: "ape2", width: 140 },
            { headerName: "Nombre", field: "nombre", width: 140 },
            { headerName: "DNI", field: "dni", width: 100 },
            { headerName: "contrato_id", field: "contrato_id", hide: true, width: 100 },
            { headerName: "F.ini.Contrato", field: "fini_c", width: 140,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "F.fin Contrato", field: "ffin_c", width: 140,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "tarea_id", field: "tarea_id", hide: true, width: 100 },
            { headerName: "F.ini.Tarea", field: "fini_t", width: 140,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "F.fin Tarea", field: "ffin_t", width: 140,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "eq_id", field: "persona_id", hide: true, width: 100 },
            { headerName: "Cód. Eq.", field: "eq_cod", width: 120 },
            { headerName: "Equipo", field: "eq_desc", width: 200 }
        ];
    };
    TareaComponent.prototype.onRowSelected = function ($event) {
        // Se recuperan datos.
        this.trab_id = $event.node.data.trab_id;
        this.trab_dni = $event.node.data.dni;
        this.trab_ape1 = $event.node.data.ape1;
        this.trab_ape2 = $event.node.data.ape2;
        this.trab_nombre = $event.node.data.nombre;
        this.trab_contrato_id = $event.node.data.contrato_id;
        this.trab_fini_c = $event.node.data.fini_c;
        this.trab_ffin_c = $event.node.data.ffin_c;
        this.nombre = this.trab_dni + " - " + this.trab_nombre + " " +
            this.trab_ape1 + " " + this.trab_ape2;
    };
    TareaComponent.prototype.ngOnChanges = function (changes) {
        // Se detectan cambios...
        var dato;
        var equipoSel = changes['equipoSel'];
        // Se recuperan cambios...
        dato = equipoSel.currentValue;
        // Si no hay nada, salimos.
        if (dato == undefined) {
            return;
        }
        // Se recupera el id, que será con lo que se busque...
        var id = dato.id;
        this.equipo_id = id;
        console.log("[EQUIPO] Recuperando EQUIPO " + id);
        // Se recupera información.
        this.filtro_recuperar = { anno: this.anno, equipo_id: this.equipo_id };
        this.recuperar();
        // ALGG 14012017 También se cargan los puestos en el combo de puestos.
        this.cargarPuesto();
    };
    TareaComponent.prototype.cargarPuesto = function () {
        var _this = this;
        this.puesto = [];
        if (this.equipo_id == null) {
            return;
        }
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables para recoger texto e identificadores.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.puestoService.send_data({ id: null, codigo: null,
            activo: 'S', eq_id: this.equipo_id,
            asig_pend: 'N' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_puesto = data;
            aux = _this.createRowData(_this.array_puesto);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.puesto.push({ label: 'Seleccione puesto', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = aux[i]['codigo'] + " (" + aux[i]['descripcion'] + ")";
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.puesto.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    TareaComponent.prototype.showDialog = function () {
        this.display = true;
    };
    TareaComponent.prototype.showDialog2 = function () {
        this.display2 = true;
    };
    TareaComponent.prototype.insertarFechaDesde = function () {
        // Primero se selecciona una fecha.
        if (this.fecha_desde == null) {
            this.mensajes("error_fechas2");
            return;
        }
        var partes_fecha = this.fecha_desde.split('/');
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "fecha_inicio";
        var id;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        // Se inserta fecha en las filas seleccionadas.
        var fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.fecha_inicio;
            newValue = fecha2;
            id = nodo_fecha.data.id;
            var data_nodo = nodo_fecha.data;
            data_nodo.fecha_inicio = fecha2;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field);
    };
    TareaComponent.prototype.insertarFechaHasta = function () {
        // Primero se selecciona una fecha.
        var partes_fecha;
        var fecha2;
        if (this.fecha_hasta == null) {
            fecha2 = null;
        }
        else {
            partes_fecha = this.fecha_hasta.split('/');
            fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        }
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "fecha_fin";
        var id;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        // Se inserta fecha en las filas seleccionadas.
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.fecha_fin;
            newValue = fecha2;
            id = nodo_fecha.data.id;
            var data_nodo = nodo_fecha.data;
            data_nodo.fecha_fin = fecha2;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field);
    };
    TareaComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == 'error_puesto') {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero el puesto del combo";
        }
        if (opcion == 'error_buscar_trab') {
            ret = true;
            severity = 'warn';
            summary = 'Gestor de Turnos informa:';
            mensaje = "Es necesario seleccionar un equipo de trabajo y una fecha por la cual buscar trabajadores";
        }
        if (opcion == 'error_fechas') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "Seleccione fecha de inicio de asignación";
        }
        if (opcion == 'error_fechas2') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero la fecha haciendo click en caja de fecha";
        }
        if (opcion == "error_insertar") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione puesto y trabajador.';
        }
        return [ret, severity, summary, mensaje];
    };
    TareaComponent.prototype.insertarPuesto = function () {
        // Primero se selecciona una fecha.
        if (this.puesto_sel == null) {
            this.mensajes("error_puesto");
            return;
        }
        // Se recupera el puesto seleccionado.
        var puesto_id = this.puesto_sel['id'];
        var puesto_cod = this.puesto_sel['code'];
        var puesto_desc = this.puesto_sel['name'];
        // Se definen variables para control de modificaciones.
        var id;
        var oldValue_id;
        var newValue_id;
        var field_id = "p_id";
        var oldValue_cod;
        var newValue_cod;
        var field_cod = "p_cod";
        var oldValue_desc;
        var newValue_desc;
        var field_desc = "p_desc";
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        // Se recuperan nodos seleccionados.
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo) {
            id = nodo.data.id;
            // Se actualiza id.
            oldValue_id = nodo.data.p_id;
            newValue_id = puesto_id;
            nodo.data.p_id = newValue_id;
            // Se actualiza código.
            oldValue_cod = nodo.data.p_cod;
            newValue_cod = puesto_cod;
            nodo.data.p_cod = newValue_cod;
            // Se actualiza descripción.
            oldValue_desc = nodo.data.p_desc;
            newValue_desc = puesto_desc;
            nodo.data.p_desc = newValue_desc;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue_id, newValue_id, id, field_id);
        this.evaluarCeldaModificada(oldValue_cod, newValue_cod, id, field_cod);
        this.evaluarCeldaModificada(oldValue_desc, newValue_desc, id, field_desc);
    };
    TareaComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // ALGG 06-01-2017 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    p_id: nodo_fila.data.p_id,
                    p_cod: nodo_fila.data.p_cod,
                    p_desc: nodo_fila.data.p_desc,
                    fecha_inicio: nodo_fila.data.fecha_inicio,
                    fecha_fin: nodo_fila.data.fecha_fin,
                    observ: nodo_fila.data.observ,
                    contrato_id: nodo_fila.data.contrato_id,
                    fecha_inicio_c: nodo_fila.data.fecha_inicio_c,
                    fecha_fin_c: nodo_fila.data.fecha_fin_c,
                    persona_id: nodo_fila.data.persona_id,
                    nombre: nodo_fila.data.nombre,
                    ape1: nodo_fila.data.ape1,
                    ape2: nodo_fila.data.ape2,
                    dni: nodo_fila.data.dni,
                    solapado: nodo_fila.data.solapado });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    TareaComponent.prototype.insertarFila = function () {
        if (this.fecha_desde == null) {
            this.mensajes("error_fechas");
            return;
        }
        if (this.puesto_sel == null || this.trab_id == null) {
            console.log(this.trab_id);
            this.mensajes("error_insertar");
            return;
        }
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    };
    TareaComponent.prototype.crearNuevaFilaDatos = function () {
        var puesto_id = this.puesto_sel['id'];
        var puesto_cod = this.puesto_sel['code'];
        var puesto_desc = this.puesto_sel['name'];
        var partes_fecha = this.fecha_desde.split('/');
        var fecha_d = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        var fecha_h = null;
        if (this.fecha_hasta == null) {
            fecha_h = null;
        }
        else {
            partes_fecha = this.fecha_hasta.split('/');
            fecha_h = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        }
        var nuevaFila = {
            id: 0,
            p_id: puesto_id,
            p_cod: puesto_cod,
            p_desc: puesto_desc,
            fecha_inicio: fecha_d,
            fecha_fin: fecha_h,
            observ: '',
            contrato_id: this.trab_contrato_id,
            fecha_inicio_c: this.trab_fini_c,
            fecha_fin_c: this.trab_ffin_c,
            persona_id: this.trab_id,
            nombre: this.trab_nombre,
            ape1: this.trab_ape1,
            ape2: this.trab_ape2,
            dni: this.trab_dni,
            solapado: 'N'
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    TareaComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "p_id", field: "p_id", hide: true, width: 100 },
            { headerName: "C.Puesto", field: "p_cod", width: 110 },
            { headerName: "Puesto", field: "p_desc", width: 150 },
            { headerName: "persona_id", field: "persona_id", hide: true, width: 100 },
            { headerName: "1er Ap.", field: "ape1", width: 100 },
            { headerName: "2do Ap.", field: "ape2", width: 100 },
            { headerName: "Nombre", field: "nombre", width: 100 },
            { headerName: "DNI", field: "dni", width: 90 },
            { headerName: "Tarea desde", field: "fecha_inicio", width: 90,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "Tarea hasta", field: "fecha_fin", width: 90,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "Contrato desde", field: "fecha_inicio_c", width: 110,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "Contrato hasta", field: "fecha_fin_c", width: 110,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "contrato_id", field: "contrato_id", hide: true, width: 100 },
            { headerName: "Solapado", field: "solapado", cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] }, editable: true, width: 100 },
            { headerName: "Observaciones", field: "observ", width: 220, editable: true },
        ];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', planilla_component_1.EquipoSeleccionado)
    ], TareaComponent.prototype, "equipoSel", void 0);
    TareaComponent = __decorate([
        core_1.Component({
            selector: 'tarea',
            templateUrl: 'app/tarea/tarea.html',
            providers: [tarea_service_1.TareaService, asignar_trabajador_service_1.AsignarTrabajadorService, puesto_service_1.PuestoService]
        }), 
        __metadata('design:paramtypes', [tarea_service_1.TareaService, asignar_trabajador_service_1.AsignarTrabajadorService, puesto_service_1.PuestoService])
    ], TareaComponent);
    return TareaComponent;
}(GridComponent_1.GridComponent));
exports.TareaComponent = TareaComponent;
//# sourceMappingURL=tarea.component.js.map
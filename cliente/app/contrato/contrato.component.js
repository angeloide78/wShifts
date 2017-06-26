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
var contrato_service_1 = require("./contrato.service");
var buscar_persona_component_1 = require("../buscar_persona/buscar_persona.component");
var categoria_profesional_service_1 = require("../categoria_profesional/categoria_profesional.service");
var cargo_service_1 = require("../cargo/cargo.service");
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
var ContratoComponent = (function (_super) {
    __extends(ContratoComponent, _super);
    function ContratoComponent(objetoService, categoriaProfesionalService, cargoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.categoriaProfesionalService = categoriaProfesionalService;
        this.cargoService = cargoService;
        this.persona_id = null;
        this.fecha_desde = null;
        this.fecha_hasta = null;
        this.display = false;
        this.display2 = false;
        this.boton_actualizar = true;
        this.titulo = "Gestión de contratos de trabajo";
        this.nombre_fichero_csv = "contratos_wShifts.csv";
        this.es = { firstDayOfWeek: 1,
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
        // Se cargan cargos y categorías profesionales.
        this.cargarCargo();
        this.cargarCategoriaProfesional();
    }
    ContratoComponent.prototype.onRowClicked = function ($event) {
        // Se recuperan datos.
        var id = $event.node.data.id;
        console.log("contrato_id = " + id);
        // Se crea el objeto del contrato seleccionado.
        var contrato_seleccionado = new ContratoSeleccionado(id);
        this.contratoSel = contrato_seleccionado;
    };
    ContratoComponent.prototype.onRowSelected = function ($event) {
        // Se recuperan datos.
        console.log("seleccionando");
        var datos = this.gridOptions.api.getSelectedRows();
        console.log(datos);
        if ((datos == undefined) || (datos == null) ||
            (datos.length == 0) || (datos[0]['id'] == 0)) {
            this.boton_actualizar = true;
        }
        else {
            this.boton_actualizar = false;
        }
    };
    ContratoComponent.prototype.onRowDataChanged = function ($event) {
        // Se recuperan datos.
        console.log("seleccionando");
        var datos = this.gridOptions.api.getSelectedRows();
        console.log(datos);
        if (datos.length == 0) {
            this.boton_actualizar = true;
        }
        else {
            this.boton_actualizar = false;
        }
    };
    ContratoComponent.prototype.ngOnChanges = function (changes) {
        // Se detectan cambios...
        var dato;
        var perSel = changes['perSel'];
        // Se recuperan cambios...
        dato = perSel.currentValue;
        // Si no hay nada, salimos.
        if (dato == undefined) {
            return;
        }
        // Se recupera el id, que será con lo que se busque...
        var id = dato.id;
        this.persona_id = id;
        console.log("[CONTRATO] Recuperando trabajador con DNI " + dato.dni);
        // Se recupera información.
        this.filtro_recuperar = { persona_id: id };
        this.recuperar();
    };
    ContratoComponent.prototype.cargarCargo = function () {
        var _this = this;
        this.cargo = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables para recoger texto e identificadores.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.cargoService.send_data({ id_: null, activo: 'S' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_cargo = data;
            aux = _this.createRowData(_this.array_cargo);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.cargo.push({ label: 'Seleccione cargo', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = "(" + aux[i]['codigo'] + ") " + aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.cargo.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    ContratoComponent.prototype.cargarCategoriaProfesional = function () {
        var _this = this;
        this.cp = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables para recoger datos del combo.
        var desc;
        var ident;
        var codigo;
        var label;
        // Filtro de recuperación.
        var filtro_recuperar = { id_: null, activo: 'S' };
        // Se llama a servicio de componente para recuperar información.
        this.categoriaProfesionalService.send_data(filtro_recuperar, 'recuperar')
            .subscribe(function (data) {
            _this.array_cp = data;
            aux = _this.createRowData(_this.array_cp);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.cp.push({ label: 'Seleccione categoría profesional', value: null });
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
    ContratoComponent.prototype.showDialog = function () {
        this.display = true;
    };
    ContratoComponent.prototype.showDialog2 = function () {
        this.display2 = true;
    };
    ContratoComponent.prototype.insertarFechaDesde = function () {
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
    ContratoComponent.prototype.insertarFechaHasta = function () {
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
    ContratoComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'La fecha de inicio no puede ser mayor que la fecha de fin.';
        }
        if (opcion == 'error_cargo') {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero el cargo del combo";
        }
        if (opcion == 'error_cp') {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero la categoria profesional del combo";
        }
        if (opcion == 'error_fechas') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "Seleccione fecha de inicio de contrato";
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
            mensaje = 'Seleccione primero cargo y categoría profesional.';
        }
        return [ret, severity, summary, mensaje];
    };
    ContratoComponent.prototype.insertarCargo = function () {
        // Primero se selecciona una fecha.
        if (this.cargo_sel == null) {
            this.mensajes("error_cargo");
            return;
        }
        // Se recupera el cargo seleccionado.
        var cargo_id = this.cargo_sel['id'];
        var cargo_cod = this.cargo_sel['code'];
        var cargo_desc = this.cargo_sel['name'];
        // Se definen variables para control de modificaciones.
        var id;
        var oldValue_id;
        var newValue_id;
        var field_id = "cargo_id";
        var oldValue_cod;
        var newValue_cod;
        var field_cod = "cargo_cod";
        var oldValue_desc;
        var newValue_desc;
        var field_desc = "cargo_desc";
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        // Se recuperan nodos seleccionados.
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo) {
            id = nodo.data.id;
            // Se actualiza id.
            oldValue_id = nodo.data.cargo_id;
            newValue_id = cargo_id;
            nodo.data.cargo_id = newValue_id;
            // Se actualiza código.
            oldValue_cod = nodo.data.cargo_cod;
            newValue_cod = cargo_cod;
            nodo.data.cargo_cod = cargo_cod;
            // Se actualiza descripción.
            oldValue_desc = nodo.data.cargo_desc;
            newValue_desc = cargo_desc;
            nodo.data.cargo_desc = cargo_desc;
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
    ContratoComponent.prototype.insertarCP = function () {
        // Primero se selecciona una fecha.
        if (this.cp_sel == null) {
            this.mensajes("error_cp");
            return;
        }
        // Se recupera la categoría profesional seleccionada.
        var cp_id = this.cp_sel['id'];
        var cp_cod = this.cp_sel['code'];
        var cp_desc = this.cp_sel['name'];
        // Se definen variables para control de modificaciones.
        var id;
        var oldValue_id;
        var newValue_id;
        var field_id = "cp_id";
        var oldValue_cod;
        var newValue_cod;
        var field_cod = "cp_cod";
        var oldValue_desc;
        var newValue_desc;
        var field_desc = "cp_desc";
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        // Se recuperan nodos seleccionados.
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo) {
            id = nodo.data.id;
            // Se actualiza id.
            oldValue_id = nodo.data.cp_id;
            newValue_id = cp_id;
            nodo.data.cp_id = newValue_id;
            // Se actualiza código.
            oldValue_cod = nodo.data.cp_cod;
            newValue_cod = cp_cod;
            nodo.data.cp_cod = cp_cod;
            // Se actualiza descripción.
            oldValue_desc = nodo.data.cp_desc;
            newValue_desc = cp_desc;
            nodo.data.cp_desc = cp_desc;
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
    ContratoComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            if ((nodo_fila.data.fecha_fin != null) &&
                (nodo_fila.data.fecha_inicio >
                    nodo_fila.data.fecha_fin)) {
                ret = false;
            }
            // Si no cumple la validación, nos vamos.
            if (!ret) {
                return [ret, bolsa];
            }
            ;
            // ALGG 06-01-2017 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    cargo_id: nodo_fila.data.cargo_id,
                    cargo_cod: nodo_fila.data.cargo_cod,
                    cargo_desc: nodo_fila.data.cargo_desc,
                    fecha_inicio: nodo_fila.data.fecha_inicio,
                    fecha_fin: nodo_fila.data.fecha_fin,
                    cp_id: nodo_fila.data.cp_id,
                    cp_cod: nodo_fila.data.cp_cod,
                    cp_desc: nodo_fila.data.cp_desc,
                    persona_id: nodo_fila.data.persona_id });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    ContratoComponent.prototype.insertarFila = function () {
        if (this.fecha_desde == null) {
            this.mensajes("error_fechas");
            return;
        }
        if ((this.cargo_sel == null) || (this.cp_sel == null)) {
            this.mensajes("error_insertar");
            return;
        }
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    };
    ContratoComponent.prototype.crearNuevaFilaDatos = function () {
        var cargo_id = this.cargo_sel['id'];
        var cargo_cod = this.cargo_sel['code'];
        var cargo_desc = this.cargo_sel['name'];
        var cp_id = this.cp_sel['id'];
        var cp_cod = this.cp_sel['code'];
        var cp_desc = this.cp_sel['name'];
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
            cargo_id: cargo_id,
            cargo_cod: cargo_cod,
            cargo_desc: cargo_desc,
            fecha_inicio: fecha_d,
            fecha_fin: fecha_h,
            cp_id: cp_id,
            cp_cod: cp_cod,
            cp_desc: cp_desc,
            persona_id: this.persona_id
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    ContratoComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "cargo_id", field: "cargo_id", hide: true, width: 100 },
            { headerName: "C.C", field: "cargo_cod", width: 70 },
            { headerName: "Cargo", field: "cargo_desc", width: 290 },
            { headerName: "Desde", field: "fecha_inicio", width: 115,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "Hasta", field: "fecha_fin", width: 115,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "cp_id", field: "cp_id", hide: true, width: 100 },
            { headerName: "C.CP", field: "cp_cod", width: 70 },
            { headerName: "Categoría Profesional", field: "cp_desc", width: 290 },
            { headerName: "persona_id", field: "persona_id", hide: true, width: 100 }
        ];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', buscar_persona_component_1.PersonaSeleccionada)
    ], ContratoComponent.prototype, "perSel", void 0);
    ContratoComponent = __decorate([
        core_1.Component({
            selector: 'contrato',
            templateUrl: 'app/contrato/contrato.html',
            providers: [contrato_service_1.ContratoService, categoria_profesional_service_1.CategoriaProfesionalService, cargo_service_1.CargoService]
        }), 
        __metadata('design:paramtypes', [contrato_service_1.ContratoService, categoria_profesional_service_1.CategoriaProfesionalService, cargo_service_1.CargoService])
    ], ContratoComponent);
    return ContratoComponent;
}(GridComponent_1.GridComponent));
exports.ContratoComponent = ContratoComponent;
//# sourceMappingURL=contrato.component.js.map
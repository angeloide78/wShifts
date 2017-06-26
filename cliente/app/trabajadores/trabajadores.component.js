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
var persona_service_1 = require("../persona/persona.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var TrabajadoresComponent = (function (_super) {
    __extends(TrabajadoresComponent, _super);
    function TrabajadoresComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.display = false;
        this.titulo = "Gestión de trabajadores";
        this.nombre_fichero_csv = "trabajadores_wShifts.csv";
        this.fnac = null;
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
        // ALGG 06-01-2017 Se indica filtro de id a nulo. Nos traemos todo.
        this.filtro_recuperar = { id: null };
    }
    TrabajadoresComponent.prototype.insertarFechaNac = function () {
        // Primero se selecciona una fecha.
        if (this.fnac == null) {
            this.mensajes("error_fechas2");
            return;
        }
        var partes_fecha = this.fnac.split('/');
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "fnac";
        var id;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        var fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.fnac;
            newValue = fecha2;
            id = nodo_fecha.data.id;
            var data_nodo = nodo_fecha.data;
            data_nodo.fnac = newValue;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field);
    };
    TrabajadoresComponent.prototype.showDialog = function () {
        this.display = true;
    };
    TrabajadoresComponent.prototype.insertarFila = function () {
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    };
    TrabajadoresComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Los campos documento, nombre, primer apellido, primer teléfono y e-mail son obligatorios.';
        }
        if (opcion == "error_fechas2") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Se debe de seleccionar una fecha de nacimiento';
        }
        return [ret, severity, summary, mensaje];
    };
    TrabajadoresComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // Se chequean que haya datos para celdas específicas.
            if ((nodo_fila.data.dni.length == 0) ||
                (nodo_fila.data.nombre.length == 0) ||
                (nodo_fila.data.ape1.length == 0) ||
                (nodo_fila.data.tlfno1.length == 0) ||
                (nodo_fila.data.email.length == 0)) {
                console.log("persona sin datos ", nodo_fila.data.id);
                ret = false;
            }
            // Si no cumple la validación, nos vamos.
            if (!ret) {
                return [ret, bolsa];
            }
            ;
            // ALGG 02-12-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    dni: nodo_fila.data.dni,
                    nombre: nodo_fila.data.nombre,
                    ape1: nodo_fila.data.ape1,
                    ape2: nodo_fila.data.ape2,
                    sexo: nodo_fila.data.sexo,
                    fnac: nodo_fila.data.fnac,
                    direccion: nodo_fila.data.direccion,
                    cp: nodo_fila.data.cp,
                    poblacion: nodo_fila.data.poblacion,
                    provincia: nodo_fila.data.provincia,
                    pais: nodo_fila.data.pais,
                    tlfno1: nodo_fila.data.tlfno1,
                    tlfno2: nodo_fila.data.tlfno2,
                    email: nodo_fila.data.email,
                    observaciones: nodo_fila.data.observaciones });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    TrabajadoresComponent.prototype.crearNuevaFilaDatos = function () {
        var fecha2 = null;
        if (this.fnac != null) {
            var partes_fecha = this.fnac.split('/');
            fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        }
        var nuevaFila = {
            id: 0,
            dni: "",
            nombre: "",
            ape1: "",
            ape2: "",
            sexo: "M",
            fnac: fecha2,
            direccion: "",
            cp: "",
            poblacion: "",
            provincia: "",
            pais: "",
            tlfno1: "",
            tlfno2: "",
            email: "",
            observaciones: ""
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    TrabajadoresComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "Documento", field: "dni", width: 120, editable: true },
            { headerName: "Nombre", field: "nombre", width: 200, editable: true },
            { headerName: "Primer apellido", field: "ape1", width: 200, editable: true },
            { headerName: "Segundo apellido", field: "ape2", width: 200, editable: true },
            { headerName: "Sexo", field: "sexo", cellEditor: "select",
                cellEditorParams: { values: ['M', 'H'] }, editable: true, width: 100 },
            { headerName: "F. Nac.", field: "fnac", width: 100,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "Dirección", field: "direccion", width: 400, editable: true },
            { headerName: "CP", field: "cp", width: 50, editable: true },
            { headerName: "Población", field: "poblacion", width: 400, editable: true },
            { headerName: "Provincia", field: "provincia", width: 100, editable: true },
            { headerName: "País", field: "pais", width: 100, editable: true },
            { headerName: "Primer teléfono", field: "tlfno1", width: 200, editable: true },
            { headerName: "Segundo teléfono", field: "tlfno2", width: 200, editable: true },
            { headerName: "e-mail", field: "email", width: 200, editable: true },
            { headerName: "Observaciones", field: "observaciones", width: 400,
                celleditor: "largeText", editable: true }
        ];
    };
    TrabajadoresComponent = __decorate([
        core_1.Component({
            selector: 'trabajadores',
            templateUrl: 'app/trabajadores/trabajadores.html',
            providers: [persona_service_1.PersonaService]
        }), 
        __metadata('design:paramtypes', [persona_service_1.PersonaService])
    ], TrabajadoresComponent);
    return TrabajadoresComponent;
}(GridComponent_1.GridComponent));
exports.TrabajadoresComponent = TrabajadoresComponent;
//# sourceMappingURL=trabajadores.component.js.map
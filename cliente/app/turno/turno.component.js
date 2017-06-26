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
var turno_service_1 = require("./turno.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var turnoComponent = (function (_super) {
    __extends(turnoComponent, _super);
    function turnoComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        // Atributos generales.
        this.titulo = "Gestión de Turnos";
        this.nombre_fichero_csv = "turnos_wShifts.csv";
        this.tipo_borrado = 'maestro_detalle';
        this.tipo_modificacion = 'maestro_detalle';
        this.display = false;
        this.hora_inicio = null;
        this.minuto_inicio = null;
        this.hora_fin = null;
        this.minuto_fin = null;
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
        // ALGG 07-01-2017 Configuración del filtro.
        this.filtro_recuperar = { codigo: null, activo: null, solo_libres: false };
    }
    turnoComponent.prototype.insertar_hora_inicio = function () {
        if (this.hora_inicio == null) {
            this.hora_inicio = 0;
        }
        if (this.minuto_inicio == null) {
            this.minuto_inicio = 0;
        }
        var h = String(this.hora_inicio);
        var m = String(this.minuto_inicio);
        if (h.length == 1) {
            h = '0' + h;
        }
        if (m.length == 1) {
            m = '0' + m;
        }
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "hora_inicio_d";
        var id;
        var id_d;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.hora_inicio_d;
            newValue = h + ":" + m;
            id = nodo_fecha.data.id;
            id_d = nodo_fecha.data.id_d;
            nodo_fecha.data.hora_inicio_d = newValue;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field, id_d);
    };
    turnoComponent.prototype.insertar_hora_fin = function () {
        if (this.hora_fin == null) {
            this.hora_fin = 0;
        }
        if (this.minuto_fin == null) {
            this.minuto_fin = 0;
        }
        var h = String(this.hora_fin);
        var m = String(this.minuto_fin);
        if (h.length == 1) {
            h = '0' + h;
        }
        if (m.length == 1) {
            m = '0' + m;
        }
        // Se definen variables para control de modificaciones.
        var oldValue;
        var newValue;
        var field = "hora_fin_d";
        var id;
        var id_d;
        // Nodos a actualizar.
        var nodos_a_actualizar = [];
        var filaSel = this.gridOptions.api.getSelectedNodes();
        filaSel.forEach(function (nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.hora_fin_d;
            newValue = h + ":" + m;
            id = nodo_fecha.data.id;
            id_d = nodo_fecha.data.id_d;
            nodo_fecha.data.hora_fin_d = newValue;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
        });
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar);
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field, id_d);
    };
    turnoComponent.prototype.showDialog = function () {
        this.display = true;
    };
    turnoComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = 'Los campos código y descripción no pueden estar vacíos y el ' +
                'formato de hora debe ser hh:mm';
        }
        if (opcion == 'error_extender_fila_nueva') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "El nuevo turno necesita ser guardado antes de poder extenderse";
        }
        return [ret, severity, summary, mensaje];
    };
    turnoComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // ALGG 04-11-2016 Se comprueba la formación correcta de las horas.
            var regexp = new RegExp('[2][0-3]|[0-1]?[0-9]:[0-5][0-9]');
            var test1 = regexp.test(nodo_fila.data.hora_inicio_d);
            var test2 = regexp.test(nodo_fila.data.hora_fin_d);
            // Se chequean que haya datos para celdas específicas.
            if (!test1 || !test2
                || (nodo_fila.data.codigo_m.length == 0)
                || (nodo_fila.data.descripcion_m.length == 0)) {
                ret = false;
            }
            // Si no cumple la validación, nos vamos.
            if (!ret) {
                return [ret, bolsa];
            }
            ;
            // ALGG 04-11-2016 Se recuperan las filas nuevas o las filas que han
            // sido extendidas (la creación de un detalle).
            if ((nodo_fila.data.id == 0)
                || (nodo_fila.data.id != 0 && nodo_fila.data.id_d == 0)) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    codigo_m: nodo_fila.data.codigo_m,
                    descripcion_m: nodo_fila.data.descripcion_m,
                    cuenta_horas_m: nodo_fila.data.cuenta_horas_m,
                    activo_m: nodo_fila.data.activo_m,
                    id_d: nodo_fila.data.id_d,
                    dia_inicial_d: nodo_fila.data.dia_inicial_d,
                    dia_final_d: nodo_fila.data.dia_final_d,
                    hora_inicio_d: nodo_fila.data.hora_inicio_d,
                    hora_fin_d: nodo_fila.data.hora_fin_d
                });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    turnoComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {
            id: 0,
            codigo_m: "",
            descripcion_m: "",
            activo_m: "S",
            cuenta_horas_m: "S",
            id_d: 0,
            dia_inicial_d: "Actual",
            dia_final_d: "Actual",
            hora_inicio_d: '00:00',
            hora_fin_d: '00:00'
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    turnoComponent.prototype.duplicarFila = function () {
        // ALGG 02-11-2016 Función para duplicar filas que están seleccionadas
        // copiando todos los datos, excepto los que interesen. Se tiene que
        // hacer override de este método ya que dependerá del grid.
        // Se obtienen filas seleccionadas.
        var filaSel = this.gridOptions.api.getSelectedRows();
        var bolsa = [];
        var seguir = true;
        // ALGG 02-11-2016 Se parametriza el tipo de borrado.
        filaSel.forEach(function (filaSeleccionada, index) {
            // Obtenemos los datos a duplicar, creamos nueva fila y la insertamos
            // en el grid.
            // ALGG 05-11-2016 Si la fila es nueva, no puede extenderse. Antes
            // se tiene que guardar en base de datos.
            if (filaSeleccionada.id == 0) {
                seguir = false;
            }
            var nuevaFila = {
                id: filaSeleccionada.id,
                codigo_m: filaSeleccionada.codigo_m,
                descripcion_m: filaSeleccionada.descripcion_m,
                activo_m: filaSeleccionada.activo_m,
                cuenta_horas_m: filaSeleccionada.cuenta_horas_m,
                id_d: 0,
                dia_inicial_d: "Actual",
                dia_final_d: "Actual",
                hora_inicio_d: '00:00',
                hora_fin_d: '00:00'
            };
            bolsa.push(nuevaFila);
        });
        if (!seguir) {
            this.mensajes('error_extender_fila_nueva');
        }
        else {
            for (var _i = 0, bolsa_1 = bolsa; _i < bolsa_1.length; _i++) {
                var item = bolsa_1[_i];
                this.gridOptions.api.addItems([item]);
            }
        }
    };
    turnoComponent.prototype.mapear_dia = function (dato) { };
    turnoComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id",
                field: "id",
                hide: true,
                width: 100
            },
            { headerName: "Código",
                field: "codigo_m",
                headerTooltip: "Código de turno",
                //cellEditorFramework: {
                //component: StringEditorComponent,
                //moduleImports: [FormsModule]
                //},
                editable: true,
                width: 100
            },
            { headerName: "Descripción",
                field: "descripcion_m",
                headerTooltip: "Descripción de turno",
                //cellEditorFramework: {
                //component: StringEditorComponent,
                //moduleImports: [FormsModule]
                //},
                editable: true,
                width: 200
            },
            { headerName: "id_d",
                field: "id_d",
                hide: true,
                width: 100,
                cellClassRules: { 'rag-red': 'x < 1' }
            },
            { headerName: "Comienza en día",
                field: "dia_inicial_d",
                cellEditor: "select",
                cellEditorParams: { values: ['Actual', 'Siguiente'] },
                editable: true,
                width: 160
            },
            { headerName: "Termina en día",
                field: "dia_final_d",
                cellEditor: "select",
                cellEditorParams: { values: ['Actual', 'Siguiente'] },
                editable: true,
                width: 160
            },
            { headerName: "Hora inicio",
                field: "hora_inicio_d",
                headerTooltip: "Hora de inicio del turno",
                //cellEditorFramework: {
                //template: `<p-calendar [(ngModel)]="value" showTime="showTime" hourFormat="24"></p-calendar>`,
                //component: StringEditorComponent,
                //moduleImports: [ FormsModule ]
                //},
                //editable: true,
                width: 160
            },
            { headerName: "Hora fin",
                field: "hora_fin_d",
                headerTooltip: "Hora de finalización del turno",
                //cellEditorFramework: {
                //component: StringEditorComponent,
                //moduleImports: [FormsModule]
                //},
                //editable: true,
                width: 160
            },
            { headerName: "Activo",
                field: "activo_m",
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true,
                width: 70
            },
            { headerName: "Cuenta Horas",
                field: "cuenta_horas_m",
                cellEditor: "select",
                cellEditorParams: { values: ['S', 'N'] },
                editable: true,
                width: 150
            }
        ];
    };
    turnoComponent = __decorate([
        core_1.Component({
            selector: 'turno',
            templateUrl: 'app/turno/turno.html',
            providers: [turno_service_1.TurnoService]
        }), 
        __metadata('design:paramtypes', [turno_service_1.TurnoService])
    ], turnoComponent);
    return turnoComponent;
}(GridComponent_1.GridComponent));
exports.turnoComponent = turnoComponent;
//# sourceMappingURL=turno.component.js.map
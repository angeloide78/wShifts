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
var puesto_ciclo_service_1 = require("./puesto_ciclo.service");
var ciclo_service_1 = require("../ciclo/ciclo.service");
var centro_fisico_service_1 = require("../centro_fisico/centro_fisico.service");
var servicio_service_1 = require("../servicio/servicio.service");
var equipo_service_1 = require("../equipo/equipo.service");
var puesto_service_1 = require("../puesto/puesto.service");
var turno_service_1 = require("../turno/turno.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var PuestoCicloComponent = (function (_super) {
    __extends(PuestoCicloComponent, _super);
    function PuestoCicloComponent(objetoService, cicloService, centroFisicoService, servicioService, equipoService, puestoService, turnoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.cicloService = cicloService;
        this.centroFisicoService = centroFisicoService;
        this.servicioService = servicioService;
        this.equipoService = equipoService;
        this.puestoService = puestoService;
        this.turnoService = turnoService;
        this.fecha_desde = null;
        this.fecha_hasta = null;
        this.display = false;
        this.titulo = "Gestión de asignación de ciclos a puestos de trabajo";
        this.nombre_fichero_csv = "puestoCiclos_wShifts.csv";
        this.sem = 1;
        this.nombre_fichero_csv2 = "cicloSemana_wShifts.csv";
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
        // Se crea tipo.
        this.gridOptions2 = {};
        // Se definen columnas.
        this.gridOptions2.columnDefs = this.createDetailColumnDefs();
        // 23-12-2016 Configuración de visualización.
        this.gridOptions2.enableFilter = false;
        this.gridOptions2.enableSorting = false;
        this.gridOptions2.enableColResize = false;
        // Se desactiva opción de eliminar columnas.
        this.gridOptions2.suppressDragLeaveHidesColumns = true;
        // Se cargan los centros físicos.
        this.cargarCF();
        // Se cargan los ciclos.
        this.cargarCiclo();
        // Se cargan los turnos libres.
        this.cargarTurno();
    }
    PuestoCicloComponent.prototype.cargarTurno = function () {
        var _this = this;
        this.t = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.turnoService.send_data({ codigo: null, activo: 'S', solo_libres: true }, 'recuperar')
            .subscribe(function (data) {
            _this.array_t = data;
            aux = _this.createRowData(_this.array_t);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.t.push({ label: 'Seleccione turno libre', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = "(" + aux[i]['codigo_m'] + ") " + aux[i]['descripcion_m'];
                    codigo = aux[i]['codigo_m'];
                    desc = aux[i]['descripcion_m'];
                    _this.t.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    PuestoCicloComponent.prototype.recuperar = function () {
        if (this.p_sel == null) {
            this.mensajes('error_recuperar_2');
        }
        else {
            this.filtro_recuperar = { puesto_id: this.p_sel['id'] };
            _super.prototype.recuperar.call(this);
        }
    };
    PuestoCicloComponent.prototype.cargarCF = function () {
        var _this = this;
        this.cf = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        var label;
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
                    label = "(" + aux[i]['codigo'] + ") " + aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.cf.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    PuestoCicloComponent.prototype.onChangeCF = function ($event) {
        // Se recupera el identificador del centro físico.
        //let cf_id = $event.value['id'] ;
        if (this.cf_sel != null) {
            // Se cargan los servicios que cuelgan del centro físico seleccionado.
            this.cargarServicio();
        }
    };
    PuestoCicloComponent.prototype.cargarServicio = function () {
        var _this = this;
        this.sf = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.servicioService.send_data({ id: null, codigo: null, activo: 'S',
            cf_id: this.cf_sel['id'],
            asig_pend: 'N' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_sf = data;
            aux = _this.createRowData(_this.array_sf);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.sf.push({ label: 'Seleccione servicio', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = "(" + aux[i]['codigo'] + ") " + aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.sf.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    PuestoCicloComponent.prototype.onChangeServicio = function ($event) {
        // Se recupera el identificador del servicio.
        //let sf_id = $event.value['id'] ;
        if (this.sf_sel != null) {
            // Se cargan los equipos que cuelgan del servicio seleccionado.
            this.cargarEquipo();
        }
    };
    PuestoCicloComponent.prototype.cargarEquipo = function () {
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
            sf_id: this.sf_sel['id'],
            asig_pend: 'N' }, 'recuperar')
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
    PuestoCicloComponent.prototype.onChangeEquipo = function ($event) {
        // Se recupera el identificador del servicio.
        //let sf_id = $event.value['id'] ;
        if (this.eq_sel != null) {
            // Se cargan los equipos que cuelgan del servicio seleccionado.
            this.cargarPuesto();
        }
    };
    PuestoCicloComponent.prototype.cargarPuesto = function () {
        var _this = this;
        this.p = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables.
        var desc;
        var ident;
        var codigo;
        var label;
        // Se llama a servicio de componente para recuperar información.
        this.puestoService.send_data({ id: null, codigo: null, activo: 'S',
            eq_id: this.eq_sel['id'],
            asig_pend: 'N' }, 'recuperar')
            .subscribe(function (data) {
            _this.array_p = data;
            aux = _this.createRowData(_this.array_p);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.p.push({ label: 'Seleccione puesto', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    label = "(" + aux[i]['codigo'] + ") " + aux[i]['descripcion'];
                    codigo = aux[i]['codigo'];
                    desc = aux[i]['descripcion'];
                    _this.p.push({ label: label, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    PuestoCicloComponent.prototype.cargarCicloSemanal = function ($event) {
        var _this = this;
        if ($event == null) {
            this.gridOptions2.api.setRowData([]);
        }
        else {
            var ciclo_id = $event.value['id'];
            var ret = void 0;
            var estado_backend = void 0;
            var mensaje_backend = void 0;
            // Se llama a servicio de componente para recuperar información.
            this.cicloService.send_data2(ciclo_id)
                .subscribe(function (data) {
                _this.array_objetos2 = data;
                _this.rowData2 = _this.createRowData2(_this.array_objetos2);
            }, function (error) {
                _this.errorMessage = error;
                _this.mensajes('error_guardar', 'Error de acceso a servidores');
            });
        }
    };
    PuestoCicloComponent.prototype.createRowData2 = function (d) {
        return d["data"];
    };
    PuestoCicloComponent.prototype.exportarCSV2 = function () {
        var params = {
            fileName: this.nombre_fichero_csv2
        };
        this.gridOptions2.api.exportDataAsCsv(params);
    };
    PuestoCicloComponent.prototype.createDetailColumnDefs = function () {
        return [{ headerName: "Semana", field: "semana", width: 80, cellStyle: { 'text-align': 'center' } },
            { headerName: "L", field: "lunes", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "M", field: "martes", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "X", field: "miercoles", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "J", field: "jueves", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "V", field: "viernes", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "S", field: "sabado", width: 50, cellStyle: { 'text-align': 'center' } },
            { headerName: "D", field: "domingo", width: 50, cellStyle: { 'text-align': 'center' } }
        ];
    };
    PuestoCicloComponent.prototype.insertarFila = function () {
        if (this.ciclo_sel == null || this.p_sel == null || this.t_sel == null ||
            this.fecha_desde == null || this.fecha_hasta == null) {
            this.mensajes('error_guardar_filas');
        }
        else {
            var nuevoElemento = this.crearNuevaFilaDatos();
            this.gridOptions.api.addItems([nuevoElemento]);
        }
    };
    PuestoCicloComponent.prototype.cargarCiclo = function () {
        var _this = this;
        this.ciclo = [];
        // Variable para recoger lo que viene del backend.
        var aux;
        // Variables para recoger datos del combo.
        var desc;
        var ident;
        var codigo;
        // Filtro de recuperación.
        var filtro_recuperar = { id_ciclo: null, es_activo: 'S', semana: false };
        // Se llama a servicio de componente para recuperar información.
        this.cicloService.send_data(filtro_recuperar, 'recuperar')
            .subscribe(function (data) {
            _this.array_ciclo = data;
            aux = _this.createRowData(_this.array_ciclo);
            if (aux.length > 0) {
                // Se rellena el combo...
                _this.ciclo.push({ label: 'Seleccione ciclo', value: null });
                for (var i = 0; i < aux.length; i++) {
                    ident = aux[i]['id'];
                    desc = aux[i]['descripcion_m'];
                    codigo = aux[i]['codigo_m'];
                    _this.ciclo.push({ label: desc, value: { id: ident, name: desc, code: codigo } });
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    PuestoCicloComponent.prototype.showDialog = function () {
        this.display = true;
    };
    /*
        public insertarFechaDesde() {
          // Primero se selecciona una fecha.
          if ( this.fecha_desde == null )  {
            this.mensajes("error_fechas2") ;
            return ;
          }
    
          let partes_fecha = this.fecha_desde.split('/');
    
          // Se definen variables para control de modificaciones.
          let oldValue: any ;
          let newValue: any ;
          let field: any = "finicio" ;
          let id:any ;
    
          // Nodos a actualizar.
          let nodos_a_actualizar: any[] = [] ;
    
          // Se inserta fecha en las filas seleccionadas.
          let fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
          let filaSel = this.gridOptions.api.getSelectedNodes() ;
          filaSel.forEach( function(nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.finicio ;
            newValue = fecha2 ;
            id = nodo_fecha.data.id ;
            let data_nodo = nodo_fecha.data;
            data_nodo.finicio = fecha2 ;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
          })
          // Se refresca el ag-grid...
          this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
          // Y se actualiza la estructura de control de modificación.
          this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
        }
    
        public insertarFechaHasta() {
          // Primero se selecciona una fecha.
          if ( this.fecha_hasta == null )  {
            this.mensajes("error_fechas2") ;
            return ;
          }
    
          let partes_fecha = this.fecha_hasta.split('/');
    
          // Se definen variables para control de modificaciones.
          let oldValue: any ;
          let newValue: any ;
          let field: any = "ffin" ;
          let id:any ;
    
          // Nodos a actualizar.
          let nodos_a_actualizar: any[] = [] ;
    
          // Se inserta fecha en las filas seleccionadas.
          let fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
          let filaSel = this.gridOptions.api.getSelectedNodes() ;
          filaSel.forEach( function(nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.ffin ;
            newValue = fecha2 ;
            id = nodo_fecha.data.id ;
            let data_nodo = nodo_fecha.data;
            data_nodo.ffin = fecha2 ;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
          })
          // Se refresca el ag-grid...
          this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
          // Y se actualiza la estructura de control de modificación.
          this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
        }
    */
    PuestoCicloComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        if (opcion == 'error_recuperar_2') {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero un puesto de trabajo para recuperar sus ciclos asociados";
        }
        if (opcion == 'error_fechas2') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "Seleccione primero una fecha";
        }
        if (opcion == 'error_fechas3') {
            ret = true;
            severity = 'error';
            summary = 'wShifts informa:';
            mensaje = "La fecha Desde tiene que ser menor o igual a la fecha Hasta";
        }
        if (opcion == "error_guardar_filas") {
            ret = true;
            severity = 'warn';
            summary = 'wShifts informa:';
            mensaje = 'Seleccione primero el puesto, ciclo, fecha desde y fecha hasta.' +
                ' Además seleccione un turno libre del combo por si se tuvieran que' +
                ' incluir libres en días festivos.';
        }
        return [ret, severity, summary, mensaje];
    };
    PuestoCicloComponent.prototype.validaciones = function (modelo) {
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        modelo.forEachNode(function (nodo_fila) {
            // ALGG 23-12-2016 Se recuperan las filas nuevas.
            if (nodo_fila.data.id == 0) {
                // Se incluye fila en la bolsa.
                bolsa.push({ id: nodo_fila.data.id,
                    p_id: nodo_fila.data.p_id,
                    p_desc: nodo_fila.data.p_desc,
                    ciclo_id: nodo_fila.data.ciclo_id,
                    ciclo_desc: nodo_fila.data.ciclo_desc,
                    finicio: nodo_fila.data.finicio,
                    ffin: nodo_fila.data.ffin,
                    semana: nodo_fila.data.semana,
                    observ: nodo_fila.data.observ,
                    libre_id: nodo_fila.data.libre_id });
                // Depuración.
                console.log(bolsa);
            }
        });
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    PuestoCicloComponent.prototype.crearNuevaFilaDatos = function () {
        var ciclo_id = this.ciclo_sel['id'];
        var ciclo_desc = this.ciclo_sel['name'];
        var p_id = this.p_sel['id'];
        var p_desc = this.p_sel['code'];
        var partes_fecha = this.fecha_desde.split('/');
        var fecha_d = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        partes_fecha = this.fecha_hasta.split('/');
        var fecha_h = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0];
        var nuevaFila = {
            id: 0,
            p_id: p_id,
            p_desc: p_desc,
            ciclo_id: ciclo_id,
            ciclo_desc: ciclo_desc,
            finicio: fecha_d,
            ffin: fecha_h,
            semana: this.sem,
            observ: "",
            libre_id: this.t_sel['id']
        };
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    PuestoCicloComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "p_id", field: "p_id", hide: true, width: 100 },
            { headerName: "Puesto", field: "p_desc", hide: true, width: 400 },
            { headerName: "ciclo_id", field: "ciclo_id", hide: true, width: 100 },
            { headerName: "Ciclo", field: "ciclo_desc", width: 400 },
            { headerName: "Desde", field: "finicio", width: 120,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "Hasta", field: "ffin", width: 120,
                cellRendererFramework: {
                    template: '{{ params.value | date: "dd/MM/yyyy"}}',
                    moduleImports: [common_1.CommonModule]
                },
            },
            { headerName: "Semana", field: "semana", width: 100 },
            { headerName: "Observaciones", field: "observ", width: 350, editable: true },
            { headerName: "libre_id", field: "libre_id", hide: true, width: 100 }
        ];
    };
    PuestoCicloComponent = __decorate([
        core_1.Component({
            selector: 'puesto_ciclo',
            templateUrl: 'app/puesto_ciclo/puesto_ciclo.html',
            providers: [puesto_ciclo_service_1.PuestoCicloService, ciclo_service_1.CicloService, centro_fisico_service_1.CentroFisicoService,
                servicio_service_1.ServicioService, equipo_service_1.EquipoService, puesto_service_1.PuestoService, turno_service_1.TurnoService]
        }), 
        __metadata('design:paramtypes', [puesto_ciclo_service_1.PuestoCicloService, ciclo_service_1.CicloService, centro_fisico_service_1.CentroFisicoService, servicio_service_1.ServicioService, equipo_service_1.EquipoService, puesto_service_1.PuestoService, turno_service_1.TurnoService])
    ], PuestoCicloComponent);
    return PuestoCicloComponent;
}(GridComponent_1.GridComponent));
exports.PuestoCicloComponent = PuestoCicloComponent;
//# sourceMappingURL=puesto_ciclo.component.js.map
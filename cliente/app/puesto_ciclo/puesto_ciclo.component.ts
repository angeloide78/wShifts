// Componentes de Angular 2
import { Component, Input, OnChanges, SimpleChange } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SpinnerModule, SelectItem } from 'primeng/primeng';
import {OverlayPanelModule} from 'primeng/primeng';

import { GridOptions } from 'ag-grid/main';

// Componentes de ag-grid para edición de celdas.
import { StringEditorComponent } from '../grid-utils/editor.component' ;

// Componentes de modelo y servicio.
import { PuestoCicloService } from "./puesto_ciclo.service" ;
import { PuestoCiclo } from "./puesto_ciclo" ;
import { CicloService } from "../ciclo/ciclo.service" ;
import { Ciclo } from "../ciclo/ciclo" ;
import { CicloSemana } from '../ciclo/cicloSemana' ;
import { CentroFisicoService } from "../centro_fisico/centro_fisico.service" ;
import { CentroFisico } from "../centro_fisico/centro_fisico" ;
import { ServicioService } from "../servicio/servicio.service" ;
import { Servicio } from "../servicio/servicio" ;
import { EquipoService } from "../equipo/equipo.service" ;
import { Equipo } from "../equipo/equipo" ;
import { PuestoService } from "../puesto/puesto.service" ;
import { Puesto } from "../puesto/puesto" ;
import { TurnoService } from "../turno/turno.service" ;
import { Turno } from "../turno/turno" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'puesto_ciclo',
    templateUrl: 'app/puesto_ciclo/puesto_ciclo.html',
    providers: [ PuestoCicloService, CicloService, CentroFisicoService,
                 ServicioService, EquipoService, PuestoService, TurnoService ]
})
export class PuestoCicloComponent extends GridComponent {
    // Atributos generales.
    array_cf: CentroFisico[] ;
    cf: SelectItem[] ;
    cf_sel: string ;

    array_sf: Servicio[] ;
    sf: SelectItem[] ;
    sf_sel: string ;

    array_eq: Equipo[] ;
    eq: SelectItem[] ;
    eq_sel: string ;

    array_p: Puesto[] ;
    p: SelectItem[] ;
    p_sel: string ;

    array_ciclo: Ciclo[] ;
    ciclo: SelectItem[] ;
    ciclo_sel: string ;

    fecha_desde: any = null ;
    fecha_hasta: any = null ;

    array_t: Turno[] ;
    t: SelectItem[] ;
    t_sel: string ;

    display: boolean = false;
    titulo:string  = "Gestión de asignación de ciclos a puestos de trabajo" ;
    array_objetos: PuestoCiclo[];
    nombre_fichero_csv: string = "puestoCiclos_wShifts.csv" ;

    sem: number = 1 ;
    array_objetos2: CicloSemana[];
    nombre_fichero_csv2: string = "cicloSemana_wShifts.csv" ;
    gridOptions2: GridOptions ;
    rowData2: any;

    es = { firstDayOfWeek: 0,
           dayNames: [ "domingo", "lunes","martes","miércoles","jueves",
                       "viernes","sábado"],
           dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
           dayNamesMin: [ "D","L","M","X","J","V","S" ],
           monthNames: [ "enero","febrero","marzo","abril","mayo","junio",
                            "julio","agosto","septiembre","octubre",
                            "noviembre","diciembre" ],
           monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul",
                              "ago","sep","oct","nov","dic" ]
    } ;

    constructor(public objetoService : PuestoCicloService,
      public cicloService: CicloService,
      public centroFisicoService: CentroFisicoService,
      public servicioService: ServicioService,
      public equipoService: EquipoService,
      public puestoService: PuestoService,
      public turnoService: TurnoService ) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se crea tipo.
      this.gridOptions2 = <GridOptions>{};
      // Se definen columnas.
      this.gridOptions2.columnDefs = this.createDetailColumnDefs();
      // 23-12-2016 Configuración de visualización.
      this.gridOptions2.enableFilter = false ;
      this.gridOptions2.enableSorting = false ;
      this.gridOptions2.enableColResize = false ;
      // Se desactiva opción de eliminar columnas.
      this.gridOptions2.suppressDragLeaveHidesColumns = true ;
      // Se cargan los centros físicos.
      this.cargarCF() ;
      // Se cargan los ciclos.
      this.cargarCiclo() ;
      // Se cargan los turnos libres.
      this.cargarTurno() ;

    }

    public cargarTurno() {
      this.t = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.turnoService.send_data({codigo: null, activo: 'S', solo_libres: true},'recuperar')
          .subscribe (
           data => {
             this.array_t = data ;
             aux = this.createRowData(this.array_t) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.t.push({label:'Seleccione turno libre', value:null});
               for (let i = 0; i < aux.length; i++) {
                 ident = aux[i]['id'] ;
                 label = "(" + aux[i]['codigo_m'] +") " + aux[i]['descripcion_m'] ;
                 codigo = aux[i]['codigo_m'] ;
                 desc = aux[i]['descripcion_m'] ;
                 this.t.push({label:label, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    recuperar() {
      if ( this.p_sel == null ) {
           this.mensajes('error_recuperar_2') ;
      }
      else {
        this.filtro_recuperar = {puesto_id : this.p_sel['id'] } ;
        super.recuperar() ;
      }
    }

    public cargarCF() {
      this.cf = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.centroFisicoService.send_data({id: null, activo:'S'},'recuperar')
          .subscribe (
           data => {
             this.array_cf = data ;
             aux = this.createRowData(this.array_cf) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.cf.push({label:'Seleccione centro físico', value:null});
               for (let i = 0; i < aux.length; i++) {
                 ident = aux[i]['id'] ;
                 label = "(" + aux[i]['codigo'] +") " + aux[i]['descripcion'] ;
                 codigo = aux[i]['codigo'] ;
                 desc = aux[i]['descripcion'] ;
                   this.cf.push({label:label, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public onChangeCF($event) {
      // Se recupera el identificador del centro físico.
      //let cf_id = $event.value['id'] ;
      if (this.cf_sel != null) {
        // Se cargan los servicios que cuelgan del centro físico seleccionado.
        this.cargarServicio() ;
      }
    }

    public cargarServicio() {
      this.sf = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.servicioService.send_data({id: null, codigo: null, activo:'S',
                                      cf_id : this.cf_sel['id'],
                                      asig_pend : 'N'},'recuperar')
          .subscribe (
           data => {
             this.array_sf = data ;
             aux = this.createRowData(this.array_sf) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.sf.push({label:'Seleccione servicio', value:null});
               for (let i = 0; i < aux.length; i++) {
                 ident = aux[i]['id'] ;
                 label = "(" + aux[i]['codigo'] +") " + aux[i]['descripcion'] ;
                 codigo = aux[i]['codigo'] ;
                 desc = aux[i]['descripcion'] ;
                 this.sf.push({label:label, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public onChangeServicio($event) {
      // Se recupera el identificador del servicio.
      //let sf_id = $event.value['id'] ;
      if (this.sf_sel != null) {
        // Se cargan los equipos que cuelgan del servicio seleccionado.
        this.cargarEquipo() ;
      }
    }

    public cargarEquipo() {
      this.eq = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.equipoService.send_data({id: null, codigo: null, activo:'S',
                                    sf_id : this.sf_sel['id'],
                                    asig_pend : 'N'},'recuperar')
          .subscribe (
           data => {
             this.array_eq = data ;
             aux = this.createRowData(this.array_eq) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.eq.push({label:'Seleccione equipo', value:null});
               for (let i = 0; i < aux.length; i++) {
                 ident = aux[i]['id'] ;
                 label = "(" + aux[i]['codigo'] +") " + aux[i]['descripcion'] ;
                 codigo = aux[i]['codigo'] ;
                 desc = aux[i]['descripcion'] ;
                 this.eq.push({label:label, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public onChangeEquipo($event) {
      // Se recupera el identificador del servicio.
      //let sf_id = $event.value['id'] ;
      if (this.eq_sel != null) {
        // Se cargan los equipos que cuelgan del servicio seleccionado.
        this.cargarPuesto() ;
      }
    }

    public cargarPuesto() {
      this.p = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.puestoService.send_data({id: null, codigo: null, activo:'S',
                                    eq_id : this.eq_sel['id'],
                                    asig_pend : 'N'},'recuperar')
          .subscribe (
           data => {
             this.array_p = data ;
             aux = this.createRowData(this.array_p) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.p.push({label:'Seleccione puesto', value:null});
               for (let i = 0; i < aux.length; i++) {
                 ident = aux[i]['id'] ;
                 label = "(" + aux[i]['codigo'] +") " + aux[i]['descripcion'] ;
                 codigo = aux[i]['codigo'] ;
                 desc = aux[i]['descripcion'] ;
                 this.p.push({label:label, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    private cargarCicloSemanal($event) {
      if ( $event == null) { this.gridOptions2.api.setRowData([]) }
      else {

        let ciclo_id = $event.value['id'] ;
        let ret: any ;
        let estado_backend: boolean ;
        let mensaje_backend: string ;

        // Se llama a servicio de componente para recuperar información.
        this.cicloService.send_data2(ciclo_id)
            .subscribe (
               data => {
                 this.array_objetos2 = data ;
                 this.rowData2 = this.createRowData2(this.array_objetos2) ;
               },
               error => {
                 this.errorMessage = <any>error ;
                this.mensajes('error_guardar', 'Error de acceso a servidores') ;
              })
      }
    }

    private createRowData2(d:any) : any {
        return d["data"];
    }

    exportarCSV2() {
      let params = {
        fileName : this.nombre_fichero_csv2
      }

      this.gridOptions2.api.exportDataAsCsv(params);
    }

    public createDetailColumnDefs() {
        return [{ headerName: "Semana", field: "semana", width: 80, cellStyle: {'text-align': 'center'} },
                { headerName: "L", field: "lunes", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "M", field: "martes", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "X", field: "miercoles", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "J", field: "jueves", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "V", field: "viernes", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "S", field: "sabado",  width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "D", field: "domingo", width: 50, cellStyle: {'text-align': 'center'} }
        ];
    }

    insertarFila() {
      if ( this.ciclo_sel == null || this.p_sel == null || this.t_sel == null ||
           this.fecha_desde == null || this.fecha_hasta == null) {
           this.mensajes('error_guardar_filas') ;
      }
      else {
        let nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
      }
    }

    public cargarCiclo() {
      this.ciclo = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables para recoger datos del combo.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

      // Filtro de recuperación.
      let filtro_recuperar = {id_ciclo:null, es_activo:'S', semana: false}

      // Se llama a servicio de componente para recuperar información.
      this.cicloService.send_data(filtro_recuperar,'recuperar')
          .subscribe (
           data => {
             this.array_ciclo = data ;
             aux = this.createRowData(this.array_ciclo) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.ciclo.push({label:'Seleccione ciclo', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   desc = aux[i]['descripcion_m'] ;
                   codigo = aux[i]['codigo_m'] ;
                   this.ciclo.push({label:desc, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public showDialog() {
      this.display = true;
    }

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
    public mensajes2(opcion: string): any {
      // Método para incluir nuevos mensajes.

      let ret = false ;
      let severity: string ;
      let summary:string ;
      let mensaje: string ;

      if (opcion == 'error_recuperar_2') {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero un puesto de trabajo para recuperar sus ciclos asociados" ;
      }

      if (opcion == 'error_fechas2') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero una fecha" ;
      }

      if (opcion == 'error_fechas3') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "La fecha Desde tiene que ser menor o igual a la fecha Hasta" ;
      }

      if (opcion == "error_guardar_filas") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Seleccione primero el puesto, ciclo, fecha desde y fecha hasta.' +
                  ' Además seleccione un turno libre del combo por si se tuvieran que' +
                  ' incluir libres en días festivos.' ;
      }

      return [ret, severity, summary, mensaje] ;
    }

    public validaciones(modelo: any): any {
      // Bandera de estado.
      let ret = true ;

      // Bolsa de filas nuevas.
      let bolsa: any [] = [] ;

      // Se itera por los nodos del modelo, para verificar que los datos son
      // correctos. Además se seleccionan las filas nuevas para ser devueltas
      // al backend.
      modelo.forEachNode(function(nodo_fila) {
        // ALGG 23-12-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       p_id : nodo_fila.data.p_id,
                       p_desc: nodo_fila.data.p_desc,
                       ciclo_id: nodo_fila.data.ciclo_id,
                       ciclo_desc: nodo_fila.data.ciclo_desc,
                       finicio: nodo_fila.data.finicio,
                       ffin: nodo_fila.data.ffin,
                       semana: nodo_fila.data.semana,
                       observ: nodo_fila.data.observ,
                       libre_id: nodo_fila.data.libre_id}) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      let ciclo_id = this.ciclo_sel['id'] ;
      let ciclo_desc = this.ciclo_sel['name'] ;

      let p_id = this.p_sel['id'] ;
      let p_desc = this.p_sel['code'] ;

      let partes_fecha = this.fecha_desde.split('/') ;
      let fecha_d = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;

      partes_fecha = this.fecha_hasta.split('/') ;
      let fecha_h = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;

      let nuevaFila = {
        id : 0,
        p_id : p_id,
        p_desc: p_desc,
        ciclo_id: ciclo_id,
        ciclo_desc: ciclo_desc,
        finicio: fecha_d,
        ffin: fecha_h,
        semana: this.sem,
        observ: "",
        libre_id: this.t_sel['id']
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "p_id", field: "p_id",  hide: true, width: 100 },
            { headerName: "Puesto", field: "p_desc", hide: true, width: 400 },
            { headerName: "ciclo_id", field: "ciclo_id", hide: true, width: 100 },
            { headerName: "Ciclo", field: "ciclo_desc", width: 400 },
            { headerName: "Desde", field: "finicio", width: 120,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "Hasta", field: "ffin", width: 120,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "Semana", field: "semana", width: 100 },
            { headerName: "Observaciones", field: "observ", width: 350, editable: true },
            { headerName: "libre_id", field: "libre_id",  hide: true, width: 100 }
        ];
    }
}

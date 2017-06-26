// Componentes de Angular 2
import { Component, Input, OnChanges, SimpleChange } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';
import {OverlayPanelModule, Message } from 'primeng/primeng';


// Componentes de modelo y servicio.
import { PlanificacionDiariaService } from "./planificacion_diaria.service" ;
import { PlanificacionDiaria } from "./planificacion_diaria" ;
import { EquipoSeleccionado } from "../planilla/planilla.component" ;
import { TurnoService } from "../turno/turno.service" ;
import { Turno } from "../turno/turno" ;
import { CambioTurno } from "../cambio_turno/cambio_turno" ;
import { CambioTurnoService } from "../cambio_turno/cambio_turno.service" ;
import { ContratoSeleccionado } from "../contrato/contrato.component" ;
import { CoberturaServicio } from "../cobertura_servicio/cobertura_servicio" ;
import { CoberturaServicioService } from "../cobertura_servicio/cobertura_servicio.service" ;
import { Balance } from "../balance/balance" ;
import { BalanceService } from "../balance/balance.service" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;
import { GridOptions } from 'ag-grid/main';

// Grid.
@Component({
    selector: 'planificacion_diaria',
    templateUrl: 'app/planificacion_diaria/planificacion_diaria.html',
    providers: [ PlanificacionDiariaService, CoberturaServicioService,
                 TurnoService, CambioTurnoService, BalanceService ]
})
export class PlanificacionDiariaComponent extends GridComponent {
    // Atributos generales.
    @Input() equipoSel: EquipoSeleccionado ;
    contratoSel: ContratoSeleccionado ;
    msgs_balance : Message[] = [] ;
    gridOptions2: GridOptions ;
    rowData2: any;
    array_objetos2: CoberturaServicio[];
    gridOptions3: GridOptions ;
    rowData3: any;
    array_objetos3: Balance[];
    nombre_fichero_csv3: string = "balanceHorario_wShifts.csv" ;
    trab_sel: string = "Planificación" ;
    contrato_id: number = null ;
    descuadre: string = null ;
    fecha_cobertura: string = null ;
    dia_semana_cobertura: string = null ;

    persona_id: number = null ;

    anno: number = new Date().getFullYear() ;
    equipo_id: number = null ;

    mes: SelectItem[] ;
    mes_sel: any ;

    boton_actualizar: boolean = true ;
    no_cambiar_estado: boolean = false ;
    edicion: boolean = false ;
    display: boolean = false;
    display2: boolean = false;
    titulo:string  = "Planificación de ciclos de puestos de trabajo" ;
    tipo_visualizacion: string = "planificacion_diaria" ;
    array_objetos: PlanificacionDiaria[];
    nombre_fichero_csv: string = "planilla_wShifts.csv" ;

    array_turno: Turno[] ;
    turno: SelectItem[] ;
    turno_sel: string ;

    constructor(public objetoService : PlanificacionDiariaService,
      public turnoService: TurnoService,
      public cambioTurnoService: CambioTurnoService,
      public coberturaServicioService: CoberturaServicioService,
      public balanceService: BalanceService ) {

      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se cargan los meses del año.
      this.cargarMes() ;
      // Se cargan los turnos y las ausencias de los combos... oh la lá..
      this.cargarTurno() ;
      // Configuración de grid de coberturas.
      this.gridOptions2 = <GridOptions>{};
      // Se definen columnas.
      this.gridOptions2.columnDefs = this.createDetailColumnDefs();
      // 20-11-2016 Configuración de visualización.
      this.gridOptions2.enableFilter = false ;
      this.gridOptions2.enableSorting = false ;
      this.gridOptions2.enableColResize = false ;
      // Se desactiva opción de eliminar columnas.
      this.gridOptions2.suppressDragLeaveHidesColumns = true ;
      // Y además oculto la cebecera...
      this.gridOptions2.headerHeight = 0 ;
      // Configuración de grid de balance horario.
      this.gridOptions3 = <GridOptions>{};
      // Se definen columnas.
      this.gridOptions3.columnDefs = this.createBalanceColumnDefs();
      // Configuración de visualización.
      this.gridOptions3.enableFilter = false ;
      this.gridOptions3.enableSorting = false ;
      this.gridOptions3.enableColResize = false ;
      // Se desactiva opción de eliminar columnas.
      this.gridOptions3.suppressDragLeaveHidesColumns = true ;
    }

    balance() {
      if (this.mes_sel == null || this.anno == null || this.persona_id == null) {
        this.gridOptions3.api.setRowData([]) ;
        this.mensajes('error_buscar_balance') ;
        return ;
      }
      let mes = this.mes_sel['code'] + 1 ;
      let anno = this.anno ;
      let persona_id = this.persona_id ;

      console.log(mes + " " + " " + anno + " " + persona_id) ;

      // Se llama a servicio de componente para recuperar información.
      this.balanceService.send_data({mes: mes, anno : anno,
                                     persona_id : persona_id,
                                     fecha_inicio : null, fecha_fin : null,
                                     cf_id : null, sf_id : null, eq_id : null,
                                     p_id : null}, 'recuperar')
          .subscribe (
            data => {
              this.array_objetos3 = data ;
              this.rowData3 = this.createRowData3(this.array_objetos3) ;
              console.log(data) ;
            },
            error => {
              this.errorMessage = <any>error ;
              this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    private createRowData3(d:any) : any {
        return d["data"];
    }

    exportarCSV3() {
      let params = {
        fileName : this.nombre_fichero_csv3
      }

      this.gridOptions3.api.exportDataAsCsv(params);
    }

    public createBalanceColumnDefs() {

      return [
          { headerName: "Año", field: "anno", width: 70 },
          { headerName: "Mes", field: "mes", width: 150 },
          { headerName: "Centro físico", field: "cf", width: 100 },
          { headerName: "Servicio", field: "sf", width: 100 },
          { headerName: "Equipo", field: "eq", width: 100 },
          { headerName: "Puesto", field: "p", width: 200 },
          { headerName: "Horas", field: "horas", width: 70 }
      ];
    }

    public createDetailColumnDefs() {

      var ayuda = function(params) {
        if (params.value == null) { return params.value }
        return params.value['presencias'] ;
      } ;

      var color = function(params) {
        if (params.value == null) { return {'text-align': 'center', backgroundColor: 'white' } }
        if (+params.value['presencias'] == 0) { return {'text-align': 'center', color : 'black', backgroundColor: 'white'} }
        if (+params.value['presencias'] > 0) { return {'text-align': 'center', color : 'white', backgroundColor: 'green'} }
        if (+params.value['presencias'] < 0) { return {'text-align': 'center', color : 'white', backgroundColor: 'red'} }
      }

        return [ { headerName: "COBERTURAS", field: "dia0", width: 160,
                  cellStyle: function(params) { return {'text-align': 'center', color: 'white', backgroundColor: '10679F'} }} ,
          { headerName: "1", field: "dia1", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "2", field: "dia2", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "3", field: "dia3", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "4", field: "dia4", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "5", field: "dia5", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "6", field: "dia6", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "7", field: "dia7", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "8", field: "dia8", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "9", field: "dia9", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "10", field: "dia10", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "11", field: "dia11", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "12", field: "dia12", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "13", field: "dia13", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "14", field: "dia14", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "15", field: "dia15", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "16", field: "dia16", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "17", field: "dia17", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "18", field: "dia18", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "19", field: "dia19", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "20", field: "dia20", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "21", field: "dia21", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "22", field: "dia22", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "23", field: "dia23", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "24", field: "dia24", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "25", field: "dia25", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "26", field: "dia26", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "27", field: "dia27", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "28", field: "dia28", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "29", field: "dia29", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "30", field: "dia30", width: 41, cellRenderer: ayuda, cellStyle: color },
          { headerName: "31", field: "dia31", width: 41, cellRenderer: ayuda, cellStyle: color }
        ];
    }

    public onRowClicked($event) {
      // Se recuperan datos.
      let id = $event.node.data.contrato_id ;
      this.trab_sel = $event.node.data.titulo ;
      console.log("contrato_id = " + id) ;

      // Si no hay contrato, no se pueden gestionar ausencias.
      if ( id == null ) {
        this.boton_actualizar = true ;
        this.trab_sel = "No se ha seleccionado ningún trabajador" ;
        this.contrato_id = null ;
        this.persona_id = null ;
      }
      else {
        // Se crea el objeto del contrato seleccionado.
        this.contrato_id = id ;
        this.persona_id = $event.node.data.persona_id ;

        let contrato_seleccionado = new ContratoSeleccionado(id) ;
        // Si se está en modo lectura, no se cargan ausencias.
        if (this.edicion) { this.contratoSel = contrato_seleccionado }

        // Y se activa el botón de ausencias su ya estaba activo el botón de
        // edición.
        if (this.edicion) {this.boton_actualizar = false}
      }
    }

    public onCellClicked2($event) {
      if ( this.equipo_id == null || $event.value == null) { return }

      this.fecha_cobertura = $event.value['dia_trab']  ;
      this.dia_semana_cobertura = $event.value['dia_semana'] ;
      if (this.dia_semana_cobertura == 'L') { this.dia_semana_cobertura = 'lunes'}
      if (this.dia_semana_cobertura == 'M') { this.dia_semana_cobertura = 'martes'}
      if (this.dia_semana_cobertura == 'X') { this.dia_semana_cobertura = 'miércoles'}
      if (this.dia_semana_cobertura == 'J') { this.dia_semana_cobertura = 'jueves'}
      if (this.dia_semana_cobertura == 'V') { this.dia_semana_cobertura = 'viernes'}
      if (this.dia_semana_cobertura == 'S') { this.dia_semana_cobertura = 'sábado'}
      if (this.dia_semana_cobertura == 'D') { this.dia_semana_cobertura = 'domingo'}

      let aux = $event.value['descuadre'] ;
      if ( aux == null) { this.descuadre = "¡Necesidades del equipo cubiertas!"}
      else { this.descuadre = aux ;}  ;
      this.showDialog() ;
    }

    private onCellDoubleClicked($event) {
      let valor_celda = $event.value ;
      let celda = $event.colDef.field ;
      let id = $event.node.data.id ;
      let tarea_id = $event.node.data.tarea_id ;
      let mes = $event.node.data.mes ;
      let anno = $event.node.data.anno ;

      console.log("celda =" + celda) ;
      console.log("turno_original =" + valor_celda) ;
      console.log("fila id =" + id) ;
      console.log("tarea_id =" + tarea_id) ;
      console.log("mes =" + mes) ;
      console.log("anno =" + anno) ;

      if ( this.edicion && this.turno_sel != null) {
        if ( valor_celda == null) {
          this.mensajes("sin_planif") ;
          return ;
        }
        this.modificarTurno(celda, valor_celda, tarea_id,
                            this.turno_sel['code'], mes, anno) ;
      }
      else {
        // ALGG 04-02-2017 Se busca balance del trabajador.

        // Se muestra.
        // this.showDialog2() ;
        //this.mensajes_balance('balance') ;
      }

    }

    private modificarTurno(celda: string, valor_celda: string, tarea_id: number,
                           turno_modificado: string, mes: number, anno: number) {
      console.log("modificando el turno") ;
      // Se llama a servicio de componente para recuperar información.
      var ret: any ;
      var estado_backend: boolean ;
      var mensaje_backend: string ;

      let datos = { tarea_id: tarea_id, celda: celda,
                    turno_original: valor_celda, turno_modificado : turno_modificado,
                    mes : mes, anno : anno} ;

      // Se envían datos al backend.
      this.cambioTurnoService.send_data(datos, 'actualizar')
          .subscribe (
            data => {
              // Se recuperan los datos devueltos por el backend.
              ret = data ;
              ret = this.createRowData(ret) ;
              // Flag de estado.
              estado_backend = ret[0].estado ;
              // Mensaje del backend.
              mensaje_backend = ret[1].mensaje ;

              console.log("estado " + estado_backend) ;
              console.log("mensaje " + mensaje_backend) ;

              // Evaluamos respuesta del backend... que listo que es...
              if ( estado_backend ) {
                this.recuperar() ;
                this.no_cambiar_estado = true ;
                this.mensajes('exito_guardar') ;
              }
              else {
                this.mensajes('error_guardar', mensaje_backend) ;
              }
            },
            error => {
              this.errorMessage = <any>error ;
              this.mensajes('error_guardar', this.errorMessage.toString()) ;
            })
    }

    handleChange(e) {
      this.edicion = e.checked;
      if ( this.edicion && this.contrato_id != null) {
        // Se crea el objeto del contrato seleccionado.
        let contrato_seleccionado = new ContratoSeleccionado(this.contrato_id) ;
        this.contratoSel = contrato_seleccionado ;
        this.boton_actualizar = false ;
      }
      else {this.boton_actualizar = true}
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
      // Se detectan cambios...
      let dato: EquipoSeleccionado ;
      let equipoSel = changes['equipoSel'] ;

      // Se recuperan cambios...
      dato = equipoSel.currentValue ;
      // Si no hay nada, salimos.
      if ( dato == undefined) { return }

      // Se recupera el id, que será con lo que se busque...
      let id = dato.id;
      this.equipo_id = id ;

      console.log("[EQUIPO] Recuperando equipo con id " + dato.id) ;

      this.recuperar()
    }

    public cambiarDiasPlanilla() {
      // Mes actual.
      let mes = this.mes_sel['code'] ;
      // Año actual.
      let anno = this.anno ;
      // Día actual.
      let dia = new Date(anno, mes + 1, 0 ).getDate() ;
      // Se buscan columnas y se ocultan o visualizan dependiendo de los días
      // del mes.
      if (dia == 28) {
        // Mes de Febrero: Se ocultan días 29,30,31
        this.gridOptions.columnApi.setColumnsVisible(['dia29','dia30','dia31'], false) ;
      }
      else {
        if ( dia == 29) {
          // Mes de Febrero para año bisiesto: Se ocultan días 30,31 y se
          // visualizan del 1 al 29.
          this.gridOptions.columnApi.setColumnsVisible(['dia30','dia31'], false) ;
          this.gridOptions.columnApi.setColumnsVisible(['dia29'], true) ;
        }
        else {
          if (dia == 30) {
            // Mes de 30 días: Se oculta día 31 y se visualizan del 1 al 30.
            this.gridOptions.columnApi.setColumnsVisible(['dia31'], false) ;
            this.gridOptions.columnApi.setColumnsVisible(['dia29','dia30'], true) ;
          }
          else {
            if (dia == 31) {
              // Mes de 31 días: Se visualizan todos los días.
              this.gridOptions.columnApi.setColumnsVisible(['dia29','dia30','dia31'], true) ;
            }
          }
        }
      }
    }

    public onChangeMes($event) {
        if ( this.mes_sel != null ) {
          if ( this.equipo_id == null ) {
            this.cambiarDiasPlanilla() ;
          }
          else {
            this.recuperar() ;
          }
        }
    }

    public cargarMes() {
      this.mes = [];
      let aux = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
                 "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] ;

      let desc: string ;
      let ident:number ;

      // Se rellena el combo...
      this.mes.push({label:'Seleccione mes', value:null});
      for (let i = 0; i <= 12; i++) {
        ident = i ;
        desc = aux[i] ;
        this.mes.push({label:desc, value: {'code' : i}});
      }
    }

    recuperar() {
      let equipo_id: any ;
      let mes: any ;
      let anno: any ;
      let visual: number ;

      if (( this.mes_sel == null) &&
         ( this.equipo_id == null) ) {
           this.mensajes('error_recuperar') ;
           return ;
      }

      if (( this.mes_sel == null) ||
         ( this.equipo_id == null) ) {
           return ;
      }

      if ( this.no_cambiar_estado ) {
        this.no_cambiar_estado = false ;
      }
      else {
        // ALGG 20012017 Se limpian trabajadores seleccionados y contratos.
        this.contratoSel = null ;
        this.contrato_id = null ;
        this.persona_id = null ;
        this.trab_sel = "No se ha seleccionado ningún trabajador" ;
        this.boton_actualizar = true ;
      }

      // Filtro de recuperación de datos.
      equipo_id = this.equipo_id ;
      mes = this.mes_sel['code'] + 1 ;
      anno = this.anno ;
      visual = 0 ;

      this.filtro_recuperar = {ver : visual, anno : anno, mes : mes,
                               equipo_id : equipo_id} ;

      // Se recupera.
      super.recuperar() ;

      // ALGG 21-01-2017 Se recuperan las coberturas de servicio... a ver qué
      // tal va...
      this.recuperarCoberturaServicio() ;
      // ALGG 22012017 Y se intentan incluir los días de la semana.
      this.dias_semanas() ;

      // ALGG 14012017 Se visualizan los días correctos de la planilla.
      this.cambiarDiasPlanilla() ;

    }

    private recuperarCoberturaServicio() {

      let datos = { equipo_id : this.equipo_id, mes: this.mes_sel['code'] + 1,
                     anno : this.anno } ;

      if ( this.equipo_id == null ) { this.gridOptions2.api.setRowData([]) }
      else {
        // Se llama a servicio de componente para recuperar información.
        this.coberturaServicioService.send_data(datos, 'recuperar')
            .subscribe (
              data => {
                this.array_objetos2 = data ;
                this.rowData2 = this.createRowData2(this.array_objetos2) ;
              },
              error => {
              this.errorMessage = <any>error ;
              this.mensajes('error_guardar', 'No se pudieron recuperar las coberturas de servicio') ;})
      }
    }

    private createRowData2(d:any) : any {
        return d["data"];
    }

    public showDialog() {
      this.display = true;
    }

    public showDialog2() {
      this.display2 = true;
    }

    public cargarTurno() {
      this.turno = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables para recoger texto e identificadores.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.turnoService.send_data({codigo : null, activo : 'S', solo_libres: false},'recuperar')
          .subscribe (
           data => {
             this.array_turno = data ;
             aux = this.createRowData(this.array_turno) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.turno.push({label:'Seleccione turno', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   label =  aux[i]['codigo_m'] +" (" + aux[i]['descripcion_m'] +")";
                   codigo = aux[i]['codigo_m'] ;
                   desc = aux[i]['descripcion_m'] ;
                   this.turno.push({label:label, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public mensajes2(opcion: string): any {
      // Método para incluir nuevos mensajes.

      let ret = false ;
      let severity: string ;
      let summary:string ;
      let mensaje: string ;

      if (opcion == "error_recuperar") {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Es necesario especificar año, mes y equipo para recuperar la planilla' ;
      }

      if (opcion == "error_buscar_balance") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Es necesario seleccionar un trabajador para obtener su balance horario' ;
      }

      if (opcion == "error_coberturas") {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = 'No se han podido cargar las coberturas de servicio' ;
      }
      if (opcion == "sin_planif") {
        ret = true ;
        severity = 'info' ;
        summary = 'wShifts informa:' ;
        mensaje = 'El día no está planificado, por lo que no se puede modificar el turno' ;
      }

      return [ret, severity, summary, mensaje] ;
    }

    private dias_semanas() {
      this.gridOptions.api.setColumnDefs(this.createColumnDefs()) ;
    }

    private dia_semana(opcion: number):string {
      if ( opcion == 0) { return "D" }
      if ( opcion == 1) { return "L" }
      if ( opcion == 2) { return "M" }
      if ( opcion == 3) { return "X" }
      if ( opcion == 4) { return "J" }
      if ( opcion == 5) { return "V" }
      if ( opcion == 6) { return "S" }
    }

    private poner_dias_semana(dia:number):string {
      let mes = this.mes_sel['code'] ;
      let a = this.dia_semana(new Date(this.anno, mes, dia).getDay()) ;
      return dia + "/" + a ;
    }

    public createColumnDefs() {

      var cab_template =function() {
            var eCell = document.createElement('span');
            eCell.innerHTML = '<div style="text-align:center;font-size:12px;color:#10679F">' +
                '  <div id="agResizeBar" style="width: 4px; height: 100%; float: right; cursor: col-resize;"></div>' +
                '  <div style="padding: 4px; overflow: hidden; text-overflow: ellipsis;">' +
                '    <span id="agHeaderCellLabel">' +
                '      <span id="agText"></span>' +
                '      <span id="agSortAsc"><i class="fa fa-long-arrow-down"></i></span>' +
                '      <span id="agSortDesc"><i class="fa fa-long-arrow-up"></i></span>' +
                '      <span id="agNoSort"></span>' +
                '      <span id="agFilter"><i class="fa fa-filter"></i></span>' +
                '    </span>' +
                '  </div>' +
                '</div>';

            return eCell;
        }

      var tooltipRenderer = function(params)
      {
        return '<span title="' + params.value + '">'+params.value+'</span>';
      };

      var ayuda = function(params) {
        let aux = params.colDef.field + "_aus" ;
        if (params.data[aux] == null) { return params.value }
        return '<span title="' + params.data[aux] + '">'+params.value+'</span>';
      } ;

      var color = function(params) {
          let aux = params.colDef.field + "_aus" ;
        if (params.data[aux] == null) {
          return {'text-align': 'center', backgroundColor: 'white'}
        }
        else {
          return {'text-align': 'center', backgroundColor: 'yellow'}
        }
      }

      let dia1 = "1" ;
      let dia2 = "2" ;
      let dia3 = "3" ;
      let dia4 = "4" ;
      let dia5 = "5" ;
      let dia6 = "6" ;
      let dia7 = "7" ;
      let dia8 = "8" ;
      let dia9 = "9" ;
      let dia10 = "10" ;
      let dia11 = "11" ;
      let dia12 = "12" ;
      let dia13 = "13" ;
      let dia14 = "14" ;
      let dia15 = "15" ;
      let dia16 = "16" ;
      let dia17 = "17" ;
      let dia18 = "18" ;
      let dia19 = "19" ;
      let dia20 = "20" ;
      let dia21 = "21" ;
      let dia22 = "22" ;
      let dia23 = "23" ;
      let dia24 = "24" ;
      let dia25 = "25" ;
      let dia26 = "26" ;
      let dia27 = "27" ;
      let dia28 = "28" ;
      let dia29 = "29" ;
      let dia30 = "30" ;
      let dia31 = "31" ;

      if ( this.mes_sel != null ) {
          dia1 = this.poner_dias_semana(1) ;
          dia2 = this.poner_dias_semana(2) ;
          dia3 = this.poner_dias_semana(3) ;
          dia4 = this.poner_dias_semana(4) ;
          dia5 = this.poner_dias_semana(5) ;
          dia6 = this.poner_dias_semana(6) ;
          dia7 = this.poner_dias_semana(7) ;
          dia8 = this.poner_dias_semana(8) ;
          dia9 = this.poner_dias_semana(9) ;
          dia10 = this.poner_dias_semana(10) ;
          dia11 = this.poner_dias_semana(11) ;
          dia12 = this.poner_dias_semana(12) ;
          dia13 = this.poner_dias_semana(13) ;
          dia14 = this.poner_dias_semana(14) ;
          dia15 = this.poner_dias_semana(15) ;
          dia16 = this.poner_dias_semana(16) ;
          dia17 = this.poner_dias_semana(17) ;
          dia18 = this.poner_dias_semana(18) ;
          dia19 = this.poner_dias_semana(19) ;
          dia20 = this.poner_dias_semana(20) ;
          dia21 = this.poner_dias_semana(21) ;
          dia22 = this.poner_dias_semana(22) ;
          dia23 = this.poner_dias_semana(23) ;
          dia24 = this.poner_dias_semana(24) ;
          dia25 = this.poner_dias_semana(25) ;
          dia26 = this.poner_dias_semana(26) ;
          dia27 = this.poner_dias_semana(27) ;
          dia28 = this.poner_dias_semana(28) ;
          dia29 = this.poner_dias_semana(29) ;
          dia30 = this.poner_dias_semana(30) ;
          dia31 = this.poner_dias_semana(31) ;
      }

        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "mes", field: "mes", hide: true, width: 100 },
            { headerName: "anno", field: "anno", hide: true, width: 400 },
            { headerName: "contrato_id", field: "contrato_id", hide: true, width: 100 },
            { headerName: "puesto_id", field: "puesto_id",  hide: true, width: 100 },
            { headerName: "puesto_cod", field: "puesto_cod", hide:true, width: 400 },
            { headerName: "Puesto", headerCellTemplate: cab_template, field: "puesto_desc", width: 70, cellRenderer: tooltipRenderer },
            { headerName: "Trabajador", headerCellTemplate: cab_template, field: "nombre_completo",  width: 90, cellRenderer: tooltipRenderer },
            { headerName: "persona_id", field: "persona_id", hide: true, width: 90 },
            { headerName: "fecha_inicio", field: "fecha_inicio", hide:true, width: 200 },
            { headerName: "ciclo_master_id", field: "ciclo_master_id", hide:true, width: 200 },
            { headerName: "fecha_fin", field: "fecha_fin", hide:true, width: 200 },
            { headerName: "total_dias", field: "total_dias", hide:true, width: 200 },
            { headerName: "Sem.", field: "semana", width:40, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "tarea_id", field: "tarea_id", width:40, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: dia1, headerCellTemplate: cab_template, field: "dia1", width: 41, cellRenderer: ayuda,cellStyle: color },
            { headerName: dia2, headerCellTemplate: cab_template, field: "dia2", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia3, headerCellTemplate: cab_template, field: "dia3", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia4, headerCellTemplate: cab_template, field: "dia4", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia5, headerCellTemplate: cab_template, field: "dia5", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia6, headerCellTemplate: cab_template, field: "dia6", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia7, headerCellTemplate: cab_template, field: "dia7", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia8, headerCellTemplate: cab_template, field: "dia8", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia9, headerCellTemplate: cab_template, field: "dia9", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia10, headerCellTemplate: cab_template, field: "dia10", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia11, headerCellTemplate: cab_template, field: "dia11", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia12, headerCellTemplate: cab_template, field: "dia12", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia13, headerCellTemplate: cab_template, field: "dia13", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia14, headerCellTemplate: cab_template, field: "dia14", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia15, headerCellTemplate: cab_template, field: "dia15", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia16, headerCellTemplate: cab_template, field: "dia16", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia17, headerCellTemplate: cab_template, field: "dia17", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia18, headerCellTemplate: cab_template, field: "dia18", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia19, headerCellTemplate: cab_template, field: "dia19", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia20, headerCellTemplate: cab_template, field: "dia20", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia21, headerCellTemplate: cab_template, field: "dia21", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia22, headerCellTemplate: cab_template, field: "dia22", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia23, headerCellTemplate: cab_template, field: "dia23", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia24, headerCellTemplate: cab_template, field: "dia24", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia25, headerCellTemplate: cab_template, field: "dia25", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia26, headerCellTemplate: cab_template, field: "dia26", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia27, headerCellTemplate: cab_template, field: "dia27", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia28, headerCellTemplate: cab_template, field: "dia28", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia29, headerCellTemplate: cab_template, field: "dia29", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia30, headerCellTemplate: cab_template, field: "dia30", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: dia31, headerCellTemplate: cab_template, field: "dia31", width: 41, cellRenderer: ayuda, cellStyle: color },
            { headerName: "1", field: "dia1_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "2", field: "dia2_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "3", field: "dia3_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "4", field: "dia4_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "5", field: "dia5_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "6", field: "dia6_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "7", field: "dia7_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "8", field: "dia8_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "9", field: "dia9_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "10", field: "dia10_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "11", field: "dia11_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "12", field: "dia12_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "13", field: "dia13_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "14", field: "dia14_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "15", field: "dia15_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "16", field: "dia16_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "17", field: "dia17_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "18", field: "dia18_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "19", field: "dia19_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "20", field: "dia20_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "21", field: "dia21_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "22", field: "dia22_aus", width: 41 ,hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "23", field: "dia23_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "24", field: "dia24_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "25", field: "dia25_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "26", field: "dia26_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "27", field: "dia27_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "28", field: "dia28_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "29", field: "dia29_aus", width: 41, hide:true,  cellStyle: {'text-align': 'center'} },
            { headerName: "30", field: "dia30_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} },
            { headerName: "31", field: "dia31_aus", width: 41, hide:true, cellStyle: {'text-align': 'center'} }
        ];
    }
}

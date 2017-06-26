// Componentes de Angular 2
import { Component, Input, OnChanges, SimpleChange } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';
import {OverlayPanelModule} from 'primeng/primeng';

// Componentes de ag-grid para edición de celdas.
//import { StringEditorComponent } from '../grid-utils/editor.component' ;

// Componentes de modelo y servicio.
import { PlanificacionService } from "./planificacion.service" ;
import { Planificacion } from "./planificacion" ;
import { PuestoCicloService } from "../puesto_ciclo/puesto_ciclo.service" ;
import { PuestoCiclo } from "../puesto_ciclo/puesto_ciclo" ;
import { CentroFisicoService } from "../centro_fisico/centro_fisico.service" ;
import { CentroFisico } from "../centro_fisico/centro_fisico" ;
import { ServicioService } from "../servicio/servicio.service" ;
import { Servicio } from "../servicio/servicio" ;
import { EquipoService } from "../equipo/equipo.service" ;
import { Equipo } from "../equipo/equipo" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'planificacion',
    templateUrl: 'app/planificacion/planificacion.html',
    providers: [ PuestoCicloService, PlanificacionService, CentroFisicoService,
                 ServicioService, EquipoService ]
})
export class PlanificacionComponent extends GridComponent {
    // Atributos generales.
    array_puestoCiclo: PuestoCiclo[] ;
    puestoCiclo: SelectItem[] ;
    puestoCiclo_sel: string ;
    anno: number = new Date().getFullYear() ;

    ver_planilla: SelectItem[] ;
    ver_planilla_sel: any ;

    array_cf: CentroFisico[] ;
    cf: SelectItem[] ;
    cf_sel: string ;

    array_sf: Servicio[] ;
    sf: SelectItem[] ;
    sf_sel: string ;

    array_eq: Equipo[] ;
    eq: SelectItem[] ;
    eq_sel: string ;

    mes: SelectItem[] ;
    mes_sel: any ;

    display: boolean = false;
    titulo:string  = "Planificación de ciclos de puestos de trabajo" ;
    tipo_visualizacion: string = "estatica" ;
    array_objetos: Planificacion[];
    nombre_fichero_csv: string = "planificacion_wShifts.csv" ;

    constructor(public objetoService : PlanificacionService,
      public puestoCicloService: PuestoCicloService,
      public centroFisicoService: CentroFisicoService,
      public servicioService: ServicioService,
      public equipoService: EquipoService ) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se cargan los meses del año.
      this.cargarMes() ;
      // Se cargan los centros físicos.
      this.cargarCF() ;
      // Se cargan opciones de ver planilla por tramos o completa.
     this.cargarVerPlanilla() ;
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
          if ( this.eq_sel == null ) {
            this.cambiarDiasPlanilla() ;
          }
          else {
            this.recuperar() ;
          }
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

    public cargarVerPlanilla() {
      this.ver_planilla = [];
      let aux = ["Por tramos", "Completo"] ;

      let desc: string ;
      let ident:number ;

      // Se rellena el combo...
      this.ver_planilla.push({label:'Seleccione visualización', value:null});
      for (let i = 0; i <= 2; i++) {
        ident = i ;
        desc = aux[i] ;
        this.ver_planilla.push({label:desc, value: i});
      }
    }

    recuperar() {
      let equipo_id: any ;
      let mes: any ;
      let anno: any ;
      let visual: number ;

      if (( this.mes_sel == null) ||
         ( this.eq_sel == null) ) {
           this.mensajes('error_recuperar') ;
           return ;
      }

      if (( this.ver_planilla_sel == null )) {
           this.mensajes('error_recuperar3') ;
           return ;
      }

      // Filtro de recuperación de datos.
      equipo_id = this.eq_sel['id'] ;
      mes = this.mes_sel['code'] + 1 ;
      anno = this.anno ;
      visual = this.ver_planilla_sel ;

      this.filtro_recuperar = {ver : visual, anno : anno, mes : mes,
                               equipo_id : equipo_id} ;

      //console.log("Recuperando puesto " + equipo_id + " para año/mes = " + anno + "/" + mes) ;
      super.recuperar() ;

      // ALGG 22012017 Y se intentan incluir los días de la semana.
      this.dias_semanas() ;

      // ALGG 10012017 Se visualizan los días correctos de la planilla.
      this.cambiarDiasPlanilla() ;

    }

    public showDialog() {
      this.display = true;
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
        mensaje = 'Es necesario especificar año, mes y equipo para recuperar las planificaciones de sus puestos' ;
      }

      if (opcion == "error_recuperar3") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Seleccione tipo de visualización: "Por tramos" visualiza puesto por ciclo ; "Completo" visualiza todo el mes por puesto en una única línea' ;
      }
      if (opcion == "error_planif1") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Es necesario seleccionar un turno libre que podría ser utilizado en la planificación' ;
      }

      if (opcion == "error_planif2") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Es necesario seleccionar un equipo al que planificarle los puestos de trabajo' ;
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
      var cab_template =function(params) {
          //let id: string = params.column.colId.substring(2) ;
          try {
              let id: string = params.value ;
              console.log(id) ;

          }
          catch(Error) {}
          //if (this.mes_sel != undefined) {
          //  console.log(this.mes_sel['code']) ;
          //}

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
            { headerName: "festivos", field: "festivos",  hide: true, width: 100 },
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "mes", field: "mes", hide: true, width: 100 },
            { headerName: "anno", field: "anno", hide: true, width: 400 },
            { headerName: "puesto_id", field: "puesto_id",  hide: true, width: 100 },
            { headerName: "puesto_cod", field: "puesto_cod", hide:true, width: 400 },
            { headerName: "Puesto", field: "puesto_desc", width: 120 },
            { headerName: "fecha_inicio", field: "fecha_inicio", hide:true, width: 200 },
            { headerName: "ciclo_master_id", field: "ciclo_master_id", hide:true, width: 200 },
            { headerName: "fecha_fin", field: "fecha_fin", hide:true, width: 200 },
            { headerName: "total_dias", field: "total_dias", hide:true, width: 200 },
            { headerName: "Sem.", field: "semana", width:40, cellStyle: {'text-align': 'center'} },
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
            { headerName: dia31, headerCellTemplate: cab_template, field: "dia31", width: 41, cellRenderer: ayuda, cellStyle: color }
        ];
    }
}

// Componentes de Angular 2
import { Component, Input, OnChanges, SimpleChange } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';
import {OverlayPanelModule} from 'primeng/primeng';

// Componentes de modelo y servicio.
import { BalanceService } from "./balance.service" ;
import { Balance } from "./balance" ;
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
    selector: 'balance',
    templateUrl: 'app/balance/balance.html',
    providers: [ PuestoCicloService, BalanceService, CentroFisicoService,
                 ServicioService, EquipoService ]
})
export class BalanceComponent extends GridComponent {
    // Atributos generales.
    array_puestoCiclo: PuestoCiclo[] ;
    puestoCiclo: SelectItem[] ;
    puestoCiclo_sel: string ;
    anno: number = new Date().getFullYear() ;

    //ver_planilla: SelectItem[] ;
    //ver_planilla_sel: any ;
    desglose: boolean = false ;
    array_cf: CentroFisico[] ;
    cf: SelectItem[] ;
    cf_sel: string ;
    selectedType: string = 'eq';
    types: SelectItem[];
    array_sf: Servicio[] ;
    sf: SelectItem[] ;
    sf_sel: string ;

    array_eq: Equipo[] ;
    eq: SelectItem[] ;
    eq_sel: string ;

    mes: SelectItem[] ;
    mes_sel: any ;

    display: boolean = false;
    titulo:string  = "Balance horario de trabajadores" ;
    tipo_visualizacion: string = "estatica" ;
    array_objetos: Balance[];
    nombre_fichero_csv: string = "balanceHorario_wShifts.csv" ;

    constructor(public objetoService : BalanceService,
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
      //this.cargarVerPlanilla() ;

      // Se cargan opciones de cálculo.
      this.types = [];
      this.types.push({label: 'Centro físico', value: 'cf'});
      this.types.push({label: 'Servicio', value: 'sf'});
      this.types.push({label: 'Equipo', value: 'eq'});
    }

    clear() {
            this.selectedType = 'eq';
    }

    calcularBalance() {
      this.recuperar() ;
    }

    handleChangeDesglose(e) {
      this.desglose = e.checked;
      /*if ( this.edicion && this.contrato_id != null) {
        // Se crea el objeto del contrato seleccionado.
        let contrato_seleccionado = new ContratoSeleccionado(this.contrato_id) ;
        this.contratoSel = contrato_seleccionado ;
        this.boton_actualizar = false ;
      }
      else {this.boton_actualizar = true}
      */
    }

    public onChangeMes($event) {
        if ( this.mes_sel != null ) {
          if ( this.eq_sel == null ) {
            //this.cambiarDiasPlanilla() ;
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

    recuperar() {
      let mes: any = null ;
      let anno: any = null ;
      let eq_id: any = null ;
      let sf_id: any = null ;
      let cf_id: any = null ;

      if (this.selectedType == 'cf' && this.cf_sel != null) {
        // Se recupera por centro físico.
        cf_id = this.cf_sel['id'] ;
      }
      else if (this.selectedType == 'sf' && this.sf_sel != null) {
        // Se recupera por servicio funcional.
        sf_id = this.sf_sel['id'] ;
      }
      else if (this.selectedType == 'eq' && this.eq_sel != null) {
        // Se recupera por equipo de trabajo (grupo funcional).
        eq_id = this.eq_sel['id'] ;
      }
      else {
        this.mensajes('error_recuperar') ;
         return ;
      }

      // Filtro de recuperación de fechas.
      anno = this.anno ;

      this.filtro_recuperar = { mes: null, anno : anno, persona_id : null,
                                fecha_inicio : null, fecha_fin : null,
                                cf_id : cf_id, sf_id : sf_id, eq_id : eq_id,
                                p_id : null } ;

      super.recuperar() ;
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
        mensaje = 'Es necesario especificar año, centro físico, servicio y equipo para recuperar trabajadores' ;
      }

      return [ret, severity, summary, mensaje] ;
    }

    public createColumnDefs() {

      return [
          { headerName: "Centro físico", field: "cf",  width: 120 },
          { headerName: "Servicio funcional", field: "sf", width: 120 },
          { headerName: "Equipo de trabajo", field: "eq", width: 150 },
          { headerName: "Puesto", field: "p", width: 150 },
          { headerName: "Trabajador", field: "trabajador", width: 300 },
          { headerName: "Año", field: "anno", width: 70 },
          { headerName: "Mes", field: "mes", width: 100 },
          { headerName: "Total horas mes", field: "horas", width: 150 },
          { headerName: "Balance", field: "balance", width: 100 },
      ];
    }
}

import { Component, Input, OnChanges, SimpleChange  } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {MenuItem, ToolbarModule, DialogModule, InputTextModule } from 'primeng/primeng';
import {OverlayPanelModule, SelectItem, Message} from 'primeng/primeng';

// Modelo.
import { CentroFisicoService } from "../centro_fisico/centro_fisico.service" ;
import { CentroFisico } from "../centro_fisico/centro_fisico" ;
import { ServicioService } from "../servicio/servicio.service" ;
import { Servicio } from "../servicio/servicio" ;
import { EquipoService } from "../equipo/equipo.service" ;
import { Equipo } from "../equipo/equipo" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Equipo seleccionado.
export class EquipoSeleccionado {
  constructor(public id:number) { }
}

@Component({
  templateUrl: 'app/planilla/planilla.html',
  styleUrls: ["../../styles.css"],
  providers: [ CentroFisicoService, ServicioService, EquipoService ]
})
export class PlanillaComponent {
    private items: MenuItem[];
    public id: number ;
    public nombre: string;
    public dni: string ;
    public ape1: string ;
    public ape2: string ;
    public persona: string ;
    public equipoSel: EquipoSeleccionado ;
    public visualizar_disabled: boolean = true ;

    errorMessage: string;
    msgs : Message[] = [] ;

    array_cf: CentroFisico[] ;
    cf: SelectItem[] ;
    cf_sel: string ;

    array_sf: Servicio[] ;
    sf: SelectItem[] ;
    sf_sel: string ;

    array_eq: Equipo[] ;
    eq: SelectItem[] ;
    eq_sel: string ;

    constructor (public centroFisicoService: CentroFisicoService,
      public servicioService: ServicioService,
      public equipoService: EquipoService ) {
      // Se cargan los centros físicos.
      this.cargarCF() ;
    }

    public createRowData(d:any) : any {
        return d["data"];
    }

    public mensaje(opcion: string) {
      this.msgs = [] ;
      let severity: string ;
      let summary: string ;
      let detail: string ;

      if ( opcion == 'error_carga') {
        severity = 'error' ;
        summary = 'Gestor de Turnos informa:' ;
        detail = 'No se puede cargar estructura' ;
      }
      // Se lanza mensaje.
      this.msgs.push({severity, summary, detail});
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
             this.mensaje('error_carga') ;
           })
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
             this.mensaje('error_carga') ;
           })
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
              this.mensaje('error_carga') ;
          })
    }

    public onChangeEquipo($event) {
      if (this.eq_sel != null) {
        let eq_id = this.eq_sel['id'] ;
        this.equipoSel = new EquipoSeleccionado(eq_id) ;
      }
    }
}

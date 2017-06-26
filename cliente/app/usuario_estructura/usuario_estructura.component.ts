// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { UsuarioEstructuraService } from "./usuario_estructura.service" ;
import { UsuarioEstructura } from "./usuario_estructura" ;
import { CentroFisicoService } from "../centro_fisico/centro_fisico.service" ;
import { CentroFisico } from "../centro_fisico/centro_fisico" ;
import { ServicioService } from "../servicio/servicio.service" ;
import { Servicio } from "../servicio/servicio" ;
import { EquipoService } from "../equipo/equipo.service" ;
import { Equipo } from "../equipo/equipo" ;
import { UsuarioService } from "../usuario/usuario.service" ;
import { Usuario } from "../usuario/usuario" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'usuario_estructura',
    templateUrl: 'app/usuario_estructura/usuario_estructura.html',
    providers: [ UsuarioEstructuraService, CentroFisicoService, ServicioService,
                 EquipoService, UsuarioService ]
})
export class UsuarioEstructuraComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Gestión de asociación de usuarios con estructura organizativa" ;
    array_objetos: UsuarioEstructura[];
    nombre_fichero_csv: string = "usuariosEstructura_wShifts.csv" ;

    array_cf: CentroFisico[] ;
    cf: SelectItem[] ;
    cf_sel: string ;

    array_sf: Servicio[] ;
    sf: SelectItem[] ;
    sf_sel: string ;

    array_eq: Equipo[] ;
    eq: SelectItem[] ;
    eq_sel: string ;

    array_usuario: Usuario[] ;
    usuario: SelectItem[] ;
    usuario_sel: string ;

    constructor(public objetoService : UsuarioEstructuraService,
                public centroFisicoService : CentroFisicoService,
                public servicioService : ServicioService,
                public equipoService : EquipoService,
                public usuarioService : UsuarioService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se carga combo de usuario y centro físico.
      this.cargarUsuario() ;
      this.cargarCF() ;
    }

    public cargarCF() {
      this.cf = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

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
                   codigo = aux[i]['codigo']
                   desc = "(" + codigo + ") " + aux[i]['descripcion'] ;

                   this.cf.push({label:desc, value:{id:ident, name: desc, code: codigo}});
               }
             }
             else { this.cf_sel = null }
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
      //else {
      this.sf_sel = null ;
      this.eq_sel = null ;
      //}
    }

    public onChangeServicio($event) {
      // Se recupera el identificador del servicio.
      //let sf_id = $event.value['id'] ;
      if (this.sf_sel != null) {
        // Se cargan los equipos que cuelgan del servicio seleccionado.
        this.cargarEq() ;
      }
      //else {
      this.eq_sel = null ;
      //}
    }

    public cargarServicio() {
      this.sf = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

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
                   codigo = aux[i]['codigo']
                   desc = "(" + codigo + ") " + aux[i]['descripcion'] ;
                   this.sf.push({label:desc, value:{id:ident, name: desc, code: codigo}});
               }
             }
             else { this.sf_sel = null }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public cargarEq() {
      this.eq = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

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
               this.eq.push({label:'Seleccione equipo de trabajo', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   codigo = aux[i]['codigo']
                   desc = "(" + codigo + ") " + aux[i]['descripcion'] ;
                   this.eq.push({label:desc, value:{id:ident, name: desc, code: codigo}});
               }
             }
             else { this.eq_sel = null }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public cargarUsuario() {
      this.usuario = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

      // Se llama a servicio de componente para recuperar información.
      this.usuarioService.send_data({usuario: null, activo:'S'},'recuperar')
          .subscribe (
           data => {
             this.array_usuario = data ;
             aux = this.createRowData(this.array_usuario) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.usuario.push({label:'Seleccione usuario', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   codigo = aux[i]['nick']
                   desc = aux[i]['nick'] ;
                   this.usuario.push({label:desc, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    insertarFila() {
        console.log(this.sf_sel) ;
        if ( this.cf_sel == null || this.sf_sel == null ||
            this.eq_sel == null || this.usuario_sel == null) {
          this.mensajes('error_guardar_filas') ;
        }
        else {
          let nuevoElemento = this.crearNuevaFilaDatos();
          this.gridOptions.api.addItems([nuevoElemento]);
        }
    }

    recuperar() {
      this.filtro_recuperar = {usuario_id : null, cf_id : null, sf_id : null,
                               eq_id : null, activo : null } ;
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

      if (opcion == "error_guardar_filas") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Es necesario seleccionar usuario, centro físico, servicio y equipo de trabajo.' ;
      }

      return [ret, severity, summary, mensaje] ;
    }

    public validaciones(modelo: any): any {
      // Bandera de estado.
      let ret = true ;

      // Bolsa de filas nuevas.
      let bolsa: any [] = [] ;

      // se seleccionan las filas nuevas para ser devueltas al backend.
      modelo.forEachNode(function(nodo_fila) {
        // ALGG 11-02-2017 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       usuario_id : nodo_fila.data.usuario_id,
                       usuario : nodo_fila.data.usuario,
                       cf_id: nodo_fila.data.cf_id,
                       cf_cod : nodo_fila.data.cf_cod,
                       cf_desc : nodo_fila.data.cf_desc,
                       sf_id: nodo_fila.data.sf_id,
                       sf_cod : nodo_fila.data.sf_cod,
                       sf_desc : nodo_fila.data.sf_desc,
                       eq_id: nodo_fila.data.eq_id,
                       eq_cod : nodo_fila.data.eq_cod,
                       eq_desc : nodo_fila.data.eq_desc,
                       observ : nodo_fila.data.observ,
                       activo : nodo_fila.data.activo
                       }) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      let cf_id = this.cf_sel['id'] ;
      let cf_cod = this.cf_sel['code'] ;
      let cf_desc = this.cf_sel['name'] ;

      let sf_id = this.sf_sel['id'] ;
      let sf_cod = this.sf_sel['code'] ;
      let sf_desc = this.sf_sel['name'] ;

      let eq_id = this.eq_sel['id'] ;
      let eq_cod = this.eq_sel['code'] ;
      let eq_desc = this.eq_sel['name'] ;

      let usuario_id = this.usuario_sel['id'] ;
      let usuario = this.usuario_sel['name'] ;

      let nuevaFila = {
        id : 0,
        usuario_id : usuario_id,
        usuario: usuario,
        cf_id : cf_id,
        cf_cod: cf_cod,
        cf_desc: cf_desc,
        sf_id : sf_id,
        sf_cod: sf_cod,
        sf_desc: sf_desc,
        eq_id : eq_id,
        eq_cod: eq_cod,
        eq_desc: eq_desc,
        observ: "",
        activo: 'S'
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "usuario_id", field: "usuario_id", hide: true, width: 120 },
            { headerName: "Usuario", field: "usuario", width: 120 },
            { headerName: "cf_id", field: "cf_id", width: 100, hide: true },
            { headerName: "Cód. CF", field: "cf_cod", width: 100, hide: true },
            { headerName: "Centro físico", field: "cf_desc", width: 300 },
            { headerName: "sf_id", field: "sf_id", width: 100, hide: true },
            { headerName: "Cód. Serv.", field: "sf_cod", width: 200, hide: true  },
            { headerName: "Servicio", field: "sf_desc", width: 300 },
            { headerName: "eq_id", field: "eq_id", width: 100, hide: true },
            { headerName: "Cód. Eq.", field: "eq_cod", width: 100, hide: true },
            { headerName: "Equipo", field: "eq_desc", width: 300 },
            { headerName: "Observaciones", field: "observ", width: 300, editable: true },
            { headerName: "Activo", field: "activo", cellEditor : "select",
              cellEditorParams : {values: ['S','N']}, editable: true,  width: 100 }
        ];
    }
}

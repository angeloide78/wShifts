// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { JornadaTeoricaService } from "./jornada_teorica.service" ;
import { JornadaTeorica } from "./jornada_teorica" ;
import { CentroFisicoService } from "../centro_fisico/centro_fisico.service" ;
import { CentroFisico } from "../centro_fisico/centro_fisico" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'jornada_teorica',
    templateUrl: 'app/jornada_teorica/jornada_teorica.html',
    providers: [ JornadaTeoricaService, CentroFisicoService ]
})
export class JornadaTeoricaComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Gestión de jornadas teóricas" ;
    array_objetos: JornadaTeorica[];
    nombre_fichero_csv: string = "jornadaTeorica_wShifts.csv" ;

    array_cf: CentroFisico[] ;
    cf: SelectItem[] ;
    cf_sel: string ;

    anno: number = new Date().getFullYear() ;

    constructor(public objetoService : JornadaTeoricaService,
                public centroFisicoService : CentroFisicoService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se cargan combos.
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
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    insertarFila() {
        if ( this.cf_sel == null) {
          this.mensajes('error_guardar_filas') ;
        }
        else {
          let nuevoElemento = this.crearNuevaFilaDatos();
          this.gridOptions.api.addItems([nuevoElemento]);
        }
    }

    recuperar() {
      let aux: number ;

      //if ( this.cf_sel != null) { aux = this.cf_sel['id'] }
      //else { aux = null }

      this.filtro_recuperar = { cf_id : null, anno: null } ;
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
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Es necesario seleccionar un centro físico.' ;
      }

      if (opcion == "error_cf_sel") {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Seleccione primero un centro físico del combo.' ;
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
        // ALGG 22-12-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       cf_id: nodo_fila.data.cf_id,
                       cf_cod: nodo_fila.data.cf_cod,
                       cf_desc: nodo_fila.data.cf_desc,
                       anno: nodo_fila.data.anno,
                       total_horas_anual: nodo_fila.data.total_horas_anual,
                       observaciones: nodo_fila.data.observaciones
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

      let nuevaFila = {
        id : 0,
        cf_id : cf_id,
        cf_cod: cf_cod,
        cf_desc: cf_desc,
        anno: this.anno,
        total_horas_anual: 0,
        observaciones: ''
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            //{ headerName: "id", field: "id",  width: 100 },
            { headerName: "cf_id", field: "cf_id", width: 100, hide: true },
            { headerName: "Cód. CF", field: "cf_cod", width: 100, hide: true },
            { headerName: "Desc. CF", field: "cf_desc", width: 300 },
            { headerName: "Año", field: "anno", width: 100 },
            { headerName: "Horas anuales", field: "total_horas_anual", editable: true,  width: 200 },
            { headerName: "Observaciones", field: "observaciones", editable: true,  width: 250 },

        ];
    }
}

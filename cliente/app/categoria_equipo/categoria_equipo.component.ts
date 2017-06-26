// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule, SelectItem } from 'primeng/primeng';

// Componentes de ag-grid para edición de celdas.
import { StringEditorComponent } from '../grid-utils/editor.component' ;

// Componentes de modelo y servicio.
import { CategoriaEquipoService } from "./categoria_equipo.service" ;
import { CategoriaEquipo } from "./categoria_equipo" ;
import { EquipoService } from "../equipo/equipo.service" ;
import { Equipo } from "../equipo/equipo" ;
import { CategoriaProfesionalService } from "../categoria_profesional/categoria_profesional.service" ;
import { CategoriaProfesional } from "../categoria_profesional/categoria_profesional" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'categoria_equipo',
    templateUrl: 'app/categoria_equipo/categoria_equipo.html',
    providers: [ CategoriaEquipoService, CategoriaProfesionalService,
                 EquipoService ]
})
export class CategoriaEquipoComponent extends GridComponent {
    // Atributos generales.
    array_eq: Equipo[] ;
    eq: SelectItem[] ;
    eq_sel: string ;

    array_cp: CategoriaProfesional[] ;
    cp: SelectItem[] ;
    cp_sel: string ;

    display: boolean = false;
    titulo:string  = "Gestión de relación entre equipos y categorías profesionales" ;
    array_objetos: CategoriaEquipo[];
    nombre_fichero_csv: string = "equipoCategorias_wShifts.csv" ;

    constructor(public objetoService : CategoriaEquipoService,
                public categoriaProfesionalServive : CategoriaProfesionalService,
                public equipoService : EquipoService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // ALGG 14-01-2017 Filtro de recuperación.
      this.filtro_recuperar = { eq_id : null, cat_id : null }
      // ... y se cargan datos en los combos de equipos y categorías...
      this.cargarCP() ;
      this.cargarEquipo() ;
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
                                    sf_id : null, asig_pend: 'N'},'recuperar')
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

    public cargarCP() {
      this.cp = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.categoriaProfesionalServive.send_data({id_: null, activo:'S'},'recuperar')
          .subscribe (
           data => {
             this.array_cp = data ;
             aux = this.createRowData(this.array_cp) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.cp.push({label:'Seleccione categoría', value:null});
               for (let i = 0; i < aux.length; i++) {
                 ident = aux[i]['id'] ;
                 label = "(" + aux[i]['codigo'] +") " + aux[i]['descripcion'] ;
                 codigo = aux[i]['codigo'] ;
                 desc = aux[i]['descripcion'] ;
                 this.cp.push({label:label, value:{id:ident, name: desc, code: codigo}});
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

    insertarFila() {
      if ( this.eq_sel == null || this.cp_sel == null) {
           this.mensajes('error_guardar_filas') ;
      }
      else {
        let nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
      }
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
        mensaje = 'Es obligatorio insertar equipo y categoría' ;
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
        // Se chequean que haya datos para celdas específicas.
        if ((nodo_fila.data.eq_id.length == 0) ||
        (nodo_fila.data.cat_id.length == 0)) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa]} ;

        // ALGG 14-01-2017 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       eq_id : nodo_fila.data.eq_id,
                       eq_cod : nodo_fila.data.eq_cod,
                       eq_desc : nodo_fila.data.eq_desc,
                       cat_id : nodo_fila.data.cat_id,
                       cat_cod : nodo_fila.data.cat_cod,
                       cat_desc : nodo_fila.data.cat_desc}) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      let eq_id = this.eq_sel['id'] ;
      let eq_cod = this.eq_sel['code'] ;
      let eq_desc = this.eq_sel['name'] ;
      let cp_id = this.cp_sel['id'] ;
      let cp_cod = this.cp_sel['code'] ;
      let cp_desc = this.cp_sel['name'] ;

      let nuevaFila = {
        id : 0,
        eq_id : eq_id,
        eq_cod : eq_cod,
        eq_desc : eq_desc,
        cat_id : cp_id,
        cat_cod : cp_cod,
        cat_desc : cp_desc
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "eq_id", field: "eq_id",  hide: true, width: 100 },
            { headerName: "Código Equipo", field: "eq_cod", width: 130 },
            { headerName: "Descripción Equipo", field: "eq_desc", width: 300 },
            { headerName: "cat_id", field: "cat_id",  hide: true, width: 100 },
            { headerName: "Cód. Categ.", field: "cat_cod", width: 130 },
            { headerName: "Descripción Categoría", field: "cat_desc", width: 300 }
        ];
    }
}

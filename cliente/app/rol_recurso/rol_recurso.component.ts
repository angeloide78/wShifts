// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { RolRecursoService } from "./rol_recurso.service" ;
import { RolRecurso } from "./rol_recurso" ;
import { RolService } from "../rol/rol.service" ;
import { Rol } from "../rol/rol" ;
import { RecursoService } from "../recurso/recurso.service" ;
import { Recurso } from "../recurso/recurso" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'rol_recurso',
    templateUrl: 'app/rol_recurso/rol_recurso.html',
    providers: [ RolRecursoService, RolService, RecursoService ]
})
export class RolRecursoComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Gestión de asociación entreroles y recursos de la aplicación" ;
    array_objetos: RolRecurso[];
    nombre_fichero_csv: string = "rolRecurso_wShifts.csv" ;

    array_rol: Rol[] ;
    rol: SelectItem[] ;
    rol_sel: string ;

    array_recurso: Recurso[] ;
    recurso: SelectItem[] ;
    recurso_sel: string ;

    constructor(public objetoService : RolRecursoService,
                public rolService : RolService,
                public recursoService : RecursoService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se cargan combos.
      this.cargarRol() ;
      this.cargarRecurso() ;
    }

    public cargarRol() {
      this.rol = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

      // Se llama a servicio de componente para recuperar información.
      this.rolService.send_data({codigo: null, activo:'S'},'recuperar')
          .subscribe (
           data => {
             this.array_rol = data ;
             aux = this.createRowData(this.array_rol) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.rol.push({label:'Seleccione rol', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   codigo = aux[i]['codigo']
                   desc = "(" + codigo + ") " + aux[i]['descripcion'] ;
                   this.rol.push({label:desc, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public cargarRecurso() {
      this.recurso = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

      // Se llama a servicio de componente para recuperar información.
      this.recursoService.send_data({codigo: null, activo:'S'},'recuperar')
          .subscribe (
           data => {
             this.array_recurso = data ;
             aux = this.createRowData(this.array_recurso) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.recurso.push({label:'Seleccione recurso', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   codigo = aux[i]['codigo']
                   desc = "(" + codigo + ") " + aux[i]['descripcion'] ;
                   this.recurso.push({label:desc, value:{id:ident, name: desc, code: codigo}});
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
      // ALGG 10-02-2017. Si no hay elegido rol y usuario, no se puede crear
      // la nueva relación.
      if (this.rol_sel == null || this.recurso_sel == null) {
        this.mensajes('error_insercion') ;
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

      if (opcion == "error_insercion") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Se tiene que elegir antes rol y recurso' ;
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
        // ALGG 07-02-2017 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       rol_id : nodo_fila.data.rol_id,
                       rol_desc : nodo_fila.data.rol_desc,
                       recurso_id : nodo_fila.data.recurso_id,
                       recurso_desc : nodo_fila.data.recurso_desc,
                       ejecucion : nodo_fila.data.ejecucion,
                       lectura : nodo_fila.data.lectura,
                       escritura : nodo_fila.data.escritura,
                       observaciones: nodo_fila.data.observaciones,
                       activo : nodo_fila.data.activo}) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      let rol_id = this.rol_sel['id'] ;
      let rol_desc = this.rol_sel['name']

      let recurso_id = this.recurso_sel['id'] ;
      let recurso_desc = this.recurso_sel['name'] ;

      let nuevaFila = {
        id : 0,
        rol_id: rol_id,
        rol_desc: rol_desc,
        recurso_id: recurso_id,
        recurso_desc: recurso_desc,
        ejecucion : "S",
        lectura: "S",
        escritura: "S",
        observaciones : "S",
        activo : "S"
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "rol_id", field: "rol_id",  hide: true, width: 100 },
            { headerName: "Rol", field: "rol_desc", width: 200 },
            { headerName: "recurso_id", field: "recurso_id",  hide: true, width: 100 },
            { headerName: "Recurso", field: "recurso_desc",  width: 200 },
            { headerName: "Ejecución", field: "ejecucion", cellEditor : "select",
            cellEditorParams : {values: ['S','N']}, editable: true,  width: 100 },
            { headerName: "Lectura", field: "lectura", cellEditor : "select",
            cellEditorParams : {values: ['S','N']}, editable: true,  width: 100 },
            { headerName: "Escritura", field: "escritura", cellEditor : "select",
            cellEditorParams : {values: ['S','N']}, editable: true,  width: 100 },
            { headerName: "Observaciones", field: "observaciones", width: 400,
              editable: true, celleditor: "largeText" },
            { headerName: "Activo", field: "activo", cellEditor : "select",
            cellEditorParams : {values: ['S','N']}, editable: true,  width: 100 }
        ];
    }
}

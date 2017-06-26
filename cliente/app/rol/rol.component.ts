// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { RolService } from "./rol.service" ;
import { Rol } from "./rol" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'rol',
    templateUrl: 'app/rol/rol.html',
    providers: [ RolService ]
})
export class RolComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Gestión de roles de aplicación" ;
    array_objetos: Rol[];
    nombre_fichero_csv: string = "roles_wShifts.csv" ;

    constructor(public objetoService : RolService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      this.filtro_recuperar = {codigo: null, activo:null}
    }

    public showDialog() {
      this.display = true;
    }

    insertarFila() {
      let nuevoElemento = this.crearNuevaFilaDatos();
      this.gridOptions.api.addItems([nuevoElemento]);
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
        mensaje = 'Los campos código y descripción son obligatorios' ;
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
        if ((nodo_fila.data.codigo.length == 0) ||
        (nodo_fila.data.descripcion.length == 0)) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa]} ;

        // ALGG 07-02-2017 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       codigo : nodo_fila.data.codigo,
                       descripcion : nodo_fila.data.descripcion,
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
      let nuevaFila = {
        id : 0,
        codigo : "",
        descripcion: "",
        observaciones: "",
        activo : 'S'
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "Código", field: "codigo", width: 100, editable: true },
            { headerName: "Descripción", field: "descripcion", width: 400,
              editable: true },
            { headerName: "Observaciones", field: "observaciones", width: 400,
              editable: true, celleditor: "largeText" },
            { headerName: "Activo", field: "activo", cellEditor : "select",
            cellEditorParams : {values: ['S','N']}, editable: true,  width: 100 }
        ];
    }
}

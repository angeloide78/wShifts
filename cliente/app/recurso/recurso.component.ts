// Componentes de Angular 2
import { Component, Input, OnChanges, SimpleChange } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule, InputTextModule, InputTextareaModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { RecursoService } from "./recurso.service" ;
import { Recurso } from "./recurso" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'recurso',
    templateUrl: 'app/recurso/recurso.html',
    providers: [ RecursoService ]
})
export class RecursoComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Recursos del sistema" ;
    array_objetos: Recurso[];
    nombre_fichero_csv: string = "recursos_wShifts.csv" ;

    constructor(public objetoService : RecursoService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      this.filtro_recuperar = {codigo: null, activo:null} ;
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
        mensaje = 'Los campos usuario y contraseña son obligatorios' ;
      }

      return [ret, severity, summary, mensaje] ;
    }

    public createColumnDefs() {
      return [{ headerName: "id", field: "id", hide: true, width: 100 },
              { headerName: "Código", field: "codigo", width: 100 },
              { headerName: "Descripción", field: "descripcion", width: 400 },
              { headerName: "Activo", field: "activo",
                cellEditor : "select", cellEditorParams : {values: ['S','N']}, editable: true, width: 70 },
              { headerName: "Observaciones", field: "observaciones", editable: true, width: 250 }
             ] ;
    }
}

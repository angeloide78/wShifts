// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { BasicaService } from "./basica.service" ;
import { Basica } from "./basica" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'basica',
    templateUrl: 'app/basica/basica.html',
    providers: [ BasicaService ]
})
export class BasicaComponent extends GridComponent {
    // Atributos generales.
    titulo:string  = "Gestión de datos básicos de la aplicación" ;
    array_objetos: Basica[];
    nombre_fichero_csv: string = "datosBasicos_wShifts.csv" ;
    display: boolean = false;

    constructor(public objetoService : BasicaService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
    }

    public showDialog() {
      this.display = true;
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
                       version: nodo_fila.data.cf_id,
                       revision: nodo_fila.data.cf_cod,
                       nombre: nodo_fila.data.cf_desc,
                       descripcion: nodo_fila.data.anno,
                       es_lunes_festivo: nodo_fila.data.es_lunes_festivo,
                       es_martes_festivo: nodo_fila.data.es_martes_festivo,
                       es_miercoles_festivo: nodo_fila.data.es_miercoles_festivo,
                       es_jueves_festivo: nodo_fila.data.es_jueves_festivo,
                       es_viernes_festivo: nodo_fila.data.es_viernes_festivo,
                       es_sabado_festivo: nodo_fila.data.es_sabado_festivo,
                       es_domingo_festivo: nodo_fila.data.es_domingo_festivo,
                       licencia: nodo_fila.data.licencia,
                       empresa: nodo_fila.data.empresa
                       }) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "Versión",  hide: true, field: "version", width: 100 },
            { headerName: "Aplicación",  hide: true,field: "nombre", width: 150 },
            { headerName: "Descripción",  hide: true,field: "descripcion", width: 250 },
            { headerName: "Empresa", field: "empresa", width: 200, editable: true },
            { headerName: "Lun. fest.", field: "es_lunes_festivo", width: 120,
            cellEditor : "select",
            cellEditorParams : {values: ['S','N']},
            editable: true },
            { headerName: "Mar. fest.", field: "es_martes_festivo", width: 100,
            cellEditor : "select",
            cellEditorParams : {values: ['S','N']},
            editable: true },
            { headerName: "Mié. fest.", field: "es_miercoles_festivo", width: 100,
            cellEditor : "select",
            cellEditorParams : {values: ['S','N']},
            editable: true },
            { headerName: "Jue. fest.", field: "es_jueves_festivo", width: 100,
            cellEditor : "select",
            cellEditorParams : {values: ['S','N']},
            editable: true },
            { headerName: "Vie. fest.", field: "es_viernes_festivo", width: 100,
            cellEditor : "select",
            cellEditorParams : {values: ['S','N']},
            editable: true },
            { headerName: "Sáb. fest.", field: "es_sabado_festivo", width: 100,
            cellEditor : "select",
            cellEditorParams : {values: ['S','N']},
            editable: true },
            { headerName: "Dom. fest.", field: "es_domingo_festivo", width: 100,
            cellEditor : "select",
            cellEditorParams : {values: ['S','N']},
            editable: true },
            { headerName: "Licencia", field: "licencia", width: 300, hide: true }
        ];
    }
}

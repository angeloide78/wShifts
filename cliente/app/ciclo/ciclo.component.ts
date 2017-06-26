// Componentes de Angular 2
import { Component, ViewChild } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';

// Componentes de ag-grid para edición de celdas.
// import { StringEditorComponent } from '../grid-utils/editor.component' ;

import { GridOptions } from 'ag-grid/main';

// Componentes de modelo y servicio.
import { CicloService } from "./ciclo.service" ;
import { Ciclo } from "./ciclo" ;
import { CicloSemana } from './cicloSemana' ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'ciclo',
    templateUrl: 'app/ciclo/ciclo.html',
    providers: [ CicloService ]
})

export class cicloComponent extends GridComponent {
    // Atributos generales.
    titulo:string  = "Gestión de Ciclos" ;
    array_objetos: Ciclo[];
    array_objetos2: CicloSemana[];
    nombre_fichero_csv: string = "ciclo_wShifts.csv" ;
    nombre_fichero_csv2: string = "cicloSemana_wShifts.csv" ;
    gridOptions2: GridOptions ;
    rowData2: any;
    display: boolean = false;
    horas_ciclo: number = null ;
    minutos_ciclo: number = null ;

    public showDialog() {
      this.display = true;
    }

    constructor(public objetoService : CicloService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se crea tipo.
      this.gridOptions2 = <GridOptions>{};
      // Se definen columnas.
      this.gridOptions2.columnDefs = this.createDetailColumnDefs();
      // 20-11-2016 Configuración de visualización.
      this.gridOptions2.enableFilter = false ;
      this.gridOptions2.enableSorting = false ;
      this.gridOptions2.enableColResize = false ;
      // Se desactiva opción de eliminar columnas.
      this.gridOptions2.suppressDragLeaveHidesColumns = true ;
      // ALGG 18-02-2017 Mensaje para cuando aún no se haya cargado nada en el
      // grid.
      this.gridOptions2.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Seleccione ciclo en el grid de arriba para ver su expansión semanal</span>' ;
      this.gridOptions2.overlayNoRowsTemplate = '<span style="padding: 10px; border: 2px solid #444; ' +
       ' background: lightgoldenrodyellow;">No se han encontrado datos</span>'
    }

    private onRowSelected($event) {
      // Identificador de la fila a partir del nodo.
      let datos = $event.node.data.id  ;
      let ret: any ;
      let estado_backend: boolean ;
      let mensaje_backend: string ;

      // Si se está creando no se visualiza nada, por defecto se limpia.
      if ( datos == 0) { this.gridOptions2.api.setRowData([]) }
      else {
        // Se llama a servicio de componente para recuperar información.
        this.objetoService.send_data2(datos)
            .subscribe (
              data => {
                this.array_objetos2 = data ;
                this.rowData2 = this.createRowData2(this.array_objetos2) ;
                // Incluyo las horas y minutos del ciclo.
                this.horas_ciclo = this.rowData2[0]['horas'] ;
                this.minutos_ciclo = this.rowData2[0]['minutos'] ;

              },
              error => {
              this.errorMessage = <any>error ;
              this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
      }
    }

    private createRowData2(d:any) : any {
        return d["data"];
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
        mensaje = 'Los campos código, descripción y ciclo no pueden estar vacíos y el campo código no puede tener más de 5 caracteres' ;
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
        // ALGG 20-11-2016 Se chequean que haya datos para celdas específicas.
        if ( (nodo_fila.data.codigo_m.length == 0)
        || (nodo_fila.data.codigo_m.length > 5)
        || (nodo_fila.data.descripcion_m.length == 0)
        || (nodo_fila.data.ciclo_d.length == 0) ) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa]} ;

        // ALGG 20-11-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       codigo_m : nodo_fila.data.codigo_m,
                       descripcion_m : nodo_fila.data.descripcion_m,
                       cuenta_festivo_m : nodo_fila.data.cuenta_festivo_m,
                       activo_m : nodo_fila.data.activo_m,
                       ciclo_d : nodo_fila.data.ciclo_d
                     }) ;

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
        codigo_m  : "",
        descripcion_m : "",
        cuenta_festivo_m : "N",
        activo_m : "S",
        ciclo_d : ''
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    exportarCSV2() {
      let params = {
        fileName : this.nombre_fichero_csv2
      }

      this.gridOptions2.api.exportDataAsCsv(params);
    }

    public createDetailColumnDefs() {
        return [{ headerName: "Semana", field: "semana", width: 80, cellStyle: {'text-align': 'center'} },
                { headerName: "L", field: "lunes", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "M", field: "martes", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "X", field: "miercoles", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "J", field: "jueves", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "V", field: "viernes", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "S", field: "sabado",  width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "D", field: "domingo", width: 50, cellStyle: {'text-align': 'center'} },
                { headerName: "horas", field: "horas", width: 50, hide: true, cellStyle: {'text-align': 'center'} },
                { headerName: "minutos", field: "minutos", width: 50, hide: true, cellStyle: {'text-align': 'center'} },

        ];
    }

    public createColumnDefs() {
        return [
            {  headerName: "id",
               field: "id",
               hide: true,
               width: 100,
               },

            {  headerName: "Código",
               field: "codigo_m",

               headerTooltip : "Código de ciclo",
               //cellEditorFramework: {
               //component: StringEditorComponent,
               //moduleImports: [FormsModule]
               //},
               editable: true,
               width: 100
               },

            {  headerName: "Descripción",
               field: "descripcion_m",
               headerTooltip : "Descripción de ciclo",
               //cellEditorFramework: {
               //component: StringEditorComponent,
               //moduleImports: [FormsModule]
               //},
               editable: true,
               width: 300,
               cellClassRules: {'rag-red': 'id < 1'}
            },

            {  headerName: "Festivo",
               field: "cuenta_festivo_m",
               headerTooltip : "Se tiene en cuenta festivos",
               cellEditor : "select",
               cellEditorParams : {values: ['S','N']},
               editable: true,
               width: 130
               },

            {  headerName: "Activo",
               field: "activo_m",
               cellEditor : "select",
               cellEditorParams : {values: ['S','N']},
               editable: true,
               width: 70
            },

            {  headerName: "Ciclo",
               field: "ciclo_d",
               headerTooltip : "Conjunto de turnos que se repiten entre semanas",
               width: 400,
               //cellEditorFramework: {
               //component: StringEditorComponent,
               //moduleImports: [FormsModule]
               //},
               editable: true
             }
        ];
    }
}

// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';
// Componentes de ag-grid para edición de celdas.
//import { StringEditorComponent } from '../grid-utils/editor.component' ;

// Componentes de modelo y servicio.
import { AusenciaService } from "./ausencia.service" ;
import { Ausencia } from "./ausencia" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'ausencia',
    templateUrl: 'app/ausencia/ausencia.html',
    providers: [ AusenciaService ]
})
export class AusenciaComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Gestión de tipos de ausencias" ;
    array_objetos: Ausencia[];
    nombre_fichero_csv: string = "tipoAusencias_wShifts.csv" ;
    estado_devengo: SelectItem[] ;
    estado_devengo_sel: any ;

    constructor(public objetoService : AusenciaService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      this.filtro_recuperar = {id: null, codigo: null, activo: null} ;
      // Se cargan los estados de devengo.
      this.cargarEstadoDevengo() ;
    }

    public onChangeEstadoDevengo($event) {
        if ( this.estado_devengo_sel != null ) {
          // Se definen variables para control de modificaciones.
          let oldValue: any ;
          let newValue = this.estado_devengo_sel['code'];
          let field: any = "estado_devengo" ;
          let id:any ;

          //console.log("estado_devengo_sel = ", this.estado_devengo_sel) ;

          // Nodos a actualizar.
          let nodos_a_actualizar: any[] = [] ;

          // Se inserta fecha en las filas seleccionadas.
          let filaSel = this.gridOptions.api.getSelectedNodes() ;
          filaSel.forEach( function(nodo_fecha) {
            // Nos guardamos los valores...
            oldValue = nodo_fecha.data.estado_devengo ;
            id = nodo_fecha.data.id ;
            let data_nodo = nodo_fecha.data;
            data_nodo.estado_devengo = newValue ;
            // Lo incluimos en la bolsa de nodos actualizados.
            nodos_a_actualizar.push(nodo_fecha);
          })
          // Se refresca el ag-grid...
          this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
          // Y se actualiza la estructura de control de modificación.
          this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
        }
    }

    public cargarEstadoDevengo() {
      this.estado_devengo = [];
      let aux = ['No definido',
                 'Cuenta horas en año actual y resta horas en año anterior',
                 'Cuenta horas en año actual y suma horas en año anterior',
                 'Cuenta horas en año actual y no cuenta horas en año anterior',
                 'No cuenta horas en año actual y resta horas en año anterior',
                 'No cuenta horas en año actual y suma horas en año anterior',
                 'No cuenta horas en año actual y no cuenta horas en año anterior'] ;

      let desc: string ;
      let ident: number ;

      // Se rellena el combo...
      for (let i = 0; i <= 6; i++) {
        ident = i ;
        desc = aux[i] ;
        this.estado_devengo.push({label:desc, value: {'code' : desc}});
      }
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
        mensaje = 'Los campos código y descripción son obligatorios.' ;
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

        // ALGG 02-12-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       codigo : nodo_fila.data.codigo,
                       descripcion : nodo_fila.data.descripcion,
                       cuenta_horas : nodo_fila.data.cuenta_horas,
                       cuenta_dias : nodo_fila.data.cuenta_dias,
                       max_ausencia_anual : nodo_fila.data.max_ausencia_anual,
                       activar_control_ausencia : nodo_fila.data.activar_control_ausencia,
                       forzar_ausencia : nodo_fila.data.forzar_ausencia,
                       observaciones : nodo_fila.data.observaciones,
                       activo : nodo_fila.data.activo,
                       estado_devengo: nodo_fila.data.estado_devengo}) ;

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
        cuenta_horas: 'N',
        cuenta_dias: 'N',
        max_ausencia_anual: 0,
        activar_control_ausencia: 'N',
        forzar_ausencia: 'N',
        observaciones: "",
        activo: 'S',
        estado_devengo: 'No definido'
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "Código", field: "codigo", width: 100, editable: true },
            { headerName: "Descripción", field: "descripcion", width: 200,
              editable: true },
            { headerName: "Horas", field: "cuenta_horas", cellEditor : "select",
              cellEditorParams : {values: ['S','N']}, editable: true,  width: 80 },
            { headerName: "Días", field: "cuenta_dias", cellEditor : "select",
              cellEditorParams : {values: ['S','N']}, editable: true,  width: 80 },
            { headerName: "Tope días", field: "max_ausencia_anual",
              editable: true,  width: 120 },
            { headerName: "Activar tope días", field: "activar_control_ausencia", cellEditor : "select",
              cellEditorParams : {values: ['S','N']}, editable: true,  width: 160 },
            { headerName: "Forzar aus.", field: "forzar_ausencia", cellEditor : "select",
              cellEditorParams : {values: ['S','N']}, editable: true,  width: 120 },
            { headerName: "Observaciones", field: "observaciones", width: 200,
              celleditor: "largeText", editable: true },
            { headerName: "Devengo anterior", field: "estado_devengo",
              editable: true,  width: 240 },
            { headerName: "Activo", field: "activo", cellEditor : "select",
            cellEditorParams : {values: ['S','N']}, editable: true,  width: 100 }
        ];
    }
}

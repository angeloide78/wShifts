// Componentes de Angular 2
import { Component, Input, OnChanges, SimpleChange } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';

// Componentes de ag-grid para edición de celdas.
//import { NumericEditorComponent } from '../grid-utils/editor.component' ;

// Componentes de modelo y servicio.
import { ServiciosPreviosService } from "./servicios_previos.service" ;
import { ServiciosPrevios } from "./servicios_previos" ;
import { PersonaSeleccionada } from "../buscar_persona/buscar_persona.component" ;
// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'servicios_previos',
    templateUrl: 'app/servicios_previos/servicios_previos.html',
    providers: [ ServiciosPreviosService ]
})
export class ServiciosPreviosComponent extends GridComponent {
    // Atributos generales.
    @Input() perSel: PersonaSeleccionada ;
    persona_id: number = null ;
    display: boolean = false;
    titulo:string  = "Gestión de Servicios Previos" ;
    array_objetos: ServiciosPrevios[];
    nombre_fichero_csv: string = "serviciosPrevios_wShifts.csv" ;

    constructor(public objetoService : ServiciosPreviosService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
      // Se detectan cambios...
      let dato: PersonaSeleccionada ;
      let perSel = changes['perSel'] ;

      // Se recuperan cambios...
      dato = perSel.currentValue ;
      // Si no hay nada, salimos.
      if ( dato == undefined) { return }

      // Se recupera el id, que será con lo que se busque...
      let id = dato.id;
      this.persona_id = id ;

      console.log("[SERVICIOS PREVIOS] Recuperando trabajador con DNI " + dato.dni) ;

      // Se recupera información.
      this.filtro_recuperar = { persona_id : id, anno : null }
      this.recuperar()
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
        mensaje = 'Los campos año y horas son obligatorios' ;
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
        if ((nodo_fila.data.anno.length == 0) ||
        (nodo_fila.data.horas.length == 0)) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa]} ;

        // ALGG 02-12-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       persona_id : nodo_fila.data.persona_id,
                       anno : nodo_fila.data.anno,
                       horas: nodo_fila.data.horas }) ;

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
        persona_id : this.persona_id,
        anno: new Date().getFullYear(),
        horas: 0
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id", width: 100, hide: true },
            { headerName: "persona_id", field: "persona_id",  hide: true,
              width: 100, editable: true },
            { headerName: "Año", field: "anno", width: 200, editable: true },
            { headerName: "Horas", field: "horas", width: 200, editable: true }
        ];
    }
}

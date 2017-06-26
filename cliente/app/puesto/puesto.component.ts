// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { PuestoService } from "./puesto.service" ;
import { Puesto } from "./puesto" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'puesto',
    templateUrl: 'app/puesto/puesto.html',
    providers: [ PuestoService ]
})
export class PuestoComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Gestión de puestos" ;
    array_objetos: Puesto[];
    nombre_fichero_csv: string = "puestos_wShifts.csv" ;

    constructor(public objetoService : PuestoService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
    }

    recuperar() {
      this.filtro_recuperar = {activo : null, id : null, codigo: null,
                               eq_id: null, asig_pend : 'N' } ;
      super.recuperar() ;
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

        // ALGG 20-12-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       tipo_unit_id: nodo_fila.data.tipo_unit_id,
                       codigo : nodo_fila.data.codigo,
                       descripcion : nodo_fila.data.descripcion,
                       activo : nodo_fila.data.activo,
                       telefono1 : nodo_fila.data.telefono1,
                       telefono2 : nodo_fila.data.telefono2,
                       observaciones : nodo_fila.data.observaciones,
                       email : nodo_fila.data.email
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
        tipo_unit_id : 4,
        codigo: "",
        descripcion: "",
        activo: 'S',
        telefono1: "",
        telefono2: "",
        observaciones: "",
        email: ""
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "tipo_unit_id", field: "tipo_unit_id", width: 100, hide: true },
            { headerName: "Código", field: "codigo", width: 100, editable: true },
            { headerName: "Descripción", field: "descripcion", width: 200,
              editable: true },
            { headerName: "Activo", field: "activo", cellEditor : "select",
              cellEditorParams : {values: ['S','N']}, editable: true,  width: 100 },
            { headerName: "1er teléfono", field: "telefono1", width: 200, editable: true },
            { headerName: "2do teléfono", field: "telefono2", width: 200, editable: true },
            { headerName: "Observaciones", field: "observaciones", width: 200, editable: true },
            { headerName: "e-mail", field: "email", width: 200, editable: true }
        ];
    }
}

// Componentes de Angular 2
import { Component, Input, OnChanges, SimpleChange } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule, InputTextModule, InputTextareaModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';

// Componentes de ag-grid para edición de celdas.
import { StringEditorComponent } from '../grid-utils/editor.component' ;

// Componentes de modelo y servicio.
import { UsuarioService } from "./usuario.service" ;
import { Usuario } from "./usuario" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'usuario',
    templateUrl: 'app/usuario/usuario.html',
    providers: [ UsuarioService ]
})
export class UsuarioComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Usuario del sistema" ;
    array_objetos: Usuario[];
    nombre_fichero_csv: string = "usuario_wShifts.csv" ;

    constructor(public objetoService : UsuarioService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      this.filtro_recuperar = {usuario: null, activo:null} ;
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
        if ((nodo_fila.data.nick.length == 0)
        || (nodo_fila.data.passwd.length == 0)
        || (nodo_fila.data.intentos.toString().length == 0)) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa]} ;

        // Se recuperan las filas nuevas.
        if (nodo_fila.data.id == 0) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       persona_id : nodo_fila.data.persona_id,
                       nick : nodo_fila.data.nick,
                       passwd : nodo_fila.data.passwd,
                       fecha_alta : nodo_fila.data.fecha_alta,
                       // fecha_alta : new Date(parseInt(nodo_fila.data.fecha_alta)),
                       fecha_baja : nodo_fila.data.fecha_baja,
                       intentos : nodo_fila.data.intentos,
                       activo : nodo_fila.data.activo
                     }) ;
          // Depuración.
          console.log(bolsa) ;
        }
      })

      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      var nuevaFila = {
        id : 0,
        persona_id : 0,
        nick : "",
        passwd : "",
        fecha_alta : Date.now(),
        fecha_baja : null,
        intentos : 5,
        activo : "S"
      }
      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [{ headerName: "id", field: "id", hide: true, width: 100 },
                { headerName: "persona_id", field: "persona_id", hide: true, width: 100 },
               { headerName: "Usuario", field: "nick", editable: true, width: 200 },
               { headerName: "Contraseña", field: "passwd", editable: true, width: 200 },
               { headerName: "Fecha de alta", field: "fecha_alta",
                 cellRendererFramework: {
                   template: '{{ params.value | date: "dd/MM/yyyy"}}',
                   moduleImports: [CommonModule]
                 }, width: 150 },
               { headerName: "Nº intentos", field: "intentos", editable: true, width: 150 },
               { headerName: "Activo", field: "activo", cellEditor : "select", cellEditorParams : {values: ['S','N']},
                 editable: true, width: 70}];
    }
}

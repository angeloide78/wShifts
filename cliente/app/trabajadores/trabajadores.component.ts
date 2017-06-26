// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { PersonaService } from "../persona/persona.service" ;
import { Persona } from "../persona/persona" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'trabajadores',
    templateUrl: 'app/trabajadores/trabajadores.html',
    providers: [ PersonaService ]
})
export class TrabajadoresComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Gestión de trabajadores" ;
    array_objetos: Persona[];
    nombre_fichero_csv: string = "trabajadores_wShifts.csv" ;

    fnac: any = null ;

    es = {  firstDayOfWeek: 0,
           dayNames: [ "domingo", "lunes","martes","miércoles","jueves",
                       "viernes","sábado"],
           dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
              dayNamesMin: [ "D","L","M","X","J","V","S" ],
              monthNames: [ "enero","febrero","marzo","abril","mayo","junio",
                            "julio","agosto","septiembre","octubre",
                            "noviembre","diciembre" ],
              monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul",
                                 "ago","sep","oct","nov","dic" ]
        } ;

    constructor(public objetoService : PersonaService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // ALGG 06-01-2017 Se indica filtro de id a nulo. Nos traemos todo.
      this.filtro_recuperar = { id : null} ;
    }

    public insertarFechaNac() {
      // Primero se selecciona una fecha.
      if ( this.fnac == null )  {
        this.mensajes("error_fechas2") ;
        return ;
      }

      let partes_fecha = this.fnac.split('/');

      // Se definen variables para control de modificaciones.
      let oldValue: any ;
      let newValue: any ;
      let field: any = "fnac" ;
      let id:any ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;
      let fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
      let filaSel = this.gridOptions.api.getSelectedNodes() ;
      filaSel.forEach( function(nodo_fecha) {
        // Nos guardamos los valores...
        oldValue = nodo_fecha.data.fnac ;
        newValue = fecha2 ;
        id = nodo_fecha.data.id ;
        let data_nodo = nodo_fecha.data;
        data_nodo.fnac = newValue ;
        // Lo incluimos en la bolsa de nodos actualizados.
        nodos_a_actualizar.push(nodo_fecha);
      })
      // Se refresca el ag-grid...
      this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
      // Y se actualiza la estructura de control de modificación.
      this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
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
        mensaje = 'Los campos documento, nombre, primer apellido, primer teléfono y e-mail son obligatorios.' ;
      }

      if (opcion == "error_fechas2") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Se debe de seleccionar una fecha de nacimiento' ;
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
        if ((nodo_fila.data.dni.length == 0) ||
            (nodo_fila.data.nombre.length == 0) ||
            (nodo_fila.data.ape1.length == 0) ||
            (nodo_fila.data.tlfno1.length == 0) ||
            (nodo_fila.data.email.length == 0) ) {
              console.log("persona sin datos ", nodo_fila.data.id) ;
              ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa]} ;

        // ALGG 02-12-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       dni : nodo_fila.data.dni,
                       nombre : nodo_fila.data.nombre,
                       ape1 : nodo_fila.data.ape1,
                       ape2 : nodo_fila.data.ape2,
                       sexo : nodo_fila.data.sexo,
                       fnac : nodo_fila.data.fnac,
                       direccion: nodo_fila.data.direccion,
                       cp : nodo_fila.data.cp,
                       poblacion: nodo_fila.data.poblacion,
                       provincia : nodo_fila.data.provincia,
                       pais : nodo_fila.data.pais,
                       tlfno1 : nodo_fila.data.tlfno1,
                       tlfno2 : nodo_fila.data.tlfno2,
                       email : nodo_fila.data.email,
                       observaciones : nodo_fila.data.observaciones}) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      let fecha2 = null ;

      if (this.fnac != null) {
        let partes_fecha = this.fnac.split('/') ;
        fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
      }

      let nuevaFila = {
        id : 0,
        dni : "",
        nombre: "",
        ape1: "",
        ape2: "",
        sexo: "M",
        fnac: fecha2,
        direccion: "",
        cp: "",
        poblacion: "",
        provincia: "",
        pais: "",
        tlfno1: "",
        tlfno2: "",
        email: "",
        observaciones: ""
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "Documento", field: "dni", width: 120, editable: true },
            { headerName: "Nombre", field: "nombre", width: 200, editable: true },
            { headerName: "Primer apellido", field: "ape1", width: 200, editable: true },
            { headerName: "Segundo apellido", field: "ape2", width: 200, editable: true },
            { headerName: "Sexo", field: "sexo", cellEditor : "select",
              cellEditorParams : {values: ['M','H']}, editable: true, width: 100 },
            { headerName: "F. Nac.", field: "fnac", width: 100,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "Dirección", field: "direccion", width: 400, editable: true },
            { headerName: "CP", field: "cp", width: 50, editable: true },
            { headerName: "Población", field: "poblacion", width: 400, editable: true },
            { headerName: "Provincia", field: "provincia", width: 100, editable: true },
            { headerName: "País", field: "pais", width: 100, editable: true },
            { headerName: "Primer teléfono", field: "tlfno1", width: 200, editable: true },
            { headerName: "Segundo teléfono", field: "tlfno2", width: 200, editable: true },
            { headerName: "e-mail", field: "email", width: 200, editable: true },
            { headerName: "Observaciones", field: "observaciones", width: 400,
              celleditor: "largeText", editable: true }
        ];
    }
}

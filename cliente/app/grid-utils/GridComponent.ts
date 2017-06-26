// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Componentes de ag-grid.
import { GridOptions } from 'ag-grid/main';
import { AgGridNg2 } from 'ag-grid-ng2/main';

// Componentes de ag-grid para edición de celdas.
import { NumericEditorComponent, StringEditorComponent }
  from './editor.component' ;

// Componentes de primeng.
import {Message} from 'primeng/primeng';

// Definición de interfaz de una celda.
interface icelda {
  id: number ;
  id_d: number ;
  field: number ;
  valor_original: any ;
  valor_nuevo: any;
} ;

// Definición de interfaz de arrays de celdas.
interface iceldas extends Array<icelda>{} ;

export class GridComponent {
    // Atributos generales.
    filtro_recuperar: any = null ;
    recargar_despues_actualizacion: boolean = false ;
    nombre_fichero_csv: string ;
    titulo: string ;
    errorMessage: string;
    msgs : Message[] = [] ;
    array_objetos: any[];
    gridOptions: GridOptions ;
    rowData: any;
    // Atributos específicos de actualización de datos.
    private filasBorradas: number [] = [] ;
    private filasBorradasMD: any [] = [] ;
    private celdasModificadas: iceldas = [];
    //public objetoService : any ;

    constructor(public objetoService: any, public tipo_borrado?: string,
                public tipo_modificacion?: string, public tipo_visualizacion?: string) {
      // Configuración del ag-grid.
      this.configurarGrid() ;
    }

    private inicializar() {
      // Inicialización de estructuras internas de control de modificación
      // del grid.
      this.filasBorradas = [] ;
      this.filasBorradasMD = [] ;
      this.celdasModificadas = [] ;
    }

    private addCeldaModificada(oldValue:any, newValue:any,
      id: number, field: number, id_d?: number) {
        // Creamos celda.
        let j = <icelda>{} ;
        j.id = id ;

        // ALGG 03-11-2016. Se tiene en cuenta el MD.
        j.id_d = 0 ;
        if (this.tipo_modificacion == 'maestro_detalle') { j.id_d = id_d } ;

        j.field = field ;
        j.valor_original = oldValue ;
        j.valor_nuevo = newValue ;

        // Y ala... dentro del saco.
        this.celdasModificadas.push(j) ;
      }

    private actualizarCeldasModificadas(oldValue:any, newValue:any,
      id: number, field: number, id_d?: number): void {
      // ALGG 27-11-2016 Si el valor antiguo es igual al nuevo, nos vamos.
      if ( oldValue == newValue ) { return }

      // Flag de evaluación.
      var insertarNuevaCelda: boolean = true ;

      // Se busca en la bolsa de celdas modificadas.
      var i: any ;

      console.log("celdasModificadas_: " + this.celdasModificadas) ;

      for (i in this.celdasModificadas) {
        // Si es una celda nula porque en ese hueco del array se eliminó ya
        // otra celda, se salta.
        if (i == null) { continue } ;

        // Datos de celda actual
        let aux_valor_original = this.celdasModificadas[i].valor_original ;
        let aux_valor_nuevo = this.celdasModificadas[i].valor_nuevo ;
        let aux_id = this.celdasModificadas[i].id ;
        let aux_id_d: number = undefined ;
        if (this.tipo_modificacion == 'maestro_detalle') {
          aux_id_d = this.celdasModificadas[i].id_d ;
        }
        let aux_field = this.celdasModificadas[i].field ;

/*
        console.log("aux_id="+aux_id) ;
        console.log("id="+id) ;
        console.log("aux_field="+aux_field) ;
        console.log("field="+field) ;
        console.log("aux_valor_original="+aux_valor_original) ;
        console.log("newValue="+newValue) ;
        console.log("aux_id_d="+aux_id_d) ;
        console.log("id_d="+id_d) ;
*/
/*

        if ((aux_id == id) && (aux_id_d == id_d) && (aux_field == field)) {
            if (aux_valor_original == newValue) { console.log("IGUALES") }
          else { console.log("diferentes")}
        }
        else { console.log("kk")}
        */

        // Si la celda es en la fila y columna correcta, se evalúan los valores
        // que contienen.
        if ((aux_id == id) && (aux_id_d == id_d) && (aux_field == field)) {
            if (aux_valor_original == newValue) {
              // El valor a actualizar es el mismo que el original. Se elimina
              // esta celda, ya que se actualizó a algo que ya estaba.
              delete this.celdasModificadas[i] ;
              insertarNuevaCelda = false ;
              break ;
            }
            else {
              // Se va a actualizar con un nuevo valor, por lo que se cambia
              // el campo newValue del objeto celda.
              this.celdasModificadas[i].valor_nuevo = newValue ;
              insertarNuevaCelda = false ;
              break ;
            }
        }
      }
      // La celda a modificar no está contemplada, por lo que se inserta
      // dentro de la bolsa de celdas a modificar... fácil y sencillo.
      if ( insertarNuevaCelda ) {
        //console.log("insertando celda") ;
        this.addCeldaModificada(oldValue, newValue, id, field, id_d) ;

      }
    }

    public evaluarCeldaModificada(oldValue:any, newValue:any, id:any, field:any,
                                  id_d?: number) {
      // ALGG 27-11-2016 Si el valor antiguo es igual al nuevo, nos vamos.
      if ( oldValue == newValue ) { return }
      // Se trata celda para verificar si es una actualización.
      this.actualizarCeldasModificadas(oldValue, newValue, id, field, id_d) ;

      // Depuración.
      console.log(this.celdasModificadas) ;
    }

    private onCellValueChanged($event) {
      // Flag de estado.
      let ret = true ;
      // Valor original de la celda.
      let oldValue = $event.oldValue ;
      // Valor actualizado de la celda.
      let newValue = $event.newValue ;
      // Identificador de la fila a partir del nodo.
      let id = $event.node.data.id ;
      // ALGG 03-11-2016 Se incluye parámetro para M-D.
      let id_d: number = undefined ;
      if (this.tipo_modificacion == 'maestro_detalle') {
        id_d = $event.node.data.id_d ;
      }
      // Identificador de la columna.
      let celda = $event.colDef.field ;
      // Se trata celda para verificar si es una actualización.
      this.actualizarCeldasModificadas(oldValue, newValue, id, celda, id_d) ;

      // Depuración.
      console.log(this.celdasModificadas) ;
    }

    configurarGrid(): void {
      // Se crea tipo.
      this.gridOptions = <GridOptions>{};
      // ALGG 05-02-2017 Se configuran mensajes de overlays cuando no hay datos
      // o se están cargando.
      this.gridOptions.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Recupere información o espere a que se carguen datos</span>' ;
      this.gridOptions.overlayNoRowsTemplate = '<span style="padding: 10px; border: 2px solid #444; ' +
       ' background: lightgoldenrodyellow;">No se han encontrado datos</span>'
      // Se definen columnas.
      this.gridOptions.columnDefs = this.createColumnDefs();
      // 19-11-2016 Configuración de visualización.
      if ( this.tipo_visualizacion == 'estatica' ) {
        this.gridOptions.enableFilter = false ;
        this.gridOptions.enableSorting = false ;
        this.gridOptions.enableColResize = false ;
      }
      else if ( this.tipo_visualizacion == 'planificacion_diaria' ) {
        // 19-01-2017 Configuración especial para la planificación diaria.
        this.gridOptions.enableFilter = false ;
        this.gridOptions.enableSorting = true ;
        this.gridOptions.enableColResize = false ;
        this.gridOptions.rowSelection = 'simple' ;
      } else {
        // Se activa filtro de columnas.
        this.gridOptions.enableFilter = true ;
        // Se permite selección múltiple de filas.
        this.gridOptions.rowSelection = 'multiple' ;
        // Se activa la ordenación de columnas.
        this.gridOptions.enableSorting = true ;
        // Se activa el redimensionamiento de columnas.
        this.gridOptions.enableColResize = true ;
      }

      // Se desactiva opción de eliminar columnas.
      this.gridOptions.suppressDragLeaveHidesColumns = true ;
    }

    private cancelarEdicion () {
      // Se cancelan posibles modificaciones, por defecto igual que recuperar.
      this.recuperar() ;
    }

    recuperar() {
      // Se limpian estructuras internas.
      this.inicializar() ;

      // Se llama a servicio de componente para recuperar información.
      this.objetoService.send_data(this.filtro_recuperar, 'recuperar')
          .subscribe (
            data => {
              this.array_objetos = data ;
              this.rowData = this.createRowData(this.array_objetos) ;
            },
            error => {
              this.errorMessage = <any>error ;
              this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    guardar() {
      var filas_a_eliminar: any ;

      // Se recuperan filas procesadas y su validación.
      let estado_datos = this.procesarFilas() ;
      // Se comprueba el estado.
      if (!estado_datos[0]) {
        // Se lanza error.
        this.mensajes('error_guardar_filas') ;
      }
      else {
        // Se recuperan filas a insertar.
        let filas_a_insertar = estado_datos[1] ;

        if (this.tipo_borrado == 'maestro_detalle') {
          // Se recuperan filas a eliminar.
          filas_a_eliminar = this.filasBorradasMD ;
        }
        else {
          // Se recuperan filas a eliminar.
          filas_a_eliminar = this.filasBorradas ;
        }

        // Se recuperan celdas a modificar.
        let celdas_a_modificar = this.celdasModificadas ;

        // Si no hay modificaciones, se informa.
        if (( celdas_a_modificar.length == 0 )
        && ( filas_a_insertar.length == 0)
        && ( filas_a_eliminar.length == 0)) { this.mensajes('nada_actualizar') }
        else {
          // Se envía al servidor backend.
          let datos = {
            filas_a_insertar : filas_a_insertar,
            filas_a_eliminar : filas_a_eliminar,
            celdas_a_modificar : celdas_a_modificar
          }

          var ret: any ;
          var estado_backend: boolean ;
          var mensaje_backend: string ;

          // Se envían datos al backend.
          this.objetoService.send_data(datos, 'actualizar')
              .subscribe (
                data => {
                  // Se recuperan los datos devueltos por el backend.
                  ret = data ;
                  ret = this.createRowData(ret) ;
                  // Flag de estado.
                  estado_backend = ret[0].estado ;
                  // Mensaje del backend.
                  mensaje_backend = ret[1].mensaje ;

                  console.log("estado " + estado_backend) ;
                  console.log("mensaje " + mensaje_backend) ;

                  // Evaluamos respuesta del backend... que listo que es...
                  if ( estado_backend ) {
                    // Si se realizaron inserciones se recarga, ya que hay que
                    // recuperar los id's de los nuevos registros.
                    if ( filas_a_insertar.length != 0 ) {
                        this.recuperar()
                    }
                    else {
                      if ( this.recargar_despues_actualizacion ) {
                        this.recuperar()
                      }
                      else {
                        // Si se borró o se actualizaron celdas, se limpia...
                        this.inicializar() ;
                      }

                    }
                    this.mensajes('exito_guardar') ;
                  }
                  else {
                    this.mensajes('error_guardar', mensaje_backend) ;
                  }
                },
                error => {
                  this.errorMessage = <any>error ;
                  this.mensajes('error_guardar', this.errorMessage.toString()) ;
                })
          }
        }
    }

    public mensajes2(opcion: string): any {
      // Método para incluir nuevos mensajes.

      let ret = false ;
      let severity: string ;
      let summary:string ;
      let mensaje: string ;

      return [ret, severity, summary, mensaje] ;
    }

    public mensajes(opcion: string, mensaje?:string) {
      // Se visualizan mensajes según opcion.
      this.msgs = [] ;
      let severity: string ;
      let summary: string ;
      let detail: string ;

      if (opcion == "error_guardar") {
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        detail = mensaje ;
      }

      if (opcion == "nada_actualizar") {
        severity = 'info' ;
        summary = 'wShifts informa:' ;
        detail = 'No hay nada para actualizar.' ;
      }

      if (opcion == "exito_guardar") {
        severity = 'success' ;
        summary = 'wShifts informa:' ;
        detail = 'Datos actualizados correctamente!' ;
      }

      /*
      if (opcion == "error_guardar_filas") {
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        detail = 'Los campos usuario, contraseña e intentos ' +
                 'no pueden estar vacíos' ;
            }
      */

      let aux = this.mensajes2(opcion) ;
      if ( aux[0] ) {
        severity = aux[1] ;
        summary = aux[2] ;
        detail = aux[3] ;
      }

      // Se lanza mensaje.
      this.msgs.push({severity, summary, detail});
    }

    public validaciones(modelo: any): any {

      // ###############################################################
      // ESTE MÉTODO SE TENDRÁ QUE SOBREESCRIBIR PARA PODER REALIZAR LOS
      // CHEQUEOS DE LOS CAMPOS PARA CADA GRID EN PARTICULAR.
      // ###############################################################

      // Bandera de estado.
      let ret = true ;

      // Bolsa de filas nuevas.
      var bolsa: any [] = [] ;

      // Se itera por los nodos del modelo, para verificar que los datos son
      // correctos. Además se seleccionan las filas nuevas para ser devueltas
      // al backend.

      // ESTE MÉTODO SE TENDRÁ QUE SOBREESCRIBIR PARA PODER REALIZAR LOS
      // CHEQUEOS DE LOS CAMPOS PARA CADA GRID EN PARTICULAR.
      /*
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
      */
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    private procesarFilas(): any {
      // Devuelve la tupla [estado, bolsa de filas a insertar].

      // Validaciones.
      let validaciones_filas: any ;

      // Bandera de estado.
      let ret = true ;

      // Bolsa de filas nuevas.
      let bolsa: any [] = [] ;

      // Se obtiene el modelo.
      let modelo = this.gridOptions.api.getModel() ;

      // Se realizan validaciones.
      validaciones_filas = this.validaciones(modelo) ;
      ret = validaciones_filas[0] ;
      bolsa = validaciones_filas[1] ;

      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {

      let nuevaFila = {} ;
      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    insertarFila() {
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    }

    duplicarFila() {
      // ALGG 02-11-2016 Función para duplicar filas que están seleccionadas
      // copiando todos los datos, excepto los que interesen. Se tiene que
      // hacer override de este método ya que dependerá del grid.


      // Se obtienen filas seleccionadas.
      var filaSel = this.gridOptions.api.getSelectedRows() ;

      // ALGG 02-11-2016 Se parametriza el tipo de borrado.
        filaSel.forEach( function(filaSeleccionada, index) {
          // Obtenemos los datos a duplicar, creamos nueva fila y la insertamos
          // en el grid.
      })
      }

    borrarFilaSeleccionada() {
        // Nos guardamos las filas que tenemos pendientes.
        var filasBorradas: number [] = this.filasBorradas ;
        var filasBorradasMD: any [] = this.filasBorradasMD ;

        // Se obtienen filas seleccionadas.
        var filaSel = this.gridOptions.api.getSelectedRows() ;

        // ALGG 02-11-2016 Se parametriza el tipo de borrado.
        if (this.tipo_borrado == 'maestro_detalle') {
          filaSel.forEach( function(filaSeleccionada, index) {
            filasBorradasMD.push({'id_m' : filaSeleccionada.id,
                                  'id_d' : filaSeleccionada.id_d}) ;
        })
        }
        else {
          filaSel.forEach( function(filaSeleccionada, index) {
            filasBorradas.push(filaSeleccionada.id) ;
        })}

        if (this.tipo_borrado == 'maestro_detalle') {
          this.filasBorradasMD = filasBorradasMD
        }

        else {
          // Y ya tenemos todas las filas a borrar.
          this.filasBorradas = filasBorradas ;
        }

        console.log("Filas a borrar con id = " + this.filasBorradas) ;
        console.log("Filas a borrar con id (m-d)= " + this.filasBorradasMD) ;

        // Se eliminan nodos seleccionados del grid.
        var filaSel2 = this.gridOptions.api.getSelectedNodes() ;
        this.gridOptions.api.removeItems(filaSel2);
    }

    exportarCSV() {
      let params = {
        fileName : this.nombre_fichero_csv
      }

      this.gridOptions.api.exportDataAsCsv(params);
    }

    public createColumnDefs() {
        return [ ];
    }

    public createRowData(d:any) : any {
        return d["data"];
    }
}

// Componentes de Angular 2
import { Component, Input, OnChanges, SimpleChange } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule, SelectItem  } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { ContratoAusenciaService } from "./contrato_ausencia.service" ;
import { ContratoAusencia } from "./contrato_ausencia" ;
import { ContratoSeleccionado } from "../contrato/contrato.component" ;
import { Ausencia } from "../ausencia/ausencia" ;
import { AusenciaService } from "../ausencia/ausencia.service" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'contrato_ausencia',
    templateUrl: 'app/contrato_ausencia/contrato_ausencia.html',
    providers: [ ContratoAusenciaService, AusenciaService ]
})
export class ContratoAusenciaComponent extends GridComponent {
    // Atributos generales.
    @Input() contratoSel: ContratoSeleccionado ;
    display: boolean = false;
    titulo:string  = "Ausencias asociadas a un contrato" ;
    array_objetos: ContratoAusencia[];
    nombre_fichero_csv: string = "ausenciasContrato_wShifts.csv" ;
    contrato_id: number = null;
    hora_inicio: number = null ;
    minuto_inicio: number = null ;
    hora_fin: number = null ;
    minuto_fin: number = null ;

    array_ausencia: Ausencia[] ;
    ausencia: SelectItem[] ;
    ausencia_sel: string ;

    fecha_desde: any = null ;
    fecha_hasta: any = null ;

    es = { firstDayOfWeek: 1,
           dayNames: [ "lunes","martes","miércoles","jueves",
                       "viernes","sábado", "domingo"],
           dayNamesShort: [ "lun","mar","mié","jue","vie","sáb", "dom" ],
           dayNamesMin: [ "L","M","X","J","V","S","D" ],
           monthNames: [ "enero","febrero","marzo","abril","mayo","junio",
                            "julio","agosto","septiembre","octubre",
                            "noviembre","diciembre" ],
           monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul",
                              "ago","sep","oct","nov","dic" ]
    } ;

    constructor(public objetoService : ContratoAusenciaService,
                public ausenciaService: AusenciaService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se cargan ausencias.
      this.cargarAusencia() ;
    }

    public insertar_hora_inicio() {
      if ( this.hora_inicio == null ) { this.hora_inicio = 0 }
      if ( this.minuto_inicio == null ) { this.minuto_inicio = 0 }

      let h = String(this.hora_inicio) ;
      let m = String(this.minuto_inicio) ;
      if ( h.length == 1) { h = '0' + h }
      if ( m.length == 1) { m = '0' + m }

      // Se definen variables para control de modificaciones.
      let oldValue: any ;
      let newValue: any ;
      let field: any = "hora_inicio" ;
      let id:any ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;

      let filaSel = this.gridOptions.api.getSelectedNodes() ;
      filaSel.forEach( function(nodo_fecha) {
        // Nos guardamos los valores...
        oldValue = nodo_fecha.data.hora_inicio ;
        newValue = h + ":" + m ;
        id = nodo_fecha.data.id ;
        nodo_fecha.data.hora_inicio = newValue;
        // Lo incluimos en la bolsa de nodos actualizados.
        nodos_a_actualizar.push(nodo_fecha);
      })
      // Se refresca el ag-grid...
      this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
      // Y se actualiza la estructura de control de modificación.
      this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
    }

    public insertar_hora_fin() {
      if ( this.hora_fin == null ) { this.hora_fin = 0 }
      if ( this.minuto_fin == null ) { this.minuto_fin = 0 }

      let h = String(this.hora_fin) ;
      let m = String(this.minuto_fin) ;
      if ( h.length == 1) { h = '0' + h }
      if ( m.length == 1) { m = '0' + m }

      // Se definen variables para control de modificaciones.
      let oldValue: any ;
      let newValue: any ;
      let field: any = "hora_fin" ;
      let id:any ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;

      let filaSel = this.gridOptions.api.getSelectedNodes() ;
      filaSel.forEach( function(nodo_fecha) {
        // Nos guardamos los valores...
        oldValue = nodo_fecha.data.hora_fin ;
        newValue = h + ":" + m ;
        id = nodo_fecha.data.id ;
        nodo_fecha.data.hora_fin = newValue;
        // Lo incluimos en la bolsa de nodos actualizados.
        nodos_a_actualizar.push(nodo_fecha);
      })
      // Se refresca el ag-grid...
      this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
      // Y se actualiza la estructura de control de modificación.
      this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
    }

    public insertarAusencia() {
      // Primero se selecciona una fecha.
      if ( this.ausencia_sel == null )  {
        this.mensajes("error_ausencia") ;
        return ;
      }

      // Se recupera la ausencia seleccionada.
      let ausencia_id = this.ausencia_sel['id'] ;
      let ausencia_cod = this.ausencia_sel['code'] ;
      let ausencia_desc = this.ausencia_sel['name'] ;

      // Se definen variables para control de modificaciones.
      let id:any ;

      let oldValue_id: any ;
      let newValue_id: any ;
      let field_id: any = "aus_id" ;


      let oldValue_cod: any ;
      let newValue_cod: any ;
      let field_cod: any = "aus_cod" ;

      let oldValue_desc: any ;
      let newValue_desc: any ;
      let field_desc: any = "aus_desc" ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;

      // Se recuperan nodos seleccionados.
      let filaSel = this.gridOptions.api.getSelectedNodes() ;
      filaSel.forEach( function(nodo) {
        id = nodo.data.id ;

        // Se actualiza id.
        oldValue_id = nodo.data.aus_id ;
        newValue_id = ausencia_id ;
        nodo.data.aus_id = newValue_id ;

        // Se actualiza código.
        oldValue_cod = nodo.data.aus_cod ;
        newValue_cod = ausencia_cod ;
        nodo.data.aus_cod = newValue_cod ;

        // Se actualiza descripción.
        oldValue_desc = nodo.data.aus_desc ;
        newValue_desc = ausencia_desc ;
        nodo.data.aus_desc = newValue_desc ;

        // Lo incluimos en la bolsa de nodos actualizados.
        nodos_a_actualizar.push(nodo);
      })
      // Se refresca el ag-grid...
      this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
      // Y se actualiza la estructura de control de modificación.
      this.evaluarCeldaModificada(oldValue_id, newValue_id, id, field_id) ;
      this.evaluarCeldaModificada(oldValue_cod, newValue_cod, id, field_cod) ;
      this.evaluarCeldaModificada(oldValue_desc, newValue_desc, id, field_desc) ;
    }

    public insertarFechaDesde() {
      // Primero se selecciona una fecha.
      if ( this.fecha_desde == null )  {
        this.mensajes("error_fechas2") ;
        return ;
      }

      let partes_fecha = this.fecha_desde.split('/');

      // Se definen variables para control de modificaciones.
      let oldValue: any ;
      let newValue: any ;
      let field: any = "fecha_inicio" ;
      let id:any ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;

      // Se inserta fecha en las filas seleccionadas.
      let fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
      let filaSel = this.gridOptions.api.getSelectedNodes() ;
      filaSel.forEach( function(nodo_fecha) {
        // Nos guardamos los valores...
        oldValue = nodo_fecha.data.fecha_inicio ;
        newValue = fecha2 ;
        id = nodo_fecha.data.id ;
        let data_nodo = nodo_fecha.data;
        data_nodo.fecha_inicio = fecha2 ;
        // Lo incluimos en la bolsa de nodos actualizados.
        nodos_a_actualizar.push(nodo_fecha);
      })
      // Se refresca el ag-grid...
      this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
      // Y se actualiza la estructura de control de modificación.
      this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
    }

    public insertarFechaHasta() {
      // Primero se selecciona una fecha.
      if ( this.fecha_hasta == null )  {
        this.mensajes("error_fechas2") ;
        return ;
      }

      let partes_fecha: any ;
      let fecha2: any ;

      partes_fecha = this.fecha_hasta.split('/');
      fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;

      // Se definen variables para control de modificaciones.
      let oldValue: any ;
      let newValue: any ;
      let field: any = "fecha_fin" ;
      let id:any ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;

      // Se inserta fecha en las filas seleccionadas.
      let filaSel = this.gridOptions.api.getSelectedNodes() ;
      filaSel.forEach( function(nodo_fecha) {
        // Nos guardamos los valores...
        oldValue = nodo_fecha.data.fecha_fin ;
        newValue = fecha2 ;
        id = nodo_fecha.data.id ;
        let data_nodo = nodo_fecha.data;
        data_nodo.fecha_fin = fecha2 ;
        // Lo incluimos en la bolsa de nodos actualizados.
        nodos_a_actualizar.push(nodo_fecha);
      })
      // Se refresca el ag-grid...
      this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
      // Y se actualiza la estructura de control de modificación.
      this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
    }

    public cargarAusencia() {
      this.ausencia = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables para recoger texto e identificadores.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.ausenciaService.send_data({ id : null, codigo : null, activo : 'S'} ,'recuperar')
          .subscribe (
           data => {
             this.array_ausencia = data ;
             aux = this.createRowData(this.array_ausencia) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.ausencia.push({label:'Seleccione ausencia', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   label = "(" + aux[i]['codigo'] +") " + aux[i]['descripcion'] ;
                   codigo = aux[i]['codigo'] ;
                   desc = aux[i]['descripcion'] ;
                   this.ausencia.push({label:label, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
      // Se detectan cambios...
      let dato: ContratoSeleccionado ;
      let contratoSel = changes['contratoSel'] ;

      // Se recuperan cambios...
      dato = contratoSel.currentValue ;
      // Si no hay nada, salimos.
      if ( dato == undefined) { return }

      // Se recupera el id, que será con lo que se busque...
      let id = dato.id;
      this.contrato_id = id ;

      console.log("[CONTRATO-AUSENCIA] Recuperando contrato con id " + dato.id) ;

      // Se recupera información.
      this.filtro_recuperar = { contrato_id : id, activo : 'S' }
      this.recuperar()
    }

    public showDialog() {
      this.display = true;
    }

    insertarFila() {
      if ( this.fecha_desde == null || this.fecha_hasta == null )  {
        this.mensajes("error_fechas") ;
        return ;
      }

      if ( (this.ausencia_sel == null) )  {
        this.mensajes("error_insertar") ;
        return ;
      }

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
        mensaje = 'Si la ausencia es parcial es necesario incluir hora de inicio y hora de fin' ;
      }
      if (opcion == 'error_ausencia') {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero la ausencia del combo" ;
      }

      if (opcion == 'error_fechas') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione fecha de inicio y de finalización de ausencia" ;
      }

      if (opcion == 'error_fechas2') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero la fecha haciendo click en caja de fecha" ;
      }

      if (opcion == "error_insertar") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Seleccione primero la ausencia.' ;
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
        if ((nodo_fila.data.ausencia_parcial == 'S') &&
        ((nodo_fila.data.hora_inicio == null) ||
        ((nodo_fila.data.hora_fin == null)))) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa] } ;

        // ALGG 02-12-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       contrato_id : nodo_fila.data.contrato_id,
                       aus_id : nodo_fila.data.aus_id,
                       aus_cod : nodo_fila.data.aus_cod,
                       aus_desc : nodo_fila.data.aus_desc,
                       fecha_inicio : nodo_fila.data.fecha_inicio,
                       fecha_fin : nodo_fila.data.fecha_fin,
                       anno_devengo : nodo_fila.data.anno_devengo,
                       activo : nodo_fila.data.activo,
                       ausencia_parcial : nodo_fila.data.ausencia_parcial,
                       hora_inicio : nodo_fila.data.hora_inicio,
                       hora_fin : nodo_fila.data.hora_fin}) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      let ausencia_id = this.ausencia_sel['id'] ;
      let ausencia_cod = this.ausencia_sel['code'] ;
      let ausencia_desc = this.ausencia_sel['name'] ;

      let partes_fecha = this.fecha_desde.split('/') ;
      let fecha_d = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;

      partes_fecha = this.fecha_hasta.split('/') ;
      let fecha_h = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;

      /*
      if ( this.hora_ausencia == null ) { this.hora_ausencia = 0 }
      if ( this.minuto_ausencia == null ) { this.minuto_ausencia = 0 }

      let h = String(this.hora_ausencia) ;
      let m = String(this.minuto_ausencia) ;
      if ( h.length == 1) { h = '0' + h }
      if ( m.length == 1) { m = '0' + m }
      */

      let nuevaFila = {
        id : 0,
        contrato_id : this.contrato_id,
        aus_id: ausencia_id,
        aus_cod: ausencia_cod,
        aus_desc: ausencia_desc,
        fecha_inicio: fecha_d,
        fecha_fin: fecha_h,
        anno_devengo: new Date().getFullYear(),
        activo: 'S',
        ausencia_parcial: 'N',
        hora_inicio: null,
        hora_fin: null
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "contrato_id", field: "contrato_id",  hide: true,
              width: 100 },
            { headerName: "aus_id", field: "aus_id",  hide: true, width: 100 },
            { headerName: "Cód.", field: "aus_cod", width: 70 },
            { headerName: "Descripción", field: "aus_desc", width: 300 },
            { headerName: "Desde", field: "fecha_inicio", width: 120,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "Hasta", field: "fecha_fin", width: 120,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "Año devengo", field: "anno_devengo", width: 130,
              editable: true },
            { headerName: "Parcial", field: "ausencia_parcial", cellEditor : "select",
              cellEditorParams : {values: ['S','N']}, editable: true,
              width: 80 },
            { headerName: "H. Inicio", field: "hora_inicio", width: 130 },
            { headerName: "H. Fin", field: "hora_fin", width: 130 },
            { headerName: "Activo", field: "activo", cellEditor : "select",
            cellEditorParams : {values: ['S','N']}, hide: true, editable: true,
            width: 100 }
        ];
    }
}

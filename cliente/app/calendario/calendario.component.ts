// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule, SpinnerModule, CalendarModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';

// Componentes de ag-grid para edición de celdas.
//import { StringEditorComponent } from '../grid-utils/editor.component' ;

// Componentes de modelo y servicio.
import { CalendarioFestivoService } from "../calendario/calendario.service" ;
import { CentroFisicoService } from "../centro_fisico/centro_fisico.service" ;

import { Calendario } from "./calendario" ;
import { CentroFisico } from "../centro_fisico/centro_fisico" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'calendario-festivo',
    templateUrl: 'app/calendario/calendario.html',
    providers: [ CalendarioFestivoService, CentroFisicoService ]
})
export class CalendarioComponent extends GridComponent {
    // Atributos generales.
    recargar_despues_actualizacion = true ;
    array_centros_fisicos: CentroFisico[] ;
    centros_fisicos: SelectItem[] ;
    centro_fisico_sel: string ;
    display: boolean = false;
    anno: number = new Date().getFullYear() ;
    fecha: any = null ;
    titulo:string  = "Gestión de Festivos" ;
    array_objetos: Calendario[];
    nombre_fichero_csv: string = "festivos_wShifts.csv" ;
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

    constructor(public objetoService : CalendarioFestivoService,
                public centroFisicoService: CentroFisicoService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se cargan los centros físicos.
      this.cargarUnit() ;
      // Filtro.
      //self.filtro_recuperar = {anno} ;
    }

    recuperar() {
      if (this.centro_fisico_sel == null) {
        this.mensajes("error_cf_sel") ;
        return ;
      }
      this.filtro_recuperar = {anno:this.anno, cf_id: this.centro_fisico_sel['id']} ;
      super.recuperar() ;
    }

    private cargarUnit() {
      this.centros_fisicos = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables para identificador, descripción y código de centros físicos.
      let ident: number ;
      let descripcion: string ;
      let codigo: string ;

      // Se llama a servicio de componente para recuperar centros físicos
      // que están activos.
      this.centroFisicoService.send_data({id:null, activo:'S', codigo: null}, 'recuperar')
          .subscribe (
           data => {
             this.array_centros_fisicos = data ;
             aux = this.createRowData(this.array_centros_fisicos) ;
             if ( aux.length  > 0 ) {
             // Se rellena el combo...
             this.centros_fisicos.push({label:'Seleccione centro físico', value:null});
             for (let i = 0; i < aux.length; i++) {
                 ident = aux[i]['id'] ;
                 descripcion = aux[i]['descripcion'] ;
                 codigo = aux[i]['codigo'] ;
                 this.centros_fisicos.push({label:descripcion, value:{id:ident, name: descripcion, code: codigo}});
             }
           }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public showDialog() {
      this.display = true;
    }

    public insertarFecha() {
      // Primero se selecciona una fecha.
      if ( this.fecha == null )  {
        this.mensajes("error_fechas2") ;
        return ;
      }
      // Se comprueba que el año de la fecha que se inserta es el mismo año
      // que se usa en la recuperación de datos.
      let partes_fecha = this.fecha.split('/');
      // En JavaScript el formato de fecha es YYYY-MM-DD, y el mes tiene un rango
      // entre 0 y 11, siendo 0 enero. Así que hacemos las conversiones necesarias...
      // let fecha_aux = new Date(partes_fecha[2], partes_fecha[1] - 1, partes_fecha[0]) ;

      if ( this.anno != partes_fecha[2] ) {
        this.mensajes("error_fechas") ;
      }
      else {
        // Se definen variables para control de modificaciones.
        let oldValue: any ;
        let newValue: any ;
        let field: any = "fecha_festivo" ;
        let id:any ;
        // Nodos a actualizar.
        let nodos_a_actualizar: any[] = [] ;
        // Se inserta fecha en las filas seleccionadas.
        //let fecha =  this.fecha ;
        //let fecha = new Date(partes_fecha[2], partes_fecha[1] - 1, partes_fecha[0]) ;
        let fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
        let filaSel = this.gridOptions.api.getSelectedNodes() ;
        filaSel.forEach( function(nodo_fecha) {
          // Nos guardamos los valores...
          oldValue = nodo_fecha.data.fecha_festivo ;
          newValue = fecha2 ;
          id = nodo_fecha.data.id ;
          let data_nodo = nodo_fecha.data;
          data_nodo.fecha_festivo = fecha2 ;
          // Lo incluimos en la bolsa de nodos actualizados.
          nodos_a_actualizar.push(nodo_fecha);
        })
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
      }
    }

    public insertarCF() {
      if ( this.centro_fisico_sel == null) {
        this.mensajes('error_cf_sel') ;
      }
      else {
        // Se definen variables para control de modificaciones.
        let oldValue: any ;
        let newValue: any ;
        let field: any = "centro_fisico_id" ;
        let id:any ;
        // Datos del centro físico seleccionado.
        let cf_id = this.centro_fisico_sel['id'] ;
        let cf_cod = this.centro_fisico_sel['code'] ;
        let cf_desc = this.centro_fisico_sel['name'] ;
        // Nodos a actualizar.
        let nodos_a_actualizar: any[] = [] ;
        // Se obtienen filas seleccionadas.
        let filaSel = this.gridOptions.api.getSelectedNodes() ;
        filaSel.forEach( function(cf) {
          let data_nodo = cf.data;
          // Si se está modificando una fila no se modifica el id.
          // Nos guardamos los valores...
          oldValue = data_nodo.centro_fisico_id ;
          newValue = cf_id ;
          id = data_nodo.id ;
          // Hacemos el cambio.
          data_nodo.centro_fisico_id = cf_id ;
          data_nodo.desc_cf = cf_desc ;
          data_nodo.cod_cf = cf_cod ;
          // Lo incluimos en la bolsa de nodos actualizados.
          nodos_a_actualizar.push(cf);
        })
        // Se refresca el ag-grid...
        this.gridOptions.api.refreshRows(nodos_a_actualizar) ;
        // Y se actualiza la estructura de control de modificación.
        this.evaluarCeldaModificada(oldValue, newValue, id, field) ;
      }
    }

    insertarFila() {
        if ( this.centro_fisico_sel == null || this.fecha == null ) {
          this.mensajes('error_cf') ;
        }
        else {
          let nuevoElemento = this.crearNuevaFilaDatos();
          this.gridOptions.api.addItems([nuevoElemento]);
        }
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
        mensaje = 'Los campos descripción, centro físico y fecha son obligatorios' ;
      }

      if (opcion == 'error_fechas') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "El año de recuperación de festivos no coincide con el año de la fecha de festivo" ;
      }

      if (opcion == 'error_fechas2') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero una fecha del calendario de festivos" ;
      }

      if (opcion == 'error_cf') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione centro físico y fecha antes de crear un nuevo festivo" ;
      }

      if (opcion == 'error_cf_sel') {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero un centro físico" ;
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
        if (nodo_fila.data.desc_festivo.length == 0) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa]} ;

        // ALGG 27-11-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       centro_fisico_id : nodo_fila.data.centro_fisico_id,
                       cod_cf : nodo_fila.data.cod_cf,
                       desc_cf : nodo_fila.data.desc_cf,
                       anno : nodo_fila.data.anno,
                       fecha_festivo : nodo_fila.data.fecha_festivo,
                       desc_festivo : nodo_fila.data.desc_festivo,
                       observ_festivo : nodo_fila.data.observ_festivo}) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      // Para crear un nuevo registro antes se tiene haber elegido el centro
      // físico del combo.
      if ( this.centro_fisico_sel == null) {
        this.mensajes('error_cf') ;
      }
      else {
        let partes_fecha = this.fecha.split('/') ;
        let fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
        let nuevaFila = {
          id : 0,
          centro_fisico_id  : this.centro_fisico_sel['id'],
          cod_cf : this.centro_fisico_sel['code'],
          desc_cf : this.centro_fisico_sel['name'],
          activo : "S",
          anno: this.anno,
          fecha_festivo: fecha2,
          desc_festivo : '',
          observ_festivo : ''
        }
        // Se devuelven datos iniciales.
        return nuevaFila ;
      }
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "centro_fisico_id", field: "centro_fisico_id",
              hide: true, width: 100 },
            { headerName: "Código Centro Físico", field: "cod_cf", hide: true,
              width: 100 },
            { headerName: "Centro Físico", field: "desc_cf", width: 200 },
            { headerName: "Año", hide: true, field: "anno", width: 70 },
            { headerName: "Fecha Festivo", field: "fecha_festivo",
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
              width: 120 },
            { headerName: "Descripción de festivo", field: "desc_festivo",
              editable: true, width: 200 },
            { headerName: "Observaciones", field: "observ_festivo",editable: true,
              width: 600 }
        ];
    }
}

// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { CoberturaEquipoService } from "./cobertura_equipo.service" ;
import { CoberturaEquipo } from "./cobertura_equipo" ;
import { EquipoService } from "../equipo/equipo.service" ;
import { Equipo } from "../equipo/equipo" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'cobertura_equipo',
    templateUrl: 'app/cobertura_equipo/cobertura_equipo.html',
    providers: [ CoberturaEquipoService, EquipoService ]
})
export class CoberturaEquipoComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Gestión de coberturas de equipo" ;
    array_objetos: CoberturaEquipo[];
    nombre_fichero_csv: string = "coberturasEquipo_wShifts.csv" ;

    array_eq: Equipo[] ;
    eq: SelectItem[] ;
    eq_sel: string ;

    fecha_inicio: any = null ;
    fecha_fin: any = null ;

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

    constructor(public objetoService : CoberturaEquipoService,
                public equipoService : EquipoService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se cargan combos.
      this.cargarEq() ;
    }

    public cargarEq() {
      this.eq = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

      // Se llama a servicio de componente para recuperar información.
      this.equipoService.send_data({id: null, codigo:null, activo:'S',
                                    sf_id: null, asig_pend : 'N'},'recuperar')
          .subscribe (
           data => {
             this.array_eq = data ;
             aux = this.createRowData(this.array_eq) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.eq.push({label:'Seleccione equipo de trabajo', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   codigo = aux[i]['codigo']
                   desc = "(" + codigo + ") " + aux[i]['descripcion'] ;
                   this.eq.push({label:desc, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public insertarFechaFin() {
      // Primero se selecciona una fecha.
      if ( this.fecha_fin == null )  {
        this.mensajes("error_fechas2") ;
        return ;
      }

      let partes_fecha = this.fecha_fin.split('/');

      // Se definen variables para control de modificaciones.
      let oldValue: any ;
      let newValue: any ;
      let field: any = "fecha_fin" ;
      let id:any ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;
      let fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
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

    insertarFila() {
        if ( this.eq_sel == null || this.fecha_inicio == null) {
          this.mensajes('error_insertar_filas') ;
        }
        else {
          let nuevoElemento = this.crearNuevaFilaDatos();
          this.gridOptions.api.addItems([nuevoElemento]);
        }
    }

    recuperar() {
      this.filtro_recuperar = {activo : "S", id : null, codigo: null } ;
      super.recuperar() ;
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

      if (opcion == 'error_fechas2') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero fecha de fin de cobertura" ;
      }

      if (opcion == "error_guardar_filas") {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = 'La fecha de inicio no puede ser mayor que la fecha de fin.' ;
      }

      if (opcion == "error_insertar_filas") {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Es necesario seleccionar un equipo y la fecha de inicio de la cobertura.' ;
      }

      if (opcion == "error_eq_sel") {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Seleccione primero un equipo de trabajo del combo.' ;
      }

      return [ret, severity, summary, mensaje] ;
    }

    public validaciones(modelo: any): any {
      // Bandera de estado.
      let ret = true ;

      // Bolsa de filas nuevas.
      let bolsa: any [] = [] ;

      // se seleccionan las filas nuevas para ser devueltas al backend.
      modelo.forEachNode(function(nodo_fila) {
        // Se chequean que haya datos para celdas específicas.
        if ((nodo_fila.data.fecha_fin != null) &&
            (nodo_fila.data.fecha_inicio >
             nodo_fila.data.fecha_fin)) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa]} ;

        // ALGG 22-12-2016 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       fecha_inicio: nodo_fila.data.fecha_inicio,
                       fecha_fin: nodo_fila.data.fecha_fin,
                       eq_id: nodo_fila.data.eq_id,
                       eq_cod: nodo_fila.data.eq_cod,
                       eq_desc: nodo_fila.data.eq_desc,
                       lunes : nodo_fila.data.lunes,
                       martes : nodo_fila.data.martes,
                       miercoles : nodo_fila.data.miercoles,
                       jueves : nodo_fila.data.jueves,
                       viernes : nodo_fila.data.viernes,
                       sabado : nodo_fila.data.sabado,
                       domingo : nodo_fila.data.domingo
                       }) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      let eq_id = this.eq_sel['id'] ;
      let eq_cod = this.eq_sel['code'] ;
      let eq_desc = this.eq_sel['name'] ;
      let partes_fecha = this.fecha_inicio.split('/') ;
      let fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;

      let nuevaFila = {
        id : 0,
        fecha_inicio: fecha2,
        fecha_fin: null,
        eq_id : eq_id,
        eq_cod: eq_cod,
        eq_desc: eq_desc,
        lunes: 0,
        martes: 0,
        miercoles: 0,
        jueves: 0,
        viernes: 0,
        sabado: 0,
        domingo: 0
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "F. inicio", field: "fecha_inicio", width: 100,
            cellRendererFramework: {
              template: '{{ params.value | date: "dd/MM/yyyy"}}',
              moduleImports: [CommonModule]
            } },
            { headerName: "F. fin", field: "fecha_fin", width: 100,
            cellRendererFramework: {
              template: '{{ params.value | date: "dd/MM/yyyy"}}',
              moduleImports: [CommonModule]
            } },
            { headerName: "eq_id", field: "eq_id", width: 100, hide: true },
            { headerName: "Cód. Eq.", field: "eq_cod", width: 100, hide: true },
            { headerName: "Equipo de trabajo", field: "eq_desc", width: 200 },
            { headerName: "Lunes", field: "lunes", editable: true,  width: 100 },
            { headerName: "Martes", field: "martes", editable: true,  width: 100 },
            { headerName: "Miércoles", field: "miercoles", editable: true,  width: 100 },
            { headerName: "Jueves", field: "jueves", editable: true,  width: 100 },
            { headerName: "Viernes", field: "viernes", editable: true,  width: 100 },
            { headerName: "Sábado", field: "sabado", editable: true,  width: 100 },
            { headerName: "Domingo", field: "domingo", editable: true,  width: 100 }
        ];
    }
}

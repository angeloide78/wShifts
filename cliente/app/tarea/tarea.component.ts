// Componentes de Angular 2
import { Component, Input, OnChanges, SimpleChange } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';
import {OverlayPanelModule} from 'primeng/primeng';

// Componentes de modelo y servicio.
import { TareaService } from "./tarea.service" ;
import { Tarea } from "./tarea" ;
import { EquipoSeleccionado } from "../planilla/planilla.component" ;
//import { CategoriaProfesionalService } from "../categoria_profesional/categoria_profesional.service" ;
//import { CategoriaProfesional } from "../categoria_profesional/categoria_profesional" ;
import { PuestoService } from "../puesto/puesto.service" ;
import { Puesto } from "../puesto/puesto" ;
import { AsignarTrabajadorService } from "../asignar_trabajador/asignar_trabajador.service" ;
import { AsignarTrabajador } from "../asignar_trabajador/asignar_trabajador" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;
import { GridOptions } from 'ag-grid/main';

// Contrato seleccionado.
export class ContratoSeleccionado {
  constructor(public id:number) { }
}

// Grid.
@Component({
    selector: 'tarea',
    templateUrl: 'app/tarea/tarea.html',
    providers: [ TareaService, AsignarTrabajadorService, PuestoService ]
})
export class TareaComponent extends GridComponent {
    // Atributos generales.
    @Input() equipoSel: EquipoSeleccionado ;
    equipo_id: number = null ;
    trab_id: number = null ;
    trab_dni: string = null ;
    trab_ape1: string = null ;
    trab_ape2: string = null ;
    trab_nombre: string = null ;
    trab_contrato_id: number = null ;
    trab_fini_c: string = null ;
    trab_ffin_c: string = null ;

    nombre: string = null ;
    anno: number = new Date().getFullYear() ;

    array_puesto: Puesto[] ;
    puesto: SelectItem[] ;
    puesto_sel: string ;

    fecha_desde: any = null ;
    fecha_hasta: any = null ;
    fecha_busqueda_trab: any = null ;

    display: boolean = false;
    display2: boolean = false;
    boton_actualizar: boolean = true ;

    titulo:string  = "Gestión de asignaciones" ;
    array_objetos: Tarea[];
    nombre_fichero_csv: string = "asignaciones_wShifts.csv" ;

    array_objetos2: AsignarTrabajador[];
    nombre_fichero_csv2: string = "asignarTrabajadores_GestorTurnos.csv" ;
    gridOptions2: GridOptions ;
    rowData2: any;

    es = { firstDayOfWeek: 0,
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

    constructor(public objetoService : TareaService,
      public asignarTrabajadorService: AsignarTrabajadorService,
      public puestoService: PuestoService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Solo se puede seleccionar una fila en este mantenimiento.
      this.gridOptions.rowSelection = 'single' ;
      // Se crea tipo.
      this.gridOptions2 = <GridOptions>{};
      // 15-01-2017 Definición de columnas y configuración de visualización.
      this.gridOptions2.columnDefs = this.createDetailColumnDefs();
      // Se desactiva opción de eliminar columnas.
      this.gridOptions2.suppressDragLeaveHidesColumns = true ;
      // Se activa filtro de columnas.
      this.gridOptions2.enableFilter = true ;
      // Selección simple.
      this.gridOptions2.rowSelection = 'single' ;
      // Se activa la ordenación de columnas.
      this.gridOptions.enableSorting = true ;
      // Se activa el redimensionamiento de columnas.
      this.gridOptions.enableColResize = true ;
      // Se cargan puestos.
      this.cargarPuesto() ;
    }

    buscar_trabajador() {
      if ((this.fecha_busqueda_trab == null) || (this.equipo_id == null)) {
        this.mensajes('error_buscar_trab') ;
        return ;
      }
      console.log("Buscando trabajadores con contrato en vigor y categoría profesional adecuada") ;

      // Se llama a servicio de componente para recuperar información.
      this.asignarTrabajadorService.send_data({equipo_id : this.equipo_id,
                                               fecha : this.fecha_busqueda_trab},
                                               'recuperar')
          .subscribe (
            data => {
              this.array_objetos2 = data ;
              this.rowData2 = this.createRowData(this.array_objetos2) ;
            },
            error => {
              this.errorMessage = <any>error ;
              this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    private createRowData2(d:any) : any {
        return d["data"];
    }

    exportarCSV2() {
      let params = {
        fileName : this.nombre_fichero_csv2
      }

      this.gridOptions2.api.exportDataAsCsv(params);
    }

    public createDetailColumnDefs() {
      return [
          { headerName: "trab_id", field: "trab_id",  hide: true, width: 100 },
          { headerName: "1er Ap.", field: "ape1", width: 140 },
          { headerName: "2do Ap.", field: "ape2", width: 140 },
          { headerName: "Nombre", field: "nombre", width: 140 },
          { headerName: "DNI", field: "dni", width: 100 },
          { headerName: "contrato_id", field: "contrato_id", hide:true, width: 100 },
          { headerName: "F.ini.Contrato", field: "fini_c", width: 140,
            cellRendererFramework: {
              template: '{{ params.value | date: "dd/MM/yyyy"}}',
              moduleImports: [CommonModule]
            },
          },
          { headerName: "F.fin Contrato", field: "ffin_c", width: 140,
            cellRendererFramework: {
              template: '{{ params.value | date: "dd/MM/yyyy"}}',
              moduleImports: [CommonModule]
            },
          },
          { headerName: "tarea_id", field: "tarea_id",  hide: true, width: 100 },
          { headerName: "F.ini.Tarea", field: "fini_t", width: 140,
            cellRendererFramework: {
              template: '{{ params.value | date: "dd/MM/yyyy"}}',
              moduleImports: [CommonModule]
            },
          },
          { headerName: "F.fin Tarea", field: "ffin_t", width: 140,
            cellRendererFramework: {
              template: '{{ params.value | date: "dd/MM/yyyy"}}',
              moduleImports: [CommonModule]
            },
          },
          { headerName: "eq_id", field: "persona_id",  hide: true, width: 100 },
          { headerName: "Cód. Eq.", field: "eq_cod", width: 120 },
          { headerName: "Equipo", field: "eq_desc", width: 200 }
      ];
    }

    public onRowSelected($event) {
      // Se recuperan datos.
      this.trab_id = $event.node.data.trab_id ;
      this.trab_dni = $event.node.data.dni ;
      this.trab_ape1 = $event.node.data.ape1 ;
      this.trab_ape2 = $event.node.data.ape2 ;
      this.trab_nombre = $event.node.data.nombre ;
      this.trab_contrato_id = $event.node.data.contrato_id ;
      this.trab_fini_c = $event.node.data.fini_c ;
      this.trab_ffin_c = $event.node.data.ffin_c ;

      this.nombre = this.trab_dni + " - " + this.trab_nombre + " " +
                    this.trab_ape1 + " " + this.trab_ape2 ;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
      // Se detectan cambios...
      let dato: EquipoSeleccionado ;
      let equipoSel = changes['equipoSel'] ;

      // Se recuperan cambios...
      dato = equipoSel.currentValue ;
      // Si no hay nada, salimos.
      if ( dato == undefined) { return }

      // Se recupera el id, que será con lo que se busque...
      let id = dato.id;
      this.equipo_id = id ;

      console.log("[EQUIPO] Recuperando EQUIPO " + id) ;

      // Se recupera información.
      this.filtro_recuperar = { anno : this.anno, equipo_id : this.equipo_id }
      this.recuperar()

      // ALGG 14012017 También se cargan los puestos en el combo de puestos.
      this.cargarPuesto() ;
    }

    public cargarPuesto() {
      this.puesto = [];

      if ( this.equipo_id == null) {return }

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables para recoger texto e identificadores.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.puestoService.send_data({id : null, codigo : null,
                                    activo : 'S', eq_id : this.equipo_id,
                                    asig_pend : 'N'},'recuperar')
          .subscribe (
           data => {
             this.array_puesto = data ;
             aux = this.createRowData(this.array_puesto) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.puesto.push({label:'Seleccione puesto', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   label = aux[i]['codigo'] +" (" + aux[i]['descripcion'] +")";
                   codigo = aux[i]['codigo'] ;
                   desc = aux[i]['descripcion'] ;
                   this.puesto.push({label:label, value:{id:ident, name: desc, code: codigo}});
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

    public showDialog2() {
      this.display2 = true;
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

      let partes_fecha: any ;
      let fecha2: any ;

      if ( this.fecha_hasta == null )  {
        fecha2 = null ;
      }
      else {
        partes_fecha = this.fecha_hasta.split('/');
        fecha2 = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
      }

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

    public mensajes2(opcion: string): any {
      // Método para incluir nuevos mensajes.

      let ret = false ;
      let severity: string ;
      let summary:string ;
      let mensaje: string ;

      if (opcion == 'error_puesto') {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero el puesto del combo" ;
      }

      if (opcion == 'error_buscar_trab') {
        ret = true ;
        severity = 'warn' ;
        summary = 'Gestor de Turnos informa:' ;
        mensaje = "Es necesario seleccionar un equipo de trabajo y una fecha por la cual buscar trabajadores" ;
      }

      if (opcion == 'error_fechas') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione fecha de inicio de asignación" ;
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
        mensaje = 'Seleccione puesto y trabajador.' ;
      }

      return [ret, severity, summary, mensaje] ;
    }

    public insertarPuesto() {
      // Primero se selecciona una fecha.
      if ( this.puesto_sel == null )  {
        this.mensajes("error_puesto") ;
        return ;
      }

      // Se recupera el puesto seleccionado.
      let puesto_id = this.puesto_sel['id'] ;
      let puesto_cod = this.puesto_sel['code'] ;
      let puesto_desc = this.puesto_sel['name'] ;

      // Se definen variables para control de modificaciones.
      let id:any ;

      let oldValue_id: any ;
      let newValue_id: any ;
      let field_id: any = "p_id" ;


      let oldValue_cod: any ;
      let newValue_cod: any ;
      let field_cod: any = "p_cod" ;

      let oldValue_desc: any ;
      let newValue_desc: any ;
      let field_desc: any = "p_desc" ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;

      // Se recuperan nodos seleccionados.
      let filaSel = this.gridOptions.api.getSelectedNodes() ;
      filaSel.forEach( function(nodo) {
        id = nodo.data.id ;

        // Se actualiza id.
        oldValue_id = nodo.data.p_id ;
        newValue_id = puesto_id ;
        nodo.data.p_id = newValue_id ;

        // Se actualiza código.
        oldValue_cod = nodo.data.p_cod ;
        newValue_cod = puesto_cod ;
        nodo.data.p_cod = newValue_cod ;

        // Se actualiza descripción.
        oldValue_desc = nodo.data.p_desc ;
        newValue_desc = puesto_desc ;
        nodo.data.p_desc = newValue_desc ;

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

    public validaciones(modelo: any): any {
      // Bandera de estado.
      let ret = true ;

      // Bolsa de filas nuevas.
      let bolsa: any [] = [] ;

      // Se itera por los nodos del modelo, para verificar que los datos son
      // correctos. Además se seleccionan las filas nuevas para ser devueltas
      // al backend.
      modelo.forEachNode(function(nodo_fila) {
        // ALGG 06-01-2017 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       p_id : nodo_fila.data.p_id,
                       p_cod : nodo_fila.data.p_cod,
                       p_desc: nodo_fila.data.p_desc,
                       fecha_inicio: nodo_fila.data.fecha_inicio,
                       fecha_fin: nodo_fila.data.fecha_fin,
                       observ: nodo_fila.data.observ,
                       contrato_id: nodo_fila.data.contrato_id,
                       fecha_inicio_c: nodo_fila.data.fecha_inicio_c,
                       fecha_fin_c: nodo_fila.data.fecha_fin_c,
                       persona_id: nodo_fila.data.persona_id,
                       nombre: nodo_fila.data.nombre,
                       ape1: nodo_fila.data.ape1,
                       ape2: nodo_fila.data.ape2,
                       dni: nodo_fila.data.dni,
                       solapado: nodo_fila.data.solapado}) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    insertarFila() {
      if ( this.fecha_desde == null )  {
        this.mensajes("error_fechas") ;
        return ;
      }

      if ( this.puesto_sel == null || this.trab_id == null )  {
        console.log(this.trab_id) ;
        this.mensajes("error_insertar") ;
        return ;
      }

      let nuevoElemento = this.crearNuevaFilaDatos();
      this.gridOptions.api.addItems([nuevoElemento]);
    }

    public crearNuevaFilaDatos() {
      let puesto_id = this.puesto_sel['id'] ;
      let puesto_cod = this.puesto_sel['code'] ;
      let puesto_desc = this.puesto_sel['name'] ;

      let partes_fecha = this.fecha_desde.split('/') ;
      let fecha_d = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;

      let fecha_h:string = null ;

      if ( this.fecha_hasta == null )  {
        fecha_h = null ;
      }
      else {
        partes_fecha = this.fecha_hasta.split('/') ;
        fecha_h = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
      }

      let nuevaFila = {
        id : 0,
        p_id : puesto_id,
        p_cod : puesto_cod,
        p_desc: puesto_desc,
        fecha_inicio: fecha_d,
        fecha_fin: fecha_h,
        observ: '',
        contrato_id: this.trab_contrato_id,
        fecha_inicio_c: this.trab_fini_c,
        fecha_fin_c: this.trab_ffin_c,
        persona_id: this.trab_id,
        nombre: this.trab_nombre,
        ape1: this.trab_ape1,
        ape2: this.trab_ape2,
        dni: this.trab_dni,
        solapado: 'N'
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "p_id", field: "p_id",  hide: true, width: 100 },
            { headerName: "C.Puesto", field: "p_cod", width: 110 },
            { headerName: "Puesto", field: "p_desc", width: 150 },
            { headerName: "persona_id", field: "persona_id",  hide: true, width: 100 },
            { headerName: "1er Ap.", field: "ape1", width: 100 },
            { headerName: "2do Ap.", field: "ape2", width: 100 },
            { headerName: "Nombre", field: "nombre", width: 100 },
            { headerName: "DNI", field: "dni", width: 90 },
            { headerName: "Tarea desde", field: "fecha_inicio", width: 90,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "Tarea hasta", field: "fecha_fin", width: 90,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "Contrato desde", field: "fecha_inicio_c", width: 110,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "Contrato hasta", field: "fecha_fin_c", width: 110,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "contrato_id", field: "contrato_id",  hide: true, width: 100 },
            {  headerName: "Solapado", field: "solapado", cellEditor : "select",
               cellEditorParams : {values: ['S','N']}, editable: true, width: 100 },
            { headerName: "Observaciones", field: "observ", width: 220, editable: true },

        ];
    }
}

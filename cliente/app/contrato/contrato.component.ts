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
import { ContratoService } from "./contrato.service" ;
import { Contrato } from "./contrato" ;
import { PersonaSeleccionada } from "../buscar_persona/buscar_persona.component" ;
import { CategoriaProfesionalService } from "../categoria_profesional/categoria_profesional.service" ;
import { CategoriaProfesional } from "../categoria_profesional/categoria_profesional" ;
import { CargoService } from "../cargo/cargo.service" ;
import { Cargo } from "../cargo/cargo" ;

import { CicloSemana } from '../ciclo/cicloSemana' ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Contrato seleccionado.
export class ContratoSeleccionado {
  constructor(public id:number) { }
}

// Grid.
@Component({
    selector: 'contrato',
    templateUrl: 'app/contrato/contrato.html',
    providers: [ ContratoService, CategoriaProfesionalService, CargoService ]
})
export class ContratoComponent extends GridComponent {
    // Atributos generales.
    @Input() perSel: PersonaSeleccionada ;
    contratoSel: ContratoSeleccionado ;
    persona_id: number = null ;

    array_cargo: Cargo[] ;
    cargo: SelectItem[] ;
    cargo_sel: string ;

    array_cp: CategoriaProfesional[] ;
    cp: SelectItem[] ;
    cp_sel: string ;

    fecha_desde: any = null ;
    fecha_hasta: any = null ;

    display: boolean = false;
    display2: boolean = false;
    boton_actualizar: boolean = true ;

    titulo:string  = "Gestión de contratos de trabajo" ;
    array_objetos: Contrato[];
    nombre_fichero_csv: string = "contratos_wShifts.csv" ;

    es = { firstDayOfWeek: 1,
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

    constructor(public objetoService : ContratoService,
      public categoriaProfesionalService: CategoriaProfesionalService,
      public cargoService: CargoService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Solo se puede seleccionar una fila en este mantenimiento.
      this.gridOptions.rowSelection = 'single' ;
      // Se cargan cargos y categorías profesionales.
      this.cargarCargo() ;
      this.cargarCategoriaProfesional()

    }

    public onRowClicked($event) {
      // Se recuperan datos.
      let id = $event.node.data.id ;

      console.log("contrato_id = " + id) ;

      // Se crea el objeto del contrato seleccionado.
      let contrato_seleccionado = new ContratoSeleccionado(id) ;

      this.contratoSel = contrato_seleccionado ;
    }

    public onRowSelected($event) {
      // Se recuperan datos.
      console.log("seleccionando") ;
      let datos = this.gridOptions.api.getSelectedRows() ;
      console.log(datos) ;
      if ((datos == undefined) || (datos == null) ||
          (datos.length == 0) || (datos[0]['id'] == 0)) {
        this.boton_actualizar = true ;
      }
      else {this.boton_actualizar = false ;}
    }

    public onRowDataChanged($event) {
      // Se recuperan datos.
      console.log("seleccionando") ;
      let datos = this.gridOptions.api.getSelectedRows() ;
      console.log(datos) ;
      if (datos.length == 0) {
        this.boton_actualizar = true ;
      }
      else { this.boton_actualizar = false ;}
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

      console.log("[CONTRATO] Recuperando trabajador con DNI " + dato.dni) ;

      // Se recupera información.
      this.filtro_recuperar = { persona_id : id }
      this.recuperar()
    }

    public cargarCargo() {
      this.cargo = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables para recoger texto e identificadores.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Se llama a servicio de componente para recuperar información.
      this.cargoService.send_data({id_ : null, activo:'S'},'recuperar')
          .subscribe (
           data => {
             this.array_cargo = data ;
             aux = this.createRowData(this.array_cargo) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.cargo.push({label:'Seleccione cargo', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   label = "(" + aux[i]['codigo'] +") " + aux[i]['descripcion'] ;
                   codigo = aux[i]['codigo'] ;
                   desc = aux[i]['descripcion'] ;
                   this.cargo.push({label:label, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public cargarCategoriaProfesional() {
      this.cp = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables para recoger datos del combo.
      let desc: string ;
      let ident:number ;
      let codigo: string ;
      let label: string ;

      // Filtro de recuperación.
      let filtro_recuperar = {id_ :null, activo: 'S'}

      // Se llama a servicio de componente para recuperar información.
      this.categoriaProfesionalService.send_data(filtro_recuperar,'recuperar')
          .subscribe (
           data => {
             this.array_cp = data ;
             aux = this.createRowData(this.array_cp) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.cp.push({label:'Seleccione categoría profesional', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   label = "(" + aux[i]['codigo'] +") " + aux[i]['descripcion'] ;
                   codigo = aux[i]['codigo'] ;
                   desc = aux[i]['descripcion'] ;
                   this.cp.push({label:label, value:{id:ident, name: desc, code: codigo}});
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

      if (opcion == "error_guardar_filas") {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = 'La fecha de inicio no puede ser mayor que la fecha de fin.' ;
      }

      if (opcion == 'error_cargo') {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero el cargo del combo" ;
      }

      if (opcion == 'error_cp') {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione primero la categoria profesional del combo" ;
      }

      if (opcion == 'error_fechas') {
        ret = true ;
        severity = 'error' ;
        summary = 'wShifts informa:' ;
        mensaje = "Seleccione fecha de inicio de contrato" ;
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
        mensaje = 'Seleccione primero cargo y categoría profesional.' ;
      }

      return [ret, severity, summary, mensaje] ;
    }

    public insertarCargo() {
      // Primero se selecciona una fecha.
      if ( this.cargo_sel == null )  {
        this.mensajes("error_cargo") ;
        return ;
      }

      // Se recupera el cargo seleccionado.
      let cargo_id = this.cargo_sel['id'] ;
      let cargo_cod = this.cargo_sel['code'] ;
      let cargo_desc = this.cargo_sel['name'] ;

      // Se definen variables para control de modificaciones.
      let id:any ;

      let oldValue_id: any ;
      let newValue_id: any ;
      let field_id: any = "cargo_id" ;


      let oldValue_cod: any ;
      let newValue_cod: any ;
      let field_cod: any = "cargo_cod" ;

      let oldValue_desc: any ;
      let newValue_desc: any ;
      let field_desc: any = "cargo_desc" ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;

      // Se recuperan nodos seleccionados.
      let filaSel = this.gridOptions.api.getSelectedNodes() ;
      filaSel.forEach( function(nodo) {
        id = nodo.data.id ;

        // Se actualiza id.
        oldValue_id = nodo.data.cargo_id ;
        newValue_id = cargo_id ;
        nodo.data.cargo_id = newValue_id ;

        // Se actualiza código.
        oldValue_cod = nodo.data.cargo_cod ;
        newValue_cod = cargo_cod ;
        nodo.data.cargo_cod = cargo_cod ;

        // Se actualiza descripción.
        oldValue_desc = nodo.data.cargo_desc ;
        newValue_desc = cargo_desc ;
        nodo.data.cargo_desc = cargo_desc ;

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

    public insertarCP() {
      // Primero se selecciona una fecha.
      if ( this.cp_sel == null )  {
        this.mensajes("error_cp") ;
        return ;
      }

      // Se recupera la categoría profesional seleccionada.
      let cp_id = this.cp_sel['id'] ;
      let cp_cod = this.cp_sel['code'] ;
      let cp_desc = this.cp_sel['name'] ;

      // Se definen variables para control de modificaciones.
      let id:any ;

      let oldValue_id: any ;
      let newValue_id: any ;
      let field_id: any = "cp_id" ;


      let oldValue_cod: any ;
      let newValue_cod: any ;
      let field_cod: any = "cp_cod" ;

      let oldValue_desc: any ;
      let newValue_desc: any ;
      let field_desc: any = "cp_desc" ;

      // Nodos a actualizar.
      let nodos_a_actualizar: any[] = [] ;

      // Se recuperan nodos seleccionados.
      let filaSel = this.gridOptions.api.getSelectedNodes() ;
      filaSel.forEach( function(nodo) {
        id = nodo.data.id ;

        // Se actualiza id.
        oldValue_id = nodo.data.cp_id ;
        newValue_id = cp_id ;
        nodo.data.cp_id = newValue_id ;

        // Se actualiza código.
        oldValue_cod = nodo.data.cp_cod ;
        newValue_cod = cp_cod ;
        nodo.data.cp_cod = cp_cod ;

        // Se actualiza descripción.
        oldValue_desc = nodo.data.cp_desc ;
        newValue_desc = cp_desc ;
        nodo.data.cp_desc = cp_desc ;

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
        // Se chequean que haya datos para celdas específicas.
        if ((nodo_fila.data.fecha_fin != null) &&
            (nodo_fila.data.fecha_inicio >
             nodo_fila.data.fecha_fin)) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        if ( !ret ) { return [ret, bolsa]} ;
        // ALGG 06-01-2017 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       cargo_id : nodo_fila.data.cargo_id,
                       cargo_cod : nodo_fila.data.cargo_cod,
                       cargo_desc: nodo_fila.data.cargo_desc,
                       fecha_inicio: nodo_fila.data.fecha_inicio,
                       fecha_fin: nodo_fila.data.fecha_fin,
                       cp_id: nodo_fila.data.cp_id,
                       cp_cod: nodo_fila.data.cp_cod,
                       cp_desc: nodo_fila.data.cp_desc,
                       persona_id: nodo_fila.data.persona_id}) ;

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

      if ( (this.cargo_sel == null) || (this.cp_sel == null) )  {
        this.mensajes("error_insertar") ;
        return ;
      }

      let nuevoElemento = this.crearNuevaFilaDatos();
      this.gridOptions.api.addItems([nuevoElemento]);
    }

    public crearNuevaFilaDatos() {
      let cargo_id = this.cargo_sel['id'] ;
      let cargo_cod = this.cargo_sel['code'] ;
      let cargo_desc = this.cargo_sel['name'] ;

      let cp_id = this.cp_sel['id'] ;
      let cp_cod = this.cp_sel['code'] ;
      let cp_desc = this.cp_sel['name'] ;

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
        cargo_id : cargo_id,
        cargo_cod : cargo_cod,
        cargo_desc: cargo_desc,
        fecha_inicio: fecha_d,
        fecha_fin: fecha_h,
        cp_id: cp_id,
        cp_cod: cp_cod,
        cp_desc: cp_desc,
        persona_id: this.persona_id
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "cargo_id", field: "cargo_id",  hide: true, width: 100 },
            { headerName: "C.C", field: "cargo_cod", width: 70 },
            { headerName: "Cargo", field: "cargo_desc", width: 290 },
            { headerName: "Desde", field: "fecha_inicio", width: 115,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "Hasta", field: "fecha_fin", width: 115,
              cellRendererFramework: {
                template: '{{ params.value | date: "dd/MM/yyyy"}}',
                moduleImports: [CommonModule]
              },
            },
            { headerName: "cp_id", field: "cp_id",  hide: true, width: 100 },
            { headerName: "C.CP", field: "cp_cod", width: 70 },
            { headerName: "Categoría Profesional", field: "cp_desc", width: 290 },
            { headerName: "persona_id", field: "persona_id",  hide: true, width: 100 }
        ];
    }
}

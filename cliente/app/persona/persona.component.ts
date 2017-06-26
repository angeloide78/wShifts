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
import { PersonaService } from "./persona.service" ;
import { Persona } from "./persona" ;
import { PersonaSeleccionada } from "../buscar_persona/buscar_persona.component" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'persona',
    templateUrl: 'app/persona/persona.html',
    providers: [ PersonaService ]
})
export class PersonaComponent extends GridComponent {
    // Atributos generales.
    @Input() perSel: PersonaSeleccionada ;
    display: boolean = false;
    titulo:string  = "Visualización de datos personales del trabajador" ;
    array_objetos: Persona[];
    nombre_fichero_csv: string = "datosTrabajador_wShifts.csv" ;
    dni: string = null ;
    id: number = null ;
    nombre: string = null ;
    ape1: string = null ;
    ape2: string = null ;
    direccion: string = null ;
    cp: string = null ;
    poblacion: string = null ;
    provincia: string = null ;
    pais: string = null ;
    tlfno1: string = null ;
    tlfno2: string = null ;
    email: string = null ;
    observaciones: string = null ;
    sexo: string = null ;
    fnac: string = null ;

    constructor(public objetoService : PersonaService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
    }

    public showDialog() {
      this.display = true;
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

      console.log("[PERSONA] Recuperando trabajador con DNI " + dato.dni) ;

      // Se recupera información.
      this.filtro_recuperar = { id:id }
      this.recuperar()
    }

    recuperar() {
      // Se llama a servicio de componente para recuperar información.
      this.objetoService.send_data(this.filtro_recuperar, 'recuperar')
          .subscribe (
            data => {
              this.array_objetos = data ;
              this.rowData = this.createRowData(this.array_objetos) ;
              this.id = this.rowData[0]['id'] ;
              this.dni = this.rowData[0]['dni'] ;
              this.nombre = this.rowData[0]['nombre'] ;
              this.ape1 = this.rowData[0]['ape1'] ;
              this.ape2 = this.rowData[0]['ape2'] ;
              this.direccion = this.rowData[0]['direccion'] ;
              this.cp = this.rowData[0]['cp'] ;
              this.poblacion = this.rowData[0]['poblacion'] ;
              this.provincia = this.rowData[0]['provincia'] ;
              this.pais = this.rowData[0]['pais'] ;
              this.tlfno1 = this.rowData[0]['tlfno1'] ;
              this.tlfno2 = this.rowData[0]['tlfno2'] ;
              this.email = this.rowData[0]['email'] ;
              this.observaciones = this.rowData[0]['observaciones'] ;
              this.sexo = this.rowData[0]['sexo'] ;
              this.fnac = this.rowData[0]['fnac'] ;
              //if ( this.fnac != null ) {
              //  let partes_fecha = this.fnac.split('/');
              //  this.fnac = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
              //}
            },
            error => {
              this.errorMessage = <any>error ;
              this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "Documento", field: "dni", width: 120 },
            { headerName: "Nombre", field: "nombre", width: 200 },
            { headerName: "Primer apellido", field: "ape1", width: 200 },
            { headerName: "Segundo apellido", field: "ape2", width: 200 },
            { headerName: "Sexo", field: "sexo", width: 200 },
            { headerName: "F. Nac.", field: "fnac", width: 200 },
            { headerName: "Dirección", field: "direccion", width: 400 },
            { headerName: "CP", field: "cp", width: 50 },
            { headerName: "Población", field: "poblacion", width: 400 },
            { headerName: "Provincia", field: "provincia", width: 100 },
            { headerName: "País", field: "pais", width: 100 },
            { headerName: "Primer teléfono", field: "tlfno1", width: 200 },
            { headerName: "Segundo teléfono", field: "tlfno2", width: 200 },
            { headerName: "e-mail", field: "email", width: 200 },
            { headerName: "Observaciones", field: "observaciones", width: 400,
              celleditor: "largeText" }
        ];
    }
}

// Componentes de Angular 2
import { Component, EventEmitter, Output } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import { ToolbarModule, DialogModule } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { BuscarPersonaService } from "./buscar_persona.service" ;
import { BuscarPersona } from "./buscar_persona" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

export class PersonaSeleccionada {
  constructor(public id:number, public nombre: string, public ape1: string,
    public ape2: string, public dni:string) { }
}

// Grid.
@Component({
    selector: 'buscar_persona',
    templateUrl: 'app/buscar_persona/buscar_persona.html',
    providers: [ BuscarPersonaService ]
})
export class BuscarPersonaComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Búsqueda de personas" ;
    array_objetos: BuscarPersona[];
    nombre_fichero_csv: string = "buscarPersonas_wShifts.csv" ;
    @Output() OnPerSel = new EventEmitter<PersonaSeleccionada>() ;

    constructor(public objetoService : BuscarPersonaService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
    }

    public showDialog() {
        this.display = true;
      }

    public onRowClicked($event) {
      // Se recuperan datos.
      let nombre = $event.node.data.nombre ;
      let ape1 = $event.node.data.ape1 ;
      let ape2 = $event.node.data.ape2 ;
      let dni = $event.node.data.dni ;
      let id = $event.node.data.id ;

      // Se crea el objeto de la persona seleccionada.
      let persona_seleccionada = new PersonaSeleccionada(id, nombre, ape1, ape2, dni) ;

      // Y se emite por el manejador de eventos.
      this.OnPerSel.emit(persona_seleccionada) ;
      }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 120 },
            { headerName: "Documento", field: "dni", width: 120 },
            { headerName: "Nombre", field: "nombre", width: 150 },
            { headerName: "Primer apellido", field: "ape1", width: 200 },
            { headerName: "Segundo apellido", field: "ape2", width: 200 }
        ];
    }
}

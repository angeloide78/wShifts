// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;
import {PanelModule} from 'primeng/primeng';

// Componentes de modelo y servicio.
import { CicloService } from "../ciclo/ciclo.service" ;
import { Ciclo } from "../ciclo/ciclo" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'cicloSemanas',
    templateUrl: 'app/ciclo/cicloSemanas.html',
    providers: [ CicloService ]
})
export class cicloSemanasComponent extends GridComponent {
    // Atributos generales.
    array_objetos: Ciclo[];
    nombre_fichero_csv: string = "ciclosSemanas_wShifts.csv" ;
    tipo_visualizacion: string = "estatica" ;

    constructor(public objetoService : CicloService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
    }

    public crearNuevaFilaDatos() {

      let nuevaFila = {
        id : 1,
        lunes  : "A",
        martes : "q",
        miercoles : "S",
        jueves : "A",
        viernes : "A",
        sabado : "A",
        domingo : 'B'
      }

      this.gridOptions.api.addItems([nuevaFila]);
      return true ;
    }

    public createColumnDefs() {
        return [
            {  headerName: "Semana",
               field: "id",
               // hide: true,
               width: 80},

            {  headerName: "L",
               field: "lunes",
               width: 50
               },

            {  headerName: "M",
               field: "martes",
               width: 50
            },

            {  headerName: "X",
               field: "miercoles",
               width: 50
            },

            {  headerName: "J",
               field: "jueves",
               width: 50
            },

            {  headerName: "V",
               field: "viernes",
               width: 50
               },

            {  headerName: "S",
               field: "sabado",
               width: 50
            },

            {  headerName: "D",
               field: "domingo",
               width: 50
            }
        ];
    }

}

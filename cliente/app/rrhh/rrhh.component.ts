import { Component, Input } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

// Componentes de primeng.
import {MenuItem, ToolbarModule, DialogModule, InputTextModule } from 'primeng/primeng';
import {OverlayPanelModule} from 'primeng/primeng';

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Modelo.
import { PersonaSeleccionada } from '../buscar_persona/buscar_persona.component' ;


@Component({
  templateUrl: 'app/rrhh/rrhh.html',
  styleUrls: ["../../styles.css"]
})

export class RRHHComponent {
    private items: MenuItem[];
    public id: number ;
    public nombre: string;
    public dni: string ;
    public ape1: string ;
    public ape2: string ;
    public persona: string ;
    public perSel: PersonaSeleccionada ;
    public visualizar_disabled: boolean = true ;

    constructor() {} ;

    OnPerSel(perSel: PersonaSeleccionada) {
      this.nombre = perSel.nombre ;
      this.ape1 = perSel.ape1 ;
      this.ape2 = perSel.ape2 ;
      this.dni = perSel.dni ;
      this.id = perSel.id ;
      this.perSel = perSel ;
      this.visualizar_disabled = false ;
    }
}

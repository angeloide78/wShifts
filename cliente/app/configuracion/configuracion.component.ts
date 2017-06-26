import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {MenuItem} from 'primeng/primeng';

@Component({
  templateUrl: 'app/configuracion/configuracion.html',
  styleUrls: ["../../styles.css"]
})
export class ConfiguracionComponent {
    private items: MenuItem[];
    ngOnInit() { }
}

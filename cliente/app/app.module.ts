/*
// MÓDULOS
*/

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,  ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgGridModule } from 'ag-grid-ng2/main';
import { TabViewModule, AccordionModule, GrowlModule } from 'primeng/primeng';
import { CalendarModule , TabMenuModule, PanelModule } from 'primeng/primeng';
import { ButtonModule, SpinnerModule, ToolbarModule } from 'primeng/primeng';
import { DialogModule, DropdownModule, InputTextareaModule } from 'primeng/primeng';
import {OverlayPanelModule, ToggleButtonModule} from 'primeng/primeng';
import {InputMaskModule} from 'primeng/primeng';
import {MessagesModule} from 'primeng/primeng';
import {SelectButtonModule} from 'primeng/primeng';

/*
// DECLARACIONES
*/

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component' ;
import { LoginComponent } from './login/login.component' ;
import { UsuarioComponent } from './usuario/usuario.component' ;
import { SeguridadComponent } from './seguridad/seguridad.component' ;
import { AUTH_PROVIDERS } from './auth/auth.service';
import { LoggedInGuard } from './guard/loggedIn.guard';
import { RecursoComponent } from "./recurso/recurso.component";
import { RolComponent } from "./rol/rol.component";
import { RolUsuarioComponent } from "./rol_usuario/rol_usuario.component";
import { RolRecursoComponent } from "./rol_recurso/rol_recurso.component";
import { ConfiguracionComponent } from "./configuracion/configuracion.component" ;
import { turnoComponent } from "./turno/turno.component";
import { cicloComponent } from "./ciclo/ciclo.component";
import { CalendarioComponent } from "./calendario/calendario.component" ;
import { PuestoCicloComponent } from "./puesto_ciclo/puesto_ciclo.component" ;
import { PlanificacionComponent } from "./planificacion/planificacion.component" ;
import { CentroFisicoComponent } from "./centro_fisico/centro_fisico.component" ;
import { ServicioComponent } from "./servicio/servicio.component" ;
import { EquipoComponent } from "./equipo/equipo.component" ;
import { PuestoComponent } from "./puesto/puesto.component" ;
import { EstructuraComponent } from "./estructura/estructura.component" ;
import { UsuarioEstructuraComponent } from "./usuario_estructura/usuario_estructura.component" ;
import { CoberturaEquipoComponent } from "./cobertura_equipo/cobertura_equipo.component" ;
import { JornadaTeoricaComponent } from "./jornada_teorica/jornada_teorica.component" ;
import { BasicaComponent } from "./basica/basica.component" ;
import { CargoComponent } from "./cargo/cargo.component";
import { AusenciaComponent } from "./ausencia/ausencia.component";
import { CategoriaProfesionalComponent } from "./categoria_profesional/categoria_profesional.component";
import { PersonaComponent } from "./persona/persona.component" ;
import { ServiciosPreviosComponent } from "./servicios_previos/servicios_previos.component" ;
import { RRHHComponent } from "./rrhh/rrhh.component" ;
import { BuscarPersonaComponent } from "./buscar_persona/buscar_persona.component" ;
import { ContratoComponent } from "./contrato/contrato.component" ;
import { ContratoAusenciaComponent } from "./contrato_ausencia/contrato_ausencia.component" ;
import { TrabajadoresComponent } from "./trabajadores/trabajadores.component" ;
import { PlanillaComponent } from "./planilla/planilla.component" ;
import { TareaComponent } from "./tarea/tarea.component" ;
import { PlanificacionDiariaComponent } from "./planificacion_diaria/planificacion_diaria.component" ;
import { CategoriaEquipoComponent } from "./categoria_equipo/categoria_equipo.component" ;
import { BalanceComponent } from "./balance/balance.component" ;
import { ManualComponent } from "./manual/manual.component" ;
import { AcercadeComponent } from "./acercade/acercade.component" ;

@NgModule({
  imports:      [ BrowserModule, routing, FormsModule,  ReactiveFormsModule, GrowlModule, TabMenuModule,
                  HttpModule,  TabViewModule, AccordionModule, AgGridModule.withNg2ComponentSupport(),
                  CalendarModule, PanelModule, ButtonModule, SpinnerModule, ToolbarModule, DialogModule,
                  DropdownModule, OverlayPanelModule, InputTextareaModule, ToggleButtonModule,
                  InputMaskModule, MessagesModule, SelectButtonModule ],
  declarations: [ AppComponent, HomeComponent, RolUsuarioComponent, SeguridadComponent,
                  UsuarioComponent, RolRecursoComponent, LoginComponent,
                  RecursoComponent, RolComponent, UsuarioEstructuraComponent,
                  ConfiguracionComponent, turnoComponent, CalendarioComponent,
                  cicloComponent, CargoComponent, AusenciaComponent,
                  CategoriaProfesionalComponent, PersonaComponent, RRHHComponent, ServiciosPreviosComponent,
                  BuscarPersonaComponent, PuestoCicloComponent, PlanificacionComponent,
                  CentroFisicoComponent, ServicioComponent, EquipoComponent, PuestoComponent,
                  EstructuraComponent, CoberturaEquipoComponent, JornadaTeoricaComponent,
                  BasicaComponent, ContratoComponent, ContratoAusenciaComponent, TrabajadoresComponent,
                  PlanillaComponent, TareaComponent, PlanificacionDiariaComponent,
                  CategoriaEquipoComponent, BalanceComponent, ManualComponent, AcercadeComponent ],
  providers:    [ appRoutingProviders, AUTH_PROVIDERS, LoggedInGuard ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }

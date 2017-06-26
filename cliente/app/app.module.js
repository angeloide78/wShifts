/*
// MÓDULOS
*/
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var main_1 = require('ag-grid-ng2/main');
var primeng_1 = require('primeng/primeng');
var primeng_2 = require('primeng/primeng');
var primeng_3 = require('primeng/primeng');
var primeng_4 = require('primeng/primeng');
var primeng_5 = require('primeng/primeng');
var primeng_6 = require('primeng/primeng');
var primeng_7 = require('primeng/primeng');
var primeng_8 = require('primeng/primeng');
/*
// DECLARACIONES
*/
var app_routing_1 = require('./app.routing');
var app_component_1 = require('./app.component');
var home_component_1 = require('./home/home.component');
var login_component_1 = require('./login/login.component');
var usuario_component_1 = require('./usuario/usuario.component');
var seguridad_component_1 = require('./seguridad/seguridad.component');
var auth_service_1 = require('./auth/auth.service');
var loggedIn_guard_1 = require('./guard/loggedIn.guard');
var recurso_component_1 = require("./recurso/recurso.component");
var rol_component_1 = require("./rol/rol.component");
var rol_usuario_component_1 = require("./rol_usuario/rol_usuario.component");
var rol_recurso_component_1 = require("./rol_recurso/rol_recurso.component");
var configuracion_component_1 = require("./configuracion/configuracion.component");
var turno_component_1 = require("./turno/turno.component");
var ciclo_component_1 = require("./ciclo/ciclo.component");
var calendario_component_1 = require("./calendario/calendario.component");
var puesto_ciclo_component_1 = require("./puesto_ciclo/puesto_ciclo.component");
var planificacion_component_1 = require("./planificacion/planificacion.component");
var centro_fisico_component_1 = require("./centro_fisico/centro_fisico.component");
var servicio_component_1 = require("./servicio/servicio.component");
var equipo_component_1 = require("./equipo/equipo.component");
var puesto_component_1 = require("./puesto/puesto.component");
var estructura_component_1 = require("./estructura/estructura.component");
var usuario_estructura_component_1 = require("./usuario_estructura/usuario_estructura.component");
var cobertura_equipo_component_1 = require("./cobertura_equipo/cobertura_equipo.component");
var jornada_teorica_component_1 = require("./jornada_teorica/jornada_teorica.component");
var basica_component_1 = require("./basica/basica.component");
var cargo_component_1 = require("./cargo/cargo.component");
var ausencia_component_1 = require("./ausencia/ausencia.component");
var categoria_profesional_component_1 = require("./categoria_profesional/categoria_profesional.component");
var persona_component_1 = require("./persona/persona.component");
var servicios_previos_component_1 = require("./servicios_previos/servicios_previos.component");
var rrhh_component_1 = require("./rrhh/rrhh.component");
var buscar_persona_component_1 = require("./buscar_persona/buscar_persona.component");
var contrato_component_1 = require("./contrato/contrato.component");
var contrato_ausencia_component_1 = require("./contrato_ausencia/contrato_ausencia.component");
var trabajadores_component_1 = require("./trabajadores/trabajadores.component");
var planilla_component_1 = require("./planilla/planilla.component");
var tarea_component_1 = require("./tarea/tarea.component");
var planificacion_diaria_component_1 = require("./planificacion_diaria/planificacion_diaria.component");
var categoria_equipo_component_1 = require("./categoria_equipo/categoria_equipo.component");
var balance_component_1 = require("./balance/balance.component");
var manual_component_1 = require("./manual/manual.component");
var acercade_component_1 = require("./acercade/acercade.component");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, app_routing_1.routing, forms_1.FormsModule, forms_1.ReactiveFormsModule, primeng_1.GrowlModule, primeng_2.TabMenuModule,
                http_1.HttpModule, primeng_1.TabViewModule, primeng_1.AccordionModule, main_1.AgGridModule.withNg2ComponentSupport(),
                primeng_2.CalendarModule, primeng_2.PanelModule, primeng_3.ButtonModule, primeng_3.SpinnerModule, primeng_3.ToolbarModule, primeng_4.DialogModule,
                primeng_4.DropdownModule, primeng_5.OverlayPanelModule, primeng_4.InputTextareaModule, primeng_5.ToggleButtonModule,
                primeng_6.InputMaskModule, primeng_7.MessagesModule, primeng_8.SelectButtonModule],
            declarations: [app_component_1.AppComponent, home_component_1.HomeComponent, rol_usuario_component_1.RolUsuarioComponent, seguridad_component_1.SeguridadComponent,
                usuario_component_1.UsuarioComponent, rol_recurso_component_1.RolRecursoComponent, login_component_1.LoginComponent,
                recurso_component_1.RecursoComponent, rol_component_1.RolComponent, usuario_estructura_component_1.UsuarioEstructuraComponent,
                configuracion_component_1.ConfiguracionComponent, turno_component_1.turnoComponent, calendario_component_1.CalendarioComponent,
                ciclo_component_1.cicloComponent, cargo_component_1.CargoComponent, ausencia_component_1.AusenciaComponent,
                categoria_profesional_component_1.CategoriaProfesionalComponent, persona_component_1.PersonaComponent, rrhh_component_1.RRHHComponent, servicios_previos_component_1.ServiciosPreviosComponent,
                buscar_persona_component_1.BuscarPersonaComponent, puesto_ciclo_component_1.PuestoCicloComponent, planificacion_component_1.PlanificacionComponent,
                centro_fisico_component_1.CentroFisicoComponent, servicio_component_1.ServicioComponent, equipo_component_1.EquipoComponent, puesto_component_1.PuestoComponent,
                estructura_component_1.EstructuraComponent, cobertura_equipo_component_1.CoberturaEquipoComponent, jornada_teorica_component_1.JornadaTeoricaComponent,
                basica_component_1.BasicaComponent, contrato_component_1.ContratoComponent, contrato_ausencia_component_1.ContratoAusenciaComponent, trabajadores_component_1.TrabajadoresComponent,
                planilla_component_1.PlanillaComponent, tarea_component_1.TareaComponent, planificacion_diaria_component_1.PlanificacionDiariaComponent,
                categoria_equipo_component_1.CategoriaEquipoComponent, balance_component_1.BalanceComponent, manual_component_1.ManualComponent, acercade_component_1.AcercadeComponent],
            providers: [app_routing_1.appRoutingProviders, auth_service_1.AUTH_PROVIDERS, loggedIn_guard_1.LoggedInGuard],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
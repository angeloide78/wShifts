import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Imports de componentes a incluir en el routing.
import { LoginComponent } from './login/login.component' ;
import { SeguridadComponent} from './seguridad/seguridad.component' ;
import { ConfiguracionComponent} from './configuracion/configuracion.component' ;
import { RRHHComponent } from './rrhh/rrhh.component' ;
import { PlanillaComponent } from './planilla/planilla.component' ;
import { AUTH_PROVIDERS } from './auth/auth.service' ;
import { LoggedInGuard} from './guard/loggedIn.guard';
import { ManualComponent } from './manual/manual.component' ;
import { AcercadeComponent } from './acercade/acercade.component' ;

// Configuración del routing.
const appRoutes: Routes = [
    { path: 'configuracion', component: ConfiguracionComponent, canActivate: [LoggedInGuard] },
    { path: 'rrhh', component: RRHHComponent, canActivate: [LoggedInGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'seguridad', component: SeguridadComponent, canActivate: [LoggedInGuard] },
    { path: 'planilla', component: PlanillaComponent, canActivate: [LoggedInGuard] },
    { path: 'manual', component: ManualComponent },
    { path: 'acercade', component: AcercadeComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full'}
];

export const appRoutingProviders: any[] = [ LoggedInGuard ] ;
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

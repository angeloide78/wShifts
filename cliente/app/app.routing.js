"use strict";
var router_1 = require('@angular/router');
// Imports de componentes a incluir en el routing.
var login_component_1 = require('./login/login.component');
var seguridad_component_1 = require('./seguridad/seguridad.component');
var configuracion_component_1 = require('./configuracion/configuracion.component');
var rrhh_component_1 = require('./rrhh/rrhh.component');
var planilla_component_1 = require('./planilla/planilla.component');
var loggedIn_guard_1 = require('./guard/loggedIn.guard');
var manual_component_1 = require('./manual/manual.component');
var acercade_component_1 = require('./acercade/acercade.component');
// Configuración del routing.
var appRoutes = [
    { path: 'configuracion', component: configuracion_component_1.ConfiguracionComponent, canActivate: [loggedIn_guard_1.LoggedInGuard] },
    { path: 'rrhh', component: rrhh_component_1.RRHHComponent, canActivate: [loggedIn_guard_1.LoggedInGuard] },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'seguridad', component: seguridad_component_1.SeguridadComponent, canActivate: [loggedIn_guard_1.LoggedInGuard] },
    { path: 'planilla', component: planilla_component_1.PlanillaComponent, canActivate: [loggedIn_guard_1.LoggedInGuard] },
    { path: 'manual', component: manual_component_1.ManualComponent },
    { path: 'acercade', component: acercade_component_1.AcercadeComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
exports.appRoutingProviders = [loggedIn_guard_1.LoggedInGuard];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map
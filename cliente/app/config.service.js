"use strict";
var Config = (function () {
    function Config() {
        this.url_backend = 'http://127.0.0.1:5000';
    }
    Config.prototype.auth = function () {
        return this.url_backend + "/login";
    };
    Config.prototype.asignar_trabajador = function () {
        return this.url_backend + "/buscar_trabajadores_asignar";
    };
    Config.prototype.ausencia = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/ausencia";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/ausencia/update";
        }
        return null;
    };
    Config.prototype.balance = function () {
        return this.url_backend + "/balance";
    };
    Config.prototype.basica = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/basica";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/basica/update";
        }
        return null;
    };
    Config.prototype.buscar_persona = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/buscar_persona";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/buscar_persona/update";
        }
        return null;
    };
    Config.prototype.calendario = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/festivos";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/festivos/update";
        }
        return null;
    };
    Config.prototype.cambio_turno = function () {
        return this.url_backend + "/cambio_turno/update";
    };
    Config.prototype.cargo = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/cargo";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/cargo/update";
        }
        return null;
    };
    Config.prototype.categoria_equipo = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/categoria_equipo";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/categoria_equipo/update";
        }
        return null;
    };
    Config.prototype.categoria_profesional = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/categoria_profesional";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/categoria_profesional/update";
        }
        return null;
    };
    Config.prototype.centro_fisico = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/centro_fisico";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/centro_fisico/update";
        }
        return null;
    };
    Config.prototype.ciclo = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/ciclo";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/ciclo/update";
        }
        return this.url_backend + "/cicloSemana";
    };
    Config.prototype.cobertura_equipo = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/cobertura_equipo";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/cobertura_equipo/update";
        }
        return null;
    };
    Config.prototype.cobertura_servicio = function () {
        return this.url_backend + "/cobertura_servicio";
    };
    Config.prototype.contrato = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/contrato";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/contrato/update";
        }
        return null;
    };
    Config.prototype.contrato_ausencia = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/contrato_ausencia";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/contrato_ausencia/update";
        }
        return null;
    };
    Config.prototype.equipo = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/equipo";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/equipo/update";
        }
        return null;
    };
    Config.prototype.estructura = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/estructura";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/estructura/update";
        }
        return null;
    };
    Config.prototype.jornada_teorica = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/jornada_teorica";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/jornada_teorica/update";
        }
        return null;
    };
    Config.prototype.persona = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/persona";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/persona/update";
        }
        return null;
    };
    Config.prototype.planificacion = function () {
        return this.url_backend + "/planificacion";
    };
    Config.prototype.planificacion_diaria = function () {
        return this.url_backend + "/planificacion_diaria";
    };
    Config.prototype.puesto = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/puesto";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/puesto/update";
        }
        return null;
    };
    Config.prototype.puesto_ciclo = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/puesto_ciclo";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/puesto_ciclo/update";
        }
        return null;
    };
    Config.prototype.recurso = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/recurso";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/recurso/update";
        }
        return null;
    };
    Config.prototype.rol = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/rol";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/rol/update";
        }
        return null;
    };
    Config.prototype.rol_recurso = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/rol_recurso";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/rol_recurso/update";
        }
        return null;
    };
    Config.prototype.rol_usuario = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/rol_usuario";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/rol_usuario/update";
        }
        return null;
    };
    Config.prototype.servicio = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/servicio";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/servicio/update";
        }
        return null;
    };
    Config.prototype.servicios_previos = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/servicios_previos";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/servicios_previos/update";
        }
        return null;
    };
    Config.prototype.tarea = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/tarea";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/tarea/update";
        }
        return null;
    };
    Config.prototype.turno = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/turno";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/turno/update";
        }
        return null;
    };
    Config.prototype.usuario = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/usuario";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/usuario/update";
        }
        return null;
    };
    Config.prototype.usuario_estructura = function (opcion) {
        if (opcion == 'recuperar') {
            return this.url_backend + "/usuario_estructura";
        }
        if (opcion == 'actualizar') {
            return this.url_backend + "/usuario_estructura/update";
        }
        return null;
    };
    Config.TITLE_PAGE = "beta 0.0.4";
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.service.js.map
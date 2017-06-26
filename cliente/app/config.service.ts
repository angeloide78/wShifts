export class Config{
    static TITLE_PAGE : string = "beta 0.0.4" ;
    url_backend : string = 'http://127.0.0.1:5000' ;

    auth() {
      return this.url_backend + "/login" ;
    }

    asignar_trabajador() {
      return this.url_backend + "/buscar_trabajadores_asignar" ;
    }

    ausencia(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/ausencia" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/ausencia/update" ;
      }
      return null ;
    }

    balance() {
      return this.url_backend + "/balance" ;
    }

    basica(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/basica" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/basica/update" ;
      }
      return null ;
    }

    buscar_persona(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/buscar_persona" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/buscar_persona/update" ;
      }
      return null ;
    }

    calendario(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/festivos" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/festivos/update" ;
      }
      return null ;
    }

    cambio_turno() {
      return this.url_backend + "/cambio_turno/update" ;
    }

    cargo(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/cargo" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/cargo/update" ;
      }
      return null ;
    }

    categoria_equipo(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/categoria_equipo" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/categoria_equipo/update" ;
      }
      return null ;
    }

    categoria_profesional(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/categoria_profesional" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/categoria_profesional/update" ;
      }
      return null ;
    }

    centro_fisico(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/centro_fisico" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/centro_fisico/update" ;
      }
      return null ;
    }

    ciclo(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/ciclo" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/ciclo/update" ;
      }
      return this.url_backend + "/cicloSemana" ;
    }

    cobertura_equipo(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/cobertura_equipo" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/cobertura_equipo/update" ;
      }
      return null ;
    }

    cobertura_servicio() {
      return this.url_backend + "/cobertura_servicio" ;
    }

    contrato(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/contrato" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/contrato/update" ;
      }
      return null ;
    }

    contrato_ausencia(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/contrato_ausencia" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/contrato_ausencia/update" ;
      }
      return null ;
    }

    equipo(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/equipo" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/equipo/update" ;
      }
      return null ;
    }

    estructura(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/estructura" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/estructura/update" ;
      }
      return null ;
    }

    jornada_teorica(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/jornada_teorica" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/jornada_teorica/update" ;
      }
      return null ;
    }

    persona(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/persona" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/persona/update" ;
      }
      return null ;
    }

    planificacion() {
      return this.url_backend + "/planificacion" ;
    }

    planificacion_diaria() {
      return this.url_backend + "/planificacion_diaria" ;
    }

    puesto(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/puesto" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/puesto/update" ;
      }
      return null ;
    }

    puesto_ciclo(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/puesto_ciclo" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/puesto_ciclo/update" ;
      }
      return null ;
    }

    recurso(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/recurso" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/recurso/update" ;
      }
      return null ;
    }

    rol(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/rol" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/rol/update" ;
      }
      return null ;
    }

    rol_recurso(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/rol_recurso" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/rol_recurso/update" ;
      }
      return null ;
    }

    rol_usuario(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/rol_usuario" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/rol_usuario/update" ;
      }
      return null ;
    }

    servicio(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/servicio" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/servicio/update" ;
      }
      return null ;
    }

    servicios_previos(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/servicios_previos" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/servicios_previos/update" ;
      }
      return null ;
    }

    tarea(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/tarea" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/tarea/update" ;
      }
      return null ;
    }

    turno(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/turno" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/turno/update" ;
      }
      return null ;
    }

    usuario(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/usuario" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/usuario/update" ;
      }
      return null ;
    }

    usuario_estructura(opcion) {
      if (opcion == 'recuperar') {
        return this.url_backend + "/usuario_estructura" ;
      }
      if (opcion == 'actualizar') {
        return this.url_backend + "/usuario_estructura/update" ;
      }
      return null ;
    }

}

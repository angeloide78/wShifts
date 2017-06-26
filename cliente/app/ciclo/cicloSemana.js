/*

ALGG 19-11-2016 Definición de clase turno semanal.

*/
"use strict";
var CicloSemana = (function () {
    function CicloSemana(semana, lunes, martes, miercoles, jueves, viernes, sabado, domingo, horas, minutos) {
        this.semana = semana;
        this.lunes = lunes;
        this.martes = martes;
        this.miercoles = miercoles;
        this.jueves = jueves;
        this.viernes = viernes;
        this.sabado = sabado;
        this.domingo = domingo;
        this.horas = horas;
        this.minutos = minutos;
    }
    return CicloSemana;
}());
exports.CicloSemana = CicloSemana;
//# sourceMappingURL=cicloSemana.js.map
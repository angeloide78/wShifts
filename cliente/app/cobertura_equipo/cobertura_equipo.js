/*

ALGG 22-12-2016 Definición de clase CoberturaEquipo.

*/
"use strict";
var CoberturaEquipo = (function () {
    function CoberturaEquipo(id, fecha_inicio, fecha_fin, eq_id, eq_cod, eq_desc, lunes, martes, miercoles, jueves, viernes, sabado, domingo) {
        this.id = id;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.eq_id = eq_id;
        this.eq_cod = eq_cod;
        this.eq_desc = eq_desc;
        this.lunes = lunes;
        this.martes = martes;
        this.miercoles = miercoles;
        this.jueves = jueves;
        this.viernes = viernes;
        this.sabado = sabado;
        this.domingo = domingo;
    }
    return CoberturaEquipo;
}());
exports.CoberturaEquipo = CoberturaEquipo;
//# sourceMappingURL=cobertura_equipo.js.map
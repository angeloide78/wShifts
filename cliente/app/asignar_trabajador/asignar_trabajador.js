/*

ALGG 15-01-2017 Definición de clase AsignarTrabajador.

*/
"use strict";
var AsignarTrabajador = (function () {
    function AsignarTrabajador(trab_id, dni, ape1, ape2, nombre, contrato_id, fini_c, ffin_c, tarea_id, fini_t, ffin_t, eq_id, eq_cod, eq_desc) {
        this.trab_id = trab_id;
        this.dni = dni;
        this.ape1 = ape1;
        this.ape2 = ape2;
        this.nombre = nombre;
        this.contrato_id = contrato_id;
        this.fini_c = fini_c;
        this.ffin_c = ffin_c;
        this.tarea_id = tarea_id;
        this.fini_t = fini_t;
        this.ffin_t = ffin_t;
        this.eq_id = eq_id;
        this.eq_cod = eq_cod;
        this.eq_desc = eq_desc;
    }
    return AsignarTrabajador;
}());
exports.AsignarTrabajador = AsignarTrabajador;
//# sourceMappingURL=asignar_trabajador.js.map
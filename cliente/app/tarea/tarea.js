/*

ALGG 12-01-2017 Definición de clase Tarea.

*/
"use strict";
var Tarea = (function () {
    function Tarea(id, p_id, p_cod, p_desc, fecha_inicio, fecha_fin, observ, contrato_id, fecha_inicio_c, fecha_fin_c, persona_id, nombre, ape1, ape2, dni, solapado) {
        this.id = id;
        this.p_id = p_id;
        this.p_cod = p_cod;
        this.p_desc = p_desc;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.observ = observ;
        this.contrato_id = contrato_id;
        this.fecha_inicio_c = fecha_inicio_c;
        this.fecha_fin_c = fecha_fin_c;
        this.persona_id = persona_id;
        this.nombre = nombre;
        this.ape1 = ape1;
        this.ape2 = ape2;
        this.dni = dni;
        this.solapado = solapado;
    }
    return Tarea;
}());
exports.Tarea = Tarea;
//# sourceMappingURL=tarea.js.map
/*

ALGG 01-11-2016 Definición de clase turno.

*/
"use strict";
var Turno = (function () {
    function Turno(id, codigo_m, descripcion_m, cuenta_horas_m, activo_m, id_d, dia_inicial_d, dia_final_d, hora_inicio_d, hora_fin_d) {
        this.id = id;
        this.codigo_m = codigo_m;
        this.descripcion_m = descripcion_m;
        this.cuenta_horas_m = cuenta_horas_m;
        this.activo_m = activo_m;
        this.id_d = id_d;
        this.dia_inicial_d = dia_inicial_d;
        this.dia_final_d = dia_final_d;
        this.hora_inicio_d = hora_inicio_d;
        this.hora_fin_d = hora_fin_d;
    }
    return Turno;
}());
exports.Turno = Turno;
//# sourceMappingURL=turno.js.map
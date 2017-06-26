/*

ALGG 06-12-2016 Definición de clase PuestoCiclo.

*/
"use strict";
var PuestoCiclo = (function () {
    function PuestoCiclo(id, ciclo_id, ciclo_desc, p_id, p_desc, finicio, ffin, semana, observ, libre_id) {
        this.id = id;
        this.ciclo_id = ciclo_id;
        this.ciclo_desc = ciclo_desc;
        this.p_id = p_id;
        this.p_desc = p_desc;
        this.finicio = finicio;
        this.ffin = ffin;
        this.semana = semana;
        this.observ = observ;
        this.libre_id = libre_id;
    }
    return PuestoCiclo;
}());
exports.PuestoCiclo = PuestoCiclo;
//# sourceMappingURL=puesto_ciclo.js.map
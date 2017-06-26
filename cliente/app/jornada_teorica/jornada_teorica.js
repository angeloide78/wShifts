/*

ALGG 22-12-2016 Definición de clase JornadaTeorica.

*/
"use strict";
var JornadaTeorica = (function () {
    function JornadaTeorica(id, cf_id, cf_cod, cf_desc, anno, total_horas_anual, observaciones) {
        this.id = id;
        this.cf_id = cf_id;
        this.cf_cod = cf_cod;
        this.cf_desc = cf_desc;
        this.anno = anno;
        this.total_horas_anual = total_horas_anual;
        this.observaciones = observaciones;
    }
    return JornadaTeorica;
}());
exports.JornadaTeorica = JornadaTeorica;
//# sourceMappingURL=jornada_teorica.js.map
/*

ALGG 19-01-2017 Definición de clase CambioTurno.

*/
"use strict";
var CambioTurno = (function () {
    function CambioTurno(tarea_id, celda, turno_original, mes, anno, turno_modificado, observaciones) {
        this.tarea_id = tarea_id;
        this.celda = celda;
        this.turno_original = turno_original;
        this.mes = mes;
        this.anno = anno;
        this.turno_modificado = turno_modificado;
        this.observaciones = observaciones;
    }
    return CambioTurno;
}());
exports.CambioTurno = CambioTurno;
//# sourceMappingURL=cambio_turno.js.map
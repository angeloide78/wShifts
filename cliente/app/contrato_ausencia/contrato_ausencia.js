/*

ALGG 04-01-2017 Definición de clase ContratoAusencia.

*/
"use strict";
var ContratoAusencia = (function () {
    function ContratoAusencia(id, contrato_id, aus_id, aus_cod, aus_desc, fecha_inicio, fecha_fin, anno_devengo, activo, ausencia_parcial, hora_inicio, hora_fin) {
        this.id = id;
        this.contrato_id = contrato_id;
        this.aus_id = aus_id;
        this.aus_cod = aus_cod;
        this.aus_desc = aus_desc;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.anno_devengo = anno_devengo;
        this.activo = activo;
        this.ausencia_parcial = ausencia_parcial;
        this.hora_inicio = hora_inicio;
        this.hora_fin = hora_fin;
    }
    return ContratoAusencia;
}());
exports.ContratoAusencia = ContratoAusencia;
//# sourceMappingURL=contrato_ausencia.js.map
/*

ALGG 04-01-2017 Definición de clase Contrato.

*/
"use strict";
var Contrato = (function () {
    function Contrato(id, cargo_id, cargo_cod, cargo_desc, fecha_inicio, fecha_fin, cp_id, cp_cod, cp_desc, persona_id, activo) {
        this.id = id;
        this.cargo_id = cargo_id;
        this.cargo_cod = cargo_cod;
        this.cargo_desc = cargo_desc;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.cp_id = cp_id;
        this.cp_cod = cp_cod;
        this.cp_desc = cp_desc;
        this.persona_id = persona_id;
        this.activo = activo;
    }
    return Contrato;
}());
exports.Contrato = Contrato;
//# sourceMappingURL=contrato.js.map
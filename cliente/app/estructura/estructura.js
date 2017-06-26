/*

ALGG 07-12-2016 Definición de clase Estructura.

*/
"use strict";
var Estructura = (function () {
    function Estructura(id, cf_id, cf_cod, cf_desc, sf_id, sf_cod, sf_desc, eq_id, eq_cod, eq_desc, p_id, p_cod, p_desc, desc, observ, activo) {
        this.id = id;
        this.cf_id = cf_id;
        this.cf_cod = cf_cod;
        this.cf_desc = cf_desc;
        this.sf_id = sf_id;
        this.sf_cod = sf_cod;
        this.sf_desc = sf_desc;
        this.eq_id = eq_id;
        this.eq_cod = eq_cod;
        this.eq_desc = eq_desc;
        this.p_id = p_id;
        this.p_cod = p_cod;
        this.p_desc = p_desc;
        this.desc = desc;
        this.observ = observ;
        this.activo = activo;
    }
    return Estructura;
}());
exports.Estructura = Estructura;
//# sourceMappingURL=estructura.js.map
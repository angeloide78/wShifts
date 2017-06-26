/*

ALGG 08-02-2017 Definición de clase UsuarioEstructura.

*/
"use strict";
var UsuarioEstructura = (function () {
    function UsuarioEstructura(id, usuario_id, usuario, cf_id, cf_cod, cf_desc, sf_id, sf_cod, sf_desc, eq_id, eq_cod, eq_desc, observ, activo) {
        this.id = id;
        this.usuario_id = usuario_id;
        this.usuario = usuario;
        this.cf_id = cf_id;
        this.cf_cod = cf_cod;
        this.cf_desc = cf_desc;
        this.sf_id = sf_id;
        this.sf_cod = sf_cod;
        this.sf_desc = sf_desc;
        this.eq_id = eq_id;
        this.eq_cod = eq_cod;
        this.eq_desc = eq_desc;
        this.observ = observ;
        this.activo = activo;
    }
    return UsuarioEstructura;
}());
exports.UsuarioEstructura = UsuarioEstructura;
//# sourceMappingURL=usuario_estructura.js.map
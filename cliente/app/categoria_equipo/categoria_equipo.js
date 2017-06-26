/*

ALGG 14-01-2017 Definición de clase CategoriaEquipo

*/
"use strict";
var CategoriaEquipo = (function () {
    function CategoriaEquipo(id, cat_id, cat_cod, cat_desc, eq_id, eq_cod, eq_desc) {
        this.id = id;
        this.cat_id = cat_id;
        this.cat_cod = cat_cod;
        this.cat_desc = cat_desc;
        this.eq_id = eq_id;
        this.eq_cod = eq_cod;
        this.eq_desc = eq_desc;
    }
    return CategoriaEquipo;
}());
exports.CategoriaEquipo = CategoriaEquipo;
//# sourceMappingURL=categoria_equipo.js.map
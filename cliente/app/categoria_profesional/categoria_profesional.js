/*

ALGG 02-12-2016 Definición de clase CategoriaProfesional.

*/
"use strict";
var CategoriaProfesional = (function () {
    function CategoriaProfesional(id, codigo, descripcion, activo) {
        this.id = id;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.activo = activo;
    }
    return CategoriaProfesional;
}());
exports.CategoriaProfesional = CategoriaProfesional;
//# sourceMappingURL=categoria_profesional.js.map
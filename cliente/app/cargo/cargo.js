/*

ALGG 02-12-2016 Definición de clase cargo.

*/
"use strict";
var Cargo = (function () {
    function Cargo(id, codigo, descripcion, observaciones, activo) {
        this.id = id;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.observaciones = observaciones;
        this.activo = activo;
    }
    return Cargo;
}());
exports.Cargo = Cargo;
//# sourceMappingURL=cargo.js.map
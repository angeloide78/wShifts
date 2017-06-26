/*

ALGG 25-10-2016 Definición de clase recurso.

*/
"use strict";
var Recurso = (function () {
    function Recurso(id, codigo, descripcion, activo, observaciones) {
        this.id = id;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.activo = activo;
        this.observaciones = observaciones;
    }
    return Recurso;
}());
exports.Recurso = Recurso;
//# sourceMappingURL=recurso.js.map
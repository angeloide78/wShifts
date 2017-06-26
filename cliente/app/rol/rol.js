/*

ALGG 07-02-2017 Definición de clase Rol.

*/
"use strict";
var Rol = (function () {
    function Rol(id, codigo, descripcion, observaciones, activo) {
        this.id = id;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.observaciones = observaciones;
        this.activo = activo;
    }
    return Rol;
}());
exports.Rol = Rol;
//# sourceMappingURL=rol.js.map
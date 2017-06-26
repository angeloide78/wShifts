/*

ALGG 20-12-2016 Definición de clase Puesto.

*/
"use strict";
var Puesto = (function () {
    function Puesto(id, tipo_unit_id, codigo, descripcion, activo, telefono1, telefono2, observaciones, email) {
        this.id = id;
        this.tipo_unit_id = tipo_unit_id;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.activo = activo;
        this.telefono1 = telefono1;
        this.telefono2 = telefono2;
        this.observaciones = observaciones;
        this.email = email;
    }
    return Puesto;
}());
exports.Puesto = Puesto;
//# sourceMappingURL=puesto.js.map
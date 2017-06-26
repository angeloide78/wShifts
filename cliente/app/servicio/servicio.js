/*

ALGG 20-12-2016 Definición de clase Servicio.

*/
"use strict";
var Servicio = (function () {
    function Servicio(id, tipo_unit_id, codigo, descripcion, activo, telefono1, telefono2, observaciones, email) {
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
    return Servicio;
}());
exports.Servicio = Servicio;
//# sourceMappingURL=servicio.js.map
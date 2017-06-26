/*

ALGG 20-12-2016 Definición de clase CentroFisico.

*/
"use strict";
var CentroFisico = (function () {
    function CentroFisico(id, tipo_unit_id, codigo, descripcion, activo, direccion, poblacion, provincia, pais, telefono1, telefono2, observaciones, email) {
        this.id = id;
        this.tipo_unit_id = tipo_unit_id;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.activo = activo;
        this.direccion = direccion;
        this.poblacion = poblacion;
        this.provincia = provincia;
        this.pais = pais;
        this.telefono1 = telefono1;
        this.telefono2 = telefono2;
        this.observaciones = observaciones;
        this.email = email;
    }
    return CentroFisico;
}());
exports.CentroFisico = CentroFisico;
//# sourceMappingURL=centro_fisico.js.map
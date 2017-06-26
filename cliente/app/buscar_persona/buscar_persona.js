/*

ALGG 03-12-2016 Definición de clase BuscarPersona.

*/
"use strict";
var BuscarPersona = (function () {
    function BuscarPersona(id, dni, nombre, ape1, ape2, direccion, cp, poblacion, provincia, pais, tlfno1, tlfno2, email, observaciones) {
        this.id = id;
        this.dni = dni;
        this.nombre = nombre;
        this.ape1 = ape1;
        this.ape2 = ape2;
        this.direccion = direccion;
        this.cp = cp;
        this.poblacion = poblacion;
        this.provincia = provincia;
        this.pais = pais;
        this.tlfno1 = tlfno1;
        this.tlfno2 = tlfno2;
        this.email = email;
        this.observaciones = observaciones;
    }
    return BuscarPersona;
}());
exports.BuscarPersona = BuscarPersona;
//# sourceMappingURL=buscar_persona.js.map
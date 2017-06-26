/*

ALGG 02-12-2016 Definición de clase Persona.

*/
"use strict";
var Persona = (function () {
    function Persona(id, dni, nombre, ape1, ape2, direccion, cp, poblacion, provincia, pais, tlfno1, tlfno2, email, observaciones, sexo, fnac) {
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
        this.sexo = sexo;
        this.fnac = fnac;
    }
    return Persona;
}());
exports.Persona = Persona;
//# sourceMappingURL=persona.js.map
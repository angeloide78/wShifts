/*

ALGG 01-11-2016 Definición de clase turno.

*/
"use strict";
var Ciclo = (function () {
    function Ciclo(id, codigo_m, descripcion_m, cuenta_festivo_m, activo_m, ciclo) {
        this.id = id;
        this.codigo_m = codigo_m;
        this.descripcion_m = descripcion_m;
        this.cuenta_festivo_m = cuenta_festivo_m;
        this.activo_m = activo_m;
        this.ciclo = ciclo;
    }
    return Ciclo;
}());
exports.Ciclo = Ciclo;
//# sourceMappingURL=ciclo.js.map
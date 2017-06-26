/*

ALGG 07-02-2017 Definición de clase RolRecurso.

*/
"use strict";
var RolRecurso = (function () {
    function RolRecurso(id, rol_id, rol_desc, recurso_id, recurso_desc, ejecucion, lectura, escritura, observaciones, activo) {
        this.id = id;
        this.rol_id = rol_id;
        this.rol_desc = rol_desc;
        this.recurso_id = recurso_id;
        this.recurso_desc = recurso_desc;
        this.ejecucion = ejecucion;
        this.lectura = lectura;
        this.escritura = escritura;
        this.observaciones = observaciones;
        this.activo = activo;
    }
    return RolRecurso;
}());
exports.RolRecurso = RolRecurso;
//# sourceMappingURL=rol_recurso.js.map
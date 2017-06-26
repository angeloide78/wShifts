/*

ALGG 02-12-2016 Definición de clase ausencia.

*/
"use strict";
var Ausencia = (function () {
    function Ausencia(id, codigo, descripcion, cuenta_horas, cuenta_dias, max_ausencia_anual, activar_control_ausencia, forzar_ausencia, observaciones, activo, estado_devengo) {
        this.id = id;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.cuenta_horas = cuenta_horas;
        this.cuenta_dias = cuenta_dias;
        this.max_ausencia_anual = max_ausencia_anual;
        this.activar_control_ausencia = activar_control_ausencia;
        this.forzar_ausencia = forzar_ausencia;
        this.observaciones = observaciones;
        this.activo = activo;
        this.estado_devengo = estado_devengo;
    }
    return Ausencia;
}());
exports.Ausencia = Ausencia;
//# sourceMappingURL=ausencia.js.map
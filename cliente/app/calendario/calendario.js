/*

ALGG 01-11-2016 Definición de clase calendario.

*/
"use strict";
var Calendario = (function () {
    function Calendario(id, centro_fisico_id, cod_cf, desc_cf, anno, fecha_festivo, desc_festivo, observ_festivo) {
        this.id = id;
        this.centro_fisico_id = centro_fisico_id;
        this.cod_cf = cod_cf;
        this.desc_cf = desc_cf;
        this.anno = anno;
        this.fecha_festivo = fecha_festivo;
        this.desc_festivo = desc_festivo;
        this.observ_festivo = observ_festivo;
    }
    return Calendario;
}());
exports.Calendario = Calendario;
//# sourceMappingURL=calendario.js.map
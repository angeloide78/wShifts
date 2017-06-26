/*

ALGG 22-12-2016 Definición de clase Basica.

*/
"use strict";
var Basica = (function () {
    function Basica(id, version, nombre, descripcion, es_lunes_festivo, es_martes_festivo, es_miercoles_festivo, es_jueves_festivo, es_viernes_festivo, es_sabado_festivo, es_domingo_festivo, licencia, empresa) {
        this.id = id;
        this.version = version;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.es_lunes_festivo = es_lunes_festivo;
        this.es_martes_festivo = es_martes_festivo;
        this.es_miercoles_festivo = es_miercoles_festivo;
        this.es_jueves_festivo = es_jueves_festivo;
        this.es_viernes_festivo = es_viernes_festivo;
        this.es_sabado_festivo = es_sabado_festivo;
        this.es_domingo_festivo = es_domingo_festivo;
        this.licencia = licencia;
        this.empresa = empresa;
    }
    return Basica;
}());
exports.Basica = Basica;
//# sourceMappingURL=basica.js.map
/*

ALGG 18-10-2016 Definición de clase usuario.

*/
"use strict";
var Usuario = (function () {
    function Usuario(id, persona_id, nick, passwd, fecha_alta, fecha_baja, intentos, activo) {
        this.id = id;
        this.persona_id = persona_id;
        this.nick = nick;
        this.passwd = passwd;
        this.fecha_alta = fecha_alta;
        this.fecha_baja = fecha_baja;
        this.intentos = intentos;
        this.activo = activo;
    }
    return Usuario;
}());
exports.Usuario = Usuario;
//# sourceMappingURL=usuario.js.map
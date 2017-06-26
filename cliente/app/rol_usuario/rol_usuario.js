/*

ALGG 07-02-2017 Definición de clase RolUsuario.

*/
"use strict";
var RolUsuario = (function () {
    function RolUsuario(id, rol_id, rol_desc, usuario_id, usuario, observaciones, activo) {
        this.id = id;
        this.rol_id = rol_id;
        this.rol_desc = rol_desc;
        this.usuario_id = usuario_id;
        this.usuario = usuario;
        this.observaciones = observaciones;
        this.activo = activo;
    }
    return RolUsuario;
}());
exports.RolUsuario = RolUsuario;
//# sourceMappingURL=rol_usuario.js.map
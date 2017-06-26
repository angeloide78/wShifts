/*

ALGG 07-02-2017 Definición de clase RolUsuario.

*/

export class RolUsuario {
  constructor(
    public id: number,
    public rol_id: number,
    public rol_desc: string,
    public usuario_id: number,
    public usuario: string,
    public observaciones: string,
    public activo: string) { }
}

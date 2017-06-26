/*

ALGG 18-10-2016 Definición de clase usuario.

*/

export class Usuario {
  constructor(
    public id: number,
    public persona_id : number,
    public nick: string,
    public passwd: string,
    public fecha_alta: string,
    public fecha_baja: string,
    public intentos: number,
    public activo) { }
}

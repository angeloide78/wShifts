/*

ALGG 08-02-2017 Definición de clase UsuarioEstructura.

*/

export class UsuarioEstructura {
  constructor(

    public id: number,

    public usuario_id: number,
    public usuario: string,

    public cf_id: number,
    public cf_cod: string,
    public cf_desc: string,

    public sf_id: number,
    public sf_cod: string,
    public sf_desc: string,

    public eq_id: number,
    public eq_cod: string,
    public eq_desc: string,

    public observ: string,
    public activo: string) { }
}

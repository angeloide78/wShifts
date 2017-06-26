/*

ALGG 25-10-2016 Definición de clase recurso.

*/

export class Recurso {
  constructor(
    public id: number,
    public codigo : string,
    public descripcion: string,
    public activo: string,
    public observaciones: string) { }
}

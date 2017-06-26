/*

ALGG 02-12-2016 Definición de clase cargo.

*/

export class Cargo {
  constructor(
    public id: number,
    public codigo: string,
    public descripcion: string,
    public observaciones: string,
    public activo: string) { }
}

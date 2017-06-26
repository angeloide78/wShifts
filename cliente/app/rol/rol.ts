/*

ALGG 07-02-2017 Definición de clase Rol.

*/

export class Rol {
  constructor(
    public id: number,
    public codigo: string,
    public descripcion: string,
    public observaciones: string,
    public activo: string) { }
}

/*

ALGG 20-12-2016 Definición de clase Equipo.

*/

export class Equipo {
  constructor(
    public id: number,
    public tipo_unit_id: number,
    public codigo: string,
    public descripcion: string,
    public activo: string,
    public telefono1: string,
    public telefono2: string,
    public observaciones: string,
    public email: string,
  ) { }
}

/*

ALGG 07-02-2017 Definición de clase RolRecurso.

*/

export class RolRecurso {
  constructor(
    public id: number,
    public rol_id: number,
    public rol_desc: string,
    public recurso_id: number,
    public recurso_desc: string,
    public ejecucion: string,
    public lectura: string,
    public escritura: string,
    public observaciones: string,
    public activo: string) { }
}

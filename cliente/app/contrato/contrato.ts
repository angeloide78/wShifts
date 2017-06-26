/*

ALGG 04-01-2017 Definición de clase Contrato.

*/

export class Contrato {
  constructor(
    public id: number,
    public cargo_id: number,
    public cargo_cod: string,
    public cargo_desc: string,
    public fecha_inicio: string,
    public fecha_fin: string,
    public cp_id: number,
    public cp_cod: string,
    public cp_desc: string,
    public persona_id: number,
    public activo: string
  ) { }
}

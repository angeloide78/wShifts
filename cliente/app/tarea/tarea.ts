/*

ALGG 12-01-2017 Definición de clase Tarea.

*/

export class Tarea {
  constructor(
    public id: number,
    public p_id: number,
    public p_cod: string,
    public p_desc: string,
    public fecha_inicio: string,
    public fecha_fin: string,
    public observ: string,
    public contrato_id: number,
    public fecha_inicio_c: string,
    public fecha_fin_c: string,
    public persona_id: number,
    public nombre: string,
    public ape1: string,
    public ape2: string,
    public dni: string,
    public solapado: string
  ) { }
}

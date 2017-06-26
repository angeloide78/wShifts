/*

ALGG 22-12-2016 Definición de clase JornadaTeorica.

*/

export class JornadaTeorica {
  constructor(
    public id: number,
    public cf_id: number,
    public cf_cod: string,
    public cf_desc: string,
    public anno: number,
    public total_horas_anual: number,
    public observaciones: string) { }
}

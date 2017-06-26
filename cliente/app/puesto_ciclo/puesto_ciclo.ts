/*

ALGG 06-12-2016 Definición de clase PuestoCiclo.

*/

export class PuestoCiclo {
  constructor(
    public id: number,
    public ciclo_id: number,
    public ciclo_desc: string,
    public p_id: number,
    public p_desc: string,
    public finicio: string,
    public ffin: string,
    public semana: number,
    public observ: string,
    public libre_id: number
  ) { }
}

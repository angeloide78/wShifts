/*

ALGG 07-12-2016 Definición de clase Estructura.

*/

export class Estructura {
  constructor(
    public id: number,
    public cf_id: number,
    public cf_cod: string,
    public cf_desc: string,

    public sf_id: number,
    public sf_cod: string,
    public sf_desc: string,

    public eq_id: number,
    public eq_cod: string,
    public eq_desc: string,

    public p_id: number,
    public p_cod: string,
    public p_desc: string,

    public desc: string,
    
    public observ: string,
    public activo: string) { }
}

/*

ALGG 14-01-2017 Definición de clase CategoriaEquipo

*/

export class CategoriaEquipo {
  constructor(
    public id: number,
    public cat_id: number,
    public cat_cod: string,
    public cat_desc: string,
    public eq_id: number,
    public eq_cod: string,
    public eq_desc: string ) { }
}

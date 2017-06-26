/*

ALGG 22-12-2016 Definición de clase CoberturaEquipo.

*/

export class CoberturaEquipo {
  constructor(
    public id: number,
    public fecha_inicio: string,
    public fecha_fin: string,
    public eq_id: number,
    public eq_cod: string,
    public eq_desc: string,
    public lunes: number,
    public martes: number,
    public miercoles: number,
    public jueves: number,
    public viernes: number,
    public sabado: number,
    public domingo: number) { }
}

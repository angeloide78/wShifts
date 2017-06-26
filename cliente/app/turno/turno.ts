/*

ALGG 01-11-2016 Definición de clase turno.

*/

export class Turno {
  constructor(
    public id: number,
    public codigo_m : string,
    public descripcion_m: string,
    public cuenta_horas_m: string,
    public activo_m: string,
    public id_d: number,
    public dia_inicial_d: string,
    public dia_final_d: string,
    public hora_inicio_d: string,
    public hora_fin_d: string
    ) { }
}

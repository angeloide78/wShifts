/*

ALGG 04-01-2017 Definición de clase ContratoAusencia.

*/

export class ContratoAusencia {
  constructor(
    public id: number,
    public contrato_id: number,
    public aus_id: number,
    public aus_cod: string,
    public aus_desc: string,
    public fecha_inicio: string,
    public fecha_fin: string,
    public anno_devengo: number,
    public activo: string,
    public ausencia_parcial: string,
    public hora_inicio: string,
    public hora_fin: string) { }
}

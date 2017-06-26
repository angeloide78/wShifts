/*

ALGG 19-01-2017 Definición de clase CambioTurno.

*/

export class CambioTurno {
  constructor(
    public tarea_id: string,
    public celda: string,
    public turno_original: string,
    public mes: string,
    public anno: number,
    public turno_modificado: string,
    public observaciones: string) { }
}

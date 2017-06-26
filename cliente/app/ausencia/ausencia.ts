/*

ALGG 02-12-2016 Definición de clase ausencia.

*/

export class Ausencia {
  constructor(
    public id: number,
    public codigo: string,
    public descripcion: string,
    public cuenta_horas: string,
    public cuenta_dias: string,
    public max_ausencia_anual: number,
    public activar_control_ausencia: string,
    public forzar_ausencia: string,
    public observaciones: string,
    public activo: string,
    public estado_devengo: string) { }
}

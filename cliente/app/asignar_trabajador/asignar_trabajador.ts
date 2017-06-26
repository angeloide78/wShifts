/*

ALGG 15-01-2017 Definición de clase AsignarTrabajador.

*/

export class AsignarTrabajador {
  constructor(
    public trab_id: number,
    public dni: string,
    public ape1: string,
    public ape2: string,
    public nombre: string,
    public contrato_id: number,
    public fini_c: string,
    public ffin_c: string,
    public tarea_id: number,
    public fini_t: string,
    public ffin_t: string,
    public eq_id: number,
    public eq_cod: string,
    public eq_desc: string
  ) { }
}

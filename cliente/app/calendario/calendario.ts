/*

ALGG 01-11-2016 Definición de clase calendario.

*/

export class Calendario {
  constructor(
    public id: number,
    public centro_fisico_id: number,
    public cod_cf: string,
    public desc_cf: string,
    public anno: number,
    public fecha_festivo : string,
    public desc_festivo: string,
    public observ_festivo: string
    ) { }
}

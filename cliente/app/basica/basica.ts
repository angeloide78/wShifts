/*

ALGG 22-12-2016 Definición de clase Basica.

*/

export class Basica {
  constructor(
    public id: number,
    public version: string,
    public nombre: string,
    public descripcion: string,
    public es_lunes_festivo: string,
    public es_martes_festivo: string,
    public es_miercoles_festivo: string,
    public es_jueves_festivo: string,
    public es_viernes_festivo: string,
    public es_sabado_festivo: string,
    public es_domingo_festivo: string,
    public licencia: string,
    public empresa: string) { }
}

/*

ALGG 19-11-2016 Definición de clase turno semanal.

*/

export class CicloSemana {
  constructor(
    public semana: number,
    public lunes : string,
    public martes: string,
    public miercoles: string,
    public jueves: string,
    public viernes: string,
    public sabado: string,
    public domingo: string,
    public horas: number,
    public minutos: number
  ) { }
}

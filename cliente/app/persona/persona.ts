/*

ALGG 02-12-2016 Definición de clase Persona.

*/

export class Persona {
  constructor(
    public id: number,
    public dni: string,
    public nombre: string,
    public ape1: string,
    public ape2: string,
    public direccion: string,
    public cp: string,
    public poblacion: string,
    public provincia: string,
    public pais: string,
    public tlfno1: string,
    public tlfno2: string,
    public email: string,
    public observaciones: string,
    public sexo: string,
    public fnac: string) { }
}

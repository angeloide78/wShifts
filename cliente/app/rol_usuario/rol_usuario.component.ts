// Componentes de Angular 2
import { Component } from "@angular/core" ;
import { FormsModule } from "@angular/forms" ;
import { CommonModule } from "@angular/common" ;

// Botones primeng.
import { ButtonModule } from 'primeng/primeng';
import {ToolbarModule, DialogModule } from 'primeng/primeng';
import {DropdownModule, SelectItem } from 'primeng/primeng';

// Componentes de modelo y servicio.
import { RolUsuarioService } from "./rol_usuario.service" ;
import { RolUsuario } from "./rol_usuario" ;
import { RolService } from "../rol/rol.service" ;
import { Rol } from "../rol/rol" ;
import { UsuarioService } from "../usuario/usuario.service" ;
import { Usuario } from "../usuario/usuario" ;

// Clase grid.
import { GridComponent } from '../grid-utils/GridComponent' ;

// Grid.
@Component({
    selector: 'rol_usuario',
    templateUrl: 'app/rol_usuario/rol_usuario.html',
    providers: [ RolUsuarioService, RolService, UsuarioService ]
})
export class RolUsuarioComponent extends GridComponent {
    // Atributos generales.
    display: boolean = false;
    titulo:string  = "Gestión de asociación de roles y usuarios de aplicación" ;
    array_objetos: RolUsuario[];
    nombre_fichero_csv: string = "rolesUsuarios_wShifts.csv" ;

    array_rol: Rol[] ;
    rol: SelectItem[] ;
    rol_sel: string ;

    array_usuario: Usuario[] ;
    usuario: SelectItem[] ;
    usuario_sel: string ;

    constructor(public objetoService : RolUsuarioService,
                public rolService : RolService,
                public usuarioService : UsuarioService) {
      super(objetoService) ;
      // Configuración del ag-grid.
      super.configurarGrid() ;
      // Se cargan combos.
      this.cargarRol() ;
      this.cargarUsuario() ;
    }

    public cargarRol() {
      this.rol = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

      // Se llama a servicio de componente para recuperar información.
      this.rolService.send_data({codigo: null, activo:'S'},'recuperar')
          .subscribe (
           data => {
             this.array_rol = data ;
             aux = this.createRowData(this.array_rol) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.rol.push({label:'Seleccione rol', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   codigo = aux[i]['codigo']
                   desc = "(" + codigo + ") " + aux[i]['descripcion'] ;
                   this.rol.push({label:desc, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public cargarUsuario() {
      this.usuario = [];

      // Variable para recoger lo que viene del backend.
      let aux: any[] ;

      // Variables.
      let desc: string ;
      let ident:number ;
      let codigo: string ;

      // Se llama a servicio de componente para recuperar información.
      this.usuarioService.send_data({usuario: null, activo:'S'},'recuperar')
          .subscribe (
           data => {
             this.array_usuario = data ;
             aux = this.createRowData(this.array_usuario) ;
             if ( aux.length  > 0 ) {
               // Se rellena el combo...
               this.usuario.push({label:'Seleccione usuario', value:null});
               for (let i = 0; i < aux.length; i++) {
                   ident = aux[i]['id'] ;
                   codigo = aux[i]['nick']
                   desc = aux[i]['nick'] ;
                   this.usuario.push({label:desc, value:{id:ident, name: desc, code: codigo}});
               }
             }
           },
           error => {
             this.errorMessage = <any>error ;
             this.mensajes('error_guardar', 'Error de acceso a servidores') ;})
    }

    public showDialog() {
      this.display = true;
    }

    insertarFila() {
      // ALGG 10-02-2017. Si no hay elegido rol y usuario, no se puede crear
      // la nueva relación.
      if (this.rol_sel == null || this.usuario_sel == null) {
        this.mensajes('error_insercion') ;
      }
      else {
        let nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
      }
    }

    public mensajes2(opcion: string): any {
      // Método para incluir nuevos mensajes.

      let ret = false ;
      let severity: string ;
      let summary:string ;
      let mensaje: string ;

      if (opcion == "error_insercion") {
        ret = true ;
        severity = 'warn' ;
        summary = 'wShifts informa:' ;
        mensaje = 'Se tiene que elegir antes rol y usuario' ;
      }

      return [ret, severity, summary, mensaje] ;
    }

    public validaciones(modelo: any): any {
      // Bandera de estado.
      let ret = true ;

      // Bolsa de filas nuevas.
      let bolsa: any [] = [] ;

      // Se itera por los nodos del modelo, para verificar que los datos son
      // correctos. Además se seleccionan las filas nuevas para ser devueltas
      // al backend.
      modelo.forEachNode(function(nodo_fila) {
        // Se chequean que haya datos para celdas específicas.

        //if ((nodo_fila.data.rol_id.length == 0) ||
        //(nodo_fila.data.usuario_id.length == 0)) { ret = false ; }

        // Si no cumple la validación, nos vamos.
        //if ( !ret ) { return [ret, bolsa]} ;

        // ALGG 07-02-2017 Se recuperan las filas nuevas.
        if ( nodo_fila.data.id == 0 ) {
          // Se incluye fila en la bolsa.
          bolsa.push({ id : nodo_fila.data.id,
                       rol_id : nodo_fila.data.rol_id,
                       rol_desc : nodo_fila.data.rol_desc,
                       usuario_id : nodo_fila.data.usuario_id,
                       usuario : nodo_fila.data.usuario,
                       observaciones: nodo_fila.data.observaciones,
                       activo : nodo_fila.data.activo}) ;

          // Depuración.
          console.log(bolsa) ;
        }
      })
      // Se devuelve la tupla [estado, datos].
      return [ret, bolsa] ;
    }

    public crearNuevaFilaDatos() {
      let rol_id = this.rol_sel['id'] ;
      let rol_desc = this.rol_sel['name']

      let usuario_id = this.usuario_sel['id'] ;
      let usuario = this.usuario_sel['name'] ;

      let nuevaFila = {
        id : 0,
        rol_id : rol_id,
        rol_desc: rol_desc,
        usuario_id : usuario_id,
        usuario: usuario,
        observaciones: "",
        activo : 'S'
      }

      // Se devuelven datos iniciales.
      return nuevaFila ;
    }

    public createColumnDefs() {
        return [
            { headerName: "id", field: "id",  hide: true, width: 100 },
            { headerName: "rol_id", field: "rol_id",  hide: true, width: 100 },
            { headerName: "Rol", field: "rol_desc", width: 300 },
            { headerName: "usuario_id", field: "usuario_id",  hide: true, width: 100 },
            { headerName: "Usuario", field: "usuario", width: 150, editable: true },
            { headerName: "Observaciones", field: "observaciones", width: 450,
              editable: true, celleditor: "largeText" },
            { headerName: "Activo", field: "activo", cellEditor : "select",
            cellEditorParams : {values: ['S','N']}, editable: true,  width: 100 }
        ];
    }
}

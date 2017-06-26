"use strict";
;
;
var GridComponent = (function () {
    //public objetoService : any ;
    function GridComponent(objetoService, tipo_borrado, tipo_modificacion, tipo_visualizacion) {
        this.objetoService = objetoService;
        this.tipo_borrado = tipo_borrado;
        this.tipo_modificacion = tipo_modificacion;
        this.tipo_visualizacion = tipo_visualizacion;
        // Atributos generales.
        this.filtro_recuperar = null;
        this.recargar_despues_actualizacion = false;
        this.msgs = [];
        // Atributos específicos de actualización de datos.
        this.filasBorradas = [];
        this.filasBorradasMD = [];
        this.celdasModificadas = [];
        // Configuración del ag-grid.
        this.configurarGrid();
    }
    GridComponent.prototype.inicializar = function () {
        // Inicialización de estructuras internas de control de modificación
        // del grid.
        this.filasBorradas = [];
        this.filasBorradasMD = [];
        this.celdasModificadas = [];
    };
    GridComponent.prototype.addCeldaModificada = function (oldValue, newValue, id, field, id_d) {
        // Creamos celda.
        var j = {};
        j.id = id;
        // ALGG 03-11-2016. Se tiene en cuenta el MD.
        j.id_d = 0;
        if (this.tipo_modificacion == 'maestro_detalle') {
            j.id_d = id_d;
        }
        ;
        j.field = field;
        j.valor_original = oldValue;
        j.valor_nuevo = newValue;
        // Y ala... dentro del saco.
        this.celdasModificadas.push(j);
    };
    GridComponent.prototype.actualizarCeldasModificadas = function (oldValue, newValue, id, field, id_d) {
        // ALGG 27-11-2016 Si el valor antiguo es igual al nuevo, nos vamos.
        if (oldValue == newValue) {
            return;
        }
        // Flag de evaluación.
        var insertarNuevaCelda = true;
        // Se busca en la bolsa de celdas modificadas.
        var i;
        console.log("celdasModificadas_: " + this.celdasModificadas);
        for (i in this.celdasModificadas) {
            // Si es una celda nula porque en ese hueco del array se eliminó ya
            // otra celda, se salta.
            if (i == null) {
                continue;
            }
            ;
            // Datos de celda actual
            var aux_valor_original = this.celdasModificadas[i].valor_original;
            var aux_valor_nuevo = this.celdasModificadas[i].valor_nuevo;
            var aux_id = this.celdasModificadas[i].id;
            var aux_id_d = undefined;
            if (this.tipo_modificacion == 'maestro_detalle') {
                aux_id_d = this.celdasModificadas[i].id_d;
            }
            var aux_field = this.celdasModificadas[i].field;
            /*
                    console.log("aux_id="+aux_id) ;
                    console.log("id="+id) ;
                    console.log("aux_field="+aux_field) ;
                    console.log("field="+field) ;
                    console.log("aux_valor_original="+aux_valor_original) ;
                    console.log("newValue="+newValue) ;
                    console.log("aux_id_d="+aux_id_d) ;
                    console.log("id_d="+id_d) ;
            */
            /*
            
                    if ((aux_id == id) && (aux_id_d == id_d) && (aux_field == field)) {
                        if (aux_valor_original == newValue) { console.log("IGUALES") }
                      else { console.log("diferentes")}
                    }
                    else { console.log("kk")}
                    */
            // Si la celda es en la fila y columna correcta, se evalúan los valores
            // que contienen.
            if ((aux_id == id) && (aux_id_d == id_d) && (aux_field == field)) {
                if (aux_valor_original == newValue) {
                    // El valor a actualizar es el mismo que el original. Se elimina
                    // esta celda, ya que se actualizó a algo que ya estaba.
                    delete this.celdasModificadas[i];
                    insertarNuevaCelda = false;
                    break;
                }
                else {
                    // Se va a actualizar con un nuevo valor, por lo que se cambia
                    // el campo newValue del objeto celda.
                    this.celdasModificadas[i].valor_nuevo = newValue;
                    insertarNuevaCelda = false;
                    break;
                }
            }
        }
        // La celda a modificar no está contemplada, por lo que se inserta
        // dentro de la bolsa de celdas a modificar... fácil y sencillo.
        if (insertarNuevaCelda) {
            //console.log("insertando celda") ;
            this.addCeldaModificada(oldValue, newValue, id, field, id_d);
        }
    };
    GridComponent.prototype.evaluarCeldaModificada = function (oldValue, newValue, id, field, id_d) {
        // ALGG 27-11-2016 Si el valor antiguo es igual al nuevo, nos vamos.
        if (oldValue == newValue) {
            return;
        }
        // Se trata celda para verificar si es una actualización.
        this.actualizarCeldasModificadas(oldValue, newValue, id, field, id_d);
        // Depuración.
        console.log(this.celdasModificadas);
    };
    GridComponent.prototype.onCellValueChanged = function ($event) {
        // Flag de estado.
        var ret = true;
        // Valor original de la celda.
        var oldValue = $event.oldValue;
        // Valor actualizado de la celda.
        var newValue = $event.newValue;
        // Identificador de la fila a partir del nodo.
        var id = $event.node.data.id;
        // ALGG 03-11-2016 Se incluye parámetro para M-D.
        var id_d = undefined;
        if (this.tipo_modificacion == 'maestro_detalle') {
            id_d = $event.node.data.id_d;
        }
        // Identificador de la columna.
        var celda = $event.colDef.field;
        // Se trata celda para verificar si es una actualización.
        this.actualizarCeldasModificadas(oldValue, newValue, id, celda, id_d);
        // Depuración.
        console.log(this.celdasModificadas);
    };
    GridComponent.prototype.configurarGrid = function () {
        // Se crea tipo.
        this.gridOptions = {};
        // ALGG 05-02-2017 Se configuran mensajes de overlays cuando no hay datos
        // o se están cargando.
        this.gridOptions.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Recupere información o espere a que se carguen datos</span>';
        this.gridOptions.overlayNoRowsTemplate = '<span style="padding: 10px; border: 2px solid #444; ' +
            ' background: lightgoldenrodyellow;">No se han encontrado datos</span>';
        // Se definen columnas.
        this.gridOptions.columnDefs = this.createColumnDefs();
        // 19-11-2016 Configuración de visualización.
        if (this.tipo_visualizacion == 'estatica') {
            this.gridOptions.enableFilter = false;
            this.gridOptions.enableSorting = false;
            this.gridOptions.enableColResize = false;
        }
        else if (this.tipo_visualizacion == 'planificacion_diaria') {
            // 19-01-2017 Configuración especial para la planificación diaria.
            this.gridOptions.enableFilter = false;
            this.gridOptions.enableSorting = true;
            this.gridOptions.enableColResize = false;
            this.gridOptions.rowSelection = 'simple';
        }
        else {
            // Se activa filtro de columnas.
            this.gridOptions.enableFilter = true;
            // Se permite selección múltiple de filas.
            this.gridOptions.rowSelection = 'multiple';
            // Se activa la ordenación de columnas.
            this.gridOptions.enableSorting = true;
            // Se activa el redimensionamiento de columnas.
            this.gridOptions.enableColResize = true;
        }
        // Se desactiva opción de eliminar columnas.
        this.gridOptions.suppressDragLeaveHidesColumns = true;
    };
    GridComponent.prototype.cancelarEdicion = function () {
        // Se cancelan posibles modificaciones, por defecto igual que recuperar.
        this.recuperar();
    };
    GridComponent.prototype.recuperar = function () {
        var _this = this;
        // Se limpian estructuras internas.
        this.inicializar();
        // Se llama a servicio de componente para recuperar información.
        this.objetoService.send_data(this.filtro_recuperar, 'recuperar')
            .subscribe(function (data) {
            _this.array_objetos = data;
            _this.rowData = _this.createRowData(_this.array_objetos);
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    GridComponent.prototype.guardar = function () {
        var _this = this;
        var filas_a_eliminar;
        // Se recuperan filas procesadas y su validación.
        var estado_datos = this.procesarFilas();
        // Se comprueba el estado.
        if (!estado_datos[0]) {
            // Se lanza error.
            this.mensajes('error_guardar_filas');
        }
        else {
            // Se recuperan filas a insertar.
            var filas_a_insertar_1 = estado_datos[1];
            if (this.tipo_borrado == 'maestro_detalle') {
                // Se recuperan filas a eliminar.
                filas_a_eliminar = this.filasBorradasMD;
            }
            else {
                // Se recuperan filas a eliminar.
                filas_a_eliminar = this.filasBorradas;
            }
            // Se recuperan celdas a modificar.
            var celdas_a_modificar = this.celdasModificadas;
            // Si no hay modificaciones, se informa.
            if ((celdas_a_modificar.length == 0)
                && (filas_a_insertar_1.length == 0)
                && (filas_a_eliminar.length == 0)) {
                this.mensajes('nada_actualizar');
            }
            else {
                // Se envía al servidor backend.
                var datos = {
                    filas_a_insertar: filas_a_insertar_1,
                    filas_a_eliminar: filas_a_eliminar,
                    celdas_a_modificar: celdas_a_modificar
                };
                var ret;
                var estado_backend;
                var mensaje_backend;
                // Se envían datos al backend.
                this.objetoService.send_data(datos, 'actualizar')
                    .subscribe(function (data) {
                    // Se recuperan los datos devueltos por el backend.
                    ret = data;
                    ret = _this.createRowData(ret);
                    // Flag de estado.
                    estado_backend = ret[0].estado;
                    // Mensaje del backend.
                    mensaje_backend = ret[1].mensaje;
                    console.log("estado " + estado_backend);
                    console.log("mensaje " + mensaje_backend);
                    // Evaluamos respuesta del backend... que listo que es...
                    if (estado_backend) {
                        // Si se realizaron inserciones se recarga, ya que hay que
                        // recuperar los id's de los nuevos registros.
                        if (filas_a_insertar_1.length != 0) {
                            _this.recuperar();
                        }
                        else {
                            if (_this.recargar_despues_actualizacion) {
                                _this.recuperar();
                            }
                            else {
                                // Si se borró o se actualizaron celdas, se limpia...
                                _this.inicializar();
                            }
                        }
                        _this.mensajes('exito_guardar');
                    }
                    else {
                        _this.mensajes('error_guardar', mensaje_backend);
                    }
                }, function (error) {
                    _this.errorMessage = error;
                    _this.mensajes('error_guardar', _this.errorMessage.toString());
                });
            }
        }
    };
    GridComponent.prototype.mensajes2 = function (opcion) {
        // Método para incluir nuevos mensajes.
        var ret = false;
        var severity;
        var summary;
        var mensaje;
        return [ret, severity, summary, mensaje];
    };
    GridComponent.prototype.mensajes = function (opcion, mensaje) {
        // Se visualizan mensajes según opcion.
        this.msgs = [];
        var severity;
        var summary;
        var detail;
        if (opcion == "error_guardar") {
            severity = 'error';
            summary = 'wShifts informa:';
            detail = mensaje;
        }
        if (opcion == "nada_actualizar") {
            severity = 'info';
            summary = 'wShifts informa:';
            detail = 'No hay nada para actualizar.';
        }
        if (opcion == "exito_guardar") {
            severity = 'success';
            summary = 'wShifts informa:';
            detail = 'Datos actualizados correctamente!';
        }
        /*
        if (opcion == "error_guardar_filas") {
          severity = 'error' ;
          summary = 'wShifts informa:' ;
          detail = 'Los campos usuario, contraseña e intentos ' +
                   'no pueden estar vacíos' ;
              }
        */
        var aux = this.mensajes2(opcion);
        if (aux[0]) {
            severity = aux[1];
            summary = aux[2];
            detail = aux[3];
        }
        // Se lanza mensaje.
        this.msgs.push({ severity: severity, summary: summary, detail: detail });
    };
    GridComponent.prototype.validaciones = function (modelo) {
        // ###############################################################
        // ESTE MÉTODO SE TENDRÁ QUE SOBREESCRIBIR PARA PODER REALIZAR LOS
        // CHEQUEOS DE LOS CAMPOS PARA CADA GRID EN PARTICULAR.
        // ###############################################################
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se itera por los nodos del modelo, para verificar que los datos son
        // correctos. Además se seleccionan las filas nuevas para ser devueltas
        // al backend.
        // ESTE MÉTODO SE TENDRÁ QUE SOBREESCRIBIR PARA PODER REALIZAR LOS
        // CHEQUEOS DE LOS CAMPOS PARA CADA GRID EN PARTICULAR.
        /*
        modelo.forEachNode(function(nodo_fila) {
          // Se chequean que haya datos para celdas específicas.
          if ((nodo_fila.data.nick.length == 0)
          || (nodo_fila.data.passwd.length == 0)
          || (nodo_fila.data.intentos.toString().length == 0)) { ret = false ; }
  
          // Si no cumple la validación, nos vamos.
          if ( !ret ) { return [ret, bolsa]} ;
  
          // Se recuperan las filas nuevas.
          if (nodo_fila.data.id == 0) {
            // Se incluye fila en la bolsa.
            bolsa.push({ id : nodo_fila.data.id,
                         persona_id : nodo_fila.data.persona_id,
                         nick : nodo_fila.data.nick,
                         passwd : nodo_fila.data.passwd,
                         fecha_alta : nodo_fila.data.fecha_alta,
                         // fecha_alta : new Date(parseInt(nodo_fila.data.fecha_alta)),
                         fecha_baja : nodo_fila.data.fecha_baja,
                         intentos : nodo_fila.data.intentos,
                         activo : nodo_fila.data.activo
                       }) ;
            // Depuración.
            console.log(bolsa) ;
          }
        })
        */
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    GridComponent.prototype.procesarFilas = function () {
        // Devuelve la tupla [estado, bolsa de filas a insertar].
        // Validaciones.
        var validaciones_filas;
        // Bandera de estado.
        var ret = true;
        // Bolsa de filas nuevas.
        var bolsa = [];
        // Se obtiene el modelo.
        var modelo = this.gridOptions.api.getModel();
        // Se realizan validaciones.
        validaciones_filas = this.validaciones(modelo);
        ret = validaciones_filas[0];
        bolsa = validaciones_filas[1];
        // Se devuelve la tupla [estado, datos].
        return [ret, bolsa];
    };
    GridComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {};
        // Se devuelven datos iniciales.
        return nuevaFila;
    };
    GridComponent.prototype.insertarFila = function () {
        var nuevoElemento = this.crearNuevaFilaDatos();
        this.gridOptions.api.addItems([nuevoElemento]);
    };
    GridComponent.prototype.duplicarFila = function () {
        // ALGG 02-11-2016 Función para duplicar filas que están seleccionadas
        // copiando todos los datos, excepto los que interesen. Se tiene que
        // hacer override de este método ya que dependerá del grid.
        // Se obtienen filas seleccionadas.
        var filaSel = this.gridOptions.api.getSelectedRows();
        // ALGG 02-11-2016 Se parametriza el tipo de borrado.
        filaSel.forEach(function (filaSeleccionada, index) {
            // Obtenemos los datos a duplicar, creamos nueva fila y la insertamos
            // en el grid.
        });
    };
    GridComponent.prototype.borrarFilaSeleccionada = function () {
        // Nos guardamos las filas que tenemos pendientes.
        var filasBorradas = this.filasBorradas;
        var filasBorradasMD = this.filasBorradasMD;
        // Se obtienen filas seleccionadas.
        var filaSel = this.gridOptions.api.getSelectedRows();
        // ALGG 02-11-2016 Se parametriza el tipo de borrado.
        if (this.tipo_borrado == 'maestro_detalle') {
            filaSel.forEach(function (filaSeleccionada, index) {
                filasBorradasMD.push({ 'id_m': filaSeleccionada.id,
                    'id_d': filaSeleccionada.id_d });
            });
        }
        else {
            filaSel.forEach(function (filaSeleccionada, index) {
                filasBorradas.push(filaSeleccionada.id);
            });
        }
        if (this.tipo_borrado == 'maestro_detalle') {
            this.filasBorradasMD = filasBorradasMD;
        }
        else {
            // Y ya tenemos todas las filas a borrar.
            this.filasBorradas = filasBorradas;
        }
        console.log("Filas a borrar con id = " + this.filasBorradas);
        console.log("Filas a borrar con id (m-d)= " + this.filasBorradasMD);
        // Se eliminan nodos seleccionados del grid.
        var filaSel2 = this.gridOptions.api.getSelectedNodes();
        this.gridOptions.api.removeItems(filaSel2);
    };
    GridComponent.prototype.exportarCSV = function () {
        var params = {
            fileName: this.nombre_fichero_csv
        };
        this.gridOptions.api.exportDataAsCsv(params);
    };
    GridComponent.prototype.createColumnDefs = function () {
        return [];
    };
    GridComponent.prototype.createRowData = function (d) {
        return d["data"];
    };
    return GridComponent;
}());
exports.GridComponent = GridComponent;
//# sourceMappingURL=GridComponent.js.map
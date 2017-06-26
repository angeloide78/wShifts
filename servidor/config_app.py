# -*- coding: utf-8 -*-
# ALGG 25-09-2016 Diseño de clases de configuración de aplicación.

class Basica(object):
    '''Clase de datos básicos de la aplicación'''

    def __init__(self, conn):
        '''Constructor'''
        
        # Conexión.
        self.__conn = conn

    def get_conf_aplic(self):
        '''Devuelve datos básicos de configuración de aplicación
        (version, revision, nombre, descripcion)'''
        
        c = self.__conn.get_basica()
            
        return c[0].version, c[0].revision, c[0].nombre, c[0].descripcion, \
               c[0].es_lunes_festivo, c[0].es_martes_festivo, \
               c[0].es_miercoles_festivo, c[0].es_jueves_festivo, \
               c[0].es_viernes_festivo, c[0].es_sabado_festivo, \
               c[0].es_domingo_festivo
    
    def get_basica(self):
        '''Devuelve: id, version, revision, nombre, descripcion, es_lunes_festivo,
        es_martes_festivo, es_miercoles_festivo, es_jueves_festivo, 
        es_viernes_festivo, es_sabado_festivo_es_domingo_festivo, licencia,
        empresa'''

        ret = self.__conn.get_basica()

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('version', ret[i].version)
            d.setdefault('revision', ret[i].revision)
            d.setdefault('nombre', ret[i].nombre)
            d.setdefault('descripcion', ret[i].descripcion)
            d.setdefault('es_lunes_festivo', ret[i].es_lunes_festivo)
            d.setdefault('es_martes_festivo', ret[i].es_martes_festivo)
            d.setdefault('es_miercoles_festivo', ret[i].es_miercoles_festivo)
            d.setdefault('es_jueves_festivo', ret[i].es_jueves_festivo)
            d.setdefault('es_viernes_festivo', ret[i].es_viernes_festivo)
            d.setdefault('es_sabado_festivo', ret[i].es_sabado_festivo)
            d.setdefault('es_domingo_festivo', ret[i].es_domingo_festivo)
            d.setdefault('licencia', ret[i].licencia)
            d.setdefault('empresa', ret[i].empresa)
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_basica(self, datos):
        '''Actualización de datos.
        Tabla: basica
        '''
        # Lista de celdas a modificar. Cada elemento es un diccionario que 
        # contiene los elementos necesarios para modificar el campo.
        celdas = datos['celdas_a_modificar'] 

        # Lista de filas a insertar.
        filas_a_insertar = datos['filas_a_insertar']

        # Lista de filas a eliminar.
        filas_a_eliminar = datos['filas_a_eliminar'] ;

        # ###############################
        # TRATAMIENTO DE FILAS A ELIMINAR
        # ###############################

        # Eliminamos identificadores 0, que son aquellos de filas nuevas que 
        # se eliminaron antes de ser guardadas en BD.
        try: 
            while True: filas_a_eliminar.remove(0)
        except: pass

        # #################################
        # TRATAMIENTO DE CELDAS A MODIFICAR
        # #################################

        # Eliminamos celdas con identificador 0, ya que son celdas que 
        # pertenecen a filas que son nuevas y que se insertarán como elementos
        # nuevos. También eliminamos aquellas celdas que pertenezcan a filas 
        # que ya hayan sido eliminadas, ya que puede darse el caso de 
        # modificar celdas y luego eliminar la fila de la celda modificada.

        aux = []

        for i in celdas:
            if i is None: continue
            if i['id'] == 0: continue
            if i['id'] in filas_a_eliminar: continue
            aux.append(i)

        celdas = aux 

        # ##############
        # ENVÍO DE DATOS
        # ##############

        ret, msj = self.__conn.actualizar_basica(celdas, \
                                                 filas_a_insertar, \
                                                 filas_a_eliminar)

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.
        return ret
  
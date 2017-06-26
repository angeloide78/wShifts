# -*- coding: utf-8 -*

# ALGG 14-01-2017 Creación de módulo de asignaciones de puestos a trabajadores.

class Tarea(object):
    '''Clase Tarea'''
    
    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn
    
    def get_tarea(self, equipo_id = None, anno = None):
        '''Devuelve: (id, p_id, p_cod, p_desc, fecha_inicio, fecha_fin, 
        observ, contrato_id, persona_id, nombre, ape1, ape2, dni, solapado)
        Opciones de filtrado: equipo_id <id equipo>, anno <año en donde está
        en vigor la asignación
        '''

        ret = self.__conn.get_tarea(equipo_id, anno)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('p_id', ret[i].p_id)
            d.setdefault('p_cod', ret[i].p_cod)
            d.setdefault('p_desc', ret[i].p_desc)
            d.setdefault('fecha_inicio', ret[i].fecha_inicio)
            d.setdefault('fecha_fin', ret[i].fecha_fin)
            d.setdefault('observ', ret[i].observ)
            d.setdefault('contrato_id', ret[i].contrato_id)
            d.setdefault('fecha_inicio_c', ret[i].fecha_inicio_c)
            d.setdefault('fecha_fin_c', ret[i].fecha_fin_c)
            d.setdefault('persona_id', ret[i].persona_id)
            d.setdefault('nombre', ret[i].nombre)
            d.setdefault('ape1', ret[i].ape1)
            d.setdefault('ape2', ret[i].ape2)
            d.setdefault('dni', ret[i].dni)
            d.setdefault('solapado', ret[i].solapado)
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_tarea(self, datos):
        '''Actualización de datos.
        Tabla: tarea
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
       
        msj = '''
        celdas a modificar: %s
        filas a eliminar: %s
        filas a insertar: %s'''
        
        # ##############
        # ENVÍO DE DATOS
        # ##############
        
        ret, msj = self.__conn.actualizar_tarea(celdas, \
                                                filas_a_insertar, \
                                                filas_a_eliminar)
        
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
        
        # Devolvemos estado.
        return ret      
    
class AsignarTrabajador(object):
    '''Trabajadores candidatos a asignación'''
    
    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn
    
    def get_asignar_trabajador(self, equipo_id, fecha):
        '''Devuelve: Los trabajadores que tienen contrato a "fecha" dada, cuya
        categoría profesional por contrato está contemplada dentro del 
        equipo de trabajo "equipo_id". Si además tiene asignaciones en esa fecha
        dada, también saldrán.
        (trab_id, dni, ape1, ape2, nombre, fini_c, ffin_c, tarea_id, fini_t, 
        ffin_t, eq_id, eq_cod, eq_desc)
        '''

        ret = self.__conn.get_asignar_trabajador(equipo_id, fecha)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('trab_id', ret[i].trab_id)
            d.setdefault('dni', ret[i].dni)
            d.setdefault('ape1', ret[i].ape1)
            d.setdefault('ape2', ret[i].ape2)
            d.setdefault('nombre', ret[i].nombre)
            d.setdefault('contrato_id', ret[i].contrato_id)
            d.setdefault('fini_c', ret[i].fini_c)
            d.setdefault('ffin_c', ret[i].ffin_c)
            d.setdefault('tarea_id', ret[i].tarea_id)
            d.setdefault('fini_t', ret[i].fini_t)
            d.setdefault('ffin_t', ret[i].ffin_t)
            d.setdefault('eq_id', ret[i].eq_id)
            d.setdefault('eq_cod', ret[i].eq_cod)
            d.setdefault('eq_desc', ret[i].eq_desc)
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data            
    
class CambioTurno(object):
    '''Clase CambioTurno'''
    
    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def set_cambio_turno(self, datos):
        '''Actualización de datos.
        Tabla: cambio_turno
        '''
        
        ret = True
        msj = "Todo correcto"
        
        # Se desmenuzan los datos a actualizar.
        tarea_id = datos['tarea_id']
        turno_original = datos['turno_original']
        turno_modificado = datos['turno_modificado']
        dia = "%s-%s-%s" % (str(datos['anno']), str(datos['mes']), \
                            str(datos['celda'][3:]))
        observaciones = None
        
        # ##############
        # ENVÍO DE DATOS
        # ##############
        
        ret, msj = self.__conn.actualizar_cambio_turno(dia, \
                                                       tarea_id, \
                                                       turno_modificado, \
                                                       turno_original, 
                                                       observaciones)
        
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
        
        # Devolvemos estado.
        return ret         
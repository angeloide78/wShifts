# -*- coding: utf-8 -*

# ALGG 03-01-2017 Creación de módulo jornada_teorica.

class JornadaTeorica(object):

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn        
    
    def get_jt(self, centro_fisico_id = None, anno = None):
        '''Devuelve: (id, cf_id, cf_cod, cf_desc, anno, 
        total_horas_anual, observaciones)
        Tabla: jornada_teorica
        Opciones de filtrado: Id de centro físico <centro_fisico_id>, 
        año de calendario laboral <anno>
        '''    

        # Se recuperan todos las jornadas teóricas.
        ret = self.__conn.get_jt(centro_fisico_id, anno)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}

            # ID ficticio.
            ID = str(ret[i].anno) + str(ret[i].cf_id) 

            # Se forma diccionario.
            d.setdefault('id', ID)
            d.setdefault('cf_id', ret[i].cf_id)
            d.setdefault('cf_cod', ret[i].cf_cod)
            d.setdefault('cf_desc', ret[i].cf_desc)
            d.setdefault('anno', ret[i].anno)
            d.setdefault('total_horas_anual', ret[i].total_horas_anual)
            d.setdefault('observaciones', ret[i].observaciones)
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data                

    def set_jt(self, datos):

        ret = True
        msj = ''
        
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

            try: 
                if i['field'] == 'total_horas_anual':
                    int(i['valor_nuevo'])
            except: 
                ret = False
                msj = u'Solo se permiten valores numéricos'
                break               
            
            aux.append(i)

        celdas = aux 

        # ###############################
        # TRATAMIENTO DE FILAS A INSERTAR
        # ###############################

        # Se comprueba que los datos son numéricos.
        for i in filas_a_insertar:
            try: int(i['total_horas_anual'])
            except: 
                ret = False
                msj = u'Solo se permiten valores numéricos'
                break

        # ##############
        # ENVÍO DE DATOS
        # ##############
            
        if ret:
            ret, msj = self.__conn.actualizar_jt(celdas, \
                                                 filas_a_insertar, \
                                                 filas_a_eliminar)

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.
        return ret    



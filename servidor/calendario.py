# -*- coding: utf-8 -*

# ALGG 06-11-2016 Creación de módulo calendario. Un calendario pertenece a un 
# centro físico. Todo centro físico tiene uno o varios calendarios. Un centro 
# físico tiene un único calendario por año. En un calendario se definen los 
# días festivos.

from datetime import datetime
from w_model import w_calendar

class CalendarioFestivo(object):
    
    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn        
        # Estructura de calendarios.
        self.__calendarios = []
   
    def newCalendarioFestivo(self, anno):
        '''Creación de calendario de días festivos'''
        
        # Se busca si son festivos el sábado y domingo en la tabla básica de
        # configuración de la aplicación.
        ret = self.__conn.get_basica()
        es_sabado_festivo = ret[4]
        es_domingo_festivo = ret[5]
        if es_domingo_festivo.upper() == 'S': es_domingo_festivo = True
        else: es_domingo_festivo = False
        if es_sabado_festivo.upper() == 'S': es_sabado_festivo = True
        else: es_sabado_festivo = False
        
        # Se crea un calendario con los festivos para sábado y domingo.
        dias_festivos = None
        if es_domingo_festivo or es_sabado_festivo:
            c = w_calendar()
            dias_festivos = c.getCalendario(anno, [], \
                                            es_sabado_festivo, \
                                            es_domingo_festivo)
    
        # Se devuelve lista de dias festivos.
        return dias_festivos
    
    def newFestivo(self, centro_fisico_id, (anno, mes, dia), descripcion, observaciones):
        '''Creación de día festivo'''
        
        dia_festivo = {'centro_fisico_id' : centro_fisico_id,
                       'festivo' : (anno, mes, dia),
                       'descripcion' : descripcion,
                       'observaciones' : observaciones}        
        
        self.__calendarios.append(dia_festivo)
        
    def getFestivosByCentroFisicoId(self, idCentroFisico, anno = None):
        '''Devuelve días festivos a partir del id de un Centro Físico. Si anno
        es None devuelve todos los festivos. Si anno es un año devuelve los 
        festivos de ese año'''
        
        festivo = []
        for i in self.__calendarios:
            if i['centro_fisico_id'] == idCentroFisico:
                if anno is None: festivo.append(i)
                else: 
                    if i['festivo'][0] == anno: festivo.append(i)
                
        return festivo
    
    def get_calendario_festivo(self, centro_fisico_id = None, anno = None):
        '''Devuelve: (id, centro_fisico_id, cod_cf, desc_cf, año, fecha_festivo,
	desc_festivo, observ_festivo)
        Tabla: calendario_festivo
	Opciones de filtrado: Id de centro físico <centro_fisico_id>, 
	año de calendario laboral <anno>
        '''    
        
        # Se recuperan todos los calendarios de festividades.
        ret = self.__conn.get_calendario_festivo(centro_fisico_id, anno)
        
        # Diccionario principal. 
        data = {}
        
        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        
        
        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            
            # ALGG 27112016 Se forma un ID ficticio compuesto por las PK, que
            # en este caso es el centro_fisico_id y la fecha de festivo.
            ID = self.__montar_pk(ret[i].centro_fisico_id, ret[i].fecha_festivo)
            
            # Se forma diccionario.
            d.setdefault('id', ID)
            d.setdefault('centro_fisico_id', ret[i].centro_fisico_id)
            d.setdefault('cod_cf', ret[i].cod_cf)
            d.setdefault('desc_cf', ret[i].desc_cf)
            d.setdefault('anno', ret[i].anno)
            d.setdefault('fecha_festivo', ret[i].fecha_festivo)
            d.setdefault('desc_festivo', ret[i].desc_festivo)
            d.setdefault('observ_festivo', ret[i].observ_festivo)
            # Se añade diccionario a la lista.
            lista.append(d)
    
        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data                
            
    def __montar_pk(self, centro_fisico_id, fecha):
        '''Monta clave primaria de calendario festivo'''
        
        return str(centro_fisico_id) + str(fecha).replace('-','')

    def __desmontar_pk(self, pk):
        '''Devuelve tupla que es pk conjunta a partir de la pk pasada como 
        parámetro'''
        
        fecha = '%s-%s-%s' % (pk[-8][0:4], pk[-8:][4:6], pk[-8:][6:8])
        centro_fisico_id = pk[0:len(pk) - 8]

        return centro_fisico_id, fecha
        

    def set_calendario_festivo(self, datos):
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
        
        # Cambiamos el ID ficticio por los ID's que forman la PK.
        #for i in range(len(filas_a_eliminar)):
        #    # Se recupera la id ficticia (compuesta).
        #    id_ficticia = filas_a_eliminar[i]
        #    centro_fisico_id, fecha = self.__desmontar_pk(id_ficticia)
        #    # Se incluye PK compuesta en la fila a eliminar como una tupla.
        #    filas_a_eliminar[i] = (centro_fisico_id, fecha)
        
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
            # Se recupera PK compuesta.
            # centro_fisico_id, fecha = self.__desmontar_pk(i['id'])
            # Si está eliminada, se salta.
            # if (centro_fisico_id, fecha) in filas_a_eliminar: continue
            aux.append(i)
            
        celdas = aux 
            
        # ###############################
        # TRATAMIENTO DE FILAS A INSERTAR
        # ###############################
         
        # En este caso hay que controlar que las filas a insertar no hayan 
        # sido eliminadas.
         
        aux = []
         
        for i in filas_a_insertar:
            if i['id'] in filas_a_eliminar: continue
            aux.append(i)
         
        msj = '''
        celdas a modificar: %s
        filas a eliminar: %s
        filas a insertar: %s'''
         
        # ##############
        # ENVÍO DE DATOS
        # ##############
         
        msj = '''
        celdas a modificar: %s
        filas a eliminar: %s
        filas a insertar: %s''' % (celdas, filas_a_eliminar, filas_a_insertar)
         
         
        print(msj)
        # return {'data' : [{'estado' : True}, {'mensaje' : msj}]}
    
        ret, msj = self.__conn.actualizar_calendario_festivo(celdas, \
                                                             filas_a_insertar, \
                                                             filas_a_eliminar)
        
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
         
        # Devolvemos estado.
        return ret    
       
        
    
    
        
        
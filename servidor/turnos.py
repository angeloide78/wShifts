# -*- coding: utf-8 -*

# ALGG 01-11-2016 Creación de módulo para transacción de datos.
# ALGG 18-11-2016 Rediseño de gestión de ciclos.

from w_model import w_ciclo, w_turno, w_planificacion, w_calendar
from pprint import pprint

class Turno(object):
    '''Clase Turno'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def __tratar_datos_a_actualizar(self, datos):
        '''Recuperación de datos a actualizar: inserciones, eliminaciones,
        modificaciones de grid'''

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

        # ALGG 03-11-2016 Eliminamos identificadores con id maestro 0 ó con 
        # id_detalle a 0.

        bolsa = []

        for i in filas_a_eliminar:
            if i['id_m'] != 0 and i['id_d'] != 0: bolsa.append(i)

        filas_a_eliminar = bolsa

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
            # Se forma el diccionario de id's maestro - detalle.
            item = {'id_d' : i['id_d'], 'id_m' : i['id']}            
            if item in filas_a_eliminar: continue
            # ALGG 03-11-2016 Nos saltamos el caso de inserción de detalle.
            if i['id'] != 0 and i['id_d'] == 0: continue
            # Se mapean los datos... a lo Walt Disney...
            mickey = i['valor_nuevo'] 
            minnie = i['valor_original']
            i['valor_nuevo'] = self.__mapear_cadena(i['valor_nuevo'])
            i['valor_original'] = self.__mapear_cadena(i['valor_original'])            
            if i['valor_nuevo'] is None:
                # ...ups! ... parece que no es lo que pensaba...
                i['valor_nuevo']  = mickey
                i['valor_original'] = minnie

            # Incluimos lo demás, que será lo que habrá que actualizar.
            aux.append(i)

        celdas = aux 

        # ###############################
        # TRATAMIENTO DE FILAS A INSERTAR
        # ###############################

        # ALGG 03-11-2016 Se controla que las filas a insertar no hayan sido 
        # eliminadas teniendo en cuenta que son maestro-detalle.

        aux = []

        for i in filas_a_insertar:
            # Se forma el diccionario de id's maestro - detalle.
            item = {'id_d' : i['id_d'], 'id_m' : i['id']}
            # Se excluyen si van a eliminarse.
            if item in filas_a_eliminar: continue
            # Se mapean los datos...
            i['dia_inicial_d'] = self.__mapear_cadena(i['dia_inicial_d'])
            i['dia_final_d'] = self.__mapear_cadena(i['dia_final_d'])
            # Y se añade lo que queda.
            aux.append(i)

        msj = '''
            celdas a modificar: %s
            filas a eliminar: %s
            filas a insertar: %s''' % (str(celdas), \
                                       str(filas_a_eliminar), \
                                       str(filas_a_insertar))

        print(msj)

        # Se devuelven datos desglosados.
        return celdas, filas_a_insertar, filas_a_eliminar  

    def __mapear_cadena(self, dato):
        '''Mapeo de cadena'''
        try:
            if dato == 0: return('Actual')
            if dato == -1: return('Anterior')
            if dato == 1: return('Siguiente')
        except: pass
        try:
            if dato == 'Actual': return(0)
            if dato == 'Anterior': return(-1)
            if dato == 'Siguiente': return(1)
        except: pass

        # Devolvemos nulo si pasa por aquí...
        return None

    def get_turno(self, codigo_turno = None, es_activo = None, \
                  solo_libres = False):
        '''Devuelve: (id, codigo, descripcion, activo, id_detalle, dia_inicial
        dia_final, hora_inicio, hora_fin)
        Tablas: turno_master y turno_detail 
        Opciones de filtrado: activo <'S','N'>, codigo <código turno>
        '''

        ret = self.__conn.get_turno(codigo = codigo_turno, \
                                    activo = es_activo, \
                                    solo_libres = solo_libres)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id_m)
            d.setdefault('codigo_m', ret[i].codigo_m)
            d.setdefault('descripcion_m', ret[i].descripcion_m)
            d.setdefault('cuenta_horas_m', ret[i].cuenta_horas_m)
            d.setdefault('activo_m', ret[i].activo_m)
            d.setdefault('id_d', ret[i].id_d)
            d.setdefault('dia_inicial_d', self.__mapear_cadena(ret[i].dia_inicial_d))
            d.setdefault('dia_final_d', self.__mapear_cadena(ret[i].dia_final_d))
            d.setdefault('hora_inicio_d', ret[i].hora_inicio_d)
            d.setdefault('hora_fin_d', ret[i].hora_fin_d)
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def __formar_turno(self, turno):
        '''Devuelve un objeto turno de tipo w_turno'''
        # Formación de cabecera de maestro.
        id_m = turno[0][0]
        codigo_m = turno[0][1]
        descripcion_m = turno[0][2]
        cuenta_horas_m = turno[0][3]
        activo_m = turno[0][4]
        # Formación de cabecera de detalle.
        horario = []
        for i in range(len(turno)):
            horario.append([{'id' : turno[i][5]},
                            {'dia_inicial' : turno[i][6]}, 
                            {'dia_final' : turno[i][7]}, 
                            {'hora_inicio': turno[i][8]}, 
                            {'hora_fin' : turno[i][9]}])        
        # Se devuelve turno.
        return id_m, codigo_m, descripcion_m, cuenta_horas_m, activo_m, horario

    def formarTurno(self, turno):
        return self.__formar_turno(turno)
    
    def set_turno(self, datos):
        '''Actualización de datos.
        Tablas: turno_master y turno_detail
        '''

        celdas, filas_a_insertar, filas_a_eliminar = \
            self.__tratar_datos_a_actualizar(datos)

        # Bandera de continuación de ejecución.
        ret = True

        # ALGG 04-11-2016 Validación en la formación de turnos. Se crean objetos
        # turnos a partir de los datos que provienen del frontend, para verificar
        # que su configuración es la correcta para ser guardada en la BD.

        # ALGG 05-11-2016 Pueden darse la casuística de insertar una extensión 
        # de un turno que solape en horario con otro que ya esté incluido en la BD. 

        # ######################################################################
        # Verificación de elementos a insertar.
        # ######################################################################

        t = w_turno()
        procesado = []
        for i in filas_a_insertar:
            horario = []
            # Construcción de horario cuando el turno no existe.
            if i['id'] == 0:
                horario.append([{'id' : 1},
                                {'dia_inicial' : i['dia_inicial_d']}, 
                                {'dia_final' : i['dia_final_d']}, 
                                {'hora_inicio': i['hora_inicio_d']}, 
                                {'hora_fin' : i['hora_fin_d']}])

                # Inserción de turno en clase. Al insertar se valida automáticamente
                # la formación del turno, devolviendo False y mensaje de error en 
                # caso de que el turno esté mal formado y True si todo ha ido bien.
                ret, msj = t.newTurno(codigo = i['codigo_m'], \
                                      descripcion = i['descripcion_m'], \
                                      horario = horario, \
                                      cuenta_horas = i['cuenta_horas_m'], \
                                      activo = i['activo_m'], \
                                      chequearRepeticionCodigo=True)

                if not ret: break

            else:
                # En este caso el maestro existe (id <> 0) pero el detalle es 
                # 0 (id_d = 0). Por tanto hay que buscar en la base de datos el
                # turno, traernos toda su información e incluir los horarios para
                # que se verifiquen si es correcto o no. No hay que hacer nada 
                # más... fácil y sencillo...

                # Construcción del horario cuando el turno existe y se está
                # extendiendo.
                if i['id'] in procesado: continue
                procesado.append(i['id'])

                # Nos traemos el turno entero de la base de datos ...
                turno = self.__conn.get_turno(id_m = i['id'])

                print("Turno de la BD: " + str(turno))

                # Se forma el turno.
                id_m, codigo_m, descripcion_m, cuenta_horas_m, \
                    activo_m, horario = self.__formar_turno(turno)

                # Se instancia la clase w_turno y se crea el turno.
                # t = w_turno()
                ret, msj = t.newTurno(_id = id_m, codigo = codigo_m, \
                                      descripcion = descripcion_m, \
                                      horario = horario, \
                                      cuenta_horas = cuenta_horas_m, \
                                      activo = activo_m)                

                # Este punto no debería saltar nunca, ya que se supone que el 
                # turno está bien formado si está guardado en la base de datos.
                if not ret: break

                print("Estado1: " + str(ret) + " Mensaje: " + str(msj))

                # Se extiende el horario del turno, devolviendo si ha habido
                # algún tipo de error.
                ret, turno = t.getTurnoByCodigo(codigo_m)

                print("Estado2: " + str(ret) + " Mensaje: " + str(msj))

                if ret: 
                    # Recuperamos todas las filas extendidas (podría haber más
                    # de una extensión para un mismo turno), e incluimos su
                    # horario en el turno que hemos recuperado de la BD, para
                    # controlar si hay solapamientos.
                    for j in filas_a_insertar:
                        if j['id'] == i['id']:
                            ret, msj = \
                                t.extenderHorarioTurno(turno, j['dia_inicial_d'], \
                                                       j['dia_final_d'], \
                                                       j['hora_inicio_d'], \
                                                       j['hora_fin_d'])
                            if not ret: break

                    print("Estado3: " + str(ret) + " Mensaje: " + str(msj))

                # Si no ha ido bien, salimos del bucle.
                if not ret: break

        # ALGG 05-11-2016 Se recuperan de la BD los turnos que se van a modificar.
        # Para cada turno se incluye la modificación que se ha realizado.
        # Se incluyen los turnos en w_turno para su comprobación. Si todo es
        # correcto, se actualizan los campos normalmente.
        # Hay que tener en cuenta que puede darse el caso de que se modifiquen
        # datos del maestro o del detalle, por lo que hay que tenerlo en cuenta.

        # ######################################################################
        # Verificación de elementos a modificar.
        # ######################################################################

        if ret:
            # Se recuperan todos los identificadores maestros de las celdas 
            # a modificar.
            ids_maestros = []
            for i in celdas: ids_maestros.append(i['id'])
            # Se recuperan de la BD los turnos que se van a modificar a partir
            # de los identificadores de maestros.
            turnos = []
            for i in ids_maestros: 
                turno = self.__conn.get_turno(id_m = i)
                # Como el resultado es una lista de tuplas, donde cada tupla
                # es una fila, hay que convertir esas tuplas en listas, para
                # poder modificar sus elementos... ya que las tuplas son 
                # inmutables... Luke... i'm your father...
                aux = []
                for k in turno: aux.append(list(k))
                turno = aux
                if turno not in turnos: turnos.append(turno)

            # Modificación de campos de turnos.
            print("Filas a modificar: " + str(turnos))
            p = -1
            for turno in turnos:
                p += 1
                for i in range(len(turno)):
                    for j in celdas:
                        # Para cada turno, se modifica, si procede, su maestro.
                        if j['id'] == turno[i][0] \
                           and j['field'] == 'codigo_m': 
                            turnos[p][i][1] = j['valor_nuevo']
                        if j['id'] == turno[i][0] \
                           and j['field'] == 'descripcion_m': 
                            turnos[p][i][2] = j['valor_nuevo']
                        if j['id'] == turno[i][0] \
                           and j['field'] == 'activo_m': 
                            turnos[p][i][3] = j['valor_nuevo']                        
                        # Para cada turno, se modifica, si procede, su detalle.
                        if j['id'] == turno[i][0] and j['id_d'] == turno[i][4]:
                            if j['field'] == 'dia_inicial_d':
                                turnos[p][i][5] = j['valor_nuevo']
                            if j['field'] == 'dia_final_d': 
                                turnos[p][i][6] = j['valor_nuevo']
                            if j['field'] == 'hora_inicio_d': 
                                turnos[p][i][7] = j['valor_nuevo']
                            if j['field'] == 'hora_fin_d': 
                                turnos[p][i][8] = j['valor_nuevo']

            # Verificación de elementos a insertar.
            t = w_turno()
            for turno in turnos:
                # Se forma el turno.
                id_m, codigo_m, descripcion_m, cuenta_horas_m, \
                    activo_m, horario = self.__formar_turno(turno)
                # Se guarda el turno, para su validación.
                ret, msj = t.newTurno(_id = id_m, codigo = codigo_m, \
                                      descripcion = descripcion_m, \
                                      horario = horario, \
                                      cuenta_horas=cuenta_horas_m, \
                                      activo = activo_m)
                # Si hay error, salimos.
                if not ret: break

        # ALGG 16-02-2017. Se comprueba en los turnos a eliminar si existe 
        # algún ciclo que está usando esos turnos desdichados... o esté como
        # cambio de turno en alguna planilla... ;)
                
        if ret:
            for i in filas_a_eliminar:
                if self.__conn.exists_turno_en_ciclo(turno_id = i['id_m']):
                    ret, msj = False, u"El turno está siendo usado en ciclos"
                    break
                
                if self.__conn.exists_turno_en_cambio_turno(turno_id = i['id_m']):
                    ret, msj = False, u"El turno está siendo usado en una " + \
                        u" planilla, como un cambio de turno"
                    break

        if ret:
            # ##############
            # ENVÍO DE DATOS
            # ##############

            ret, msj = self.__conn.actualizar_turno(celdas, \
                                                    filas_a_insertar, \
                                                    filas_a_eliminar)

        print("Turno.set_turno: ret = %s, msj = %s" % (str(ret), str(msj)))

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.

        # ret = {'data' : [{'estado' : True}, {'mensaje' : 'Todo ok'}]}
        return ret

class Ciclo(object):
    '''Clase Ciclo'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_ciclo(self, id_ciclo = None, es_activo = None, semana = False):
        '''Devuelve: (id, codigo, descripcion, cuenta_festivo, activo, 
        id_detalle, numero_dia, turno_master_id
        Tablas: ciclo_master y ciclo_detail 
        Opciones de filtrado: activo <'S','N'>, codigo <código ciclo>'''

        ret = self.__conn.get_ciclo(id_ = id_ciclo, activo = es_activo)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        # Se crea diccionario.
        d = {}

        if semana is False:

            # Centinela.
            centinela = None
            primera_vez = True

            # Se itera, para formar el ciclo.
            for i in range(len(ret)):
                if centinela != ret[i].id_m:
                    # Centinela ahora es el patrón actual.
                    centinela = ret[i].id_m

                    if primera_vez:
                        primera_vez = False
                    else:
                        # Se añade diccionario a la lista.
                        d['ciclo_d'] = d['ciclo_d'].strip()
                        lista.append(d)

                    # Se reinicia diccionario.
                    d = {}

                    # Se forma diccionario.
                    d.setdefault('id', ret[i].id_m)
                    d.setdefault('codigo_m', ret[i].cod_m)
                    d.setdefault('descripcion_m', ret[i].desc_m)
                    d.setdefault('cuenta_festivo_m', ret[i].cuenta_festivo_m)
                    d.setdefault('activo_m', ret[i].activo_m)
                    d.setdefault('ciclo_d', str(ret[i].cod_turno_d))
                    patron = '%s ' % str(ret[i].cod_turno_d)

                else:
                    patron += '%s ' % str(ret[i].cod_turno_d)
                    d['ciclo_d'] = patron

            
            try:
                # Se añade el último elemento a la lista.
                d['ciclo_d'] = d['ciclo_d'].strip()        
                lista.append(d)            
            except: pass

        else:
            # ALGG 19-11-2016 Se construye el ciclo semanal.
            t = w_turno()
            lista_turnos = []
            # Se itera, para recuperar el conjunto de turnos originales.
            for i in range(len(ret)): lista_turnos.append(str(ret[i].cod_turno_d))
            # Se crea el ciclo por semanas.
            c = w_ciclo()
            ciclo_semanal = c.getCicloSemanalPorCodTurno(lista_turnos)
            
            # ALGG 18-02-2017 Se buscan las horas del ciclo.
            horas_ciclo = self.__conn.get_horas_ciclo(ciclo_semanal)
            
            # Se incluye el número de semana.
            for num_semana in range(len(ciclo_semanal)):
                ciclo_semanal[num_semana].insert(0, num_semana + 1)
            # ALGG 20-11-2016 Se forma la lista de diccionarios, donde cada
            # diccionario es una semana.
            for i in ciclo_semanal:
                d = {}
                d.setdefault('semana', i[0])
                d.setdefault('lunes', i[1])
                d.setdefault('martes', i[2])
                d.setdefault('miercoles', i[3])
                d.setdefault('jueves', i[4])
                d.setdefault('viernes', i[5])
                d.setdefault('sabado', i[6])
                d.setdefault('domingo', i[7])
                d.setdefault('horas', horas_ciclo[0][0])
                d.setdefault('minutos', horas_ciclo[0][1])
                
                # Se añade al diccionario.
                lista.append(d)  

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        pprint(data)
        return data        

    def __tratar_datos_a_actualizar(self, datos):
        '''Recuperación de datos a actualizar: inserciones, eliminaciones,
        modificaciones de grid'''

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

        # ALGG 20-11-2016 Eliminamos identificadores 0, que son aquellos de 
        # filas nuevas que se eliminaron antes de ser guardadas en BD.

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
            filas a insertar: %s''' % (str(celdas), \
                                       str(filas_a_eliminar), \
                                       str(filas_a_insertar))

        print(msj)

        # Se devuelven datos desglosados.
        return celdas, filas_a_insertar, filas_a_eliminar  
  
    def set_ciclo(self, datos):
        '''Actualización de datos.
        Tablas: ciclo_master y ciclo_detail
        '''

        celdas, filas_a_insertar, filas_a_eliminar = \
            self.__tratar_datos_a_actualizar(datos)

        # Bandera de continuación de ejecución y mensaje.
        ret = True
        msj = "Datos guardados correctamente"

        # ######################################################################
        # Verificación de elementos a insertar.
        # ######################################################################

        # Para la inserción se definen las códigos (abreviaturas) de los turnos
        # (actividades). Por tanto es necesario verificar que las actividades
        # incluidas son válidas.  Además hay que verificar que las actividades 
        # contiguas no se solapen en el tiempo.

        # Se crea objeto turno, para crear turno formateado.
        tt = Turno(None)
        
        # Se crea objeto turno, para hacer verificaciones.
        t = w_turno()
        
        # ALGG 22-11-2016 Se define bolsa de identificadores de actividades.
        bolsa_id_turnos_insercion = []
        
        # Se itera sobre las filas a insertar.
        for i in filas_a_insertar:
            bolsa_id_turnos_aux = []
            # Bandera de ejecución...
            if not ret: break
            # Se crea lista de turnos y se quitan espacios en blanco.
            ciclo = i['ciclo_d'].split(" ")
            aux = []
            for j in range(len(ciclo)): 
                if len(ciclo[j].strip()) != 0: aux.append(ciclo[j].strip())
            ciclo = aux
            pprint(ciclo)
            # Para cada código de turno, se busca en la base de datos.
            for j in ciclo:
                turno = self.__conn.get_turno(codigo = j, activo = 'S')
                # Si no hay datos, el turno no existe.
                if len(turno) == 0:
                    ret = False
                    msj = u"El turno %s no existe o no está activo" % str(j)
                    break
                # Se recuperan datos del turno obtenido de la base de datos.
                id_m, codigo_m, descripcion_m, cuenta_horas_m, \
                    activo_m, horario = tt.formarTurno(turno)
                # Nos guardamos el identificador del turno.
                bolsa_id_turnos_aux.append(id_m)
                # Y ahora se incluye en el objeto w_turno, fácil y sencillo, no?
                ret, msj = t.newTurno(_id = id_m, codigo = codigo_m, \
                                      descripcion = descripcion_m, \
                                      horario = horario, \
                                      cuenta_horas = cuenta_horas_m, \
                                      activo = activo_m, \
                                      chequearRepeticionCodigo = False)
                
                # Se comprueba si hay error.
                if not ret: break  
            
            # Guardamos la bolsa en la bolsa total.
            bolsa_id_turnos_insercion.append(bolsa_id_turnos_aux)
   
        if ret:
            # Se comprueba si hay solapamiento horario entre turnos contiguos.
            ret1, msj = t.existeSolapamientoTurnos()
            ret = not ret1
        
        if ret:
            # Se guardan los identificadores de actividades.
            for i in range(len(filas_a_insertar)):
                filas_a_insertar[i]['ciclo_d'] = bolsa_id_turnos_insercion[i]
        
        # #####################################################################
        # Verificación de elementos a modificar.
        # #####################################################################

        # En este caso hay que verificar que la celda del ciclo contiene 
        # turnos válidos y no solapados.
        
        if ret:
            
            # Se crea objeto turno, para crear turno formateado.   
            tt = Turno(None)
        
            # Se crea objeto turno, para hacer verificaciones.
            t = w_turno()
        
            # ALGG 22-11-2016 Se define bolsa de identificadores de actividades.
            bolsa_id_turnos_actualizacion = []
        
            # Se itera sobre las filas a insertar.
            for i in celdas:
                bolsa_id_turnos_aux = []
                
                # Bandera de ejecución...
                if not ret: break
            
                # Si no se modifica un ciclo, se salta, ya que es el componente
                # crítico a analizar en esta parte del código.
                if i['field'] != 'ciclo_d': continue

                # Se crea lista de turnos y se quitan espacios en blanco.
                ciclo = i['valor_nuevo'].split(" ")
                aux = []
                for j in range(len(ciclo)): 
                    if len(ciclo[j].strip()) != 0: aux.append(ciclo[j].strip())
                ciclo = aux
                pprint(ciclo)
                # Para cada código de turno, se busca en la base de datos.
                for j in ciclo:
                    turno = self.__conn.get_turno(codigo = j, activo = 'S')
                    # Si no hay datos, el turno no existe.
                    if len(turno) == 0:
                        ret = False
                        msj = u"El turno %s no existe o no está activo" % str(j)
                        break
                    # Se recuperan datos del turno obtenido de la base de datos.
                    id_m, codigo_m, descripcion_m, cuenta_horas_m, \
                        activo_m, horario = \
                        tt.formarTurno(turno)
                    # Nos guardamos el identificador del turno.
                    bolsa_id_turnos_aux.append(id_m)
                    # Y ahora se incluye en el objeto w_turno, fácil y sencillo, no?
                    ret, msj = t.newTurno(_id = id_m, codigo = codigo_m, \
                                          descripcion = descripcion_m, \
                                          horario = horario, \
                                          cuenta_horas = cuenta_horas_m, \
                                          activo = activo_m, \
                                          chequearRepeticionCodigo = False)
                    
                    # Se comprueba si hay error.
                    if not ret: break   
                    
                # Guardamos la bolsa en la bolsa total.
                bolsa_id_turnos_actualizacion.append(bolsa_id_turnos_aux)
       
        if ret:
            # Se comprueba si hay solapamiento horario entre turnos contiguos.
            ret1, msj = t.existeSolapamientoTurnos()
            ret = not ret1
        
        if ret:
            # Se guardan los identificadores de actividades.
            for i in range(len(celdas)):
                if celdas[i]['field'] == "ciclo_d": 
                    celdas[i]['valor_nuevo'] = bolsa_id_turnos_actualizacion[i]        
            
        if ret:
            
            # ##############
            # ENVÍO DE DATOS
            # ##############

            ret, msj = self.__conn.actualizar_ciclo(celdas, \
                                                    filas_a_insertar, \
                                                    filas_a_eliminar)

   
        # Devolvemos estado.
   
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        print("Lo que se envia:")
        pprint(ret)
        return ret

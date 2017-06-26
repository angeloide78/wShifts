# -*- coding: utf-8 -*

# ALGG 04-12-2016 Creación de módulo de recursos humanos.
# ALGG 01-01-2017 Creación de clase Contrato.

from datetime import datetime

class Persona(object):
    '''Clase persona que cotiene todos los datos personales de un trabajador'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_persona(self, id_ = None, dni = None, busqueda = False):
        '''Devuelve: (id, dni, nombre, ape1, ape2, direccion, cp, poblacion,
        provincia, pais, tlfno1, tlfno2, email, observaciones)
        Opciones de filtrado: id_ <id de persona>, dni <dni de persona>'''

        ret = self.__conn.get_persona(id_, dni)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('dni', ret[i].dni)
            d.setdefault('nombre', ret[i].nombre)
            d.setdefault('ape1', ret[i].ape1)
            d.setdefault('ape2', ret[i].ape2)
            if not busqueda:
                d.setdefault('direccion', ret[i].direccion)
                d.setdefault('cp', ret[i].cp)
                d.setdefault('poblacion', ret[i].poblacion)
                d.setdefault('provincia', ret[i].provincia)
                d.setdefault('pais', ret[i].pais)
                d.setdefault('tlfno1', ret[i].tlfno1)
                d.setdefault('tlfno2', ret[i].tlfno2)
                d.setdefault('email', ret[i].email)
                d.setdefault('observaciones', ret[i].observaciones)
                d.setdefault('sexo', ret[i].sexo)
                if ret[i].fnac is None: d.setdefault('fnac', ret[i].fnac)
                else:
                    aux = str(ret[i].fnac).split("-")
                    aux = "%s-%s-%s" % (aux[2], aux[1], aux[0])
                    d.setdefault('fnac', aux)
                                                
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_persona(self, datos):
        '''Actualización de datos.
        Tabla: persona
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

        ret, msj = self.__conn.actualizar_persona(celdas, \
                                                  filas_a_insertar, \
                                                  filas_a_eliminar)

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.
        return ret

class Ausencia(object):
    '''Clase ausencia'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def __estado_devengo(self, opcion):
        '''Mapeo de conceptos de funcionamiento de ausencia con años de devengo'''
        
        if opcion == 0: return u'No definido'
        if opcion == 1: 
            return u'Cuenta horas en año actual y resta horas en año anterior'
        if opcion == 2: 
            return u'Cuenta horas en año actual y suma horas en año anterior'
        if opcion == 3: 
            return u'Cuenta horas en año actual y no cuenta horas en año anterior'
        if opcion == 4:
            return u'No cuenta horas en año actual y resta horas en año anterior'
        if opcion == 5:
            return u'No cuenta horas en año actual y suma horas en año anterior'
        if opcion == 6:
            return u'No cuenta horas en año actual y no cuenta horas en año anterior'

    def __estado_devengo2(self, opcion):
        '''Mapeo de conceptos de funcionamiento de ausencia con años de devengo'''
        
        if opcion == u'No definido': return 0
        if opcion == u'Cuenta horas en año actual y resta horas en año anterior':
            return 1
        if opcion == u'Cuenta horas en año actual y suma horas en año anterior':
            return 2
        if opcion == u'Cuenta horas en año actual y no cuenta horas en año anterior':
            return 3
        if opcion == u'No cuenta horas en año actual y resta horas en año anterior':
            return 4
        if opcion == u'No cuenta horas en año actual y suma horas en año anterior':
            return 5
        if opcion == u'No cuenta horas en año actual y no cuenta horas en año anterior':
            return 6
        # Si no hay más opciones, devolvemos nulo.
        return None
    
    def get_ausencia(self, id_ = None, codigo = None, activo = None):
        '''Devuelve: (id, codigo, descripcion, cuenta_horas, cuenta_dias, 
        max_ausencia_anual, activar_control_ausencia, forzar_ausencia, 
        observaciones, activo, estado_ausencia)
        Opciones de filtrado: id_ <id ausencia,>, codigo <cód. ausencia>, 
        activo <'S', 'N'>'''

        ret = self.__conn.get_ausencia(id_, codigo, activo)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('codigo', ret[i].codigo)
            d.setdefault('descripcion', ret[i].descripcion)
            d.setdefault('cuenta_horas', ret[i].cuenta_horas)
            d.setdefault('cuenta_dias', ret[i].cuenta_dias)
            d.setdefault('max_ausencia_anual', ret[i].max_ausencia_anual)
            d.setdefault('activar_control_ausencia', ret[i].activar_control_ausencia)
            d.setdefault('forzar_ausencia', ret[i].forzar_ausencia)
            d.setdefault('observaciones', ret[i].observaciones)
            d.setdefault('activo', ret[i].activo)
            d.setdefault('estado_devengo', \
                         self.__estado_devengo(ret[i].estado_devengo))
            
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_ausencia(self, datos):
        '''Actualización de datos.
        Tabla: ausencia
        '''
        
        ret = True
        
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

        # ALGG 28-02-2017 Se mapean estados de devengo.
        for i in range(len(celdas)):
            if celdas[i]['field'] == 'estado_devengo':
                opcion = celdas[i]['valor_nuevo']
                celdas[i]['valor_nuevo'] = \
                    self.__estado_devengo2(opcion)
        
        # ###############################
        # TRATAMIENTO DE FILAS A INSERTAR
        # ###############################

        # ALGG 28-02-2017 Se mapea código de estado de devengo.
        for i in range(len(filas_a_insertar)):
            opcion = filas_a_insertar[i]['estado_devengo']
            filas_a_insertar[i]['estado_devengo'] = \
                self.__estado_devengo2(opcion)
            
        # ALGG 28-02-2017 Se comprueba que las ausencias no están siendo 
        # utilizadas en contratos.
        for i in filas_a_eliminar:
            if self.__conn.exists_ausencia_en_contrato(i):
                ret, msj = \
                    False, u"El tipo de ausencia está siendo usada en contratos"
                break
    
        # ##############
        # ENVÍO DE DATOS
        # ##############

        if ret:
            ret, msj = self.__conn.actualizar_ausencia(celdas, \
                                                       filas_a_insertar, \
                                                       filas_a_eliminar)

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.
        return ret        


class ContratoAusencia(object):
    '''Clase ausencia asociada a un contrato'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn  
        # Contrato.
        self.__contrato_id = None
        # Ausencias.
        self.__ausencias = []
        # Ausencias a modificar.
        self.__celdas = None
        # Nuevas ausencias.
        self.__filas_a_insertar = None
        # Ausencias a eliminar.
        self.__filas_a_eliminar = None
        
    def setContrato(self, contrato_id):
        '''Asocia identificador de contrato con ausencias'''
        self.__contrato_id = contrato_id
     
    def setModificaciones(self, celdas, filas_a_eliminar, filas_a_insertar):
        '''Se cargan celdas a modificar, filas a eliminar y filas a insertar
        de las ausencias asociadas al contrato'''
        self.__celdas = celdas
        self.__filas_a_insertar = filas_a_insertar
        self.__filas_a_eliminar = filas_a_eliminar

    def __actualizarAusencia(self):
        for i in self.__celdas:
            # Se recuperan datos de la celda a modificar.
            field = i['field']
            contrato_ausencia_id = i['id']
            valor_nuevo = i['valor_nuevo']
            # Se buscan de entre las ausencias aquella específica y se cambia
            # el valor.
            puntero = -1
            for j in self.__ausencias:
                puntero += 1
                _contrato_ausencia_id = j[0]
                
                if _contrato_ausencia_id == contrato_ausencia_id: 
                    # Se cambian datos de la ausencia.
                    if field == 'aus_id':
                        self.__ausencias[puntero][2] = valor_nuevo
                    if field == 'fecha_inicio':
                        self.__ausencias[puntero][5] = valor_nuevo
                    if field == 'fecha_fin':
                        self.__ausencias[puntero][6] = valor_nuevo
                    if field == 'anno_devengo':
                        self.__ausencias[puntero][7] = valor_nuevo
                    if field == 'activo':
                        self.__ausencias[puntero][8] = valor_nuevo
                    if field == 'ausencia_parcial':
                        self.__ausencias[puntero][9] = valor_nuevo
                    if field == 'hora_inicio':
                        self.__ausencias[puntero][10] = valor_nuevo
                    if field == 'hora_fin':
                        self.__ausencias[puntero][11] = valor_nuevo
                        
                    # Y se sale del bucle.
                    break
             
    def __insertarAusencia(self):
        ident = 0
        for i in self.__filas_a_insertar:
            ident -= 1
            # Datos de la nueva ausencia.
            contrato_id = i['contrato_id']
            aus_id = i['aus_id']
            aus_cod = i['aus_cod']
            aus_desc = i['aus_desc']
            fecha_inicio = i['fecha_inicio']
            fecha_fin = i['fecha_fin']
            anno_devengo = i['anno_devengo']
            activo = i['activo']
            ausencia_parcial = i['ausencia_parcial']
            hora_inicio = i['hora_inicio']
            hora_fin = i['hora_fin']       
            # Se incluyen en la lista de ausencias...
            self.__ausencias.append([ident, contrato_id, aus_id, aus_cod, \
                                     aus_desc, fecha_inicio, fecha_fin, \
                                     anno_devengo, activo, ausencia_parcial, \
                                     hora_inicio, hora_fin])
                
    def __borrarAusencia(self):
        for i in self.__filas_a_eliminar:
            puntero = -1
            for j in self.__ausencias:
                puntero += 1
                if j[0] == i: 
                    self.__ausencias.remove(j)
                    break
        
    def __validarFechasYHoras(self):
        '''Validación de fechas por ausencia y de horas para aus. parciales'''
        # Control de fechas para una misma ausencia.
        for i in self.__ausencias:
            anno_fini = i[5].split('-')[0]
            anno_ffin = i[6].split('-')[0]
            anno_devengo = i[7]
            es_parcial = True if i[9] == 'S' else False
            hini = i[10]
            hfin = i[11]
    
            # No se permiten ausencias entre años.
            if anno_fini != anno_ffin: 
                msj = u"No se permiten ausencias con año de inicio y de " + \
                    "fin diferentes"
                return False, msj
    
            # No se permite devengar en años posteriores al actual.
            if int(anno_fini) < int(anno_devengo):
                msj = u"El año de devengo no puede ser superior a la fecha " + \
                    "de la ausencia. Solo se permite devengar en el mismo año " + \
                    "o en años anteriores."
                return False, msj
    
            # La fecha de inicio debe ser menor o igual a la fecha fin.
            fini = (int(i[5].split('-')[0]), int(i[5].split('-')[1]), \
                    int(i[5].split('-')[2]))
            ffin = (int(i[6].split('-')[0]), int(i[6].split('-')[1]), \
                    int(i[6].split('-')[2]))
            if fini > ffin:
                msj = u"La fecha fin no puede ser superior a la fecha de inicio"
                return False, msj

            # Si la ausencia es parcial, la hora de inicio no puede ser mayor
            # que la hora de fin.
            if es_parcial:
                hi = datetime(2017, 1, 1, \
                              int(hini.split(':')[0]), \
                              int(hini.split(':')[1])).time()
                hf = datetime(2017, 1, 1, \
                              int(hfin.split(':')[0]), \
                              int(hfin.split(':')[1])).time()                 

                if hi > hf:
                    msj = u'La hora de inicio es mayor que la hora de fin'
                    return False, msj
                    
        # Se devuelve todo correcto si se pasa por aquí...
        return True, ''
            
    def __fecha(self, fecha):
        '''Formato de fecha dd/mm/yyyy'''
        anno = fecha.split('-')[0]
        mes = fecha.split('-')[1]
        dia = fecha.split('-')[2]
        return "%s/%s/%s" % (dia, mes, anno)
    
    def __sinSolapamientoFechas(self):
        '''Devuelve True si no existe solapamiento entre fechas de ausencias 
        y False en caso contrario'''
        
        # Se tiene que controlar el solapamiento entre ausencias, y en el caso
        # de que haya ausencias parciales, por horario para un mismo día.
        
        ret = True
        msj = ''
        
        for i in self.__ausencias:
            # Datos de ausencia actual.
            fini = (int(i[5].split('-')[0]), int(i[5].split('-')[1]), \
                    int(i[5].split('-')[2]))
            ffin = (int(i[6].split('-')[0]), int(i[6].split('-')[1]), \
                    int(i[6].split('-')[2]))
            es_parcial = True if i[9] == 'S' else False
            hini = i[10]
            hfin = i[11]
            ident = i[0]
            # Se itera sobre todas las ausencias, para verificar que no hay
            # solapamiento.
            for j in self.__ausencias:
                _ident = j[0]
                if ident == _ident: pass
                else:
                    # Datos de la ausencia a comparar...
                    _fini = (int(j[5].split('-')[0]), int(j[5].split('-')[1]), \
                             int(j[5].split('-')[2]))
                    _ffin = (int(j[6].split('-')[0]), int(j[6].split('-')[1]), \
                             int(j[6].split('-')[2]))     
                    _es_parcial = True if j[9] == 'S' else False
                    _hini = j[10]
                    _hfin = j[11]
                    
                    # Caso 1: Una ausencia no es parcial. No se tiene en
                    # cuenta el horario.
                    if not es_parcial or (es_parcial and not _es_parcial):
                        if (fini <= _ffin) and (ffin >= _fini):
                            msj = u'Hay solapamiento de ausencias entre ' + \
                                '[%s, %s] y [%s, %s]' % (self.__fecha(i[5]), \
                                                         self.__fecha(i[6]), \
                                                         self.__fecha(j[5]), \
                                                         self.__fecha(j[6]))
                            # Se devuelve estado.
                            return False, msj
                        
                    # Caso 2: Las dos ausencias son parciales. Se tiene en 
                    # cuenta el horario.
                    if es_parcial and _es_parcial:
                        if (fini <= _ffin) and (ffin >= _fini):
                            # Horas de la ausencia actual.
                            hi = datetime(2017, 1, 1, \
                                          int(hini.split(':')[0]), \
                                          int(hini.split(':')[1])).time()
                            hf = datetime(2017, 1, 1, \
                                          int(hfin.split(':')[0]), \
                                          int(hfin.split(':')[1])).time()          
                            # Horas de la ausencia a comparar.
                            _hi = datetime(2017, 1, 1, \
                                           int(_hini.split(':')[0]), \
                                           int(_hini.split(':')[1])).time()
                            _hf = datetime(2017, 1, 1, \
                                           int(_hfin.split(':')[0]), \
                                           int(_hfin.split(':')[1])).time()          
                        
                            if (hi < _hf) and (_hi < hf):
                                msj = u'Hay solapamiento de ausencias ' + \
                                    ' parciales para las horas entre [%s, %s] ' + \
                                    ' y [%s, %s]'
                                msj = msj % (i[10], i[11], j[10], j[11]) 
                                return False, msj
        
        # Si todo es correcto, se sale.
        return ret, msj
    
    def __validarAusencias(self):
        '''Método de validación de ausencias asociadas a contrato una vez
        cargadas todas las modificaciones de actualización, inserción y 
        borrado
        '''
        
        # Validación de fechas para cada ausencia.
        ret, msj = self.__validarFechasYHoras() 
        
        # Validación de solapamientos entre fechas de ausencia.
        if ret:
            ret, msj = self.__sinSolapamientoFechas()
            
        
        return ret, msj 
    
    def esValido(self):
        '''Método de inicialización de mecanismo de validación de ausencias
        asociadas a contrato'''
        
        ret = True
        msj = u'Todo correcto'
        
        # Se recuperan todas las ausencias asociadas al contrato.
        ret = self.__conn.get_contrato_ausencia(self.__contrato_id, \
                                                activo = 'S')   
        
        # Se crea lista con ausencias asociadas a contrato que ya existen en 
        # el sistema.
        for i in ret: self.__ausencias.append(list(i))
        
        # Se actualiza con los posibles cambios realizados.
        self.__actualizarAusencia()
        
        # Se insertan nuevas ausencias.
        self.__insertarAusencia()
        
        # Se borran posibles ausencias.
        self.__borrarAusencia()
        
        # Y finalmente se realizan todas las validaciones... devolviendo 
        # True, '' si todo ha ido bien y False, <mensaje de error> si no es
        # posible crear el conjunto de ausencias asociadas al contrato.
        ret, msj = self.__validarAusencias()
        
        # Nos vamos.
        return ret, msj

#class Contrato(object):
    #'''Clase contrato de un trabajador'''

    #def __init__(self):
        #'''Constructor'''
        ## Contratos.
        #self.__contratos = []

    #def __haySolapamiento(self, f1_inicio, f1_fin, f2_inicio, f2_fin):
        #'''Devuelve True si hay solapamiento entre el rango de fechas f1 y f2
        #y False en caso contrario. Cada uno de los parámetros tiene que tener
        #el formato (año, mes, dia)'''

        #fi1 = date(f1_inicio[0], f1_inicio[1], f1_inicio[2])
        #ff1 = date(f1_fin[0], f1_fin[1], f1_fin[2])

        #fi2 = date(f2_inicio[0], f2_inicio[1], f2_inicio[2])
        #ff2 = date(f2_fin[0], f2_fin[1], f2_fin[2])

        #if fi2 <= ff1 and fi1 <= ff2:
            #return True, "Existe solapamiento entre contratos [%s, %s] y [%s, %s]" % \
                   #(str(f1_inicio), str(f1_fin), str(f2_inicio), str(f2_fin))
        #elif fi1 > ff1 or fi2 > ff2:
            #return True, "Existen fechas de fin superiores a fechas de inicio"
        #else:
            #return False, ""

    #def addContrato(self, contrato_id, cargo_id, fecha_inicio, fecha_fin, \
                    #categoria_profesional_id, persona_id, solapado):
        #'''Añade contrato nuevo'''

        #ret = True
        #msj = ''

        ## Se comprueba si hay solapamiento con otros contratos ya existentes, 
        ## siempre que no se especifique que se quiere un contrato solapado.
        #if solapado == 'N':
            #for contrato in self.__contratos:
                #fini = contrato['fecha_inicio']
                #ffin = contrato['fecha_fin']
                #ret, msj = self.__haySolapamiento(fecha_inicio, fecha_fin, \
                                                  #fini, ffin)
                #if ret: 
                    #ret = False
                    #break
                #else: ret = True

                ## Además se comprueba que el identificador de contrato sea único.
                #if contrato['id'] == contrato_id:
                    #ret = False
                    #msj = u'Identificador de contrato %d ya existe' % contrato_id
                    #break

        ## Configuración y creación de contrato.        
        #if ret:
            ## Se instancia clase ContratoAusencia.
            #contrato_ausencia = ContratoAusencia()
            ## Y se configura para el contrato creado.
            #contrato_ausencia.setContrato(contrato_id)
            ## Se crea el contrato.
            #contrato = {'id' : contrato_id, \
                        #'cargo_id' : cargo_id, \
                        #'fecha_inicio' : fecha_inicio, \
                        #'fecha_fin' : fecha_fin, \
                        #'categoria_profesional_id' : categoria_profesional_id, \
                        #'persona_id' : persona_id, \
                        #'solapado' : solapado, \
                        #'activo' : 'S', \
                        #'ausencias' : contrato_ausencia}

            ## Se añade el contrato a la lista de contratos.
            #self.__contratos.append(contrato)

        ## Se devuelve estado y mensaje.
        #return ret, msj

    #def getContratos(self):
        #'''Devuelve todos los contratos'''
        #return self.__contratos

    #def addAusencia(self, contrato_id, ausencia_id, fecha_inicio, fecha_fin, \
                    #anno_devengo):
        #'''Incluye una ausencia en el contrato'''

        #ret = False
        #msj = u'Contrato %d no encontrado' % contrato_id

        ## Se busca el contrato.
        #for contrato in self.__contratos:
            #if contrato['id'] == contrato_id:
                #contrato['ausencias'].addAusencia(ausencia_id, fecha_inicio, \
                                                  #fecha_fin, \
                                                  #anno_devengo)
                #ret = True
                #msj = ''
                #break 

        ## Nos vamos.
        #return ret, msj

    #def getAusencias(self, contrato_id):
        #'''Devuelve todas las ausencias del contrato pasado como parámetro'''

        #ret = False
        #msj = u'Contrato %d no encontrado' % contrato_id

        ## Se busca el contrato.
        #for contrato in self.__contratos:
            #if contrato['id'] == contrato_id:
                #msj = contrato['ausencias'].getAusencias(contrato_id)
                #ret = True
                #break 

        ## Nos vamos, devolviendo estado y mensaje o ausencias.
        #return ret, msj

    #def getContrato(self, contrato_id):
        #'''Devuelve el contrato'''

        #ret = False
        #msj = u'Contrato %d no encontrado' % contrato_id

        ## Se busca el contrato.
        #for contrato in self.__contratos:
            #if contrato['id'] == contrato_id:
                #msj = contrato
                #ret = True
                #break 

        ## Nos vamos, devolviendo estado y mensaje o contrato.
        #return ret, msj        

    #def setContrato(self, contrato_id, cargo_id, fecha_inicio, fecha_fin, \
                    #categoria_profesional_id, solapado, activo):
        #'''Modificación de datos de contrato'''

        #ret = True
        #msj = ''

        #centinela = False

        ## Se busca el contrato.
        #puntero = -1
        #for contrato in self.__contratos:
            #puntero += 1
            #if contrato['id'] == contrato_id:   
                #centinela = True

                ## Si se borra el contrato, se desactiva.
                #if activo == 'N':
                    #self.__contratos[puntero]['activo'] = 'N'
                    #break

                ## Se comprueba si hay solapamiento con otros contratos ya 
                ## existentes, siempre que no se especifique que se quiere un 
                ## contrato solapado.
                #if solapado == 'N':
                    #for contrato_aux in self.__contratos:
                        #fini = contrato_aux['fecha_inicio']
                        #ffin = contrato_aux['fecha_fin']
                        #ret, msj = self.__haySolapamiento(fecha_inicio, \
                                                          #fecha_fin, \
                                                          #fini, ffin)
                        #if ret: 
                            #ret = False
                            #break
                        #else: ret = True    

                ## Se modifican datos de contrato.
                #self.__contratos[puntero]['cargo_id'] = cargo_id    
                #self.__contratos[puntero]['fecha_inicio'] = fecha_inicio
                #self.__contratos[puntero]['fecha_fin'] = fecha_fin
                #self.__contratos[puntero]['categoria_profesional_id'] = \
                    #categoria_profesional_id    
                #self.__contratos[puntero]['solapado'] = solapado
                #break

        ## Miramos el centinela...
        #if not centinela:
            #ret = False
            #msj = u'El contrato %d no existe' % contrato_id

        ## Se devuelve estado e información.
        #return ret, msj

    #def setAusencia(self, contrato_id, contrato_ausencia_id, ausencia_id, \
                    #fecha_inicio, fecha_fin, anno_devengo, activo):
        #'''Modificación de ausencias asociadas a contrato'''

        #ret = True
        #msj = ''

        #centinela = False

        ## Se busca el contrato.
        #for contrato in self.__contratos:
            #if contrato['id'] == contrato_id:
                #centinela = True
                ## Se modifica la ausencia.
                #ret, msj = contrato['ausencias'].setAusencia(contrato_ausencia_id, \
                                                             #ausencia_id, \
                                                             #fecha_inicio, \
                                                             #fecha_fin, \
                                                             #anno_devengo, \
                                                             #activo)

                #break

        #if not centinela: 
            #ret, msj = False, u'Contrato %d no encontrado' % contrato_id

        ## Se devuelve estado e información.     
        #return ret, msj    

class ContratoPersona(object):
    '''Clase ContratoPersona que relaciona a una persona con sus contratos'''

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

        # info...
        msj = '''
            celdas a modificar: %s
            filas a eliminar: %s
            filas a insertar: %s''' % (str(celdas), \
                                       str(filas_a_eliminar), \
                                       str(filas_a_insertar))

        print(msj)

        # Se devuelven datos desglosados.
        return celdas, filas_a_insertar, filas_a_eliminar  

    def get_contrato(self, persona_id):
        '''Recupera todos los contratos de una persona
        Devuelve: (id, cargo_id, cargo_cod, cargo_desc, fecha_inicio, fecha_fin,
        cp_id, cp_cod, cp_desc, persona_id)
        Opciones de filtrado: persona_id <id de persona>'''

        ret = self.__conn.get_contrato(persona_id)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('cargo_id', ret[i].cargo_id)
            d.setdefault('cargo_cod', ret[i].cargo_cod)
            d.setdefault('cargo_desc', ret[i].cargo_desc)
            d.setdefault('fecha_inicio', ret[i].fecha_inicio)
            d.setdefault('fecha_fin', ret[i].fecha_fin)
            d.setdefault('cp_id', ret[i].cp_id)
            d.setdefault('cp_cod', ret[i].cp_cod)
            d.setdefault('cp_desc', ret[i].cp_desc)
            d.setdefault('persona_id', ret[i].persona_id)

            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data    


    def set_contrato(self, datos):
        '''Actualización de datos.
        Tabla: contrato
        '''

        celdas, filas_a_insertar, filas_a_eliminar = \
            self.__tratar_datos_a_actualizar(datos)

        # Bandera de continuación de ejecución y mensaje.
        ret = True
        msj = "Datos guardados correctamente"

        # ####################################
        # Verificación de elementos a eliminar
        # ####################################

        # Un contrato no puede eliminarse si está asociado a un trabajador que 
        # tiene una asignación.
        
        for i in filas_a_eliminar:
            if self.__conn.exists_asignacion_in_contrato(i):
                ret = False
                msj = u'El contrato tiene asignaciones'
                break
        
        if ret:

            # ##############
            # ENVÍO DE DATOS
            # ##############

            ret, msj = self.__conn.actualizar_contrato(celdas, \
                                                       filas_a_insertar, \
                                                       filas_a_eliminar)


        # Devolvemos estado.
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
        return ret        

class ContratoAusenciaPersona(object):
    '''Clase ContratoAusenciaPersona que relaciona las ausencias con un contrato'''

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

        # info...
        msj = '''
            celdas a modificar: %s
            filas a eliminar: %s
            filas a insertar: %s''' % (str(celdas), \
                                       str(filas_a_eliminar), \
                                       str(filas_a_insertar))

        print(msj)

        # Se devuelven datos desglosados.
        return celdas, filas_a_insertar, filas_a_eliminar  

    def get_contrato_ausencia(self, contrato_id, activo = None):
        '''Recupera todas las ausencias de un contrato
        Devuelve: (id, contrato_id, aus_id, aus_cod, aus_desc, fecha_inicio,
        fecha_fin, anno_devengo, activo)
        Opciones de filtrado: contrato_id <id de contrato>, activo <'S', 'N'>'''

        ret = self.__conn.get_contrato_ausencia(contrato_id, activo)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('contrato_id', ret[i].contrato_id)
            d.setdefault('aus_id', ret[i].aus_id)
            d.setdefault('aus_cod', ret[i].aus_cod)
            d.setdefault('aus_desc', ret[i].aus_desc)
            d.setdefault('fecha_inicio', ret[i].fecha_inicio)
            d.setdefault('fecha_fin', ret[i].fecha_fin)
            d.setdefault('anno_devengo', ret[i].anno_devengo)
            d.setdefault('activo', ret[i].activo)
            d.setdefault('ausencia_parcial', ret[i].ausencia_parcial)
            d.setdefault('hora_inicio', ret[i].hora_inicio)
            d.setdefault('hora_fin', ret[i].hora_fin)

            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data    

    def set_contrato_ausencia(self, datos):
        '''Actualización de datos.
        Tabla: contrato_ausencia
        '''

        celdas, filas_a_insertar, filas_a_eliminar = \
            self.__tratar_datos_a_actualizar(datos)

        # Bandera de continuación de ejecución y mensaje.
        ret = True
        msj = "Datos guardados correctamente"

        # ALGG 28-01-2017 Las fechas de inicio y de fin no pueden estar en años
        # diferentes. Además, el año de devengo no puede ser superior al año
        # de inicio de la ausencia. Hay que evitar los solapamientos entre 
        # ausencias ya sean parciales o no, cuando se borre, se inserte y se
        # actualice.
        
        contratoAusencia = ContratoAusencia(self.__conn)

        # ###########################################
        # Recuperación del identificador de contrato.
        # ###########################################
        
        contrato_id = None
        
        # Si hay filas a insertar, se busca directamente el identificador
        # del contrato.
        if len(filas_a_insertar) != 0:
            contrato_id = filas_a_insertar[0]['contrato_id']
        
        # Si hay filas a eliminar, se puede obtener el identificador de la 
        # ausencia asociada al contrato y a partir de ahí el identificador del 
        # contrato.
        elif len(filas_a_eliminar) != 0:
            ret = self.__conn.getContratoByAusencia(filas_a_eliminar[0])
            if ret is None or len(ret) == 0:
                ret = False
                msj = u'Error al recuperar el contrato'
            else: 
                contrato_id = ret[0][0]
                ret = True
                msj = u'ID del contrato recupeado de registo a eliminar'
            
        # Y si finalmente solo se trata de una modificación, pasa lo mismo que
        # con un borrado, se obtiene el identificador de la ausencia y a partir
        # de él se obtiene el identificador del contrato.
        elif len(celdas) != 0:
            ret = self.__conn.getContratoByAusencia(celdas[0]['id'])
            if ret is None or len(ret) == 0:
                ret = False
                msj = u'Error al recuperar el contrato'
            else: 
                contrato_id = ret[0][0]
                ret = True
                msj = u'ID del contrato recuperado del registro a modificar'
        
        # ###############################################
        # Tratamiento de ausencias asociadas al contrato.
        # ###############################################
        
        if ret:        
            contratoAusencia.setContrato(contrato_id)
            contratoAusencia.setModificaciones(celdas, filas_a_eliminar, \
                                               filas_a_insertar)
            ret, msj = contratoAusencia.esValido()
                
        if ret:

            # ##############
            # ENVÍO DE DATOS
            # ##############

            ret, msj = self.__conn.actualizar_contrato_ausencia(celdas, \
                                                                filas_a_insertar, \
                                                                filas_a_eliminar)


        # Devolvemos estado.
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
        return ret        

class ServiciosPrevios(object):
    '''Clase para gestión de servicios previos de un trabajador'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_sp(self, persona_id, anno = None):
        '''Devuelve: (persona_id, anno, horas)
        Opciones de filtrado: anno <año>'''

        ret = self.__conn.get_sp(persona_id, anno)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('persona_id', ret[i].persona_id)
            d.setdefault('anno', ret[i].anno)
            d.setdefault('horas', ret[i].horas)
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_sp(self, datos):
        '''Actualización de datos.
        Tabla: servicios_previos
        '''
        
        ret = True
        
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
            
            try: int(i['valor_nuevo'])
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
            try: 
                int(i['horas'])
                int(i['anno'])
            except: 
                ret = False
                msj = u'Solo se permiten valores numéricos'
                break
        
        # ##############
        # ENVÍO DE DATOS
        # ##############

        if ret:
            ret, msj = self.__conn.actualizar_sp(celdas, \
                                                 filas_a_insertar, \
                                                 filas_a_eliminar)

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.
        return ret    

class Cargo(object):
    '''Clase cargo de contrato para puesto de un trabajador'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_cargo(self, id_ = None, activo = None):
        '''Devuelve: (id, codigo, descripcion, observaciones, activo)
        Opciones de filtrado: id_ <id cargo>, activo <'S', 'N'>'''

        ret = self.__conn.get_cargo(id_, activo)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('codigo', ret[i].codigo)
            d.setdefault('descripcion', ret[i].descripcion)
            d.setdefault('observaciones', ret[i].observaciones)
            d.setdefault('activo', ret[i].activo)
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_cargo(self, datos):
        '''Actualización de datos.
        Tabla: cargo
        '''
        
        ret = True
        
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

        # ALGG 28-02-2017 Se comprueba que los cargos no están siendo 
        # utilizadas en contratos.
        for i in filas_a_eliminar:
            if self.__conn.exists_cargo_en_contrato(i):
                ret, msj = \
                    False, u"El cargo está siendo usado en contratos"
                break

        # ##############
        # ENVÍO DE DATOS
        # ##############

        if ret:
            ret, msj = self.__conn.actualizar_cargo(celdas, \
                                                    filas_a_insertar, \
                                                    filas_a_eliminar)

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.
        return ret    

class CategoriaProfesional(object):
    '''Clase categoría profesional asociada a un contrato'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_cp(self, id_ = None, activo = None):
        '''Devuelve: (id, codigo, descripcion, activo)
        Opciones de filtrado: id_ <id cat.prof.>, activo <'S', 'N'>'''

        ret = self.__conn.get_cp(id_, activo)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('codigo', ret[i].codigo)
            d.setdefault('descripcion', ret[i].descripcion)
            d.setdefault('activo', ret[i].activo)
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_cp(self, datos):
        '''Actualización de datos.
        Tabla: categoria_profesional
        '''
        
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
            aux.append(i)

        celdas = aux 

        # ALGG 19-02-2017 Se comprueba que las categorías profesionales no 
        # están siendo utilizadas en contratos ni en relaciones con equipos.
        for i in filas_a_eliminar:
            if self.__conn.exists_catProf_en_contrato(i):
                ret, msj = False, u"La categoría está siendo usada en contratos"
                break

            if self.__conn.exists_catProf_en_equipo(i):
                ret, msj = False, u"La categoría está siendo usada en relaciones " + \
                    u" con equipos de trabajo"
                break

        # ##############
        # ENVÍO DE DATOS
        # ##############

        if ret:
            ret, msj = self.__conn.actualizar_cp(celdas, \
                                                 filas_a_insertar, \
                                                 filas_a_eliminar)

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.
        return ret        

class CategoriaEquipo(object):
    '''Clase categorías en equipos de trabajo'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_catEq(self, eq_id = None, cat_id = None):
        '''Devuelve: (id, eq_id, eq_cod, eq_desc, cat_id, cat_cod, cat_desc)
        Opciones de filtrado: eq_id <id equipo>, cat_idactivo <id cat.prof.>'''

        ret = self.__conn.get_catEq(eq_id, cat_id)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('eq_id', ret[i].eq_id)
            d.setdefault('eq_cod', ret[i].eq_cod)
            d.setdefault('eq_desc', ret[i].eq_desc)
            d.setdefault('cat_id', ret[i].cat_id)
            d.setdefault('cat_cod', ret[i].cat_cod)
            d.setdefault('cat_desc', ret[i].cat_desc)

            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_catEq(self, datos):
        '''Actualización de datos.
        Tabla: categoria_equipo
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

        ret, msj = self.__conn.actualizar_catEq(celdas, \
                                                filas_a_insertar, \
                                                filas_a_eliminar)

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.
        return ret            
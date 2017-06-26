# -*- coding: utf-8 -*

# ALGG 26-11-2016 Creación de módulo de estructura de unidades organizativas.
# ALGG 06-12-2016 Creación de clase Estructura, para mantenimiento de estructura 
# organizativa.

class Unit(object):
    '''Clase unit (unidad organizativa)'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_centro_fisico(self, id_ = None, codigo = None, es_activo = None):
        '''Devuelve: (id, codigo, descripcion, activo, direccion, poblacion, 
        cp, provincia, pais, telefono1, telefono2, observaciones, email)
        Tabla: unit (unidad organizativa)
        Opciones de filtrado: id_ <id de centro físico>, activo <'S','N'>'''
        
        return self.get_unit(1, id_, codigo, es_activo)

    def get_servicio(self, id_ = None, codigo = None, es_activo = None, \
                     cf_id = None, asig_pend = False):
        '''Devuelve: (id, codigo, descripcion, activo, direccion, poblacion, 
        cp, provincia, pais, telefono1, telefono2, observaciones, email)
        Tabla: unit (unidad organizativa)
        Opciones de filtrado: id_ <id de servicio>, activo <'S','N'>'''
       
        if cf_id is None: return self.get_unit(2, id_, codigo, es_activo)    
        else: return self.get_unit_dependences(1, cf_id, asig_pend)

    def get_puesto(self, id_ = None, codigo = None, es_activo = None, \
                   eq_id = None, asig_pend = False):
        '''Devuelve: (id, codigo, descripcion, activo, direccion, poblacion, 
        cp, provincia, pais, telefono1, telefono2, observaciones, email)
        Tabla: unit (unidad organizativa)
        Opciones de filtrado: id_ <id de puesto>, activo <'S','N'>'''
       
        if eq_id is None: return self.get_unit(4, id_, codigo, es_activo)    
        else: return self.get_unit_dependences(3, eq_id, asig_pend)

    def get_equipo(self, id_ = None, codigo = None, es_activo = None, \
                   sf_id = None, asig_pend = False):
        '''Devuelve: (id, codigo, descripcion, activo, direccion, poblacion, 
        cp, provincia, pais, telefono1, telefono2, observaciones, email)
        Tabla: unit (unidad organizativa)
        Opciones de filtrado: id_ <id de equipo>, activo <'S','N'>'''
       
        if sf_id is None: return self.get_unit(3, id_, codigo, es_activo)    
        else: return self.get_unit_dependences(2, sf_id, asig_pend)
        
    def get_unit_dependences(self, tipo_unit, id_, asig_pend = False):
        '''Devuelve las dependencias arbóreas de unidades organizativas, según
        tipo_unit:
        1 - Devuelve todos los servicios funcionales que cuelgan del centro 
        físico con id_ pasado como parámetro.
        2 - Devuelve todos los equipos de trabajo que cuelgan del servicio
        con id_ pasado como parámetro.
        3 - Devuelve todos los puestos que cuelgan del equipo de trabajo con 
        identificador id_ pasado como parámetro.
        '''
        ret = self.__conn.get_unit_dependences(tipo_unit, id_, asig_pend)

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
                                    
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data     
    
    def get_unit(self, tipo_unit, id_ = None, codigo = None, es_activo = None):
        '''Devuelve: (id, codigo, descripcion, activo, direccion, poblacion, 
        cp, provincia, pais, telefono1, telefono2, observaciones, email)
        Tabla: unit (unidad organizativa)
        Opciones de filtrado: tipo_unit <tipo de unidad organizativa:
        1 - centro físico, 2 - servicio, 3- categoría o equipo
        4 - puesto>, id_ <id de unit>, activo <'S','N'>, codigo <codigo de unit>
        '''

        ret = self.__conn.get_unit(tipo_unit, id_, codigo, es_activo)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('tipo_unit_id', ret[i].tipo_unit_id)
            d.setdefault('codigo', ret[i].codigo)
            d.setdefault('descripcion', ret[i].descripcion)
            d.setdefault('activo', ret[i].activo)
            d.setdefault('direccion', ret[i].direccion)
            d.setdefault('poblacion', ret[i].poblacion)
            d.setdefault('cp', ret[i].cp)
            d.setdefault('provincia', ret[i].provincia)
            d.setdefault('pais', ret[i].pais)
            d.setdefault('telefono1', ret[i].telefono1)
            d.setdefault('telefono2', ret[i].telefono2)
            d.setdefault('observaciones', ret[i].observaciones)
            d.setdefault('email', ret[i].email)
                                    
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_unit(self, datos, opcion = None):
        # Lista de celdas a modificar. Cada elemento es un diccionario que 
        # contiene los elementos necesarios para modificar el campo.

        ret = True
        
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
        
        # ALGG 20-12-2016 Se comprueba que las unidades a eliminar no estén 
        # en más lugares...
        for i in filas_a_eliminar:
            # Estructura organizativa.
            if opcion == 'puesto':
                if self.__conn.exists_in_estructura(p_id = i):
                    ret, msj = False, u"El puesto existe en la estructura"
                    break
            if opcion == 'equipo':
                if self.__conn.exists_in_estructura(eq_id = i):
                    ret, msj = False, u"El equipo existe en la estructura"
                    break
            if opcion == 'servicio':
                if self.__conn.exists_in_estructura(sf_id = i):
                    ret, msj = False, u"El servicio existe en la estructura"
                    break
            if opcion == 'centro_fisico':
                if self.__conn.exists_in_estructura(cf_id = i):
                    ret, msj = False, u"El centro físico existe en la estructura"
                    break

            # Si es un puesto, que no esté planificado o asignado.
            if opcion == 'puesto':
                if self.__conn.exists_puesto_planificado(i):
                    ret, msj = False, u"El puesto ya está planificado"
                    break
            
                if self.__conn.exists_puesto_asignado(i):
                    ret, msj = False, u"El puesto ya está asignado a un trabajador"
                    break
            
            # Si es un equipo, que no tenga coberturas de servicio o categorías
            # en categorías por equipo.
            if opcion == 'equipo':
                if self.__conn.exists_equipo_con_cobertura(i):
                    ret, msj = False, u"El equipo tiene coberturas asignadas"
                    break
                            
                if self.__conn.exists_equipo_con_categ(i):
                    ret, msj = False, u"El equipo tiene categorías asignadas"
                    break
                
            # Si es un centro físico, que no tenga calendarios festivos
            # asociados o jornadas teóricas asociadas.
            if opcion == 'centro_fisico':
                if self.__conn.exists_cfisico_con_jteorica(i):
                    ret, msj = False, u"El centro físico tiene jornada teórica"
                    break

                if self.__conn.exists_cfisico_con_calendario(i):
                    ret, msj = False, u"El centro físico tiene calendarios asociados"
                    break
                
        if ret:
            
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
            
            ret, msj = self.__conn.actualizar_unit(celdas, \
                                                   filas_a_insertar, \
                                                   filas_a_eliminar, opcion)
            
            
        # Devolvemos estado.
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
        return ret
    
class Estructura(object):
    '''Clase Estructura (estructura organizativa)'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def __montar_pk(self, cf_id, sf_id, eq_id, p_id):
        '''Monta clave primaria de estructura'''
        
        return str(cf_id) + str(sf_id) + str(eq_id) + str(p_id)

    def get_estructura(self, puesto_id = None, activo = None): 
        '''Devuelve: (cf_id, cf_cod, cf_desc, sf_id, sf_cod, sf_desc, 
        eq_id, eq_cod, eq_desc, p_id, p_cod, p_desc, observ, activo)
        Tabla: estructura (estructura organizativa)
        '''
        
        ret = self.__conn.get_estructura(puesto_id = puesto_id, \
                                         activo = activo)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        
        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
    
            # ALGG 23122016 Se forma un ID ficticio compuesto por el código
            # del puesto, ya que será único en la estructura.
            ID = ret[i].p_id
    
            # Se forma diccionario.
            d.setdefault('id', ID)
            
            # Se forma cadena de información compacta.
            cadena = '%s - %s - %s - %s' % (ret[i].cf_desc, ret[i].sf_desc, \
                                            ret[i].eq_desc, ret[i].p_desc)
            d.setdefault('desc', cadena)
            
            # Se añaden resto de elementos.
            d.setdefault('cf_id', ret[i].cf_id)
            d.setdefault('cf_cod', ret[i].cf_cod)
            d.setdefault('cf_desc', ret[i].cf_desc)
            
            d.setdefault('sf_id', ret[i].sf_id)
            d.setdefault('sf_cod', ret[i].sf_cod)
            d.setdefault('sf_desc', ret[i].sf_desc)

            d.setdefault('eq_id', ret[i].eq_id)
            d.setdefault('eq_cod', ret[i].eq_cod)
            d.setdefault('eq_desc', ret[i].eq_desc)

            d.setdefault('p_id', ret[i].p_id)
            d.setdefault('p_cod', ret[i].p_cod)
            d.setdefault('p_desc', ret[i].p_desc)
            
            d.setdefault('observ', ret[i].observ)
            d.setdefault('activo', ret[i].activo)
            
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_estructura(self, datos):
        # Lista de celdas a modificar. Cada elemento es un diccionario que 
        # contiene los elementos necesarios para modificar el campo.

        ret = True
        
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

        # Se comprueba que el puesto no esté planificado o asignado.
        for i in filas_a_eliminar:
            if self.__conn.exists_puesto_asignado(i):
                ret, msj = False, u"El puesto ya está asignado a un trabajador"
                break

            if self.__conn.exists_puesto_planificado(i):
                ret, msj = False, u"El puesto ya está planificado"
                break
            
        if ret:
            
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
            
            # ALGG 23122016 Se tiene que controlar que el puesto no exista 
            # en la estructura, ya que no se permite que un puesto esté más
            # de una vez en la estructura (no puede colgar de dos equipos al
            # mismo tiempo).
            
            aux = []
            
            for i in filas_a_insertar:
                if self.__conn.exists_in_estructura(p_id = i['p_id']):
                    ret, msj = False, u"El puesto ya existe en la estructura"
                    break
            
                if i['p_id'] not in aux: aux.append(i['p_id'])
                else:
                    ret = False
                    msj = u'El puesto no puede repetirse en la estructura'
                    
            # ##############
            # ENVÍO DE DATOS
            # ##############
            
            if ret:
                ret, msj = self.__conn.actualizar_estructura(celdas, \
                                                             filas_a_insertar, \
                                                             filas_a_eliminar)
            
        # Devolvemos estado.
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
        return ret
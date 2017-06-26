# -*- coding: utf-8 -*-
# ALGG 24-09-2016 Diseño de clases de acceso a aplicación.
# ALGG 14-10-2016 Diseño de clase Usuario, Recurso, Rol
# ALGG 17-10-2016 Diseño de clase RolUsuario
# ALGG 18-10-2016 Redefinición de tipo de devolución de datos.
# ALGG 11-02-2017 Diseño de clase UsuarioEstructura.

import pprint

class Login(object):
    '''Clase de acceso a la aplicación'''

    def __init__(self, conn):
        '''Constructor'''
        
        # Conexión.
        self.__conn = conn

    def existe_login(self, usuario, passwd):
        '''Devuelve <True, msj> si login/passwd es correcto y <False, msj> en
        caso contrario.'''
        
        c = self.__conn.get_usuario(nick=usuario)
        
        if len(c) == 0:
            ret = False, 'Usuario no existe'
        else:
            # ¿Usuario correcto?
            if c[0].nick == usuario and c[0].passwd == passwd and \
               c[0].activo == 'S' and c[0].intentos > 0:
                ret = True, 'Usuario correcto'
            elif c[0].activo == 'N':
                ret = False, 'Usuario no activo'
            elif c[0].intentos < 1:
                ret = False, 'Se ha excedido el número de intentos de acceso'
            elif c[0].passwd <> passwd:
                ret = False, 'Contraseña incorrecta'
                # Se descuenta número de intentos en 1.
                self.__conn.set_usuario_passwd(c[0].id, quitarIntento = True)
            else: 
                ret = False, 'No se ha podido autenticar el usuario'
                
        return ret

class Usuario(object):
    '''Clase Usuario'''

    def __init__(self, conn):
        '''Constructor'''
        
        # Conexión.
        self.__conn = conn
    
    def get_usuario(self, usuario = None, es_activo = None):
        '''Devuelve (id, persona_id, nick, password, fecha_alta,fecha_baja, 
        intentos, activo)
        Opciones de filtrado: nick <login usuario>, activo <'S','N'>
        Si no se parametrizan opciones de filtrado por defecto devuelve todos
        los usuarios.'''
        
        ret = self.__conn.get_usuario(nick=usuario, activo = es_activo)
        
        # Diccionario principal. 
        data = {}
        
        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []
        
        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('nick', ret[i].nick) 
            d.setdefault('id', ret[i].id)
            d.setdefault('persona_id', ret[i].persona_id)
            d.setdefault('passwd', ret[i].passwd)
            d.setdefault('fecha_alta', ret[i].fecha_alta)
            d.setdefault('fecha_baja', ret[i].fecha_baja)
            d.setdefault('intentos', ret[i].intentos)
            d.setdefault('activo', ret[i].activo)
            
            # Se añade diccionario a la lista.
            lista.append(d)
        
        # Se incluye clave, valor que será "data" : lista de diccionarios 
        ret = data.setdefault('data', lista)
        return data
    
    def set_usuario(self, datos):
        
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
        
        # ALGG 12-02-2017 Si el usuario está en relación rol_usuario o 
        # usuario_estructura, el usuario no puede eliminarse.
        for usuario_id in filas_a_eliminar:
            if self.__conn.exists_usuario_estructura(usuario_id = usuario_id):
                ret = False
                msj = u'No se puede eliminar usuario. Existe asociación ' + \
                    'con estructura'
                break                   
        
            if self.__conn.exists_rol_usuario(usuario_id = usuario_id):
                ret = False
                msj = u'No se puede eliminar usuario. Existe asociación con rol'
                break        
        
        # ##############
        # ENVÍO DE DATOS
        # ##############
        
        if ret:
            ret, msj = self.__conn.actualizar_usuario(celdas, \
                                                      filas_a_insertar, \
                                                      filas_a_eliminar)
        
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
        
        # Devolvemos estado.
        return ret

class Recurso(object):
    '''Clase Recurso'''

    def __init__(self, conn):
        '''Constructor'''
        
        # Conexión.
        self.__conn = conn

    def get_recurso(self, codigo = None, es_activo = None):
        '''Devuelve: (id, codigo, descripcion, activo, observaciones)
        Tabla: recurso (recurso de aplicación)
        Opciones de filtrado: código del recurso <codigo>, activo <'S','N'>
        Si no se parametrizan opciones de filtrado por defecto devuelve todos
        los recursos.'''
        
        ret = self.__conn.get_recurso(codigo = codigo, activo = es_activo)
        
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
            d.setdefault('observaciones', ret[i].observaciones)
            
            # Se añade diccionario a la lista.
            lista.append(d)
        
        # Se incluye clave, valor que será "data" : lista de diccionarios 
        ret = data.setdefault('data', lista)
        print(data)
        # print(ret)    
        return data
    
    def set_recurso(self, datos):
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
         
        ret, msj = self.__conn.actualizar_recurso(celdas, \
                                                  filas_a_insertar, \
                                                  filas_a_eliminar)
        
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
         
        # Devolvemos estado.
        return ret    

class Rol(object):
    '''Clase Rol'''

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
        
        # Se devuelven datos desglosados.
        return celdas, filas_a_insertar, filas_a_eliminar        

    def get_rol(self, codigo_rol = None, es_activo = None):
        '''Devuelve:(id, codigo, descripcion, observaciones, activo)
        Tabla: rol (rol de aplicación) 
        Opciones de filtrado: activo <'S','N'>, codigo <código rol>'''
        
        ret = self.__conn.get_rol(codigo = codigo_rol, \
                                  activo = es_activo)
        
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
            d.setdefault('observaciones', ret[i].observaciones)
           
            # Se añade diccionario a la lista.
            lista.append(d)
        
        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        # print(data)
        return data
    
    def set_rol(self, datos):
        '''Actualización de datos.
        Tabla: rol
        '''
        
        ret = True
        
        celdas, filas_a_insertar, filas_a_eliminar = \
            self.__tratar_datos_a_actualizar(datos)
        
        # ALGG 11-02-2017 Si existe relación en rol_usuario o rol_recurso no se
        # puede eliminar el rol.
        for i in filas_a_eliminar:
            if self.__conn.exists_rol_recurso(i):
                ret = False
                msj = u'No se puede eliminar rol. Existe asociación con recurso'
                break
            
            if self.__conn.exists_rol_usuario(rol_id = i):
                ret = False
                msj = u'No se puede eliminar rol. Existe asociación con usuario'
                break
        
        # ##############
        # ENVÍO DE DATOS
        # ##############

        if ret:
            ret, msj = self.__conn.actualizar_rol(celdas, \
                                                  filas_a_insertar, \
                                                  filas_a_eliminar)
        
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
         
        # Devolvemos estado.
        return ret    
          
class RolUsuario(object):
    '''Clase Rol - Usuario'''

    def __init__(self, conn):
        '''Constructor'''
        
        # Conexión.
        self.__conn = conn

    def get_rol_usuario(self, usu_id = None, es_activo = None):
        '''Devuelve:(rol_id, usuario_id, observaciones, activo)
        Tabla: rol_usuario (relación entre usuario y sus roles asociados) 
        Opciones de filtrado: activo <'S','N'>, usu_id <id de usuario>'''
        
        ret = self.__conn.get_rol_usuario(usuario_id = usu_id, \
                                          activo = es_activo)
        
        data = {}
        
        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []           

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id_)
            d.setdefault('rol_id', ret[i].rol_id)
            d.setdefault('rol_desc', ret[i].rol_desc)
            d.setdefault('usuario_id', ret[i].usuario_id)
            d.setdefault('usuario', ret[i].usuario)
            d.setdefault('observaciones', ret[i].observaciones)
            d.setdefault('activo', ret[i].activo)

            # Se añade diccionario a la lista.
            lista.append(d)
        
        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        # print(data)
        return data

    def set_rol_usuario(self, datos):
        
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
                  
        # ###############################
        # TRATAMIENTO DE FILAS A INSERTAR
        # ###############################
         
        # ALGG 10-02-2017 Hay que comprobar que no hay duplicidad de tupla 
        # (usuario_id, rol_id) para la inserción. Puesto que no se permite la 
        # modificación de una asociación entre usuario y rol, en este caso no 
        # hace falta comprobación.
        
        aux = []
        for i in filas_a_insertar:
            rol_id = i['rol_id']
            usuario_id = i['usuario_id']
            rol_desc = i['rol_desc']
            usuario = i['usuario']
            
            if self.__conn.exists_rol_usuario(rol_id = rol_id, usuario_id = \
                                              usuario_id):
                ret = False
                msj = u'Ya existe la asociación entre usuario %s y rol %s' % \
                    (usuario, rol_desc)
                break
         
            if (rol_id, usuario_id) not in aux: aux.append((rol_id, usuario_id))
            else:
                ret = False
                msj = u'Asociación entre usuario %s y rol %s repetida' % \
                    (usuario, rol_desc) 
                break
                
        # ##############
        # ENVÍO DE DATOS
        # ##############
         
        if ret:
            ret, msj = self.__conn.actualizar_rol_usuario(celdas, \
                                                          filas_a_insertar, \
                                                          filas_a_eliminar)
        
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
         
        # Devolvemos estado.
        return ret    

            
class RolRecurso(object):
    '''Clase Rol - Recurso'''

    def __init__(self, conn):
        '''Constructor'''
        
        # Conexión.
        self.__conn = conn

    def get_rol_recurso(self, rec_id = None, es_activo = None):
        '''Devuelve:(rol_id, recurso_id, ejecucion, lectura, escritura, 
        observaciones, activo)
        Tabla: rol_recurso (relación entre recurso y sus roles asociados) 
        Opciones de filtrado: activo <'S','N'>, rec_id <id de recurso>'''
        
        ret = self.__conn.get_rol_recurso(recurso_id = rec_id, \
                                          activo = es_activo)
        
        data = {}
        
        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []         

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id_)
            d.setdefault('rol_id', ret[i].rol_id)
            d.setdefault('rol_desc', ret[i].rol_desc)
            d.setdefault('recurso_id', ret[i].recurso_id)
            d.setdefault('recurso_desc', ret[i].recurso_desc)
            d.setdefault('ejecucion', ret[i].ejecucion)
            d.setdefault('lectura', ret[i].lectura)
            d.setdefault('escritura', ret[i].escritura)
            d.setdefault('observaciones', ret[i].observaciones)
            d.setdefault('activo', ret[i].activo)
            
            # Se añade diccionario a la lista.
            lista.append(d)
        
        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        # print(data)
        return data

    def set_rol_recurso(self, datos):
        
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
                  
        # ###############################
        # TRATAMIENTO DE FILAS A INSERTAR
        # ###############################
         
        # ALGG 10-02-2017 Hay que comprobar que no hay duplicidad de tupla 
        # (recurso_id, rol_id) para la inserción. Puesto que no se permite la 
        # modificación de una asociación entre recurso y rol, en este caso no 
        # hace falta comprobación.
        
        aux = []
        for i in filas_a_insertar:
            rol_id = i['rol_id']
            recurso_id = i['recurso_id']
            rol_desc = i['rol_desc']
            recurso_desc = i['recurso_desc']
            
            if self.__conn.exists_rol_recurso(rol_id, recurso_id):
                ret = False
                msj = u'Ya existe la asociación entre recurso %s y rol %s' % \
                    (recurso_desc, rol_desc)
                break
         
            if (rol_id, recurso_id) not in aux: aux.append((rol_id, recurso_id))
            else:
                ret = False
                msj = u'Asociación entre recurso %s y rol %s repetida' % \
                    (recurso_desc, rol_desc) 
                break
                
        # ##############
        # ENVÍO DE DATOS
        # ##############
         
        if ret:
            ret, msj = self.__conn.actualizar_rol_recurso(celdas, \
                                                          filas_a_insertar, \
                                                          filas_a_eliminar)
        
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
         
        # Devolvemos estado.
        return ret        
    
class UsuarioEstructura(object):
    '''Clase Usuario - Estructura'''

    def __init__(self, conn):
        '''Constructor'''
        
        # Conexión.
        self.__conn = conn

    def get_usuario_estructura(self, usuario_id = None, cf_id = None, \
                               sf_id = None, eq_id = None, activo = None):
        '''Devuelve:(id, usuario_id, usuario, cf_id, cf_cod, cf_desc, sf_id, 
        sf_cod, sf_desc, eq_id, eq_cod, eq_desc, observ, activo)
        Tabla: usuario_estructura (relación entre usuario y estructura 
        organizativa) 
        Opciones de filtrado: usuario_id, cf_id, sf_id, eq_id, activo
        '''
        
        ret = self.__conn.get_usuario_estructura(usuario_id = usuario_id, \
                                                 cf_id = cf_id, sf_id = sf_id, \
                                                 eq_id = eq_id, activo = activo)
        
        data = {}
        
        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []         

        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('id', ret[i].id_)
            d.setdefault('usuario_id', ret[i].usuario_id)
            d.setdefault('usuario', ret[i].usuario)
            d.setdefault('cf_id', ret[i].cf_id)
            d.setdefault('cf_cod', ret[i].cf_cod)
            d.setdefault('cf_desc', ret[i].cf_desc)
            d.setdefault('sf_id', ret[i].sf_id)
            d.setdefault('sf_cod', ret[i].sf_cod)
            d.setdefault('sf_desc', ret[i].sf_desc)
            d.setdefault('eq_id', ret[i].eq_id)
            d.setdefault('eq_cod', ret[i].eq_cod)
            d.setdefault('eq_desc', ret[i].eq_desc)
            d.setdefault('observ', ret[i].observ)
            d.setdefault('activo', ret[i].activo)
            
            # Se añade diccionario a la lista.
            lista.append(d)
        
        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        # print(data)
        return data

    def set_usuario_estructura(self, datos):
        
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
                  
        # ###############################
        # TRATAMIENTO DE FILAS A INSERTAR
        # ###############################
         
        # ALGG 11-02-2017 Hay que comprobar que no hay duplicidad de tuplas 
        # para la inserción. Puesto que no se permite la modificación de 
        # asociaciones, no hace falta comprobación.
        
        aux = []
        for i in filas_a_insertar:
            usuario_id = i['usuario_id']
            cf_id = i['cf_id']
            sf_id = i['sf_id']
            eq_id = i['eq_id']
                                                            
            usuario = i['usuario']
            cf_desc = i['cf_desc']
            sf_desc = '' if i['sf_desc'] is None else i['sf_desc'] 
            eq_desc = '' if i['eq_desc'] is None else i['eq_desc']
            
            if self.__conn.exists_usuario_estructura(usuario_id, cf_id, sf_id, \
                                                     eq_id):
                ret = False
                msj = u'Ya existe la asociación entre usuario %s y ' + \
                    ' estructura (%s, %s, %s)' 
                msj = msj % (usuario, cf_desc, sf_desc, eq_desc)
                break            

            if (usuario_id, cf_id, sf_id, eq_id) not in aux: 
                aux.append((usuario_id, cf_id, sf_id, eq_id))
            else:
                ret = False
                msj = u'Asociación duplicada entre usuario y estructura' 
                break
                
        # ##############
        # ENVÍO DE DATOS
        # ##############
         
        if ret:
            ret, msj = self.__conn.actualizar_usuario_estructura(celdas, \
                                                                 filas_a_insertar, \
                                                                 filas_a_eliminar)
        
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
         
        # Devolvemos estado.
        return ret        
        
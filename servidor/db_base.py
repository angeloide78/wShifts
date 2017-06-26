# -*- coding: utf-8 -*-
# ALGG 23-09-2016 Creación de clases bases de acceso a datos: Conexion.
# ALGG 24-09-2016 Uso del ORM SQLAlquemy y sqlsoup para capa de abstracción 
# de acceso y manipulación de la base de datos.
# ALGG 14-10-2016 Diseño de métodos get_usuario, get_recurso
# ALGG 15-10-2016 Diseño de método get_rol_basico
# ALGG 17-10-2016 Diseño de método get_rol_compuesto
# ALGG 01-11-2016 Diseño de métodos para gestión de turnos, ciclos.
# ALGG 07-12-2016 Diseño de métodos para asignación de ciclos a puestos.


import sqlsoup
from sqlalchemy import or_, and_, asc, exists, desc
from sqlalchemy.orm import aliased, scoped_session, sessionmaker
from sqlalchemy.sql.expression import func
from datetime import datetime
import calendar
import pprint

class Db(object):
    '''Clase conexión base.'''

    def __init__(self, engine, url, schema, bbdd):
        '''Constructor'''

        # Atributos de configuración.
        self.__sgbd = engine
        self.__url = url
        self.__schema = schema
        self.__bbdd = bbdd
        self.__db = None

    def connect(self):
        '''Creación de conexión. Devuelve cierto si todo es 
        correcto y false en caso contrario'''

        ret = False

        # ######
        # SQLITE
        # ######

        if self.__sgbd.lower() == 'sqlite':
            self.__db = \
                sqlsoup.SQLSoup('sqlite:///%s' % self.__url, \
                                session=scoped_session(sessionmaker \
                                                       (autoflush=False, \
                                                        autocommit=False)))
            # 22-10-2016 ALGG Incluyo sesión.
            ret = True

        # ##########
        # POSTGRESQL
        # ##########

        if self.__sgbd.lower() == 'postgresql':
            pass

        # Se devuelve estado.
        return ret

    def fechaPython(self, fecha):
        '''Devuelve objeto Python Date a partir del año, mes y día'''
        # Creamos objeto Python de tipo Date para pasarlo a la base de datos.

        #        fecha = '%s-%s-%s' % (anno, mes, dia)
        return datetime.strptime(fecha, "%Y-%m-%d").date()

    def __get_date_sql(self, field, tipo):
        '''Devuelve campo con comando sql del engine en uso para obtener
        el tipo de dato pasado como parámetro. "field" es el campo y "tipo" 
        podrá tener los valores "anno", "mes", "dia"'''

        ret = None
        if self.__sgbd.lower() == 'sqlite':
            if tipo == "anno": ret = "strftime('%s', %s)" % ('%Y', \
                                                             str(field))

            if tipo == "dia": ret = "strftime('%s', %s)" % ('%d', \
                                                            str(field))

            if tipo == "mes": ret = "strftime('%s', %s)" % ('%m', \
                                                            str(field))

        # Se devuelve dato.
        return ret

    def actualizar(self):
        '''Commit de conexión'''

        msj = ''

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            print "MENSAJE DE ERROR ", msj

        # Se devuelve estado y mensaje.
        return ret, msj

    def get_basica(self):
        '''Devuelve: id, version, revision, nombrem, descripcion, es_lunes_festivo,
        es_martes_festivo, es_miercoles_festivo, es_jueves_festivo, 
        es_viernes_festivo, es_sabado_festivo_es_domingo_festivo, licencia,
        empresa
        Tabla: basica (datos básicos de la aplicación)'''

        # Se recuperan datos.
        basica = self.__db.basica.all()

        # Y se devuelven.
        return basica
    

    def get_tipo_unit(self, _id = None, activo = None):
        '''Devuelve: (id, codigo, descripcion, activo, observaciones) 
        Tabla: entidad (tipo de unidad organizativa)
        Opciones de filtrado: id <identificador>, activo <'S','N'>'''

        # Se define entidad.
        entidad = self.__db.entity("tipo_unit")

        if _id is not None and activo is not None:
            where = and_(entidad.id==_id, entidad.activo==activo)
            ret = entidad.filter(where).order_by(asc(entidad.descripcion)).all()
        elif _id is not None:
            ret = entidad.get(_id)
        elif activo is not None:
            ret = entidad.filter(entidad.activo==activo).order_by(asc(entidad.descripcion)).all()
        else:
            ret = entidad.all()

        # Y se devuelven.
        return ret

    def get_usuario(self, activo = None, nick = None):
        '''Devuelve: (id, persona_id, nick, password, fecha_alta,
        fecha_baja, intentos, activo)
        Tabla: usuario (usuario de aplicación)
        Opciones de filtrado: nick <login usuario>, activo <'S','N'>'''

        # 22-10-2016 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()

        # Se define entidad.
        entidad = self.__db.entity("usuario")

        if nick is not None and activo is not None:
            where = and_(entidad.nick==nick, entidad.activo==activo)
            ret = entidad.filter(where).order_by(asc(entidad.nick)).all()
        elif nick is not None:
            ret = entidad.filter(entidad.nick==nick).all()
        elif activo is not None:
            ret = entidad.filter(entidad.activo==activo).order_by(asc(entidad.nick)).all()
        else:
            ret = entidad.order_by(asc(entidad.nick)).all()

        # Y se devuelven.
        return ret

    def set_usuario_passwd(self, usuario_id, \
                           quitarIntento = False, \
                           resetearIntento = False, \
                           numeroIntentos = 0):
        '''Actualización: intentos
        Tabla: usuario
        Filtros de actualización: usuario_id <identificador>
        Opciones de filtrado: quitarIntento <True: disminuye en 1 el número
        de intentos, False: Nada> resetearIntento <True: Resetea intentos a 
        numeroIntentos, False: Nada>'''

        # Se define entidad.
        entidad = self.__db.entity("usuario")

        if quitarIntento or resetearIntento:
            # Se recupera usuario.
            ret = entidad.get(usuario_id)

            # Quitamos intento.
            if quitarIntento:
                if ret.intentos > 0: ret.intentos -= 1

            # Reseteamos intento.
            if resetearIntento: ret.intentos = numeroIntentos

            # Commit.
            self.__db.commit()

    def get_recurso(self, codigo = None, activo = None):
        '''Devuelve: (id, codigo, descripcion, activo, observaciones)
        Tabla: recurso (recurso de aplicación)
        Opciones de filtrado: código del recurso <codigo>, activo <'S','N'>'''

        # 26-10-2016 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()        

        # Se define entidad.
        entidad = self.__db.entity("recurso")

        if codigo is not None and activo is not None:
            where = and_(entidad.activo==activo, entidad.codigo==codigo)
            ret = entidad.filter(where).order_by(asc(entidad.descripcion)).all()
        elif activo is not None:
            ret = entidad.filter(entidad.activo==activo).order_by(asc(entidad.descripcion)).all()
        elif codigo is not None:
            ret = entidad.filter(entidad.codigo==codigo).order_by(asc(entidad.descripcion)).all()
        else:
            ret = entidad.order_by(asc(entidad.descripcion)).all()

        # Y se devuelven.
        return ret

    def get_rol(self, activo = None, codigo = None):
        '''Devuelve: (id, codigo, descripcion, observaciones, activo)
        Tabla: rol (rol maestro de aplicación) 
        Opciones de filtrado: activo <'S','N'>, codigo <código rol>'''

        # 26-10-2016 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()        

        # Se definen entidades.
        entidad_maestro = self.__db.entity("rol")
        
        # Reglas.
        if codigo is not None and activo is not None:
            where = and_(entidad_maestro.activo==activo, \
                         entidad_maestro.codigo==codigo)
            ret = entidad_maestro.filter(where).order_by(asc(entidad_maestro.descripcion)).all()
        elif codigo is not None:
            ret = entidad_maestro.filter(entidad_maestro.codigo==codigo).order_by(asc(entidad_maestro.descripcion)).all()
        elif activo is not None:
            ret = entidad_maestro.filter(entidad_maestro.activo==activo).order_by(asc(entidad_maestro.descripcion)).all()
        else:
            ret = entidad_maestro.order_by(asc(entidad_maestro.descripcion)).all()

        # Y se devuelven.
        return ret


    def get_rol_usuario(self, usuario_id = None, activo = None):
        '''Devuelve: (rol_id, usuario_id, observaciones, activo
        Tabla: rol_usuario (relación entre rol y usuario)
        Opciones de filtrado: usuario_id <id de usuario>, activo <'S','N'>'''

        cadenaSQL = '''
        select rol_usuario.id id_,
               rol_usuario.rol_id rol_id,
               rol.descripcion rol_desc,
               usuario.id usuario_id,
               usuario.nick usuario,
               rol_usuario.observaciones observaciones,
               rol_usuario.activo activo
          from rol_usuario join usuario on usuario.id = rol_usuario.usuario_id
                           join rol on rol.id = rol_usuario.rol_id
         where 1 = 1
        '''

        # Definición de clausuras.
        clausura_1 = ' and rol_usuario.usuario_id = ? '
        clausura_2 = ' and rol_usuario.activo = ? '

        # Se crea objeto conexión.
        conn = self.__db.connection()        

        # Reglas.
        if usuario_id is not None: cadenaSQL += clausura_1
        if activo is not None: cadenaSQL += clausura_2

        # Ejecución.
        if usuario_id is not None and activo is not None:
            ret = conn.execute(cadenaSQL, usuario_id, activo)
        elif usuario_id is not None:
            ret = conn.execute(cadenaSQL, usuario_id)
        elif activo is not None:
            ret = conn.execute(cadenaSQL, activo)
        else:
            ret = conn.execute(cadenaSQL)
        # Se recuperan datos.
        ret = ret.fetchall()        

        # Y se devuelven.
        return ret        

    def get_rol_recurso(self, recurso_id = None, activo = None):
        '''Devuelve: (id, rol_id, rol_desc, recurso_id, recurso_desc, 
        ejecucion, lectura, escritura, observaciones, activo
        Tabla: rol_recurso (relación entre rol y recurso)
        Opciones de filtrado: recurso_id <id de recurso>, activo <'S','N'>'''

        cadenaSQL = '''
        select rol_recurso.id id_,
               rol_recurso.rol_id rol_id,
               rol.descripcion rol_desc,
               recurso.id recurso_id,
               recurso.descripcion recurso_desc,
               rol_recurso.ejecucion,
               rol_recurso.lectura,
               rol_recurso.escritura,
               rol_recurso.observaciones observaciones,
               rol_recurso.activo activo
          from rol_recurso join recurso on recurso.id = rol_recurso.recurso_id
                           join rol on rol.id = rol_recurso.rol_id
         where 1 = 1
        '''

        # Definición de clausuras.
        clausura_1 = ' and rol_recurso.recurso_id = ? '
        clausura_2 = ' and rol_recurso.activo = ? '

        # Se crea objeto conexión.
        conn = self.__db.connection()        

        # Reglas.
        if recurso_id is not None: cadenaSQL += clausura_1
        if activo is not None: cadenaSQL += clausura_2

        # Ejecución.
        if recurso_id is not None and activo is not None:
            ret = conn.execute(cadenaSQL, recurso_id, activo)
        elif recurso_id is not None:
            ret = conn.execute(cadenaSQL, recurso_id)
        elif activo is not None:
            ret = conn.execute(cadenaSQL, activo)
        else:
            ret = conn.execute(cadenaSQL)
        # Se recuperan datos.
        ret = ret.fetchall()        

        # Y se devuelven.
        return ret        

    def insert_usuario(self, nick, passwd, fecha_alta, \
                       intentos, activo, hacer_commit = True):
        '''Inserción de nuevo usuario
        Tabla: usuario
        '''

        # Se define entidad.
        entidad = self.__db.entity("usuario")

        # Tratamiento especial para las fechas.
        try:
            fecha_alta = datetime.fromtimestamp(fecha_alta/1000.0).date()
        except:
            fecha_alta = datetime.today()

        # Se inserta nuevo elemento.
        entidad.insert(nick = nick, passwd = passwd, \
                       fecha_alta = fecha_alta, intentos = intentos, \
                       activo = activo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_usuario(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: usuario'''

        # Se define entidad.
        entidad = self.__db.entity("usuario")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "nick": ret.nick = valor
        if campo == "passwd": ret.passwd = valor
        if campo == "persona_id": ret.persona_id = valor
        if campo == "intentos": ret.intentos = valor
        if campo == "activo": ret.activo = valor
        if campo == "fecha_baja": ret.fecha_baja = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_usuario(self, _id, hacer_commit = True):
        '''Borrado de usuario
        Tabla: usuario
        '''

        # Se define entidad.
        entidad = self.__db.entity("usuario")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_usuario(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de usuario
        Tabla: usuario
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_usuario(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_usuario(i['nick'], i['passwd'], i['fecha_alta'], \
                                i['intentos'], i['activo'], False)

        # Actualización.
        for i in campos:
            self.update_usuario(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                msj = u'El nombre de usuario ya existe.'
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj

    def insert_recurso(self, codigo, descripcion, observaciones, \
                       activo, hacer_commit = True):
        '''Inserción de nuevo recurso
        Tabla: recurso
        '''

        # Se define entidad.
        entidad = self.__db.entity("recurso")

        # Se inserta nuevo elemento.
        entidad.insert(codigo = codigo, descripcion = descripcion, \
                       observaciones = observaciones, activo = activo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_recurso(self, _id,campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: recurso'''

        # Se define entidad.
        entidad = self.__db.entity("recurso")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "codigo": ret.codigo = valor
        if campo == "descripcion": ret.descripcion = valor
        if campo == "observaciones": ret.observaciones = valor
        if campo == "activo": ret.activo = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_recurso(self, _id, hacer_commit = True):
        '''Borrado de recurso
        Tabla: recurso
        '''

        # Se define entidad.
        entidad = self.__db.entity("recurso")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_recurso(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de recurso
        Tabla: recurso
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_recurso(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_recurso(i['codigo'], i['descripcion'], \
                                i['observaciones'], i['activo'], False)

        # Actualización.
        for i in campos:
            self.update_recurso(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj

    def insert_rol(self, codigo, descripcion, observaciones, \
                   activo, hacer_commit = True):
        '''Inserción de nuevo rol
        Tabla: rol
        '''

        # Se define entidad.
        entidad = self.__db.entity("rol")

        # Se inserta nuevo elemento.
        entidad.insert(codigo = codigo, descripcion = descripcion, \
                       observaciones = observaciones, activo = activo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_rol(self, _id,campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: rol'''

        # Se define entidad.
        entidad = self.__db.entity("rol")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "codigo": ret.codigo = valor
        if campo == "descripcion": ret.descripcion = valor
        if campo == "observaciones": ret.observaciones = valor
        if campo == "activo": ret.activo = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_rol(self, _id, hacer_commit = True):
        '''Borrado de rol
        Tabla: rol
        '''

        # Se define entidad.
        entidad = self.__db.entity("rol")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_rol(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de rol 
        Tabla: rol
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_rol(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_rol(i['codigo'], i['descripcion'], \
                            i['observaciones'], i['activo'], False)

        # Actualización.
        for i in campos:
            self.update_rol(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                msj = u'El código y/o la descripción ya existen'            
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj

    def get_turno(self, activo = None, codigo = None, id_m = None, \
                  solo_libres = False):
        '''Devuelve: (id, codigo, descripcion, cuenta_horas, activo,
        id_detalle, dia_inicial, dia_final, hora_inicio, hora_fin)
        Tablas: turno_master y turno_detail 
        Opciones de filtrado: activo <'S','N'>, codigo <código turno>, 
                              identificador de maestro <id_m>
        '''

        # ALGG 01-11-2016 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()        

        cadenaSQL = '''
        select m.id id_m, 
               m.codigo codigo_m, 
               m.descripcion descripcion_m, 
               m.cuenta_horas cuenta_horas_m,
               m.activo activo_m, 
               d.id id_d,
               d.dia_inicial dia_inicial_d,
               d.dia_final dia_final_d,
               d.hora_inicio hora_inicio_d,
               d.hora_fin hora_fin_d
          from turno_master m join turno_detail d on m.id = d.turno_master_id
         where 1 = 1
         '''

        ordenacion = 'order by codigo_m, id_d'

        if id_m is None:
            # Definición de clausuras.
            clausura_1 = ' and codigo_m = ? '
            clausura_2 = ' and activo_m = ? '
        else:
            clausura_1 = ' and id_m = ? '

        if solo_libres: clausura_3 = " and cuenta_horas_m = 'N' "
        else: clausura_3 = ' and 1 = 1 '

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        if id_m is None:
            if codigo is not None and activo is not None:
                cadenaSQL += clausura_1 + clausura_2 + clausura_3 + ordenacion
                ret = conn.execute(cadenaSQL, codigo, activo) 
            elif codigo is not None:
                cadenaSQL += clausura_1 + clausura_3 + ordenacion
                ret = conn.execute(cadenaSQL, codigo)
            elif activo is not None:
                cadenaSQL += clausura_2 + clausura_3 + ordenacion
                ret = conn.execute(cadenaSQL, activo)
            else:
                ret = conn.execute(cadenaSQL)
        else:
            cadenaSQL += clausura_1 + clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, id_m)

        # Se recuperan datos.
        ret = ret.fetchall()

        # Y se devuelven.
        return ret

    def insert_turno(self, id_m, codigo_m, descripcion_m, cuenta_horas_m, \
                     activo_m, id_d, dia_inicial_d, dia_final_d, hora_inicio_d, \
                     hora_fin_d, hacer_commit = True):
        '''Inserción de turno
        Tablas: turno_master y turno_detail
        '''

        # Un turno se compone de un maestro y un detalle. Se puede insertar
        # un maestro si id_m es 0 e id_d es 0. Se puede insertar un detalle
        # si id_m es distinto de cero pero id_d es 0. Por tanto hay que tener
        # en cuenta estas dos casuísticas.

        # Se define entidad de maestro.
        entidad_maestro = self.__db.entity("turno_master")

        # Se define entidad de detalle.
        entidad_detalle = self.__db.entity("turno_detail")

        # Inserción en maestro.
        if id_m == 0:
            entidad_maestro.insert(codigo = codigo_m, \
                                   descripcion = descripcion_m, \
                                   cuenta_horas = cuenta_horas_m, \
                                   activo = activo_m)
            # Hacemos flush para decirle a la transacción que necesitamos
            # operar sobre el resultado de operaciones que hemos hecho.
            
            try:
                self.__db.flush()        
                ret = True
                msj = ''

            except Exception as ex:
                msj = str(ex.__class__)
                ret = False
                if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                    msj = u'El turno ya existe.'            
                    print "MENSAJE DE ERROR ", msj

            if ret:
                # Se recupera el id de la fila que acabamos de insertar.
                ret = entidad_maestro.filter(entidad_maestro.codigo==codigo_m).one()
                # Y se actualiza el identificador del maestro.
                id_m = ret.id
                # Y el identificador del detalle.
                id_d = 1
        else:
            # Si el maestro existe hay que buscar el siguiente id del detalle.
            cadenaSQL = '''
        select max(td.id) max_id
          from turno_detail td
         where 1 = 1 
           and td.turno_master_id = ?
            '''

            # Se crea objeto conexión.
            conn = self.__db.connection()

            # Ejecución.
            ret = conn.execute(cadenaSQL, id_m).fetchone() 

            # Se calcula nuevo id de detalle.
            id_d = ret['max_id'] + 1

        # Inserción de detalle.  
        entidad_detalle.insert(turno_master_id = id_m, id = id_d, \
                               dia_inicial = dia_inicial_d, \
                               dia_final = dia_final_d, \
                               hora_inicio = hora_inicio_d, \
                               hora_fin = hora_fin_d)

        # Hacemos flush para decirle a la transacción que necesitamos
        # operar sobre el resultado de operaciones que hemos hecho. Así evitamos
        # el problema de inserciones múltiples de elementos nuevos.
        
        if ret:
            try:
                self.__db.flush()        
                ret = True
                msj = ''
    
            except Exception as ex:
                msj = str(ex.__class__)
                ret = False
                if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                    msj = u'Ya existe un turno con mismo código o descripción.'            
                    print "MENSAJE DE ERROR ", msj
            
            if ret:        
                # Se hace commit.
                if hacer_commit: self.__db.commit()    
                
        # Se devuelve estado...
        return ret, msj

    def update_turno(self, campos, hacer_commit = True):
        '''Actualización de turno
        Tabla: turno_master y turno_detail'''

        # Se definen entidades.
        entidad_master = self.__db.entity("turno_master")
        entidad_detail = self.__db.entity("turno_detail")

        for i in campos:
            # Buscamos la fila apropiada.
            ret_m = entidad_master.get(i['id'])
            ret_d = entidad_detail.filter(entidad_detail.turno_master_id == i['id'], \
                                          entidad_detail.id == i['id_d']).one()

            # Actualizamos los campos que se consideren oportunos.
            if i['field'] == "codigo_m": ret_m.codigo = i['valor_nuevo']
            if i['field'] == "descripcion_m": ret_m.descripcion = i['valor_nuevo']
            if i['field'] == "activo_m": ret_m.activo = i['valor_nuevo']
            if i['field'] == "cuenta_horas_m": ret_m.cuenta_horas = i['valor_nuevo']

            if i['field'] == "hora_inicio_d": ret_d.hora_inicio = i['valor_nuevo']
            if i['field'] == "hora_fin_d": ret_d.hora_fin = i['valor_nuevo']
            if i['field'] == "dia_inicial_d": ret_d.dia_inicial = i['valor_nuevo']
            if i['field'] == "dia_final_d": ret_d.dia_final = i['valor_nuevo']

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_turno(self, turno_master_id, _id, hacer_commit = True):
        '''Borrado de turno
        Tablas: turno_master y turno_detail
        '''

        # Se define entidad.
        entidad = self.__db.entity("turno_detail")

        # print("Borrando fila %d , %d" % (turno_master_id, _id))    

        # Buscamos la fila apropiada, cuya Primary Key es compuesta.
        ret = entidad.filter(entidad.turno_master_id==turno_master_id, \
                             entidad.id==_id).one()

        # Se elimina.
        self.__db.delete(ret)

        # Hacemos flush para decirle a la transacción que se hizo un delete
        # sin llegar a hacer commit, pero que lo tiene que tener en cuenta...
        self.__db.flush()

        # Se comprueba si quedan más detalles. Si no hay más detalles, se
        # elimina la fila del maestro.
        entidad = self.__db.entity("turno_detail")
        ret = entidad.filter(entidad.turno_master_id==turno_master_id).all()
        if len(ret) == 0:
            # Se busca la cabecera del maestro...
            entidad = self.__db.entity("turno_master")
            ret = entidad.filter(entidad.id==turno_master_id).one()
            # Y se elimina...
            self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_turno(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de turno
        Tablas: turno_master y turno_detail
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        ret = True
        msj = 'Todo correcto'
        
        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: 
            # Se borra...
            self.delete_turno(i['id_m'], i['id_d'], False)

        # Inserción.
        for i in reg_nuevo: 
            ret,msj = self.insert_turno(id_m = i['id'], codigo_m = i['codigo_m'], \
                                        descripcion_m = i['descripcion_m'], \
                                        cuenta_horas_m = i['cuenta_horas_m'], \
                                        activo_m = i['activo_m'], id_d = i['id_d'], \
                                        dia_inicial_d = i['dia_inicial_d'], \
                                        dia_final_d = i['dia_final_d'], \
                                        hora_inicio_d = i['hora_inicio_d'], \
                                        hora_fin_d = i['hora_fin_d'], \
                                        hacer_commit = False)
            if not ret: break

        if ret:
            # Actualización.
            self.update_turno(campos, False)        
    
            # Commit.
            try:
                self.__db.commit()
                ret = True
    
            except Exception as ex:
            # except ValueError as e:
                # Se recoge mensaje de error y se envía.
                self.__db.rollback()
                msj = str(ex.__class__)
                ret = False
                if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                    msj = u'Ya existe un turno con mismo código o descripción.'            
                print "MENSAJE DE ERROR ", msj

        else: self.__db.rollback()
        
        # Se devuelve estado y mensaje.
        return ret, msj    

    def get_ciclo(self, activo = None, id_ = None):
        '''Devuelve: (id, codigo, descripcion, cuenta_festivo, activo, 
        id_detalle, numero_dia, turno_master_id
        Tablas: ciclo_master y ciclo_detail 
        Opciones de filtrado: activo <'S','N'>, codigo <código ciclo>'''

        # ALGG 01-11-2016 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()        

        cadenaSQL = '''
        select m.id id_m, 
               m.codigo cod_m, 
               m.descripcion desc_m, 
               m.cuenta_festivo cuenta_festivo_m,
               m.activo activo_m, 
               tm.id id_turno_d,
               tm.codigo cod_turno_d	
          from ciclo_master m join ciclo_detail d on m.id = d.ciclo_master_id
                              join turno_master tm on tm.id = d.turno_master_id
         where 1 = 1
      '''

        # Ordenación.
        ordenacion = ' order by m.codigo, d.id '

        # Definición de clausuras.
        clausura_1 = ' and m.id = ? '
        clausura_2 = ' and m.activo = ? '

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        if id_ is not None and activo is not None:
            cadenaSQL += clausura_1 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, id_, activo) 
        elif id_ is not None:
            cadenaSQL += clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, id_)
        elif activo is not None:
            cadenaSQL += clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, activo)
        else:
            ret = conn.execute(cadenaSQL + ordenacion)

        # Se recuperan datos.
        ret = ret.fetchall()

        print cadenaSQL

        # Y se devuelven.
        return ret

    def get_calendario_festivo(self, centro_fisico_id = None, anno = None):
        '''Devuelve: (centro_fisico_id, cod_cf, desc_cf, año, fecha_festivo,
        desc_festivo, observ_festivo)
        Tabla: calendario_festivo
        Opciones de filtrado: Id de centro físico <centro_fisico_id>, 
        año de calendario laboral <anno>
        '''

        # Rollback para eliminar tansacciones pendientes.
        self.__db.rollback()        

        # ####################################################################
        #
        # Calendarios asociados a centros físicos:
        #
        #   select calendario_festivo.centro_fisico_id,
        #          unit.codigo cod_cf, 
        #          unit.descripcion desc_cf,
        #          strftime('%Y', calendario_festivo.fecha) as anno,
        #          calendario_festivo.fecha fecha_festivo,
        #          calendario_festivo.descripcion desc_festivo,
        #          calendario_festivo.observaciones observ_festivo
        #     from calendario_festivo join unit on unit.id = calendario_festivo.centro_fisico_id
        #                                  and unit.tipo_unit_id = 1
        #                                  and unit.activo = 'S'
        #                             join tipo_unit on tipo_unit.id = unit.tipo_unit_id
        # 		                   and tipo_unit.activo = 'S'
        # order by unit.descripcion asc, anno desc, calendario_festivo.fecha asc		 
        #
        # ####################################################################        

        # Se obtiene función para obtener año de fecha a partir del engine actual.
        anno_sql = self.__get_date_sql("calendario_festivo.fecha", "anno")

        # Se define consulta.
        cadenaSQL = '''
	select calendario_festivo.centro_fisico_id,
	       unit.codigo cod_cf, 
               unit.descripcion desc_cf,
	       %s as anno,
	       calendario_festivo.fecha fecha_festivo,
	       calendario_festivo.descripcion desc_festivo,
	       calendario_festivo.observaciones observ_festivo
	  from calendario_festivo join unit on unit.id = calendario_festivo.centro_fisico_id
	                               and unit.tipo_unit_id = 1
                                       and unit.activo = 'S'
                                  join tipo_unit on tipo_unit.id = unit.tipo_unit_id
                                       and tipo_unit.activo = 'S'
         where 1 = 1	
	''' % (anno_sql)

        # Definición de clausuras.
        clausura_1 = ' and calendario_festivo.centro_fisico_id = ? '
        clausura_2 = ' and anno = ? '

        # Ordenación
        ordenacion = 'order by unit.descripcion asc, anno desc, calendario_festivo.fecha asc'

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        if centro_fisico_id is not None: cadenaSQL += clausura_1
        if anno is not None: cadenaSQL += clausura_2
        cadenaSQL += ordenacion

        # Ejecución.
        if centro_fisico_id is not None and anno is not None:
            ret = conn.execute(cadenaSQL, centro_fisico_id, str(anno))
        elif centro_fisico_id is not None:
            ret = conn.execute(cadenaSQL, centro_fisico_id)
        elif anno is not None:
            ret = conn.execute(cadenaSQL, str(anno))
        else: ret = conn.execute(cadenaSQL)

        # Se recuperan datos.
        ret = ret.fetchall()

        print(cadenaSQL)

        # Y se devuelven.
        return ret	

    def actualizar_ciclo(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de turno
        Tablas: ciclo_master y ciclo_detail
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        ret = True
        msj = ''
        
        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: 
            # Se borra...
            self.delete_ciclo(i, True, False)

        # Inserción.
        for i in reg_nuevo: 
            ret,msj = self.insert_ciclo(id_m = i['id'], codigo_m = i['codigo_m'], \
                                        descripcion_m = i['descripcion_m'], \
                                        activo_m = i['activo_m'], \
                                        cuenta_festivo_m = i['cuenta_festivo_m'], \
                                        ciclo_d = i['ciclo_d'], hacer_commit = False)
            if not ret: break

        if ret:
            # Actualización.
            self.update_ciclo(campos, False)        
    
            # Commit.
            try:
                self.__db.commit()
                ret = True
    
            except Exception as ex:
                # Se recoge mensaje de error y se envía.
                self.__db.rollback()
                msj = str(ex.__class__)
                ret = False
                if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                    msj = u'El ciclo ya existe.'            
                print "MENSAJE DE ERROR ", msj
        else: self.__db.rollback()
        
        # Se devuelve estado y mensaje.
        return ret, msj    

    def delete_ciclo(self, ciclo_master_id, borrar_cabecera = True, \
                     hacer_commit = True):
        '''Borrado de ciclo
        Tablas: ciclo_master y ciclo_detail
        '''

        # Se define entidad.
        entidad = self.__db.entity("ciclo_detail")

        # Buscamos el detalle, y borramos todas sus filas.
        ret = entidad.filter(entidad.ciclo_master_id==ciclo_master_id).all()

        # Se elimina.
        for i in ret: self.__db.delete(i)

        # Hacemos flush para decirle a la transacción que se hizo un delete
        # sin llegar a hacer commit, pero que lo tiene que tener en cuenta...
        self.__db.flush()

        if borrar_cabecera:
            # Se elimina la fila del maestro.
            entidad = self.__db.entity("ciclo_master")
            ret = entidad.filter(entidad.id==ciclo_master_id).one()
            # Y se elimina...
            self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()    

    def insert_ciclo(self, codigo_m, descripcion_m, activo_m, \
                     cuenta_festivo_m, ciclo_d, insertar_solo_detalle = False, \
                     id_m = None, hacer_commit = True):
        '''Inserción de ciclo
        Tablas: ciclo_master y ciclo_detail
        '''

        ret = True
        msj = ''
        
        # Un ciclo se compone de un maestro y un detalle. 

        # Se define entidad de detalle.
        entidad_detalle = self.__db.entity("ciclo_detail")

        if not insertar_solo_detalle:
            # Se define entidad de maestro.
            entidad_maestro = self.__db.entity("ciclo_master")

            # Inserción en maestro.
            entidad_maestro.insert(codigo = codigo_m, \
                                   descripcion = descripcion_m, \
                                   activo = activo_m, \
                                   cuenta_festivo = cuenta_festivo_m)

            # Hacemos flush para decirle a la transacción que necesitamos
            # operar sobre el resultado de operaciones que hemos hecho.
           
            try:
                self.__db.flush()        
                ret = True
                msj = ''

            except Exception as ex:
                msj = str(ex.__class__)
                ret = False
                if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                    msj = u'El código o descripción del ciclo ya existe.'            
                    print "MENSAJE DE ERROR ", msj
            
            if ret:
                # Se recupera el id de la fila que acabamos de insertar.
                ret = entidad_maestro.filter(entidad_maestro.codigo==codigo_m).one()
                # Id. del maestro.
                id_m = ret.id

        if ret:
            # Se insertan todas las actividades en el detalle.
            for i in range(len(ciclo_d)):
                entidad_detalle.insert(ciclo_master_id = id_m, \
                                       id = i + 1, \
                                       turno_master_id = ciclo_d[i])

        if ret:
            # Se hace commit.
            if hacer_commit: self.__db.commit()            

        # Se devuelve estado...
        return ret, msj

    def update_ciclo(self, campos, hacer_commit = True):
        '''Actualización de ciclo
        Tabla: ciclo_master y ciclo_detail'''

        # Se definen entidades.
        entidad_master = self.__db.entity("ciclo_master")
        entidad_detail = self.__db.entity("ciclo_detail")

        for i in campos:
            # Buscamos la fila apropiada.
            ret_m = entidad_master.get(i['id'])

            # Actualizamos los campos que se consideren oportunos.
            if i['field'] == "codigo_m": ret_m.codigo = i['valor_nuevo']
            if i['field'] == "descripcion_m": ret_m.descripcion = i['valor_nuevo']
            if i['field'] == "activo_m": ret_m.activo = i['valor_nuevo']
            if i['field'] == "cuenta_festivo_m": ret_m.activo = i['valor_nuevo']

            # Si se cambia el ciclo, se tiene que borrar el detalle del ciclo
            # y volver a insertar.
            if i['field'] == "ciclo_d": 
                # Eliminamos ciclo.
                self.delete_ciclo(i['id'], borrar_cabecera = False, \
                                  hacer_commit = False)
                # Se inserta ciclo.
                self.insert_ciclo(None, None, None, None, i['valor_nuevo'], \
                                  insertar_solo_detalle = True, \
                                  id_m = i['id'], hacer_commit = False) 

        # Commit.
        if hacer_commit: self.__db.commit()

    def get_unit(self, tipo_unit_id_, id_ = None, codigo = None, activo = None):
        '''Devuelve: (id, tipo_unit_id, codigo, descripcion, activo, direccion, 
        poblacion, cp, provincia, pais, telefono1, telefono2, observaciones, 
        email)
        Tabla: unit (unidad organizativa)
        Opciones de filtrado: id_ <id de unit>, activo <'S','N'>'''

        # 26-11-2016 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()

        # Se define entidad.
        entidad = self.__db.entity("unit")

        if id_ is not None and activo is not None:
            where = and_(entidad.id==id_, entidad.activo==activo, \
                         entidad.tipo_unit_id==tipo_unit_id_)
            ret = entidad.filter(where).order_by(asc(entidad.descripcion)).all()
        if codigo is not None and activo is not None:
            where = and_(entidad.codigo==codigo, entidad.activo==activo, \
                         entidad.tipo_unit_id==tipo_unit_id_)
            ret = entidad.filter(where).order_by(asc(entidad.descripcion)).all()
        elif id_ is not None:
            where = and_(entidad.id==id_, entidad.tipo_unit_id==tipo_unit_id_)            
            ret = entidad.filter(where).all()
        elif codigo is not None:
            where = and_(entidad.codigo==codigo, entidad.tipo_unit_id==tipo_unit_id_)            
            ret = entidad.filter(where).all()
        elif activo is not None:
            where = and_(entidad.activo==activo, entidad.tipo_unit_id==tipo_unit_id_)            
            ret = entidad.filter(where).order_by(asc(entidad.descripcion)).all()
        else:
            ret = entidad.filter(entidad.tipo_unit_id==tipo_unit_id_).all()

        # Y se devuelven.
        return ret

    def actualizar_calendario_festivo(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de calendario festivo
        Tabla: calendario_festivo
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_calendario_festivo(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_calendario_festivo(i['centro_fisico_id'], \
                                           i['fecha_festivo'], \
                                           i['desc_festivo'], \
                                           i['observ_festivo'], False)

        # Actualización.
        for i in campos:
            self.update_calendario_festivo(i['id'], i['field'], \
                                           i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                msj = u'Ya existe un día festivo para el centro físico ' + \
                    'en el año seleccionado'            
            print "MENSAJE DE ERROR ", msj

        # Se devuelve estado y mensaje.
        return ret, msj

    def insert_calendario_festivo(self, centro_fisico_id, fecha_festivo, \
                                  desc_festivo, observ_festivo, \
                                  hacer_commit = True):
        '''Inserción de nueva festividad
        Tabla: calendario_festivo
        '''

        '''
        [{u'desc_festivo': u'aa', u'observ_festivo': u'aa', u'centro_fisico_id': 1, 
          u'anno': 2016, u'fecha_festivo': u'2016-11-01', u'desc_cf': u'CF 1', 
          u'cod_cf': u'COCF1', u'id': 0}]
        '''

        # Se define entidad.
        entidad = self.__db.entity("calendario_festivo")

        # ALGG 11012017 Se transforma la fecha a objeto Python.
        fecha_festivo = self.fechaPython(fecha_festivo)

        # Se inserta nuevo elemento.
        entidad.insert(centro_fisico_id = centro_fisico_id, fecha = fecha_festivo, \
                       descripcion = desc_festivo, observaciones = observ_festivo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_calendario_festivo(self, _id,campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: calendario_festivo'''

        # Se define entidad.
        entidad = self.__db.entity("calendario_festivo")

        # Desmenuzamos la PK para formar la PK compuesta.
        fecha = '%s-%s-%s' % (_id[-8:][0:4], _id[-8:][4:6], _id[-8:][6:8])
        # Creamos objeto Python de tipo Date para pasarlo a la base de datos.
        fecha = datetime.strptime(fecha, "%Y-%m-%d").date()
        # Centro físico id.
        cf_id = int(_id[0:len(_id) - 8])
        print(fecha)

        # print("actualizando campo %s con valor %s con cf_id=%s, fecha=%s" % (campo, valor, cf_id, fecha))
        # Buscamos la fila apropiada.
        where = and_(entidad.centro_fisico_id==cf_id, \
                     entidad.fecha==fecha)
        ret = entidad.filter(where).one()

        # Actualizamos los campos que se consideren oportunos.
        if campo == "fecha_festivo": ret.fecha = \
           datetime.strptime(valor, "%Y-%m-%d").date()
        if campo == "centro_fisico_id": ret.centro_fisico_id = valor
        if campo == "observ_festivo": ret.observaciones = valor
        if campo == "desc_festivo": ret.descripcion = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_calendario_festivo(self, _id, hacer_commit = True):
        '''Borrado de festividad
        Tabla: calendario_festivo
        '''

        # Se define entidad.
        entidad = self.__db.entity("calendario_festivo")

        # Desmenuzamos la PK para formar la PK compuesta.
        fecha = '%s-%s-%s' % (_id[-8:][0:4], _id[-8:][4:6], _id[-8:][6:8])
        # Creamos objeto Python de tipo Date para pasarlo a la base de datos.
        fecha = datetime.strptime(fecha, "%Y-%m-%d").date()   
        # Centro físico id.
        centro_fisico_id = int(_id[0:len(_id) - 8])

        # Buscamos la fila apropiada.
        where = and_(entidad.centro_fisico_id==centro_fisico_id, \
                     entidad.fecha==fecha)

        print("valor de _id: %s" % str(_id)) 
        print("centro_fisico_id=%s" % str(centro_fisico_id))
        print("fecha: %s" % fecha)

        ret = entidad.filter(where).one()

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def get_persona(self, id_ = None, dni = None):
        '''Devuelve: (id, dni, nombre, ape1, ape2, direccion, cp, poblacion,
        provincia, pais, tlfno1, tlfno2, email, observaciones, sexo, fnac)
        Tabla: persona (datos personales del trabajador)
        Opciones de filtrado: id_ <id de persona>, dni <dni de persona>
        '''

        # 04-12-2016 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()

        # Se define entidad.
        entidad = self.__db.entity("persona")

        if id_ is not None and dni is not None:
            where = and_(entidad.id==id_, entidad.dni==dni)
            ret = entidad.filter(where).order_by(asc(entidad.ape1), \
                                                 asc(entidad.ape2), \
                                                 asc(entidad.nombre)).all()
        elif id_ is not None:
            ret = entidad.filter(entidad.id==id_).all()
        elif dni is not None:
            ret = entidad.filter(entidad.dni==dni).order_by(asc(entidad.ape1), \
                                                            asc(entidad.ape2), \
                                                            asc(entidad.nombre)).all()
        else:
            ret = entidad.order_by(asc(entidad.ape1), asc(entidad.ape2), \
                                   asc(entidad.nombre)).all()

        # Y se devuelven.
        return ret

    def insert_persona(self, dni, nombre, ape1, ape2, direccion, cp, poblacion, \
                       provincia, pais, tlfno1, tlfno2, email, observaciones, \
                       sexo, fnac, hacer_commit = True):
        '''Inserción de nueva persona
        Tabla: persona
        '''

        # Se define entidad.
        entidad = self.__db.entity("persona")

        if fnac is not None: fnac = self.fechaPython(fnac)
        
        # Se inserta nuevo elemento.
        entidad.insert(dni = dni, nombre = nombre, ape1 = ape1, ape2 = ape2, \
                       direccion = direccion, cp = cp, poblacion = poblacion, \
                       provincia = provincia, pais = pais, tlfno1 = tlfno1, \
                       tlfno2 = tlfno2, email = email, \
                       observaciones = observaciones, sexo = sexo, fnac = fnac) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_persona(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: persona'''

        # Se define entidad.
        entidad = self.__db.entity("persona")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "dni": ret.dni = valor
        if campo == "nombre": ret.nombre = valor
        if campo == "ape1": ret.ape1 = valor
        if campo == "ape2": ret.ape2 = valor
        if campo == "direccion": ret.direccion = valor
        if campo == "cp": ret.cp = valor
        if campo == "poblacion": ret.poblacion = valor
        if campo == "provincia": ret.provincia = valor
        if campo == "pais": ret.pais = valor
        if campo == "tlfno1": ret.tlfno1 = valor
        if campo == "tlfno2": ret.tlfno2 = valor
        if campo == "email": ret.email = valor
        if campo == "observaciones": ret.observaciones = valor
        if campo == "sexo": ret.sexo = valor
        if campo == "fnac": ret.fnac = self.fechaPython(valor)

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_persona(self, _id, hacer_commit = True):
        '''Borrado de persona
        Tabla: persona
        '''

        # Se define entidad.
        entidad = self.__db.entity("persona")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_persona(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de persona
        Tabla: persona
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_persona(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_persona(i['dni'], i['nombre'], i['ape1'], i['ape2'], \
                                i['direccion'], i['cp'], i['poblacion'], \
                                i['provincia'], i['pais'], i['tlfno1'], \
                                i['tlfno2'], i['email'], i['observaciones'], \
                                i['sexo'], i['fnac'], False)

        # Actualización.
        for i in campos:
            self.update_persona(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj    

    def get_estructura(self, puesto_id = None, activo = None):
        '''Devuelve: (cf_id, cf_cod, cf_desc, sf_id, sf_cod, sf_desc, 
        eq_id, eq_cod, eq_desc, p_id, p_cod, p_desc, observ, activo)
        Tabla: estructura (estructura organizativa)
        '''

        # Rollback para eliminar tansacciones pendientes.
        self.__db.rollback()        

        # ####################################################################
        #
        # Estructura organizativa.
        #
        #   select u_cf.id cf_id,
        #          u_cf.codigo cf_cod,
        #          u_cf.descripcion cf_desc,		  
        #          u_sf.id sf_id,
        #          u_sf.codigo sf_cod,
        #          u_sf.descripcion sf_desc,		  
        #          u_eq.id eq_id,
        #          u_eq.codigo eq_cod,
        #          u_eq.descripcion eq_desc,		  
        #          u_p.id p_id,
        #          u_p.codigo p_cod,
        #          u_p.descripcion p_desc,
        #          e.observaciones observ,
        #          e.activo activo
        #     from estructura e join unit u_cf on u_cf.id = e.centro_fisico_id
        #                            and u_cf.activo = 'S'
        #                       join unit u_sf on u_sf.id = e.servicio_id
        #                            and u_sf.activo = 'S'
        #                       join unit u_eq on u_eq.id = e.categoria_id
        #                            and u_eq.activo = 'S'
        #                       join unit u_p on u_p.id = e.puesto_id
        #                            and u_p.activo = 'S'
        #    where e.activo = 'S'									 
        # order by cf_desc, sf_desc, eq_desc, p_desc		 
        #
        # ####################################################################        

        # Se define consulta.
        cadenaSQL = '''
          select distinct 
                 u_cf.id cf_id,
                 u_cf.codigo cf_cod,
	         u_cf.descripcion cf_desc,		  
	         u_sf.id sf_id,
                 u_sf.codigo sf_cod,
                 u_sf.descripcion sf_desc,		  
	         u_eq.id eq_id,
                 u_eq.codigo eq_cod,
	         u_eq.descripcion eq_desc,		  
	         u_p.id p_id,
	         u_p.codigo p_cod,
	         u_p.descripcion p_desc,
                 e.observaciones observ,
                 e.activo activo
            from estructura e join unit u_cf on u_cf.id = e.centro_fisico_id
                                   and u_cf.activo = 'S'
                              join unit u_sf on u_sf.id = e.servicio_id
	                           and u_sf.activo = 'S'
                              join unit u_eq on u_eq.id = e.categoria_id
	                           and u_eq.activo = 'S'
	                      join unit u_p on u_p.id = e.puesto_id
	                           and u_p.activo = 'S'
           where 1 = 1
        '''

        # Ordenación.
        ordenacion = ' order by cf_desc, sf_desc, eq_desc, p_desc '

        # Definición de clausuras.
        clausura_1 = ' and u_p.id = ? '
        clausura_2 = ' and e.activo = ? '


        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        if activo is not None and puesto_id is not None:
            cadenaSQL += clausura_1 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, puesto_id, activo)
        elif puesto_id is not None:
            cadenaSQL += clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, puesto_id)
        elif activo is not None:
            cadenaSQL += clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, activo)
        else:
            ret = conn.execute(cadenaSQL + ordenacion)

        # Se recuperan datos.
        ret = ret.fetchall()

        # Y se devuelven.
        return ret    

    def get_puesto_ciclo(self, puesto_id = None, id_ = None):
        '''Devuelve: (ciclo_id, ciclo_desc, cf_id, cf_desc, sf_id, sf_desc, 
        eq_id, eq_desc, p_id, p_desc, observ, finicio, ffin)
        Tabla: puesto_ciclo (asignación de ciclos a puestos)
        '''

        # Rollback para eliminar tansacciones pendientes.
        self.__db.rollback()        

        # ####################################################################
        #
        # Ciclos asignados a puestos.
        #
        #  select pc.id id,
        #         c.id ciclo_id,
        #         c.descripcion ciclo_desc,
        #         u_cf.id cf_id,
        #         u_cf.descripcion cf_desc,
        #         u_sf.id sf_id,
        #         u_sf.descripcion sf_desc,
        #         u_eq.id eq_id,
        #         u_eq.descripcion eq_desc,
        #         u_p.id p_id,
        #         u_p.descripcion p_desc,
        #         pc.observaciones observ,
        #         pc.fecha_inicio finicio,
        #         pc.fecha_fin ffin
        #    from puesto_ciclo pc join ciclo_master c on c.id = pc.ciclo_master_id
        #                         join estructura e on e.puesto_id = pc.puesto_id
        #                         join unit u_cf on u_cf.id = e.centro_fisico_id
        #                         join unit u_sf on u_sf.id = e.servicio_id
        #                         join unit u_eq on u_eq.id = e.categoria_id
        #                         join unit u_p on u_p.id = e.puesto_id        
        #
        # ####################################################################        

        # Se define consulta.
        cadenaSQL = '''
           select pc.id,
                  c.id ciclo_id,
                  c.descripcion ciclo_desc,
		  u_cf.id cf_id,
		  u_cf.descripcion cf_desc,
                  u_sf.id sf_id,
		  u_sf.descripcion sf_desc,
		  u_eq.id eq_id,
		  u_eq.descripcion eq_desc,
		  u_p.id p_id,
		  u_p.descripcion p_desc,
		  pc.observaciones observ,
		  pc.fecha_inicio finicio,
                  pc.fecha_fin ffin,
                  (select distinct 
                          planificacion.semana 
                     from planificacion 
		    where planificacion.puesto_id = u_p.id  
                    and planificacion.fecha_inicio = pc.fecha_inicio) semana
             from puesto_ciclo pc join ciclo_master c on c.id = pc.ciclo_master_id
                                  join estructura e on e.puesto_id = pc.puesto_id
			          join unit u_cf on u_cf.id = e.centro_fisico_id
			          join unit u_sf on u_sf.id = e.servicio_id
			          join unit u_eq on u_eq.id = e.categoria_id
				  join unit u_p on u_p.id = e.puesto_id	
            where 1 = 1
        '''

        # Ordenación.
        ordenacion = ' order by cf_desc, sf_desc, eq_desc, p_desc '

        # Definición de clausuras.
        clausura_0 = ' and u_p.id = ? '   
        clausura_1 = ' and pc.id = ? '   

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        if puesto_id is not None:
            cadenaSQL += clausura_0 + ordenacion
            ret = conn.execute(cadenaSQL, puesto_id)         
        elif id_ is not None:
            cadenaSQL += clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, id_)                     
        else:
            cadenaSQL += ordenacion
            ret = conn.execute(cadenaSQL)   

        # Se recuperan datos.
        ret = ret.fetchall()

        # Y se devuelven.
        return ret    

    def get_planificacion(self, anno, mes, puesto_id = None, \
                          fecha_inicio = None, equipo_id = None, \
                          visualizacion = 0):
        '''Devuelve: ()
        Tabla: planificacion (planificaciones de ciclos asociados a puestos)
        '''

        # Rollback para eliminar tansacciones pendientes.
        self.__db.rollback()        

        # ####################################################################
        #
        # Planificaciones de ciclos asociados a puestos de trabajo.
        #
        #  select mes, anno, puesto_id, fecha_inicio, ciclo_master_id, fecha_fin,
        #         total_dias, tag, dia1, dia2, dia3, dia4, dia5, dia6, dia7, 
        #         dia8, dia9, dia10, dia11, dia12, dia13, dia14, dia15, dia16, 
        #         dia17, dia18, dia19, dia20, dia21, dia22, dia23, dia24, dia25,
        #         dia26, dia27, dia28, dia29, dia30, dia31,
        #         p.es_lunes_festivo, p.es_martes_festivo, p.es_miercoles_festivo, 
        #         p.es_jueves_festivo, p.es_viernes_festivo, p.es_sabado_festivo,
        #         p.es_domingo_festivo, p.turno_libre_id        
        #    from planificacion
        #    where 1 = 1
        # ####################################################################        

        # ALGG 10012017. Se hace merge de líneas para cada puesto
        # si visualizacion = 1.

        if visualizacion == 1:
            cadenaSQL = '''
           select distinct 
                  p.mes, p.anno, p.puesto_id, u.codigo puesto_cod, 
                  u.descripcion puesto_desc, p.fecha_inicio, p.ciclo_master_id,
                  p.fecha_fin, p.total_dias, p.semana, 
                  max(p.dia1) dia1, max(p.dia2) dia2, max(p.dia3) dia3, 
                  max(p.dia4) dia4, max(p.dia5) dia5, max(p.dia6) dia6, 
                  max(p.dia7) dia7, max(p.dia8) dia8, max(p.dia9) dia9, 
                  max(p.dia10) dia10, max(p.dia11) dia11, max(p.dia12) dia12, 
                  max(p.dia13) dia13, max(p.dia14) dia14, max(p.dia15) dia15, 
                  max(p.dia16) dia16, 
                  max(p.dia17) dia17, max(p.dia18) dia18, max(p.dia19) dia19,
                  max(p.dia20) dia20, max(p.dia21) dia21, max(p.dia22) dia22, 
                  max(p.dia23) dia23, max(p.dia24) dia24, max(p.dia25) dia25,
                  max(p.dia26) dia26, max(p.dia27) dia27, max(p.dia28) dia28, 
                  max(p.dia29) dia29, max(p.dia30) dia30, max(p.dia31) dia31,
                  p.es_lunes_festivo, p.es_martes_festivo, p.es_miercoles_festivo, 
                  p.es_jueves_festivo, p.es_viernes_festivo, p.es_sabado_festivo,
                  p.es_domingo_festivo, p.turno_libre_id
             from planificacion p join puesto_ciclo pc on p.puesto_id = pc.puesto_id
                                  join unit u on u.id = p.puesto_id 
                                  join estructura e on e.puesto_id = u.id
             where 1 = 1        
            '''

        if visualizacion == 0:
            # Se define consulta.
            cadenaSQL = '''
            select distinct 
                   p.mes, p.anno, p.puesto_id, u.codigo puesto_cod, 
                   u.descripcion puesto_desc, p.fecha_inicio, p.ciclo_master_id,
                   p.fecha_fin, p.total_dias, p.semana, p.dia1, p.dia2, p.dia3, p.dia4, p.dia5, 
                   p.dia6, p.dia7, p.dia8, p.dia9, p.dia10, p.dia11, p.dia12, 
                   p.dia13, p.dia14, p.dia15, p.dia16, p.dia17, p.dia18, p.dia19,
                   p.dia20, p.dia21, p.dia22, p.dia23, p.dia24, p.dia25,
                   p.dia26, p.dia27, p.dia28, p.dia29, p.dia30, p.dia31,
                   p.es_lunes_festivo, p.es_martes_festivo, p.es_miercoles_festivo, 
                   p.es_jueves_festivo, p.es_viernes_festivo, p.es_sabado_festivo,
                   p.es_domingo_festivo, p.turno_libre_id
              from planificacion p join puesto_ciclo pc on p.puesto_id = pc.puesto_id
                                   join unit u on u.id = p.puesto_id 
                                   join estructura e on e.puesto_id = u.id
             where 1 = 1
             '''

        # Ordenación.
        ordenacion = ' order by puesto_desc, p.fecha_inicio '
        if visualizacion == 1: 
            grupo = '''
         group by p.mes, p.anno, p.puesto_id, u.codigo,  
                  u.descripcion,
		  p.es_lunes_festivo, p.es_martes_festivo, p.es_miercoles_festivo, 
                  p.es_jueves_festivo, p.es_viernes_festivo, p.es_sabado_festivo,
                  p.es_domingo_festivo, p.turno_libre_id            
            '''
            ordenacion = grupo + ordenacion 

        # Definición de clausuras.
        clausura_0 = ' and p.anno = ? and mes = ? '
        clausura_1 = ' and p.puesto_id = ? '
        clausura_2 = ' and p.fecha_inicio = ? '
        clausura_3 = ' and e.categoria_id = ? '

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        if puesto_id is not None and fecha_inicio is not None and \
           equipo_id is not None:
            cadenaSQL += clausura_0 + clausura_1 + clausura_2 + clausura_3 + \
                ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, puesto_id, fecha_inicio, \
                               equipo_id)         
        elif puesto_id is not None and equipo_id is not None:
            cadenaSQL += clausura_0 + clausura_1 + clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, puesto_id, equipo_id)                     
        elif fecha_inicio is not None and equipo_id is not None:
            cadenaSQL += clausura_0 + clausura_2 + clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, fecha_inicio, equipo_id)                     
        elif puesto_id is not None and fecha_inicio is not None:
            cadenaSQL += clausura_0 + clausura_1 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, puesto_id, fecha_inicio) 
        elif puesto_id is not None:
            cadenaSQL += clausura_0 + clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, puesto_id)
        elif fecha_inicio is not None:
            cadenaSQL += clausura_0 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, fecha_inicio)
        elif equipo_id is not None:
            cadenaSQL += clausura_0 + clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, equipo_id)
        else:
            cadenaSQL += clausura_0 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes)

        # Se recuperan datos.
        ret = ret.fetchall()

        print cadenaSQL

        # Y se devuelven.
        return ret

    def insert_planificacion(self, mes, puesto_id, anno, fecha_inicio, \
                             ciclo_id, fecha_fin, total_dias, semana,
                             lista_dias_mes, es_lunes_festivo, \
                             es_martes_festivo, es_miercoles_festivo, \
                             es_jueves_festivo, es_viernes_festivo, \
                             es_sabado_festivo, es_domingo_festivo, \
                             turno_libre_id, \
                             hacer_commit = True):
        '''Inserción de nueva planificación
        Tabla: planificacion'''

        # Se define entidad.
        entidad = self.__db.entity("planificacion")

        # Creamos objeto Python de tipo Date para pasarlo a la base de datos.
        f_aux = "%d-%d-%d" % (fecha_inicio[0], fecha_inicio[1], fecha_inicio[2])
        fecha_inicio = datetime.strptime(f_aux, "%Y-%m-%d").date()
        f_aux = "%d-%d-%d" % (fecha_fin[0], fecha_fin[1], fecha_fin[2])
        fecha_fin = datetime.strptime(f_aux, "%Y-%m-%d").date()

        # Mes con días 29, 30, o 31...
        try: dia29 = lista_dias_mes[28]
        except: dia29 = None
        try: dia30 = lista_dias_mes[29]
        except: dia30 = None
        try: dia31 = lista_dias_mes[30]
        except: dia31 = None

        # Se inserta nuevo elemento.
        entidad.insert(mes = mes, puesto_id = puesto_id, anno = anno, \
                       fecha_inicio = fecha_inicio, ciclo_master_id = ciclo_id, \
                       fecha_fin = fecha_fin, total_dias = total_dias, \
                       semana = semana, \
                       dia1 = lista_dias_mes[0], dia2 = lista_dias_mes[1], \
                       dia3 = lista_dias_mes[2], dia4 = lista_dias_mes[3], \
                       dia5 = lista_dias_mes[4], dia6 = lista_dias_mes[5], \
                       dia7 = lista_dias_mes[6], dia8 = lista_dias_mes[7], \
                       dia9 = lista_dias_mes[8], dia10 = lista_dias_mes[9], \
                       dia11 = lista_dias_mes[10], dia12 = lista_dias_mes[11], \
                       dia13 = lista_dias_mes[12], dia14 = lista_dias_mes[13], \
                       dia15 = lista_dias_mes[14], dia16 = lista_dias_mes[15], \
                       dia17 = lista_dias_mes[16], dia18 = lista_dias_mes[17], \
                       dia19 = lista_dias_mes[18], dia20 = lista_dias_mes[19], \
                       dia21 = lista_dias_mes[20], dia22 = lista_dias_mes[21], \
                       dia23 = lista_dias_mes[22], dia24 = lista_dias_mes[23], \
                       dia25 = lista_dias_mes[24], dia26 = lista_dias_mes[25], \
                       dia27 = lista_dias_mes[26], dia28 = lista_dias_mes[27], \
                       dia29 = dia29 , dia30 = dia30, dia31 = dia31, \
                       es_lunes_festivo = es_lunes_festivo, \
                       es_martes_festivo = es_martes_festivo, \
                       es_miercoles_festivo = es_miercoles_festivo, \
                       es_jueves_festivo = es_jueves_festivo, \
                       es_viernes_festivo = es_viernes_festivo, \
                       es_sabado_festivo = es_sabado_festivo, \
                       es_domingo_festivo = es_domingo_festivo, \
                       turno_libre_id = turno_libre_id) 

        # Commit.
        if hacer_commit: self.__db.commit()    

    def insert_unit(self, tipo_unit_id, codigo, descripcion, activo, direccion, \
                    poblacion, cp, provincia, pais, telefono1, telefono2, \
                    observaciones, email, hacer_commit = True):
        '''Inserción de nueva unidad organizativa
        Tabla: unit
        '''

        # Se define entidad.
        entidad = self.__db.entity("unit")

        # Se inserta nuevo elemento.
        entidad.insert(tipo_unit_id = tipo_unit_id, codigo = codigo, \
                       descripcion = descripcion, activo = activo, \
                       direccion = direccion, poblacion = poblacion, cp = cp, \
                       provincia = provincia, pais = pais, \
                       telefono1 = telefono1, telefono2 = telefono2, \
                       observaciones = observaciones, email = email) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_unit(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: unit'''

        # Se define entidad.
        entidad = self.__db.entity("unit")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "codigo": ret.codigo = valor
        if campo == "descripcion": ret.descripcion = valor
        if campo == "activo": ret.activo = valor
        if campo == "direccion": ret.direccion = valor
        if campo == "poblacion": ret.poblacion = valor
        if campo == "cp": ret.cp = valor
        if campo == "provincia": ret.provincia = valor
        if campo == "pais": ret.pais = valor
        if campo == "telefono1": ret.telefono1 = valor
        if campo == "telefono2": ret.telefono2 = valor
        if campo == "observaciones": ret.observaciones = valor
        if campo == "email": ret.email = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_unit(self, _id, hacer_commit = True):
        '''Borrado de unidad organizativa
        Tabla: unit
        '''

        # Se define entidad.
        entidad = self.__db.entity("unit")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_unit(self, campos, reg_nuevo, reg_eliminado, opcion = None):
        '''Actualización de unidad organizativa
        Tabla: unit
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_unit(i, False)

        # Inserción.
        for i in reg_nuevo: 
            if opcion in ['puesto', 'servicio', 'equipo']:
                self.insert_unit(i['tipo_unit_id'], i['codigo'], \
                                 i['descripcion'], i['activo'], None, \
                                 None, None,  None, None, i['telefono1'], \
                                 i['telefono2'], i['observaciones'], \
                                 i['email'], False)
            else:
                self.insert_unit(i['tipo_unit_id'], i['codigo'], \
                                 i['descripcion'], i['activo'], i['direccion'], \
                                 i['poblacion'], i['cp'], i['provincia'], \
                                 i['pais'], i['telefono1'], i['telefono2'], \
                                 i['observaciones'], i['email'], False)

        # Actualización.
        for i in campos:
            self.update_unit(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                msj = u'El código o nombre de la unidad organizativa ya existe.'            
            print "MENSAJE DE ERROR ", msj

        # Se devuelve estado y mensaje.
        return ret, msj

    def exists_in_estructura(self, cf_id = None, sf_id = None, eq_id = None, \
                            p_id = None):
        '''Devuelve: True si la unidad organizativa existe en la tabla 
        estructura y False en caso contrario
        Tabla: estructura (estructura organizativa)
        '''

        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from estructura e
           where 1 = 1
        '''

        # Definición de clausuras.
        clausura_1 = ' and e.centro_fisico_id = ? '
        clausura_2 = ' and e.servicio_id = ? '
        clausura_3 = ' and e.categoria_id = ? '
        clausura_4 = ' and e.puesto_id = ? '

        # Se crea objeto conexión.
        conn = self.__db.connection()

        if cf_id is not None:
            cadenaSQL += clausura_1
            ret = conn.execute(cadenaSQL, cf_id)
        elif sf_id is not None:
            cadenaSQL += clausura_2
            ret = conn.execute(cadenaSQL, sf_id)
        elif eq_id is not None:
            cadenaSQL += clausura_3
            ret = conn.execute(cadenaSQL, eq_id)
        elif p_id is not None:
            cadenaSQL += clausura_4
            ret = conn.execute(cadenaSQL, p_id)
        
        # Se recuperan datos.
        ret = ret.fetchall()

        if len(ret) == 0: ret = False
        else: ret = True

        # Estado devuelto.
        return ret    

    def exists_in_puesto_ciclo(self):
        '''Devuelve: True si existe más de un ciclo que empieza el mismo día
        para el puesto
        Tabla: puesto_ciclo (asociación de ciclos a puestos de trabajo)
        '''

        # Se define consulta.
        cadenaSQL = '''
           select n 
             from (select count(*) n, fecha_inicio, puesto_id
                     from puesto_ciclo  
                 group by fecha_inicio, puesto_id)
           where n > 1
        '''

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Se lanza SQL.
        ret = conn.execute(cadenaSQL)

        # Se recuperan datos.
        ret = ret.fetchall()

        if len(ret) == 0: ret = False
        else: ret = True

        # Estado devuelto.
        return ret    

    def exists_solapamiento_in_puesto_ciclo(self):
        '''Devuelve: True si existe solapamiento entre rango de fechas para
        un puesto y False en caso contrario
        Tabla: puesto_ciclo (asociación de ciclos a puestos de trabajo)
        '''

        # Se define consulta.
        cadenaSQL = '''
            select 1 
             where exists (select pc1.fecha_inicio a, 
                                  pc1.fecha_fin b, 
                                  pc2.fecha_inicio c, 
	                          pc2.fecha_fin d
                             from puesto_ciclo pc1 join puesto_ciclo pc2 on pc1.puesto_id = pc2.puesto_id
                            where a <> c  
                              and (a <= d and b >= c))
            '''

        # Se crea objeto conexión.
        conn = self.__db.connection()

        ret = conn.execute(cadenaSQL)

        # Se recuperan datos.
        ret = ret.fetchall()

        if len(ret) == 0: ret = False
        else: ret = True

        # Estado devuelto.
        return ret    

    def insert_estructura(self, cf_id, sf_id, eq_id, p_id, observ, activo, \
                          hacer_commit = True):
        '''Inserción de relación organizativa
        Tablas: estructura
        '''

        # Se define entidad.
        entidad = self.__db.entity("estructura")

        # Se inserta nuevo elemento.
        entidad.insert(centro_fisico_id = cf_id, servicio_id = sf_id, \
                       categoria_id = eq_id, puesto_id = p_id, \
                       observaciones = observ, activo = activo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_estructura(self, campos, hacer_commit = True):
        '''Actualización de relación organizativa
        Tabla: estructura
        '''

        # Se define entidad.
        entidad = self.__db.entity("estructura")

        for i in campos:
            # Buscamos la fila apropiada.
            ret = entidad.filter(entidad.puesto_id == i['id']).one()

            # Actualizamos los campos que se consideren oportunos. Es importante
            # señalar que aquí únicamente se pueden actualizar los campos 
            # observaciones y activo, ya que una relación jerárquica solo se
            # puede insertar o borrar.
            if i['field'] == "observ": ret.observaciones = i['valor_nuevo']
            if i['field'] == "activo": ret.activo = i['valor_nuevo']

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_estructura(self, _id, hacer_commit = True):
        '''Borrado de relación en estructura organizativa
        Tablas: estructura
        '''

        # Se define entidad.
        entidad = self.__db.entity("estructura")

        # Buscamos la fila apropiada, que será el puesto del que cuelga.
        ret = entidad.filter(entidad.puesto_id==_id).one()

        # Se elimina.
        self.__db.delete(ret)

        # Hacemos flush para decirle a la transacción que se hizo un delete
        # sin llegar a hacer commit, pero que lo tiene que tener en cuenta...
        self.__db.flush()

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_estructura(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de estructura organizativa
        Tablas: estructura
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_estructura(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_estructura(cf_id = i['cf_id'], sf_id = i['sf_id'], \
                                   eq_id = i['eq_id'], p_id = i['p_id'], \
                                   observ = i['observ'], activo = i['activo'], \
                                   hacer_commit = False)

        # Actualización.
        self.update_estructura(campos, False)        

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj           

    def is_fechas_correctas_puesto_ciclo(self):
        '''Devuelve True si fecha_desde es menor o igual a fecha_hasta
        y False en caso contrario en puesto_ciclo'''
        # Se define consulta.
        cadenaSQL = '''
           select fecha_inicio, fecha_fin
             from puesto_ciclo 
            where puesto_ciclo.fecha_inicio > puesto_ciclo.fecha_fin
        '''

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Se lanza SQL.
        ret = conn.execute(cadenaSQL)

        # Se recuperan datos.
        ret = ret.fetchall()

        if len(ret) == 0: ret = False
        else: ret = True

        # Estado devuelto.
        return ret    

    def actualizar_puesto_ciclo(self, campos, reg_nuevo, reg_eliminado, \
                                detalle_reg_eliminado):
        '''Actualización de ciclos asociados a puestos de trabajo
        Tablas: puesto_ciclo
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: 
            self.delete_puesto_ciclo(i, detalle_reg_eliminado, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_puesto_ciclo(ciclo_master_id = i['ciclo_id'], \
                                     fecha_inicio = i['finicio'], \
                                     puesto_id = i['p_id'], \
                                     observaciones = i['observ'], \
                                     fecha_fin = i['ffin'], \
                                     hacer_commit = False)

        # Actualización.
        self.update_puesto_ciclo(campos, False)        

        # ALGG 26122016 Comprobaciones de consistencia de datos después de hacer
        # updates, inserts y deletes.

        ret = True

        # No puede existir para un puesto más de un ciclo que empiece el 
        # mismo día.
        if self.exists_in_puesto_ciclo():
            ret, msj = False, u"Ya existe un ciclo que empieza en la misma fecha"
        else:
            # No puede haber solapamiento de fechas entre los ciclos asociados a
            # un puesto.
            if self.exists_solapamiento_in_puesto_ciclo():
                ret, msj = False, u"Existen solapamientos de ciclos"
            else:
                # ALGG 27122016 Se comprueba que la fecha desde sea menor
                # o igual a la fecha hasta.
                if self.is_fechas_correctas_puesto_ciclo():
                    ret, msj = False, u"Fecha Desde es mayor que fecha Hasta"

        if not ret:
            self.__db.rollback()
            print "MENSAJE DE ERROR ", msj            
        else:
            # Commit.
            try:
                self.__db.commit()
                ret = True

            except Exception as ex:
            # except ValueError as e:
                # Se recoge mensaje de error y se envía.
                self.__db.rollback()
                msj = str(ex.__class__)
                ret = False
                print "MENSAJE DE ERROR ", msj

        # Se devuelve estado y mensaje.
        return ret, msj               

    def insert_puesto_ciclo(self, ciclo_master_id, fecha_inicio, puesto_id, \
                            observaciones, fecha_fin, hacer_commit = True):
        '''Inserción de relación entre ciclos y puesto de trabajo
        Tablas: puesto_ciclo
        '''

        # Se transforman las fechas a objetos Python.
        fecha_inicio = self.fechaPython(fecha_inicio)
        fecha_fin = self.fechaPython(fecha_fin)

        # Se define entidad.
        entidad = self.__db.entity("puesto_ciclo")

        # Se inserta nuevo elemento.
        entidad.insert(ciclo_master_id = ciclo_master_id, \
                       fecha_inicio = fecha_inicio, \
                       puesto_id = puesto_id, \
                       observaciones = observaciones, \
                       fecha_fin = fecha_fin) 

        # Hacemos flush para decirle a la transacción que se hizo un insert
        # sin llegar a hacer commit, pero que lo tiene que tener en cuenta...
        self.__db.flush()

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_puesto_ciclo(self, campos, hacer_commit = True):
        '''Actualización de relación entre ciclos y puesto de trabajo
        Tabla: puesto_ciclo
        '''

        # Se define entidad.
        entidad = self.__db.entity("puesto_ciclo")

        for i in campos:
            # Buscamos la fila apropiada.
            ret = entidad.filter(entidad.id == i['id']).one()

            # Actualizamos los campos que se consideren oportunos. Es importante
            # señalar que aquí únicamente se pueden actualizar los campos 
            # observaciones, fecha inicio y fecha fin.
            if i['field'] == "observ": ret.observaciones = i['valor_nuevo']
            if i['field'] == "finicio":
                # Se transforman las fechas a objetos Python.
                ret.fecha_inicio = self.fechaPython(i['valor_nuevo'])
            if i['field'] == "ffin": 
                # Se transforman las fechas a objetos Python.
                ret.fecha_fin = self.fechaPython(i['valor_nuevo'])                

        # Hacemos flush para decirle a la transacción que se hizo un update
        # sin llegar a hacer commit, pero que lo tiene que tener en cuenta...
        self.__db.flush()            

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_puesto_ciclo(self, _id, detalle, hacer_commit = True):
        '''Borrado de relación de ciclos con puesto de trabajo
        Tablas: puesto_ciclo
        '''

        # ALGG 11012017 Se elimina primero la planificación, para respetar
        # la integridad referencial.

        # Se define entidad.
        entidad = self.__db.entity("planificacion")

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Instrucción.
        cadenaSQL = '''
        delete from planificacion 
         where 1 = 1
           and puesto_id = ? 
           and fecha_inicio = ? 
        '''        

        # Definición de clausuras.

        for i in detalle:
            # Se obtienen las claves primarias.
            fecha_inicio = i[0]
            puesto_id = i[1]
            print(u"Eliminando planificación de puesto %s que empieza el %s" % \
                  (str(puesto_id), str(fecha_inicio)))

            # Ejecución.
            conn.execute(cadenaSQL, puesto_id, fecha_inicio)

        # Flush...
        self.__db.flush()

        # Se define entidad.
        entidad = self.__db.entity("puesto_ciclo")

        # Buscamos la fila apropiada, que será el puesto del que cuelga.
        ret = entidad.filter(entidad.id==_id).one()

        # Se elimina.
        self.__db.delete(ret)

        # Hacemos flush para decirle a la transacción que se hizo un delete
        # sin llegar a hacer commit, pero que lo tiene que tener en cuenta...
        self.__db.flush()

        # Commit.
        if hacer_commit: self.__db.commit()    

    def get_sp(self, persona_id, anno = None):
        '''Devuelve: (id, persona_id, anno, horas)
        Tabla: servicios_previos
        Opciones de filtrado: anno <año>
        '''

        # 02-01-2017 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()

        # Se define entidad.
        entidad = self.__db.entity("servicios_previos")

        # Clausurado y filtros.
        if anno is not None:
            where = and_(entidad.persona_id==persona_id, entidad.anno==anno)
        else:
            where = entidad.persona_id==persona_id

        # Se recupera información.
        ret = entidad.filter(where).order_by(desc(entidad.anno)).all()

        # Y se devuelven.
        return ret

    def insert_sp(self, persona_id, anno, horas, hacer_commit = True):
        '''Inserción de servicios previos
        Tabla: servicios_previos
        '''

        # Se define entidad.
        entidad = self.__db.entity("servicios_previos")

        # Se inserta nuevo elemento.
        entidad.insert(persona_id = persona_id, anno = anno, horas = horas) 

        self.__db.flush()
                
        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_sp(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: servicios_previos
        '''

        # Se define entidad.
        entidad = self.__db.entity("servicios_previos")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "anno": ret.anno = valor
        if campo == "horas": ret.horas = valor

        self.__db.flush()
        
        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_sp(self, _id, hacer_commit = True):
        '''Borrado de servicios previos
        Tabla: servicios_previos
        '''

        # Se define entidad.
        entidad = self.__db.entity("servicios_previos")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_sp(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de servicios previos
        Tabla: servicios_previos
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        ret = True
        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_sp(i, False)

        # Inserción.
        for i in reg_nuevo: 
            print("actualizando %d" % i['persona_id'])
            self.insert_sp(i['persona_id'], i['anno'], i['horas'], False)

        # Actualización.
        for i in campos:
            self.update_sp(i['id'], i['field'], i['valor_nuevo'], False)

        # Se comprueba que no haya más de un servicio previo por año y persona.
        if self.exists_sp_in_persona():
            ret = False
            msj = u'No puede haber más de un servicio previo por persona y año'
            self.__db.rollback()

        if ret:
            # Commit.
            try:
                self.__db.commit()
                ret = True
    
            except Exception as ex:
                # Se recoge mensaje de error y se envía.
                self.__db.rollback()
                msj = str(ex.__class__)
                ret = False
                print "MENSAJE DE ERROR ", msj
                
        # Se devuelve estado y mensaje.
        return ret, msj    

    def get_cargo(self, id_ = None, activo = None):
        '''Devuelve: (id, codigo, descripcion, observaciones, activo)
        Tabla: cargo
        Opciones de filtrado: id_ <id. cargo>, activo <'S', 'N'>
        '''

        # 02-01-2017 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()

        # Se define entidad.
        entidad = self.__db.entity("cargo")

        # Clausurado y filtros.
        if id_ is not None and activo is not None:
            where = and_(entidad.id==id_, entidad.activo==activo)
            ret = entidad.filter(where).order_by(asc(entidad.descripcion)).all()
        elif id_ is not None:
            ret = entidad.filter(entidad.id==id_).order_by(asc(entidad.descripcion)).all()
        elif activo is not None:
            ret = entidad.filter(entidad.activo==activo).order_by(asc(entidad.descripcion)).all()
        else:
            ret = entidad.order_by(asc(entidad.descripcion)).all()

        # Y se devuelven.
        return ret

    def insert_cargo(self, codigo, descripcion, observaciones, activo, \
                     hacer_commit = True):
        '''Inserción de cargo
        Tabla: cargo
        '''

        # Se define entidad.
        entidad = self.__db.entity("cargo")

        # Se inserta nuevo elemento.
        entidad.insert(codigo = codigo, descripcion = descripcion, \
                       observaciones = observaciones, activo = activo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_cargo(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: cargo
        '''

        # Se define entidad.
        entidad = self.__db.entity("cargo")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "codigo": ret.codigo = valor
        if campo == "descripcion": ret.descripcion = valor
        if campo == "observaciones": ret.observaciones = valor
        if campo == "activo": ret.activo = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_cargo(self, _id, hacer_commit = True):
        '''Borrado de cargo
        Tabla: cargo
        '''

        # Se define entidad.
        entidad = self.__db.entity("cargo")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_cargo(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de cargo
        Tabla: cargo
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_cargo(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_cargo(i['codigo'], i['descripcion'], i['observaciones'], \
                              i['activo'], False)

        # Actualización.
        for i in campos:
            self.update_cargo(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                msj = u'El cargo ya existe.'            
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj    

    def get_cp(self, id_ = None, activo = None):
        '''Devuelve: (id, codigo, descripcion, activo)
        Tabla: cargo
        Opciones de filtrado: id_ <id. cargo>, activo <'S', 'N'>
        '''

        # 02-01-2017 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()

        # Se define entidad.
        entidad = self.__db.entity("categoria_profesional")

        # Clausurado y filtros.
        if id_ is not None and activo is not None:
            where = and_(entidad.id==id_, entidad.activo==activo)
            ret = entidad.filter(where).order_by(asc(entidad.descripcion)).all()
        elif id_ is not None:
            ret = entidad.filter(entidad.id==id_).order_by(asc(entidad.descripcion)).all()
        elif activo is not None:
            ret = entidad.filter(entidad.activo==activo).order_by(asc(entidad.descripcion)).all()
        else:
            ret = entidad.order_by(asc(entidad.descripcion)).all()

        # Y se devuelven.
        return ret

    def insert_cp(self, codigo, descripcion, activo, hacer_commit = True):
        '''Inserción de categoría profesional
        Tabla: categoria_profesional
        '''

        # Se define entidad.
        entidad = self.__db.entity("categoria_profesional")

        # Se inserta nuevo elemento.
        entidad.insert(codigo = codigo, descripcion = descripcion, \
                       activo = activo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_cp(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: categoria_profesional
        '''

        # Se define entidad.
        entidad = self.__db.entity("categoria_profesional")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "codigo": ret.codigo = valor
        if campo == "descripcion": ret.descripcion = valor
        if campo == "activo": ret.activo = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_cp(self, _id, hacer_commit = True):
        '''Borrado de categoría profesional
        Tabla: categoria_profesional
        '''

        # Se define entidad.
        entidad = self.__db.entity("categoria_profesional")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_cp(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de categoría profesional
        Tabla: categoria_profesional
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_cp(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_cp(i['codigo'], i['descripcion'], \
                           i['activo'], False)

        # Actualización.
        for i in campos:
            self.update_cp(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                msj = u'La categoría profesional ya existe.'            
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj    

    def get_ausencia(self, id_ = None, codigo = None, activo = None):
        '''Devuelve: (id, codigo, descripcion, cuenta_horas, cuenta_dias, 
        max_ausencia_anual, activar_control_ausencia, forzar_ausencia, 
        observaciones, activo, estado_devengo)
        Tabla: ausencia
        Opciones de filtrado: id_ <id ausencia,>, codigo <cód. ausencia>, 
        activo <'S', 'N'>'''

        # 02-01-2017 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()

        # Se define entidad.
        entidad = self.__db.entity("ausencia")

        # Clausurado y filtros.
        if id_ is not None and activo is not None:
            where = and_(entidad.id==id_, entidad.activo==activo)
            ret = entidad.filter(where).order_by(asc(entidad.descripcion)).all()
        elif codigo is not None and activo is not None:
            where = and_(entidad.codigo==codigo, entidad.activo==activo)            
            ret = entidad.filter(where).order_by(asc(entidad.descripcion)).all()
        elif id_ is not None:
            ret = entidad.filter(entidad.id==id_).order_by(asc(entidad.descripcion)).all()
        elif codigo is not None:
            ret = entidad.filter(entidad.codigo==codigo).order_by(asc(entidad.descripcion)).all()
        elif activo is not None:
            ret = entidad.filter(entidad.activo==activo).order_by(asc(entidad.descripcion)).all()
        else:
            ret = entidad.order_by(asc(entidad.descripcion)).all()

        # Y se devuelven.
        return ret

    def insert_ausencia(self, codigo, descripcion, cuenta_horas, \
                        cuenta_dias, max_ausencia_anual, \
                        activar_control_ausencia, forzar_ausencia, \
                        observaciones, activo, estado_devengo, \
                        hacer_commit = True):
        '''Inserción de ausencia
        Tabla: ausencia
        '''

        # Se define entidad.
        entidad = self.__db.entity("ausencia")

        # Se inserta nuevo elemento.
        entidad.insert(codigo = codigo, descripcion = descripcion, \
                       cuenta_horas = cuenta_horas, cuenta_dias = cuenta_dias, \
                       max_ausencia_anual = max_ausencia_anual, \
                       activar_control_ausencia = activar_control_ausencia, \
                       forzar_ausencia = forzar_ausencia, \
                       observaciones = observaciones, activo = activo, \
                       estado_devengo = estado_devengo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_ausencia(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: ausencia
        '''

        # Se define entidad.
        entidad = self.__db.entity("ausencia")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "codigo": ret.codigo = valor
        if campo == "descripcion": ret.descripcion = valor
        if campo == "cuenta_horas": ret.cuenta_horas = valor
        if campo == "cuenta_dias": ret.cuenta_dias = valor
        if campo == "max_ausencia_anual": ret.max_ausencia_anual = valor
        if campo == "activar_control_ausencia": ret.activar_control_ausencia = valor
        if campo == "forzar_ausencia": ret.forzar_ausencia = valor
        if campo == "observaciones": ret.observaciones = valor
        if campo == "activo": ret.activo = valor
        if campo == "estado_devengo": ret.estado_devengo = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_ausencia(self, _id, hacer_commit = True):
        '''Borrado de ausencia
        Tabla: ausencia
        '''

        # Se define entidad.
        entidad = self.__db.entity("ausencia")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_ausencia(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de ausencia
        Tabla: ausencia
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_ausencia(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_ausencia(i['codigo'], i['descripcion'], \
                                 i['cuenta_horas'], i['cuenta_dias'], \
                                 i['max_ausencia_anual'], \
                                 i['activar_control_ausencia'], \
                                 i['forzar_ausencia'], i['observaciones'], \
                                 i['activo'], i['estado_devengo'], False)

        # Actualización.
        for i in campos:
            self.update_ausencia(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                msj = u'La ausencia ya existe.'            
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj    

    def actualizar_jt(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de jornada teórica
        Tabla: jornada_teorica
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_jt(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_jt(i['cf_id'], \
                           i['anno'], \
                           i['total_horas_anual'], \
                           i['observaciones'], False)

        # Actualización.
        for i in campos:
            self.update_jt(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
                msj = u'Ya existe una jornada teórica para el centro físico en el año seleccionado.'            
            print "MENSAJE DE ERROR ", msj

        # Se devuelve estado y mensaje.
        return ret, msj

    def insert_jt(self, cf_id, anno, total_horas_anual, observaciones, \
                  hacer_commit = True):
        '''Inserción de jornada teórica
        Tabla: jornada_teorica
        '''

        # Se define entidad.
        entidad = self.__db.entity("jornada_teorica")

        # Se inserta nuevo elemento.
        entidad.insert(centro_fisico_id = cf_id, anno = anno, \
                       total_horas_anual = total_horas_anual, \
                       observaciones = observaciones) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_jt(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: jornada_teorica'''

        # Se define entidad.
        entidad = self.__db.entity("jornada_teorica")

        # Desmenuzamos la PK para formar la PK compuesta.
        anno = _id[0:4]
        cf_id = _id[4:]

        # Buscamos la fila apropiada.
        where = and_(entidad.centro_fisico_id==cf_id, \
                     entidad.anno==anno)
        ret = entidad.filter(where).one()

        # Actualizamos los campos que se consideren oportunos.
        if campo == "total_horas_anual": ret.total_horas_anual = valor
        if campo == "observaciones": ret.observaciones = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_jt(self, _id, hacer_commit = True):
        '''Borrado de jornada teórica
        Tabla: jornada_teorica
        '''

        # Se define entidad.
        entidad = self.__db.entity("jornada_teorica")

        # Desmenuzamos la PK para formar la PK compuesta.
        anno = _id[0:4]
        cf_id = _id[4:]

        # Buscamos la fila apropiada.
        where = and_(entidad.centro_fisico_id==cf_id, \
                     entidad.anno==anno)
        ret = entidad.filter(where).one()

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def get_contrato(self, persona_id):
        '''Recupera todos los contratos de una persona
        Devuelve: (id, cargo_id, cargo_cod, cargo_desc, fecha_inicio, fecha_fin,
        cp_id, cp_cod, cp_desc, persona_id)
        Tabla: contrato
        Opciones de filtrado: persona_id <id de persona>'''

        # ALGG 03-01-2017 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()        

        cadenaSQL = '''
        select contrato.id id,
               cargo.id cargo_id,
	       cargo.codigo cargo_cod, 
	       cargo.descripcion cargo_desc,
               contrato.fecha_inicio fecha_inicio,
               contrato.fecha_fin fecha_fin,
	       categoria_profesional.id cp_id,
	       categoria_profesional.codigo cp_cod,
	       categoria_profesional.descripcion cp_desc,
	       contrato.persona_id persona_id
          from contrato join cargo on cargo.id = contrato.cargo_id
                        join categoria_profesional on categoria_profesional.id = contrato.categoria_profesional_id 
         where contrato.persona_id = ? 
      order by fecha_inicio desc  
         '''
      
        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Ejecución.
        ret = conn.execute(cadenaSQL, persona_id)

        # Se recuperan datos.
        ret = ret.fetchall()

        # Y se devuelven.
        return ret                                                                

    def get_contrato_ausencia(self, contrato_id , activo = None, \
                              fecha_desde = None, fecha_hasta = None):
        '''Recupera todas las ausencias de un contrato
        Devuelve: (id, contrato_id, aus_id, aus_cod, aus_desc, fecha_inicio,
        fecha_fin, anno_devengo, activo, ausencia_parcial, hora_inicio, 
        hora_fin)
        Tabla: contrato_ausencia
        Opciones de filtrado: contrato_id <id de contrato>, activo <'S', 'N'>,
        fecha_desde, fecha_hasta'''

        # ALGG 04-01-2017 Incluyo rollback para eliminar cualquier transacción 
        # que se haya podido quedar pillada.
        self.__db.rollback()        

        # print("contrato_id=%s (%s, %s)" % \
        #      (contrato_id, fecha_desde, fecha_hasta))
        
        cadenaSQL = '''
        select contrato_ausencia.id,
               contrato.id contrato_id,
               ausencia.id aus_id,
	       ausencia.codigo aus_cod,
	       ausencia.descripcion aus_desc,
	       contrato_ausencia.fecha_inicio,
	       contrato_ausencia.fecha_fin,
               contrato_ausencia.anno_devengo,
	       contrato_ausencia.activo,
               contrato_ausencia.ausencia_parcial,
               contrato_ausencia.hora_inicio,
               contrato_ausencia.hora_fin
          from contrato join contrato_ausencia on contrato.id = contrato_ausencia.contrato_id
                        join ausencia on ausencia.id = contrato_ausencia.ausencia_id
         where 1 = 1
         '''

        ordenacion = 'order by contrato_ausencia.fecha_inicio desc'

        # Definición de clausuras.
        clausura_1 = ' and contrato.id = ? '
        clausura_2 = ' and contrato_ausencia.activo = ? '
        clausura_3 = ' and contrato_ausencia.fecha_inicio <= ? ' + \
            ' and contrato_ausencia.fecha_fin >= ? '

        if fecha_desde is not None and fecha_hasta is not None:
            # Se transforman fechas...  
            fecha_desde = self.fechaPython(fecha_desde)
            fecha_hasta = self.fechaPython(fecha_hasta)
        
        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        if activo is not None and fecha_desde is not None and \
           fecha_hasta is not None:
            cadenaSQL += clausura_1 + clausura_2 + clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, contrato_id, activo, \
                               fecha_hasta, fecha_desde)             
        elif activo is not None:
            cadenaSQL += clausura_1 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, contrato_id, activo) 
        else:
            cadenaSQL += clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, contrato_id)

        # Se recuperan datos.
        ret = ret.fetchall()

        # Y se devuelven.
        return ret  


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

        # Rollback para eliminar tansacciones pendientes.
        self.__db.rollback()        

        if tipo_unit == 1:
            # Se define consulta.
            cadenaSQL = '''
            select distinct 
                   u_sf.id,
                   u_sf.codigo,
                   u_sf.descripcion
              from estructura e join unit u_cf on u_cf.id = e.centro_fisico_id
                                          and u_cf.activo = 'S'
                                join unit u_sf on u_sf.id = e.servicio_id
                                          and u_sf.activo = 'S'
	     where 1 = 1
	    '''

            # ALGG 12-02-2017 Se incluyen aquellas unidades organizativas que
            # aún no se han añadido a la estructura.
            union = '''
             union
             select unit.id, 
                    unit.codigo,
                    unit.descripcion
               from unit
              where unit.tipo_unit_id = 2
                and unit.id not in (select servicio_id from estructura)
            '''

            # Definición de clausuras.
            clausura_1 = ' and u_cf.id = ? '	    
            
            # Ordenación.
            aux_ord = ' order by u_sf.descripcion '

        if tipo_unit == 2:
            # Se define consulta.
            cadenaSQL = '''
	    select distinct 
                   u_eq.id,
	           u_eq.codigo,
	           u_eq.descripcion
	      from estructura e join unit u_sf on u_sf.id = e.servicio_id
	                             and u_sf.activo = 'S'
	                        join unit u_eq on u_eq.id = e.categoria_id
	                             and u_eq.activo = 'S'
	     where 1 = 1
	    '''

            union = '''
             union
             select unit.id, 
                    unit.codigo,
                    unit.descripcion
               from unit
              where unit.tipo_unit_id = 3
                and unit.id not in (select categoria_id from estructura)
            '''

            # Definición de clausuras.
            clausura_1 = ' and u_sf.id = ? '	    

            # Ordenación.
            aux_ord = ' order by u_eq.descripcion '

        if tipo_unit == 3:
            # Se define consulta.
            cadenaSQL = '''
	    select distinct 
	           u_p.id,
	           u_p.codigo,
	           u_p.descripcion
	      from estructura e join unit u_eq on u_eq.id = e.categoria_id
	                             and u_eq.activo = 'S'
	                        join unit u_p on u_p.id = e.puesto_id
	                             and u_p.activo = 'S'
	     where 1 = 1
	    '''

            union = '''
             union
             select unit.id, 
                    unit.codigo,
                    unit.descripcion
               from unit
              where unit.tipo_unit_id = 4
                and unit.id not in (select puesto_id from estructura)
            '''

            # Definición de clausuras.
            clausura_1 = ' and u_eq.id = ? '	    
            
            # Ordenación.
            aux_ord = ' order by u_p.descripcion '
            

        # Ordenación.
        if asig_pend: ordenacion = ' order by descripcion '
        else: ordenacion = aux_ord

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Ejecución.
        if asig_pend: cadenaSQL += clausura_1 + union + ordenacion
        else: cadenaSQL += clausura_1 + ordenacion
        ret = conn.execute(cadenaSQL, id_)

        # Se recuperan datos.
        ret = ret.fetchall()

        # Y se devuelven.
        return ret        

    def get_catEq(self, eq_id = None, cat_id = None):
        '''Devuelve: (id, eq_id, eq_cod, eq_desc, cat_id, cat_cod, cat_desc)
        Tabla: categoria_equipo
        '''

        # 14-01-2017 Rollback.
        self.__db.rollback()

        # Se define consulta.
        cadenaSQL = '''
        select ce.id id,
               u.id eq_id,
               u.codigo eq_cod, 
               u.descripcion eq_desc,
               cp.id cat_id,
               cp.codigo cat_cod,
               cp.descripcion cat_desc 
          from categoria_equipo ce join categoria_profesional cp on ce.categoria_profesional_id = cp.id
                                        and cp.activo = 'S'
                                   join unit u on u.id = ce.categoria_id
                                        and u.tipo_unit_id = 3
         where 1 = 1
         '''

        # Ordenación.
        ordenacion = ' order by eq_desc, cat_desc '

        # Definición de clausuras.
        clausura_1 = ' and u.id = ? '	    
        clausura_2 = ' and ce.id = ? '	    

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        if eq_id is not None and cat_id is not None:
            cadenaSQL += clausura_1 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, eq_id, cat_id) 
        elif eq_id is not None:
            cadenaSQL += clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, eq_id)
        elif cat_id is not None:
            cadenaSQL += clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, cat_id)
        else:
            cadenaSQL += ordenacion
            ret = conn.execute(cadenaSQL)

        # Se recuperan datos.
        ret = ret.fetchall()

        # Y se devuelven.
        return ret

    def insert_catEq(self, eq_id, cat_id, hacer_commit = True):
        '''Inserción de categorías en equipos
        Tabla: categoria_equipo
        '''

        # Se define entidad.
        entidad = self.__db.entity("categoria_equipo")

        # Se inserta nuevo elemento.
        entidad.insert(categoria_id = eq_id, categoria_profesional_id = cat_id) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def delete_catEq(self, _id, hacer_commit = True):
        '''Borrado de relación de equipo y categoría profesional
        Tabla: categoria_equipo
        '''

        # Se define entidad.
        entidad = self.__db.entity("categoria_equipo")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_catEq(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de categorías en equipos de trabajo
        Tabla: categoria_equipo
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"
        ret = True
        
        # Eliminación.
        for i in reg_eliminado: self.delete_catEq(i, False)

        # ALGG 19-02-2017 Se verifica que la categoría y el equipo a insertar
        # no existen.
        for i in reg_nuevo: 
            if self.exists_catProf_equipo(i['cat_id'], i['eq_id']):
                ret = False
                msj = u'La relación entre categoría profesional y equipo ya existe'
                break
        
        if ret:
            # Inserción.
            for i in reg_nuevo: 
                self.insert_catEq(i['eq_id'], i['cat_id'], False)
    
            # Commit.
            try:
                self.__db.commit()
                ret = True
    
            except Exception as ex:
                # Se recoge mensaje de error y se envía.
                self.__db.rollback()
                msj = str(ex.__class__)
                ret = False
                print "MENSAJE DE ERROR ", msj
        
        else: self.__db.rollback()
                 
        # Se devuelve estado y mensaje.
        return ret, msj    

    def get_planificacion_diaria(self, anno, mes, puesto_id = None, \
                                 fecha_inicio = None, equipo_id = None):
        '''Devuelve: La planilla
        Tabla: planificacion, tarea (planilla)
        '''

        # Rollback para eliminar tansacciones pendientes.
        self.__db.rollback()        

        cadenaSQL = '''
        select case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'01') between fini_t and ffin_t then dia1 else null end dia1,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'02') between fini_t and ffin_t then dia2 else null end dia2,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'03') between fini_t and ffin_t then dia3 else null end dia3,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'04') between fini_t and ffin_t then dia4 else null end dia4,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'05') between fini_t and ffin_t then dia5 else null end dia5,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'06') between fini_t and ffin_t then dia6 else null end dia6,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'07') between fini_t and ffin_t then dia7 else null end dia7,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'08') between fini_t and ffin_t then dia8 else null end dia8,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'09') between fini_t and ffin_t then dia9 else null end dia9,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'10') between fini_t and ffin_t then dia10 else null end dia10,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'11') between fini_t and ffin_t then dia11 else null end dia11,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'12') between fini_t and ffin_t then dia12 else null end dia12,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'13') between fini_t and ffin_t then dia13 else null end dia13,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'14') between fini_t and ffin_t then dia14 else null end dia14,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'15') between fini_t and ffin_t then dia15 else null end dia15,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'16') between fini_t and ffin_t then dia16 else null end dia16,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'17') between fini_t and ffin_t then dia17 else null end dia17,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'18') between fini_t and ffin_t then dia18 else null end dia18,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'19') between fini_t and ffin_t then dia19 else null end dia19,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'20') between fini_t and ffin_t then dia20 else null end dia20,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'21') between fini_t and ffin_t then dia21 else null end dia21,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'22') between fini_t and ffin_t then dia22 else null end dia22,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'23') between fini_t and ffin_t then dia23 else null end dia23,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'24') between fini_t and ffin_t then dia24 else null end dia24,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'25') between fini_t and ffin_t then dia25 else null end dia25,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'26') between fini_t and ffin_t then dia26 else null end dia26,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'27') between fini_t and ffin_t then dia27 else null end dia27,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'28') between fini_t and ffin_t then dia28 else null end dia28,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'29') between fini_t and ffin_t then dia29 else null end dia29,
               case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'30') between fini_t and ffin_t then dia30 else null end dia30,
	       case when strftime('%Y-%m-%d', anno||'-'||substr('00'||mes,length('00'||mes) -1)||'-'||'31') between fini_t and ffin_t then dia31 else null end dia31,
	       fini_t, ffin_t, nombre, persona_id, ape1, ape2, dni, mes, anno, puesto_id, puesto_cod, puesto_desc, fecha_inicio, ciclo_master_id, fecha_fin, total_dias, semana, 
               es_lunes_festivo, es_martes_festivo, es_miercoles_festivo, es_jueves_festivo, es_viernes_festivo, es_sabado_festivo,
               es_domingo_festivo, turno_libre_id, tlfno1, tarea_id, contrato_id, ape1||' '||coalesce(ape2,'')||', '||nombre||' ('||dni||')' nombre_completo
          from ( 
        select distinct 
               tarea.contrato_id,
               tarea.id tarea_id,
               tarea.fecha_inicio fini_t,
	       tarea.fecha_fin ffin_t,
               persona.id persona_id,
               persona.nombre,
               persona.ape1,
               persona.ape2,
	       persona.dni,
               persona.tlfno1,
               p.mes, p.anno, p.puesto_id, u.codigo puesto_cod, 
               u.descripcion puesto_desc, p.fecha_inicio, p.ciclo_master_id,
               p.fecha_fin, p.total_dias, p.semana, 
               max(p.dia1) dia1, max(p.dia2) dia2, max(p.dia3) dia3, 
               max(p.dia4) dia4, max(p.dia5) dia5, max(p.dia6) dia6, 
               max(p.dia7) dia7, max(p.dia8) dia8, max(p.dia9) dia9, 
               max(p.dia10) dia10, max(p.dia11) dia11, max(p.dia12) dia12, 
               max(p.dia13) dia13, max(p.dia14) dia14, max(p.dia15) dia15, 
               max(p.dia16) dia16, 
               max(p.dia17) dia17, max(p.dia18) dia18, max(p.dia19) dia19,
               max(p.dia20) dia20, max(p.dia21) dia21, max(p.dia22) dia22, 
               max(p.dia23) dia23, max(p.dia24) dia24, max(p.dia25) dia25,
               max(p.dia26) dia26, max(p.dia27) dia27, max(p.dia28) dia28, 
               max(p.dia29) dia29, max(p.dia30) dia30, max(p.dia31) dia31,
               p.es_lunes_festivo, p.es_martes_festivo, p.es_miercoles_festivo, 
               p.es_jueves_festivo, p.es_viernes_festivo, p.es_sabado_festivo,
               p.es_domingo_festivo, p.turno_libre_id
          from planificacion p join puesto_ciclo pc on p.puesto_id = pc.puesto_id
                               join unit u on u.id = p.puesto_id 
                               join estructura e on e.puesto_id = u.id
	                       join tarea on tarea.puesto_id = p.puesto_id
				    and tarea.fecha_inicio <= p.fecha_fin
				    and tarea.fecha_fin >= p.fecha_inicio
                               join contrato on contrato.id = tarea.contrato_id
			       join persona on persona.id = contrato.persona_id
         where 1 = 1
         '''

        
        # Clausurado para evitar nulos y agrupación.
        clausura_4 = ' group by tarea.puesto_id, tarea.fecha_inicio, ' + \
            'persona.dni) where contrato_id is not null '
        
        # Clausura + Ordenación.
        ordenacion = clausura_4 + ' order by puesto_desc, fecha_inicio '

        # Definición de clausuras.
        clausura_0 = ' and p.anno = ? and mes = ? '
        clausura_1 = ' and p.puesto_id = ? '
        clausura_2 = ' and p.fecha_inicio = ? '
        clausura_3 = ' and e.categoria_id = ? '

        # Se crea objeto conexión.
        conn = self.__db.connection()

        if fecha_inicio is not None:
            fecha_inicio = self.fechaPython(fecha_inicio)
            
        # Reglas.
        if puesto_id is not None and fecha_inicio is not None and \
           equipo_id is not None:
            cadenaSQL += clausura_0 + clausura_1 + clausura_2 + clausura_3 + \
                ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, puesto_id, fecha_inicio, \
                               equipo_id)         
        elif puesto_id is not None and equipo_id is not None:
            cadenaSQL += clausura_0 + clausura_1 + clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, puesto_id, equipo_id)                     
        elif fecha_inicio is not None and equipo_id is not None:
            cadenaSQL += clausura_0 + clausura_2 + clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, fecha_inicio, equipo_id)                     
        elif puesto_id is not None and fecha_inicio is not None:
            cadenaSQL += clausura_0 + clausura_1 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, puesto_id, fecha_inicio) 
        elif puesto_id is not None:
            cadenaSQL += clausura_0 + clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, puesto_id)
        elif fecha_inicio is not None:
            cadenaSQL += clausura_0 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, fecha_inicio)
        elif equipo_id is not None:
            cadenaSQL += clausura_0 + clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes, equipo_id)
        else:
            cadenaSQL += clausura_0 + ordenacion
            ret = conn.execute(cadenaSQL, anno, mes)

        # Se recuperan datos.
        ret = ret.fetchall()

        print cadenaSQL

        # Y se devuelven.
        return ret    

    def get_tarea(self, equipo_id = None, anno = None):
        '''Devuelve: (id, p_id, p_cod, p_desc, fecha_inicio, fecha_fin, 
        observ, contrato_id, persona_id, nombre, ape1, ape2, dni, solapado)
        Tabla: tarea
        Opciones de filtrado: equipo_id <id equipo>, anno <año en donde está
        en vigor la asignación>
        '''

        # Rollback.
        self.__db.rollback()        

        # Se obtiene función para obtener año de fecha a partir del engine actual.
        anno_f_ini = self.__get_date_sql("t.fecha_inicio", "anno")
        anno_f_fin = self.__get_date_sql("t.fecha_fin", "anno")

        cadenaSQL = '''
        select t.id id,
               u.id p_id,
               u.codigo p_cod,
               u.descripcion p_desc,
               t.fecha_inicio fecha_inicio,
               t.fecha_fin fecha_fin,
               t.observaciones observ,
               t.contrato_id contrato_id,
               c.fecha_inicio fecha_inicio_c,
               c.fecha_fin fecha_fin_c,
               p.id persona_id,
               p.nombre nombre,
               p.ape1 ape1,
               p.ape2 ape2,
               p.dni dni,
               t.solapado
          from tarea t join contrato c on c.id = t.contrato_id
                       join persona p on p.id = c.persona_id
                       join unit u on u.id = t.puesto_id
                            and u.tipo_unit_id = 4
                       join estructura e on e.puesto_id = t.puesto_id
         where 1 = 1
      '''

        # Info de parámetros que se envían.
        print(u"Parámetros")
        print("anno_f_ini = %s anno_f_fin = %s anno = %s eq_id %s" % (anno_f_ini, \
                                                                      anno_f_fin, \
                                                                      anno, \
                                                                      equipo_id))
        # Ordenación.
        ordenacion = ' order by p_desc, fecha_inicio desc, ape1, ape2, nombre '

        # Definición de clausuras.
        clausura_1 = ' and e.categoria_id = ? '
        clausura_2 = ' and ( %s = ?  or  %s = ? ) ' % (anno_f_ini, \
                                                       anno_f_fin)

        # print cadenaSQL

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        if equipo_id is not None and anno is not None:
            cadenaSQL += clausura_1 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, equipo_id, str(anno), str(anno)) 
        elif equipo_id is not None:
            cadenaSQL += clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, equipo_id)
        elif anno is not None:
            cadenaSQL += clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, str(anno), str(anno))
        else:
            ret = conn.execute(cadenaSQL + ordenacion)

        # Se recuperan datos.
        ret = ret.fetchall()

        print cadenaSQL

        # Y se devuelven.
        return ret    

    def get_asignar_trabajador(self, equipo_id, fecha):
        '''Devuelve: Los trabajadores que tienen contrato a "fecha" dada, cuya
        categoría profesional por contrato está contemplada dentro del 
        equipo de trabajo "equipo_id". Si además tiene asignaciones en esa fecha
        dada, también saldrán.
        (trab_id, dni, ape1, ape2, nombre, contrato_id, fini_c, ffin_c, 
        tarea_id, fini_t, ffin_t, eq_id, eq_cod, eq_desc)
        '''

        # Rollback.
        self.__db.rollback()        

        # Transformamos la fecha a formato correcto.
        fecha = fecha.split('/')
        fecha = self.fechaPython("%s-%s-%s" % (fecha[2], fecha[1], fecha[0]))

        # Info para debug...                         
        print("equipo_id = %s, fecha = %s" % (str(equipo_id), str(fecha)))

        # Query que devuelve los trabajadores con contrato en vigor a fecha dada
        # junto con los trabajadores que tienen una asignación en fecha dada.
        cadenaSQL = '''
        select distinct
               persona.id trab_id,
               persona.dni dni,
	       persona.ape1 ape1,
	       persona.ape2 ape2,
               persona.nombre nombre,
               contrato.id contrato_id,
               contrato.fecha_inicio fini_c,
               contrato.fecha_fin ffin_c,
               null tarea_id,
               null fini_t,
               null ffin_t,
               null eq_id,
               null eq_cod,
	       null eq_desc
          from contrato join categoria_equipo on categoria_equipo.categoria_profesional_id = contrato.categoria_profesional_id
                        join persona on persona.id = contrato.persona_id
         where contrato.categoria_profesional_id in (select categoria_equipo.categoria_profesional_id from categoria_equipo where categoria_equipo.categoria_id = ?) 
           and ? between contrato.fecha_inicio and contrato.fecha_fin 
           and contrato.id not in (select tarea.contrato_id from tarea where ? between tarea.fecha_inicio and tarea.fecha_fin)
         union
        select distinct
               persona.id trab_id,
               persona.dni dni,
	       persona.ape1 ape1,
               persona.ape2 ape2,
	       persona.nombre nombre,
               contrato.id contrato_id,
	       contrato.fecha_inicio fini_c,
	       contrato.fecha_fin ffin_c,
	       tarea.id tarea_id,
	       tarea.fecha_inicio fini_t,
	       tarea.fecha_fin ffin_t,
	       eq.id eq_id,
	       eq.codigo eq_cod,
	       eq.descripcion eq_desc
          from contrato join categoria_equipo on categoria_equipo.categoria_profesional_id = contrato.categoria_profesional_id
                        join persona on persona.id = contrato.persona_id
	                join tarea on tarea.contrato_id = contrato.id
			join unit on unit.id = tarea.puesto_id 
			join estructura on estructura.puesto_id = unit.id
			     and estructura.categoria_id = categoria_equipo.categoria_id 
			join unit eq on eq.id = estructura.categoria_id
         where contrato.categoria_profesional_id in (select categoria_equipo.categoria_profesional_id from categoria_equipo where categoria_equipo.categoria_id = ?) 
           and ? between contrato.fecha_inicio and contrato.fecha_fin 
           and contrato.id in (select tarea.contrato_id from tarea where ? between tarea.fecha_inicio and tarea.fecha_fin)
           and tarea.activo = 'S'
        '''

        print cadenaSQL

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Ejecución.
        ret = conn.execute(cadenaSQL, equipo_id, fecha, fecha, \
                           equipo_id, fecha, fecha) 

        # Se recuperan datos.
        ret = ret.fetchall()

        # Y se devuelven.
        return ret    

    def actualizar_tarea(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de tarea
        Tabla: tarea
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_tarea(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_tarea(i['p_id'], i['fecha_inicio'], \
                              i['fecha_fin'], i['observ'], \
                              i['contrato_id'], \
                              i['solapado'], False)

        # Actualización.
        for i in campos:
            self.update_tarea(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj        

    def insert_tarea(self, puesto_id, fecha_inicio, fecha_fin, observaciones, \
                     contrato_id, solapado, hacer_commit = True):
        '''Inserción de tarea (asignación)
        Tabla: tarea
        '''

        # Se define entidad.
        entidad = self.__db.entity("tarea")

        # ALGG 18012017 En este método falta incluir código para controlar los
        # traslados entre equipos, mediante los campos activo y tarea_anterior.
        # Además hay que incluir chequeos para controlar que más de una tarea
        # para un mismo trabajador no puede empezar el mismo día, salvo que
        # esté solapada. Darse cuenta que si se hace un traslado hay que tener
        # claro que la asignación original puede partirse en dos o tres.

        # Si la fecha fin es nula, la ponemos como 31-12-2099.
        if fecha_fin is None: fecha_fin = self.fechaPython("2099-12-31")
        else: fecha_fin = self.fechaPython(fecha_fin)

        # Se inserta nuevo elemento.
        entidad.insert(puesto_id = puesto_id, \
                       fecha_inicio = self.fechaPython(fecha_inicio), \
                       fecha_fin = fecha_fin, observaciones = observaciones, \
                       contrato_id = contrato_id, solapado = solapado, \
                       tarea_anterior = None, activo = 'S') 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_tarea(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: tarea
        '''

        # Se define entidad.
        entidad = self.__db.entity("tarea")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "puesto_id": ret.puesto_id = valor
        if campo == "fecha_inicio": ret.fecha_inicio = self.fechaPython(valor)
        if campo == "fecha_fin": ret.fecha_fin = self.fechaPython(valor)
        if campo == "observaciones": ret.observaciones = valor
        if campo == "contrato_id": ret.contrato_id = valor
        if campo == "solapado": ret.solapado = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_tarea(self, _id, hacer_commit = True):
        '''Borrado de tarea (asignación)
        Tabla: tarea
        '''

        # Se define entidad.
        entidad = self.__db.entity("tarea")

        # ALGG 18012017 Aquí se debe de insertar el código para comprobar si
        # la asignación viene de romper otra asignación. Si es así hay que
        # buscar la asignación de tarea_anterior y buscar el rango de fechas 
        # que se quiere borrar con activo = 'N', para cambiarlo a activo = "S",
        # de modo que el trabajador vuelva a su sitio de origen.

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se buscan cambios de turnos y se eliminan, ya que eliminar una 
        # asignación es eliminar todas las modificaciones sobre la
        # planificación diaria.

        # tarea = self.get_tarea(None, None, tarea_id = ret.id)
        # bla bla bla
        
        
        
        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_cambio_turno(self, dia, tarea_id, turno_modificado, \
                                turno_original, observaciones):
        '''Cambio de turno en planificación diaria
        Tabla: cambio_turno
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Se recupera, si existe, el turno original para el día especificado 
        # en la asignación especificada.

        entidad = self.__db.entity("cambio_turno")

        dia = self.fechaPython(dia)

        # Buscamos la fila apropiada.
        where = and_(entidad.dia==dia, entidad.tarea_id==tarea_id)

        try:
            ret = entidad.filter(where).one()
            ret.turno_modificado = turno_modificado
            ret.observaciones = observaciones
        except:
            # No existe un cambio de turno anterior, por lo que se inserta.
            # Se inserta nuevo elemento.
            entidad.insert(dia=dia, tarea_id=tarea_id, \
                           turno_modificado = turno_modificado, \
                           turno_original = turno_original, \
                           observaciones = observaciones) 

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj        

    def get_cambios_turnos(self, fini_t, ffin_t, tarea_id):
        '''Se recuperan los posibles cambios de turnos de la planificación 
        diaria para una tarea entre un rango de fechas de tarea.
        Tabla: cambio_turno
        '''


        cadenaSQL = '''
        select dia,
               tarea_id,
               turno_modificado,
               turno_original,
               observaciones
          from cambio_turno
         where (1 = 1)
         '''

        # Definición de clausuras.
        clausura_1 = ' and tarea_id = ? '
        clausura_2 = ' and dia between ? and ? '

        # print cadenaSQL

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        cadenaSQL += clausura_1 + clausura_2
        ret = conn.execute(cadenaSQL, tarea_id, self.fechaPython(fini_t), \
                           self.fechaPython(ffin_t)) 
    
        # Se recuperan datos.
        ret = ret.fetchall()

        print cadenaSQL

        # Y se devuelven.
        return ret    

    def insert_contrato_ausencia(self, contrato_id, aus_id, fecha_inicio, \
                                 fecha_fin, anno_devengo, activo, \
                                 ausencia_parcial, hora_inicio, hora_fin, \
                                 hacer_commit = True):
        '''Inserción de ausencia en contrato
        Tabla: contrato_ausencia
        '''

        # Se define entidad.
        entidad = self.__db.entity("contrato_ausencia")

        
        # Se inserta nuevo elemento.
        entidad.insert(contrato_id = contrato_id, ausencia_id = aus_id, \
                       fecha_inicio = self.fechaPython(fecha_inicio), \
                       fecha_fin = self.fechaPython(fecha_fin), \
                       anno_devengo = anno_devengo, \
                       ausencia_parcial = ausencia_parcial, \
                       hora_inicio = hora_inicio, hora_fin = hora_fin, \
                       activo = activo) 

        # ALGG 28-01-2017. Comprobar que la ausencia no sale del contrato.
        self.__db.flush()

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_contrato_ausencia(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: contrato_ausencia
        '''

        # Se define entidad.
        entidad = self.__db.entity("contrato_ausencia")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "aus_id": ret.ausencia_id = valor
        if campo == "fecha_inicio": ret.fecha_inicio = self.fechaPython(valor)
        if campo == "fecha_fin": ret.fecha_fin = self.fechaPython(valor)
        if campo == "anno_devengo": ret.anno_devengo = valor
        if campo == "activo": ret.activo = valor
        if campo == "ausencia_parcial": ret.ausencia_parcial = valor
        if campo == "hora_inicio": ret.hora_inicio = valor
        if campo == "hora_fin": ret.hora_fin = valor
        
        # ALGG 28-01-2017. Comprobar que la ausencia no sale del contrato.
        self.__db.flush()
        
        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_contrato_ausencia(self, _id, hacer_commit = True):
        '''Borrado de ausencia del contrato
        Tabla: contrato_ausencia
        '''

        # Se define entidad.
        entidad = self.__db.entity("contrato_ausencia")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # ALGG 28-01-2017 Flush.
        self.__db.flush()
        
        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_contrato_ausencia(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de ausencia en contrato
        Tabla: contrato_ausencia
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"
        ret = True
        
        # Eliminación.
        for i in reg_eliminado: self.delete_contrato_ausencia(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_contrato_ausencia(i['contrato_id'], i['aus_id'], \
                                          i['fecha_inicio'], i['fecha_fin'], \
                                          i['anno_devengo'], \
                                          i['activo'], i['ausencia_parcial'], \
                                          i['hora_inicio'], i['hora_fin'], False)

        # Actualización.
        for i in campos:
            self.update_contrato_ausencia(i['id'], i['field'], \
                                          i['valor_nuevo'], False)

        # Se comprueba que las fechas de ausencias están dentro de los contratos.
        if self.exists_ausencias_not_in_contrato():
            ret = False
            msj = u'Existen ausencias cuyas fechas quedan fuera de contrato'
            self.__db.rollback()
            
        if ret:
            # Commit.
            try:
                self.__db.commit()
                ret = True
    
            except Exception as ex:
                # Se recoge mensaje de error y se envía.
                self.__db.rollback()
                msj = str(ex.__class__)
                ret = False
                print "MENSAJE DE ERROR ", msj

        # Se devuelve estado y mensaje.
        return ret, msj    
    
    def insert_cobertura_equipo(self, fecha_inicio, categoria_id, lunes, \
                                martes, miercoles, jueves, viernes, sabado, \
                                domingo, fecha_fin, hacer_commit = True):
        '''Inserción de cobertura de equipo
        Tabla: cobertura_equipo
        '''

        # Se define entidad.
        entidad = self.__db.entity("cobertura_equipo")

        # Si la fecha fin es nula, la ponemos como 31-12-2099.
        if fecha_fin is None: fecha_fin = self.fechaPython("2099-12-31")
        else: fecha_fin = self.fechaPython(fecha_fin)

        # Se inserta nuevo elemento.
        entidad.insert(fecha_inicio = self.fechaPython(fecha_inicio), \
                       categoria_id = categoria_id, lunes = lunes, \
                       martes = martes, miercoles = miercoles, \
                       jueves = jueves, viernes = viernes, sabado = sabado, \
                       domingo = domingo, fecha_fin = fecha_fin) 

        # Flush... ya que se tiene que comprobar más adelante si hay solapamiento
        # de fechas en coberturas de servicio.
        self.__db.flush()  
                
        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_cobertura_equipo(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: cobertura_equipo
        '''

        # Se define entidad.
        entidad = self.__db.entity("cobertura_equipo")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "fecha_inicio": ret.fecha_inicio = self.fechaPython(valor)
        if campo == "fecha_fin": ret.fecha_fin = self.fechaPython(valor)
        if campo == "lunes": ret.lunes = valor
        if campo == "martes": ret.martes = valor
        if campo == "miercoles": ret.miercoles = valor
        if campo == "jueves": ret.jueves = valor
        if campo == "viernes": ret.viernes = valor
        if campo == "sabado": ret.sabado = valor
        if campo == "domingo": ret.domingo = valor

        # Flush... ya que se tiene que comprobar más adelante si hay solapamiento
        # de fechas en coberturas de servicio.
        self.__db.flush()  
        
        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_cobertura_equipo(self, _id, hacer_commit = True):
        '''Borrado de cobertura de equipo
        Tabla: cobertura_equipo
        '''

        # Se define entidad.
        entidad = self.__db.entity("cobertura_equipo")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_cobertura_equipo(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de coberturas de equipo
        Tabla: cobertura_equipo
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        ret = True
        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_cobertura_equipo(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_cobertura_equipo(i['fecha_inicio'], i['eq_id'], \
                                         i['lunes'], i['martes'], \
                                         i['miercoles'], i['jueves'], \
                                         i['viernes'], i['sabado'], \
                                         i['domingo'], i['fecha_fin'], False)

        # Actualización.
        for i in campos:
            self.update_cobertura_equipo(i['id'], i['field'], \
                                         i['valor_nuevo'], False)

        # ALGG 04032017 Se comprueba si hay solapamientos en coberturas de 
        # servicio, provocadas por actualizaciones o inserciones.
        if self.exists_solapamiento_in_cobertura():
            ret = False
            msj = u'Existe solapamiento de fechas en coberturas de servicio'
            self.__db.rollback()
       
        if ret:
            # Commit.
            try:
                self.__db.commit()
                ret = True
   
            except Exception as ex:
                # Se recoge mensaje de error y se envía.
                self.__db.rollback()
                msj = str(ex.__class__)
                ret = False
                print "MENSAJE DE ERROR ", msj
       
        # Se devuelve estado y mensaje.
        return ret, msj        
    
    def get_cobertura_equipo(self, equipo_id = None, fecha = None):
        '''Devuelve: (id, fecha_inicio, categoria_id, lunes, martes, miercoles,
        jueves, viernes, sabado, domingo, fecha_fin)
        Tabla: cobertura_equipo
        Opciones de filtrado: equipo_id <id equipo>, fecha <fecha en donde la 
        cobertura es efectiva>'''
   
        # ALGG 21-01-2017 Incluyo rollback para eliminar cualquier transacción 
        # que se haya podido quedar pillada.
        self.__db.rollback()        
   
        
        cadenaSQL = '''
        select c.id,
               c.fecha_inicio,
               c.fecha_fin,
               u.id eq_id,
               u.codigo eq_cod,
               u.descripcion eq_desc,
               c.lunes,
               c.martes,
               c.miercoles,
               c.jueves,
               c.viernes,
               c.sabado,
               c.domingo
          from cobertura_equipo c join unit u on u.id = c.categoria_id
                                       and u.tipo_unit_id = 3
         where 1 = 1
         '''
   
        ordenacion = ' order by u.descripcion '
   
        # Definición de clausuras.
        clausura_1 = ' and c.categoria_id = ? '
        clausura_2 = ' and ? between c.fecha_inicio and c.fecha_fin '
   
        # Se transforma fecha.
        if fecha is not None: fecha = self.fechaPython(fecha)
        
        # Se crea objeto conexión.
        conn = self.__db.connection()
   
        # Reglas.
        if equipo_id is not None and fecha is not None:
            cadenaSQL += clausura_1 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, equipo_id, fecha)             
        elif equipo_id is not None:
            cadenaSQL += clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, equipo_id) 
        elif fecha is not None:
            cadenaSQL += clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, fecha) 
        else:
            cadenaSQL += ordenacion
            ret = conn.execute(cadenaSQL)
   
        # Se recuperan datos.
        ret = ret.fetchall()
   
        # Y se devuelven.
        return ret  
       
    def get_coberturaServicio(self, equipo_id, mes, anno):
        '''Devuelve: (dia_trab, dia_semana, descuadre, info)
        Tabla: cobertura_equipo, tarea, v_planificacion
        Esta query da las coberturas de servicio, teniendo en cuenta turnos
        que cuenten o no horas, ausencias que cuenten ó no presencias (días) y
        cambios de turnos.
        '''
   
        # ALGG 21-01-2017 Incluyo rollback para eliminar cualquier transacción 
        # que se haya podido quedar pillada.
        self.__db.rollback()        
        
        cadenaSQL = '''
       select "dia"||cast(strftime('%d',dia_trab) as integer) columna,
               dia_trab, dia_semana,case  when dia_semana = 'L' and (lunes - n_trab) <> 0 then "Necesidad: "||lunes||" Presencia: "||n_trab||case when (n_trab - lunes) > 0 then " Exceso: "||abs(n_trab - lunes) when (n_trab - lunes) < 0 then " Deficiencia: "||abs(n_trab - lunes) end
	       when dia_semana = 'M' and (martes - n_trab) <> 0 then "Necesidad: "||martes||" Presencia: "||n_trab||case when (n_trab - martes) > 0 then " Exceso: "||abs(n_trab - martes) when (n_trab - martes) < 0 then " Deficiencia: "||abs(n_trab - martes) end
               when dia_semana = 'X' and (miercoles - n_trab) <> 0 then "Necesidad: "||miercoles||" Presencia: "||n_trab||case when (n_trab - miercoles) > 0 then " Exceso: "||abs(n_trab - miercoles) when (n_trab - miercoles) < 0 then " Deficiencia: "||abs(n_trab - miercoles) end
	       when dia_semana = 'J' and (jueves - n_trab) <> 0 then "Necesidad: "||jueves||" Presencia: "||n_trab||case when (n_trab - jueves) > 0 then " Exceso: "||abs(n_trab - jueves) when (n_trab - jueves) < 0 then " Deficiencia: "||abs(n_trab - jueves) end
	       when dia_semana = 'V' and (viernes - n_trab) <> 0 then "Necesidad: "||viernes||" Presencia: "||n_trab||case when (n_trab - viernes) > 0 then " Exceso: "||abs(n_trab - viernes) when (n_trab - viernes) < 0 then " Deficiencia: "||abs(n_trab - viernes) end
	       when dia_semana = 'S' and (sabado - n_trab) <> 0 then "Necesidad: "||sabado||" Presencia: "||n_trab||case when (n_trab - sabado) > 0 then " Exceso: "||abs(n_trab - sabado) when (n_trab - sabado) < 0 then " Deficiencia: "||abs(n_trab - sabado) end
	       when dia_semana = 'D' and (domingo - n_trab) <> 0 then "Necesidad: "||domingo||" Presencia: "||n_trab||case when (n_trab - domingo) > 0 then " Exceso: "||abs(n_trab - domingo) when (n_trab - domingo) < 0 then " Deficiencia: "||abs(n_trab - domingo)  end end descuadre,
	  case when dia_semana = 'L' and (lunes - n_trab) > 0 then "faltan"
	       when dia_semana = 'L' and (lunes - n_trab) < 0 then "sobran"
	       when dia_semana = 'M' and (martes - n_trab) > 0 then "faltan"
	       when dia_semana = 'M' and (martes - n_trab) < 0 then "sobran"
	       when dia_semana = 'X' and (miercoles - n_trab) > 0 then "faltan"
	       when dia_semana = 'X' and (miercoles - n_trab) < 0 then "sobran"
	       when dia_semana = 'J' and (jueves - n_trab) > 0 then "faltan"
	       when dia_semana = 'J' and (jueves - n_trab) < 0 then "sobran"
               when dia_semana = 'V' and (lunes - n_trab) > 0 then "faltan"
	       when dia_semana = 'V' and (lunes - n_trab) < 0 then "sobran"
	       when dia_semana = 'S' and (sabado - n_trab) > 0 then "faltan"
               when dia_semana = 'S' and (sabado - n_trab) < 0 then "sobran"
	       when dia_semana = 'D' and (domingo - n_trab) > 0 then "faltan"
	       when dia_semana = 'D' and (domingo - n_trab) < 0 then "sobran"
               else "correcto" end info,
          case when dia_semana = 'L' then n_trab - lunes 
	       when dia_semana = 'M' then n_trab - martes
	       when dia_semana = 'X' then n_trab - miercoles
    	       when dia_semana = 'J' then n_trab - jueves
	       when dia_semana = 'V' then n_trab - viernes
	       when dia_semana = 'S' then n_trab - sabado
	       when dia_semana = 'D' then n_trab - domingo end presencias
from (	       
select dia_trab,
       turno,
       sum(case when hay_ausencia = 'no' then cast(presencias as float)
                when hay_ausencia = 'si' and presencias <> 0 then presencia_en_ausencia
                else 0.0 end) n_trab,
       lunes, 
       martes, 
       miercoles,
       jueves,
       viernes,
       sabado,
       domingo,
       dia_semana 
  from (
select case when contrato_ausencia.id is null then 'no' else 'si' end hay_ausencia,
       case when ausencia.cuenta_dias = 'N' and contrato_ausencia.ausencia_parcial = 'N' then 0
            when ausencia.cuenta_dias = 'S' then 1
            when ausencia.cuenta_dias = 'N' and contrato_ausencia.ausencia_parcial = 'S' then 
             (cast((v_diario.horas * 60 * 60) + (v_diario.minutos * 60) as float) - (cast((strftime('%s', '2017-01-01 '||contrato_ausencia.hora_fin) - strftime('%s', '2017-01-01 '||contrato_ausencia.hora_inicio)) as float))) /
             cast( (v_diario.horas * 60 * 60) + (v_diario.minutos * 60) as float ) 
            else null end presencia_en_ausencia,
       contrato_ausencia.ausencia_parcial,
       contrato_ausencia.hora_inicio,
       contrato_ausencia.hora_fin,
       case cast (strftime('%w', x.date) as integer) when 0 then 'D'
                                                      when 1 then 'L'
                                                      when 2 then 'M'
                                                      when 3 then 'X'
                                                      when 4 then 'J'
                                                      when 5 then 'V'
                                                      else 'S' end as dia_semana,
       tarea.id tarea_id, 
       v_diario.turno, 
       case when turno_master.cuenta_horas = 'S' then 1 
            else 0 end presencias, x.date dia_trab,
       cobertura_equipo.lunes, 
       cobertura_equipo.martes, 
       cobertura_equipo.miercoles, 
       cobertura_equipo.jueves,
       cobertura_equipo.viernes, 
       cobertura_equipo.sabado, 
       cobertura_equipo.domingo
  from estructura join tarea on tarea.puesto_id = estructura.puesto_id
                  join cobertura_equipo on cobertura_equipo.categoria_id = estructura.categoria_id
                  join contrato on contrato.id = tarea.contrato_id
                  join v_diario on v_diario.persona_id = contrato.persona_id 
                       and v_diario.dia = x.date
                  join turno_master on turno_master.codigo = v_diario.turno
                  join (select date  
                          from (with recursive dates(date) as (
                              values(?)
                           union all
                             select date(date, '+1 day') d
                              from dates
                             where date < ?)
                            select date from dates)) x on x.date between tarea.fecha_inicio and tarea.fecha_fin
              left join contrato_ausencia on contrato_ausencia.contrato_id = contrato.id
                        and x.date  between contrato_ausencia.fecha_inicio and contrato_ausencia.fecha_fin
              left join ausencia on ausencia.id = contrato_ausencia.ausencia_id
 where x.date between cobertura_equipo.fecha_inicio and cobertura_equipo.fecha_fin 
   and estructura.categoria_id = ?
) group by dia_trab)
      '''
        
        # A partir del mes y del año se forman las fechas de inicio y fin del mes.
        fini = self.fechaPython("%s-%s-%s" % (str(anno), str(mes), "1"))
        last_day = calendar.monthrange(anno, mes)[1]
        ffin = self.fechaPython("%s-%s-%s" % (str(anno), str(mes), str(last_day)))
        
        # Se crea objeto conexión.
        conn = self.__db.connection()
   
        # ...info de parámetros.
        print("año=",anno, "mes=", mes, "equipo_id",equipo_id, \
              "fini",fini, "ffin", ffin, "equipo_id", equipo_id)     
   
        # Reglas.
        ret = conn.execute(cadenaSQL, fini, ffin, equipo_id)
   
        # Se recuperan datos.
        ret = ret.fetchall()
   
        # Y se devuelven.
        return ret         
    
    def update_basica(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: basica'''

        # Se define entidad.
        entidad = self.__db.entity("basica")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "es_lunes_festivo": ret.es_lunes_festivo = valor
        if campo == "es_martes_festivo": ret.es_martes_festivo = valor
        if campo == "es_miercoles_festivo": ret.es_miercoles_festivo = valor
        if campo == "es_jueves_festivo": ret.es_jueves_festivo = valor
        if campo == "es_viernes_festivo": ret.es_viernes_festivo = valor
        if campo == "es_sabado_festivo": ret.es_sabado_festivo = valor
        if campo == "es_domingo_festivo": ret.es_domingo_festivo = valor
        if campo == "empresa": ret.empresa = valor
        
        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_basica(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de datos básicos de aplicación.
        Tabla: basica
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Actualización.
        for i in campos:
            self.update_basica(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj        
    
    def getContratoByAusencia(self, contrato_ausencia_id):
        '''Devuelve: Id de contrato a partir del identificador de ausencia
        de contrato.
        Tabla: contrato_ausencia
        '''

        # Se define consulta.
        cadenaSQL = '''
           select contrato_id 
             from contrato_ausencia
            where id = ? 
        '''

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Se lanza SQL.
        ret = conn.execute(cadenaSQL, contrato_ausencia_id)

        # Se recuperan datos.
        ret = ret.fetchall()

        # Identificador...
        return ret        
    
    def get_horas(self, fecha_inicio, fecha_fin, persona_id = None, \
                  cf_id = None, sf_id = None, eq_id = None, p_id = None):
        '''Devuelve el total de horas de un trabajador entre un 
        rango de fechas.
        Filtro: centro físico <cf_id>, servicio <sf_id>, equipo <eq_id>, 
        puesto <p_id>, ident. del trabajador <persona_id>
        Vista: v_balance
        '''

        # Rollback para eliminar tansacciones pendientes.
        self.__db.rollback()        

        cadenaSQL = '''
        select jt.total_horas_anual - sum(horas_presencia) balance,
	       v_balance.nombre||' '||v_balance.ape1||' '||v_balance.ape2||'('||v_balance.dni||')' trabajador,
               sum(horas_presencia) horas, 
               case when strftime('%m', dia) = '01' then 'enero'
                    when strftime('%m', dia) = '02' then 'febrero'
                    when strftime('%m', dia) = '03' then 'marzo'
                    when strftime('%m', dia) = '04' then 'abril'
                    when strftime('%m', dia) = '05' then 'mayo'
                    when strftime('%m', dia) = '06' then 'junio'
                    when strftime('%m', dia) = '07' then 'julio'
                    when strftime('%m', dia) = '08' then 'agosto'
                    when strftime('%m', dia) = '09' then 'septiembre'
                    when strftime('%m', dia) = '10' then 'octubre'
                    when strftime('%m', dia) = '11' then 'noviembre'
                    when strftime('%m', dia) = '12' then 'diciembre' end mes, 
	       strftime('%Y', dia) anno,  
               cf.descripcion cf,
               sf.descripcion sf,
               eq.descripcion eq,
               p.descripcion p
          from v_balance join unit cf on cf.id = v_balance.cf_id
                         join unit sf on sf.id = v_balance.sf_id
                         join unit eq on eq.id = v_balance.eq_id
                         join unit p on p.id = v_balance.p_id
               left join jornada_teorica jt on jt.centro_fisico_id = cf.id
		         and jt.anno = strftime('%Y', dia)
         where 1 = 1
           and dia between ? and ?
         '''
        
        # Clausurado de agrupación.
        clausura_n = '''
        group by strftime('%m', dia), 
               strftime('%Y', dia), 
               cf.descripcion,
	       sf.descripcion,
	       eq.descripcion,
	       p.descripcion,
               v_balance.nombre||' '||v_balance.ape1||' '||v_balance.ape2||'('||v_balance.dni||')'
               '''
        
        # Clausura de agrupación + ordenación.
        ordenacion = clausura_n + ' order by anno, mes, trabajador, cf, sf, eq, p '

        # Definición de clausuras.
        clausura_0 = ' and persona_id = ? '
        clausura_1 = ' and cf.id = ? '
        clausura_2 = ' and sf.id = ? '
        clausura_3 = ' and eq.id = ? '
        clausura_4 = ' and p.id = ? '
        
        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Conversión de fechas a Python.
        fecha_inicio = self.fechaPython(fecha_inicio)
        fecha_fin = self.fechaPython(fecha_fin)
            
        # Reglas.
        if persona_id is not None and cf_id is not None:
            cadenaSQL += clausura_0 + clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, fecha_inicio, fecha_fin, \
                               persona_id, cf_id)
        elif persona_id is not None and sf_id is not None:
            cadenaSQL += clausura_0 + clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, fecha_inicio, fecha_fin, \
                               persona_id, sf_id)
        elif persona_id is not None and eq_id is not None:
            cadenaSQL += clausura_0 + clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, fecha_inicio, fecha_fin, \
                               persona_id, eq_id)
        elif persona_id is not None and p_id is not None:
            cadenaSQL += clausura_0 + clausura_4 + ordenacion
            ret = conn.execute(cadenaSQL, fecha_inicio, fecha_fin, \
                               persona_id, p_id)
        elif cf_id is not None:
            cadenaSQL += clausura_1 + ordenacion
            ret = conn.execute(cadenaSQL, fecha_inicio, fecha_fin, cf_id)
        elif sf_id is not None:
            cadenaSQL += clausura_2 + ordenacion
            ret = conn.execute(cadenaSQL, fecha_inicio, fecha_fin, sf_id)
        elif eq_id is not None:
            cadenaSQL += clausura_3 + ordenacion
            ret = conn.execute(cadenaSQL, fecha_inicio, fecha_fin, eq_id)
        elif p_id is not None:
            cadenaSQL += clausura_4 + ordenacion
            ret = conn.execute(cadenaSQL, fecha_inicio, fecha_fin, p_id)
        else:
            cadenaSQL += ordenacion
            ret = conn.execute(cadenaSQL, fecha_inicio, fecha_fin)
            
        # Se recuperan datos.
        ret = ret.fetchall()

        print(cadenaSQL)

        # Y se devuelven.
        return ret       
    
    def exists_rol_usuario(self, rol_id = None, usuario_id = None):
        '''Devuelve: True si existe la tupla (usuario_id, rol_id) y False en 
        caso contrario.
        Tabla: rol_usuario (asociación de usuario con rol)
        '''

        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from rol_usuario r
           where 1 = 1
        '''

        # Clausurado.
        clausura_0 = ' and usuario_id = ? '
        clausura_1 = ' and rol_id = ? '
        
        # Se crea objeto conexión.
        conn = self.__db.connection()

        if usuario_id is not None and rol_id is not None:
            cadenaSQL += clausura_0 + clausura_1
            ret = conn.execute(cadenaSQL, usuario_id, rol_id)
        elif usuario_id is not None:
            cadenaSQL += clausura_0           
            ret = conn.execute(cadenaSQL, usuario_id)
        elif rol_id is not None:
            cadenaSQL += clausura_1           
            ret = conn.execute(cadenaSQL, rol_id)
        else: ret = conn.execute(cadenaSQL)
        
        # Se recuperan datos.
        ret = ret.fetchall()

        if len(ret) == 0: ret = False
        else: ret = True

        # Estado devuelto.
        return ret     
    
    def insert_rol_usuario(self, rol_id, usuario_id, observaciones, \
                           activo, hacer_commit = True):
        '''Inserción de nueva asociación de rol con usuario
        Tabla: rol_usuario
        '''

        # Se define entidad.
        entidad = self.__db.entity("rol_usuario")

        # Se inserta nuevo elemento.
        entidad.insert(rol_id = rol_id, usuario_id = usuario_id, \
                       observaciones = observaciones, activo = activo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_rol_usuario(self, _id,campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: rol_usuario
        '''

        # Se define entidad.
        entidad = self.__db.entity("rol_usuario")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        # if campo == "rol_id": ret.rol_id = valor
        # if campo == "usuario_id": ret.usuario_id = valor
        if campo == "observaciones": ret.observaciones = valor
        if campo == "activo": ret.activo = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_rol_usuario(self, _id, hacer_commit = True):
        '''Borrado de rol asociado a usuario
        Tabla: rol_usuario
        '''

        # Se define entidad.
        entidad = self.__db.entity("rol_usuario")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_rol_usuario(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de roles asociados a usuarios 
        Tabla: rol_usuario
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_rol_usuario(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_rol_usuario(i['rol_id'], i['usuario_id'], \
                                    i['observaciones'], i['activo'], False)

        # Actualización.
        for i in campos:
            self.update_rol_usuario(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            # if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
            #     msj = u'El código y/o la descripción ya existen'            
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj    
    
    def exists_rol_recurso(self, rol_id, recurso_id = None):
        '''Devuelve: True si existe la tupla (recurso_id, rol_id) y False en 
        caso contrario.
        Tabla: rol_recurso (asociación de recurso con rol)
        '''

        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from rol_recurso r
           where rol_id = ?
             and 1 = 1
        '''

        # Clausurado.
        clausura_0 = ' and recurso_id = ? '

        # Se crea objeto conexión.
        conn = self.__db.connection()

        if recurso_id is not None:
            cadenaSQL += clausura_0
            ret = conn.execute(cadenaSQL, rol_id, recurso_id)
        else:
            ret = conn.execute(cadenaSQL, rol_id)
            
        # Se recuperan datos.
        ret = ret.fetchall()

        if len(ret) == 0: ret = False
        else: ret = True

        # Estado devuelto.
        return ret     
    
    def insert_rol_recurso(self, rol_id, recurso_id, ejecucion, lectura, \
                           escritura, observaciones, activo, \
                           hacer_commit = True):
        '''Inserción de nueva asociación de rol con recurso
        Tabla: rol_recurso
        '''

        # Se define entidad.
        entidad = self.__db.entity("rol_recurso")

        # Se inserta nuevo elemento.
        entidad.insert(rol_id = rol_id, recurso_id = recurso_id, \
                       ejecucion = ejecucion, lectura = lectura, \
                       escritura = escritura, \
                       observaciones = observaciones, activo = activo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_rol_recurso(self, _id,campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: rol_recurso
        '''

        # Se define entidad.
        entidad = self.__db.entity("rol_recurso")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        # if campo == "rol_id": ret.rol_id = valor
        # if campo == "recurso_id": ret.recurso_id = valor
        if campo == "ejecucion": ret.ejecucion = valor
        if campo == "lectura": ret.lectura = valor
        if campo == "escritura": ret.escritura = valor
        if campo == "observaciones": ret.observaciones = valor
        if campo == "activo": ret.activo = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_rol_recurso(self, _id, hacer_commit = True):
        '''Borrado de rol asociado a recurso
        Tabla: rol_recurso
        '''

        # Se define entidad.
        entidad = self.__db.entity("rol_recurso")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_rol_recurso(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de roles asociados a recursos 
        Tabla: rol_recurso
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_rol_recurso(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_rol_recurso(i['rol_id'], i['recurso_id'], \
                                    i['ejecucion'], i['lectura'], \
                                    i['escritura'], i['observaciones'], \
                                    i['activo'], False)

        # Actualización.
        for i in campos:
            self.update_rol_recurso(i['id'], i['field'], i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            # if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
            #     msj = u'El código y/o la descripción ya existen'            
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj        
    
    def get_usuario_estructura(self, usuario_id = None, cf_id = None, \
                               sf_id = None, eq_id = None, activo = None):
        '''Devuelve:(id, usuario_id, usuario, cf_id, cf_cod, cf_desc, sf_id, 
        sf_cod, sf_desc, eq_id, eq_cod, eq_desc, observ, activo)
        Tabla: usuario_estructura (relación entre usuario y estructura 
        organizativa) 
        Opciones de filtrado: usuario_id, cf_id, sf_id, eq_id, activo
        '''
        
        cadenaSQL = '''
        select distinct
               usuario_estructura.id id_,
               usuario.id usuario_id,
	       usuario.nick usuario,
               u_cf.id cf_id,
	       u_cf.codigo cf_cod,
	       u_cf.descripcion||' - '||u_cf.codigo cf_desc,
	       u_sf.id sf_id,
	       u_sf.codigo sf_cod,
	       u_sf.descripcion||' - '||u_sf.codigo sf_desc,
	       u_eq.id eq_id,
	       u_eq.codigo eq_cod,
	       u_eq.descripcion||' - '||u_eq.codigo eq_desc,
	       usuario_estructura.observaciones observ,
	       usuario_estructura.activo activo
          from usuario_estructura join usuario on usuario.id = usuario_estructura.usuario_id
                                  join estructura e1 on e1.centro_fisico_id = usuario_estructura.centro_fisico_id
                                  join unit u_cf on u_cf.id = e1.centro_fisico_id
				  join estructura e2 on e2.servicio_id = usuario_estructura.servicio_id
				  join unit u_sf on u_sf.id = e2.servicio_id
				  join estructura e3 on e3.categoria_id = usuario_estructura.equipo_id
				  join unit u_eq on u_eq.id = e3.categoria_id
         where 1 = 1 
        '''

        # Definición de clausuras.
        clausura_1 = ' and usuario.id = ? '
        clausura_2 = ' and u_cf.id = ? '
        clausura_3 = ' and u_sf.id = ? '
        clausura_4 = ' and u_eq.id = ? '
        clausura_5 = ' and usuario_estructura.activo = ? '

        # Se crea objeto conexión.
        conn = self.__db.connection()        

        # Reglas.
        if usuario_id is not None: cadenaSQL += clausura_1
        if cf_id is not None: cadenaSQL += clausura_2
        if sf_id is not None: cadenaSQL += clausura_3
        if eq_id is not None: cadenaSQL += clausura_4
        if activo is not None: cadenaSQL += clausura_5

        b1 = usuario_id is not None and cf_id is not None \
            and sf_id is not None and eq_id is not None and activo is not None
        
        b2 = usuario_id is not None and cf_id is not None \
            and sf_id is not None and activo is not None
        
        b3 = usuario_id is not None and cf_id is not None and activo is not None
        
        b4 = usuario_id is not None and activo is not None
        
        b5 = activo is not None
        
        b6 = usuario_id is not None and cf_id is not None \
            and sf_id is not None and eq_id is not None and activo is None
                
        b7 = usuario_id is not None and cf_id is not None \
            and sf_id is not None and activo is None
                
        b8 = usuario_id is not None and cf_id is not None and activo is None
                
        b9 = usuario_id is not None and activo is None
        
        # Ejecución.
        if b1:
            ret = conn.execute(cadenaSQL, usuario_id, cf_id, sf_id, eq_id, activo)
        elif b2:
            ret = conn.execute(cadenaSQL, usuario_id, cf_id, sf_id, activo)
        elif b3:
            ret = conn.execute(cadenaSQL, usuario_id, cf_id, activo)
        elif b4:
            ret = conn.execute(cadenaSQL, usuario_id, activo)
        elif b5:
            ret = conn.execute(cadenaSQL, activo)
        elif b6:
            ret = conn.execute(cadenaSQL, usuario_id, cf_id, sf_id, eq_id)
        elif b7:
            ret = conn.execute(cadenaSQL, usuario_id, cf_id, sf_id)
        elif b8:
            ret = conn.execute(cadenaSQL, usuario_id, cf_id)
        elif b9:
            ret = conn.execute(cadenaSQL, usuario_id)
        else:
            ret = conn.execute(cadenaSQL)
        
        # Se recuperan datos.
        ret = ret.fetchall()        

        # Y se devuelven.
        return ret            
    
    def insert_usuario_estructura(self, usuario_id, cf_id, sf_id, eq_id, \
                                  observaciones, activo, hacer_commit = True):
        '''Inserción de nueva asociación de usuario con estructura
        Tabla: usuario_estructura
        '''

        # Se define entidad.
        entidad = self.__db.entity("usuario_estructura")

        # Se inserta nuevo elemento.
        entidad.insert(usuario_id = usuario_id, centro_fisico_id = cf_id, \
                       servicio_id = sf_id, equipo_id = eq_id, \
                       puesto_id = None, observaciones = observaciones, \
                       activo = activo) 

        # Se hace commit.
        if hacer_commit: self.__db.commit()

    def update_usuario_estructura(self, _id,campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: usuario_estructura
        '''

        # Se define entidad.
        entidad = self.__db.entity("usuario_estructura")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)

        # Actualizamos los campos que se consideren oportunos.
        if campo == "observ": ret.observaciones = valor
        if campo == "activo": ret.activo = valor

        # Commit.
        if hacer_commit: self.__db.commit()

    def delete_usuario_estructura(self, _id, hacer_commit = True):
        '''Borrado de usuario asociado a unidad organizativa 
        Tabla: usuario_estructura
        '''

        # Se define entidad.
        entidad = self.__db.entity("usuario_estructura")

        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        

        # Se elimina.
        self.__db.delete(ret)

        # Commit.
        if hacer_commit: self.__db.commit()

    def actualizar_usuario_estructura(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de usuarios asociados a estructura 
        Tabla: usuario_estructura
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()

        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_usuario_estructura(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_usuario_estructura(i['usuario_id'], i['cf_id'], \
                                    i['sf_id'], i['eq_id'], \
                                    i['observ'], i['activo'], False)

        # Actualización.
        for i in campos:
            self.update_usuario_estructura(i['id'], i['field'], \
                                           i['valor_nuevo'], False)

        # Commit.
        try:
            self.__db.commit()
            ret = True

        except Exception as ex:
        # except ValueError as e:
            # Se recoge mensaje de error y se envía.
            self.__db.rollback()
            msj = str(ex.__class__)
            ret = False
            # if msj == "<class 'sqlalchemy.exc.IntegrityError'>":
            #     msj = u'El código y/o la descripción ya existen'            
            print "MENSAJE DE ERROR ", msj
        # Se devuelve estado y mensaje.
        return ret, msj        
        
    def exists_usuario_estructura(self, usuario_id, cf_id = None, \
                                  sf_id = None, eq_id = None):
        '''Devuelve: True si existe la tupla usuario, estructura y False
        en caso contrario.
        Tabla: usuario_estructura (asociación de usuario con rol)
        '''

        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from usuario_estructura r
           where usuario_id = ?
             and 1 = 1
        '''

        # Clausurado.
        clausura_0 = ' and centro_fisico_id = ? and servicio_id = ? ' + \
            ' and equipo_id = ? '
        
        # Se crea objeto conexión.
        conn = self.__db.connection()

        if cf_id is None and sf_id is None and eq_id is None:
            ret = conn.execute(cadenaSQL, usuario_id)
        else:
            cadenaSQL += clausura_0
            ret = conn.execute(cadenaSQL, usuario_id, cf_id, sf_id, eq_id)

        # Se recuperan datos.
        ret = ret.fetchall()

        if len(ret) == 0: ret = False
        else: ret = True

        # Estado devuelto.
        return ret            
    
    def exists_puesto_planificado(self, puesto_id):
        '''Devuelve: True si el puesto está planificado y False en caso
        contrario
        Tablas: puesto_ciclo 
        '''

        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from puesto_ciclo e
           where e.puesto_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, puesto_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True
  
        # Estado devuelto.
        return ret    
  
    def exists_puesto_asignado(self, puesto_id):
        '''Devuelve: True si el puesto está asignado y False en caso
        contrario
        Tabla: tarea
        '''

        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from tarea e
           where e.puesto_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, puesto_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True
  
        # Estado devuelto.
        return ret         
    
    def exists_equipo_con_cobertura(self, equipo_id):
        '''Devuelve: True si el equipo tiene coberturas de servicio y False en 
        caso contrario
        Tablas: cobertura_equipo
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from cobertura_equipo e
           where e.categoria_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, equipo_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True
  
        # Estado devuelto.
        return ret             
    
    def exists_equipo_con_cobertura(self, equipo_id):
        '''Devuelve: True si el equipo tiene categorías profesionales asociadas
        y False en caso contrario
        Tablas: categoria_equipo
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from categoria_equipo e
           where e.categoria_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, equipo_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True
  
        # Estado devuelto.
        return ret                 

    def exists_cfisico_con_jteorica(self, centro_fisico_id):
        '''Devuelve: True si el centro físico tiene jornadas teóricas 
        asociadas y False en caso contrario
        Tablas: jornada_teorica
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from jornada_teorica e
           where e.centro_fisico_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, centro_fisico_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True
  
        # Estado devuelto.
        return ret                     
    
    def exists_cfisico_con_calendario(self, centro_fisico_id):
        '''Devuelve: True si el centro físico tiene calendarios festivos 
        asociadss y False en caso contrario
        Tablas: jornada_teorica
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from calendario_festivo e
           where e.centro_fisico_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, centro_fisico_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True    
        
        # Estado devuelto.
        return ret      
    
    def exists_turno_en_ciclo(self, turno_id):
        '''Devuelve: True si el turno existe en un ciclo y False en caso 
        contrario.
        Tablas: ciclo_detail
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from ciclo_detail e
           where e.turno_master_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, turno_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True            
        
        # Estado devuelto.
        return ret              

    def exists_turno_en_cambio_turno(self, turno_id):
        '''Devuelve: True si el turno existe en un cambio de turno y False en caso 
        contrario.
        Tablas: cambio_turno, turno_master
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from turno_master join cambio_turno on turno_master.codigo = cambio_turno.turno_modificado
           where turno_master.id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, turno_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True            
        
        # Estado devuelto.
        return ret                 
    
    def get_horas_ciclo(self, ciclo_semanal):
        '''Devuelve: (horas, minutos)
        Tablas: turno_master, turno_detail
        Opciones de filtrado: ciclo_semanal <lista de semanas, donde cada
        semana es una lista de los días de la semana y cada elemento es un 
        código de turno>'''

        # ALGG 01-11-2016 Incluyo rollback para eliminar cualquier transacción que
        # se haya podido quedar pillada.
        self.__db.rollback()        

        cadenaSQL = '''
        select sum(horas) + sum(minutos) / 60 horas,
               sum(minutos) % 60 minutos
          from (select case when dif_horas_0_0 is null then dif_horas_0_1 else dif_horas_0_0 end horas,
	               case when dif_min_0_1 is null then dif_min_0_0 else dif_min_0_1 end minutos
                  from (select case when dia_inicial = dia_final then cast(((strftime('%s', '2017-01-01 '||hora_fin) - strftime('%s', '2017-01-01 '||hora_inicio)) % (60 * 60 * 24)) / (60 * 60) as integer)
                                    else null end dif_horas_0_0,
                               case when dia_inicial = dia_final then cast(((strftime('%s', '2017-01-01 '||hora_fin) - strftime('%s', '2017-01-01 '||hora_inicio)) % (60 * 60 * 24)) % (60 * 60) / 60 as integer)
                                    else null end dif_min_0_0,
                               case when dia_inicial = 0 and dia_final = 1 then (cast(((strftime('%s', '2017-01-01 24:00') - strftime('%s', '2017-01-01 '||hora_inicio)) % (60 * 60 * 24)) / (60 * 60) as integer) + 
                                                                                 cast(((strftime('%s', '2017-01-01 '||hora_fin) - strftime('%s', '2017-01-01 00:00')) % (60 * 60 * 24)) / (60 * 60) as integer))
                                    else null end dif_horas_0_1,
                               case when dia_inicial = 0 and dia_final = 1 then (cast(((strftime('%s', '2017-01-01 24:00') - strftime('%s', '2017-01-01 '||hora_inicio)) % (60 * 60 * 24)) % (60 * 60) / 60 as integer) + 
                                                                                 cast(((strftime('%s', '2017-01-01 '||hora_fin) - strftime('%s', '2017-01-01 00:00')) % (60 * 60 * 24)) % (60 * 60) / 60 as integer))
                                    else null end dif_min_0_1  
                          from (
                          '''

        # ALGG 18-02-2017 Se crea SQL dinámica atendiendo a los turnos que 
        # componen el ciclo semanal.
        aux = ''
        centinela = False
        for semana in ciclo_semanal:
            for turno in semana:
                if not centinela: centinela = True
                else: 
                    aux += '''
                    union all
                    '''
                
                aux += '''
                select dia_inicial, dia_final, hora_inicio, hora_fin
                  from turno_master tm join turno_detail td on td.turno_master_id = tm.id
                 where tm.codigo = '%s'
                ''' % turno
        
        # Se compone el sql dinámico...
        cadenaSQL = cadenaSQL + aux + ' )))'
        
        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Reglas.
        ret = conn.execute(cadenaSQL) 

        # Se recuperan datos.
        ret = ret.fetchall()

        # print("valor devuelto")
        # print(ret)
        print(cadenaSQL)

        # Y se devuelven.
        return ret
    
    def get_jt(self, centro_fisico_id = None, anno = None):
        '''Devuelve: (id, cf_id, cf_cod, cf_desc, anno, 
        total_horas_anual, observaciones)
        Tablas: jornada_teorica, unit
        Opciones de filtrado: Id de centro físico <centro_fisico_id>, 
        año de calendario laboral <anno>
        '''    

        # Rollback.
        self.__db.rollback()        

        print("centro_fisico_id ", str(centro_fisico_id))
        print("anno ", anno)
        
        cadenaSQL = '''
        select jornada_teorica.centro_fisico_id cf_id,
               unit.codigo cf_cod,
	       unit.descripcion cf_desc, 
	       jornada_teorica.anno,
	       jornada_teorica.total_horas_anual,
	       jornada_teorica.observaciones
          from jornada_teorica join unit on unit.id = jornada_teorica.centro_fisico_id
                                    and unit.activo = 'S'
         where 1 = 1
      '''

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Orden y clausurado.
        clausura_0 = ' and jornada_teorica.centro_fisico_id = ? '
        clausura_1 = ' and jornada_teorica.anno = ? '
        orden = ' order by jornada_teorica.anno desc, unit.descripcion asc '
        
        # Reglas.
        if centro_fisico_id is not None and anno is not None:
            cadenaSQL += clausura_0 + clausura_1 + orden
            ret = conn.execute(cadenaSQL, centro_fisico_id, anno)
        elif centro_fisico_id is not None:
            cadenaSQL += clausura_0 + orden
            ret = conn.execute(cadenaSQL, centro_fisico_id)
        elif anno is not None:
            cadenaSQL += clausura_1 + orden
            ret = conn.execute(cadenaSQL, anno)
        else: 
            cadenaSQL += orden
            ret = conn.execute(cadenaSQL)

        # Se recuperan datos.
        ret = ret.fetchall()

        print cadenaSQL

        # Y se devuelven.
        return ret    
    
    def exists_catProf_en_contrato(self, categoria_profesional_id):
        '''Devuelve: True si la categoría profesional existe en un contrato
        y False en caso contrario.
        Tabla: contrato
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from contrato e
           where e.categoria_profesional_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, categoria_profesional_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True            
        
        # Estado devuelto.
        return ret              

    def exists_catProf_en_equipo(self, categoria_profesional_id):
        '''Devuelve: True si la categoría profesional existe en la relación
        de equipo con categoría profesional y False en caso contrario.
        Tabla: categoria_equipo
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from categoria_equipo e
           where e.categoria_profesional_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, categoria_profesional_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True            
        
        # Estado devuelto.
        return ret              
     
    def exists_catProf_equipo(self, cat_prof_id, eq_id):
        '''Devuelve: True si la relación <categoría profesional, equipo de 
        trabajo> existe y False en caso contrario
        Tabla: categoria_equipo
        '''
    
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from categoria_equipo e
           where e.categoria_profesional_id = ?
             and e.categoria_id = ?
        '''
    
        # Se crea objeto conexión.
        conn = self.__db.connection()
    
        ret = conn.execute(cadenaSQL, cat_prof_id, eq_id)
    
        # Se recuperan datos.
        ret = ret.fetchall()
    
        if len(ret) == 0: ret = False
        else: ret = True            
        
        # Estado devuelto.
        return ret              
          
    def exists_ausencia_en_contrato(self, ausencia_id):
        '''Devuelve: True si la ausencia existe en un contrato y False en caso 
        contrario.
        Tabla: contrato_ausencia
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from contrato_ausencia e
           where e.ausencia_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, ausencia_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True            
        
        # Estado devuelto.
        return ret                        
    
    def exists_cargo_en_contrato(self, cargo_id):
        '''Devuelve: True si el cargo existe en un contrato y False en caso 
        contrario.
        Tabla: contrato
        '''
  
        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from contrato e
           where e.cargo_id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, cargo_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True            
        
        # Estado devuelto.
        return ret                

    def exists_solapamiento_in_cobertura(self):
        '''Devuelve: True si existe solapamiento entre coberturas para un
        grupo funcional y False en caso contrario
        Tabla: cobertura_equipo
        '''

        # Se define consulta.
        cadenaSQL = '''
            select 1 
             where exists (select ce1.fecha_inicio a, 
                                  ce1.fecha_fin b, 
                                  ce2.fecha_inicio c, 
	                          ce2.fecha_fin d
                             from cobertura_equipo ce1 join cobertura_equipo ce2 on ce1.categoria_id = ce2.categoria_id
                            where ce1.id <> ce2.id  
                              and (a <= d and b >= c))
            '''

        # Se crea objeto conexión.
        conn = self.__db.connection()

        ret = conn.execute(cadenaSQL)

        # Se recuperan datos.
        ret = ret.fetchall()

        if len(ret) == 0: ret = False
        else: ret = True

        # Estado devuelto.
        return ret    
    
    def exists_sp_in_persona(self):
        '''Devuelve: True si el trabajador tiene servicios previos para el año
        y False en caso contrario.
        Tabla: servicios_previos
        '''
  
        # Se define consulta.
        cadenaSQL = '''
                select 1
                  from servicios_previos
              group by anno, persona_id
                having count(persona_id) > 1
                '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True            
        
        # Estado devuelto.
        return ret              
    
    def exists_asignacion_in_contrato(self, contrato_id):
        '''Devuelve: True si el contrato tiene asignaciones y False en caso
        contrario
        Tabla: contrato, tarea
        '''

        # Se define consulta.
        cadenaSQL = '''
          select 1 
            from contrato join tarea on contrato.id = tarea.contrato_id
           where contrato.id = ?
        '''
  
        # Se crea objeto conexión.
        conn = self.__db.connection()
  
        ret = conn.execute(cadenaSQL, contrato_id)
  
        # Se recuperan datos.
        ret = ret.fetchall()
  
        if len(ret) == 0: ret = False
        else: ret = True
  
        # Estado devuelto.
        return ret           
    
    def actualizar_contrato(self, campos, reg_nuevo, reg_eliminado):
        '''Actualización de contrato de persona
        Tabla: contrato
        Actualización a nivel de modificación de campos, inserción de 
        filas, eliminación de filas.'''

        # Operación de actualización de modificación de campos, inserción 
        # de filas y eliminación de filas. Todas las operaciones se harán 
        # bajo una misma transacción, haciendo commit si todo ha ido bien
        # y rollback si hubo algún fallo. O sale todo correcto o no se guardará
        # nada... así de simple.

        # Hago Rollback por si algo se quedó en el tintero...
        self.__db.rollback()
        
        ret = True
        msj = "Todo correcto"

        # Eliminación.
        for i in reg_eliminado: self.delete_contrato(i, False)

        # Inserción.
        for i in reg_nuevo: 
            self.insert_contrato(i['cargo_id'], i['fecha_inicio'], \
                                 i['fecha_fin'], i['cp_id'], \
                                 i['persona_id'], False)

        # Actualización.
        for i in campos:
            self.update_contrato(i['id'], i['field'], \
                                 i['valor_nuevo'], False)
           
        # Se comprueba si no hay solapamiento entre contratos para un mismo
        # trabajador.
        if self.exists_solapamiento_in_contrato():
            ret = False
            msj = u'Existe solapamiento de fechas entre contratos de trabajadores'
            self.__db.rollback()

        if ret:
            # Commit.
            try:
                self.__db.commit()
                ret = True
    
            except Exception as ex:
                # Se recoge mensaje de error y se envía.
                self.__db.rollback()
                msj = str(ex.__class__)
                ret = False
                print "MENSAJE DE ERROR ", msj
        
        # Se devuelve estado y mensaje.
        return ret, msj        
    
    def delete_contrato(self, _id, hacer_commit = True):
        '''Borrado de contrato
        Tabla: contrato
        '''

        # ALGG 05032017 Se eliminan primero las ausencias asociadas.
        entidad = self.__db.entity("contrato_ausencia")

        # Se crea objeto conexión.
        conn = self.__db.connection()

        # Instrucción.
        cadenaSQL = '''
        delete from contrato_ausencia 
         where contrato_id = ? 
        '''        

        # Ejecución.
        conn.execute(cadenaSQL, _id)
 
        # Se define entidad.
        entidad = self.__db.entity("contrato")
 
        # Buscamos la fila apropiada.
        ret = entidad.get(_id)        
 
        # Se elimina.
        self.__db.delete(ret)
        
        # Commit.
        if hacer_commit: self.__db.commit() 
        
    def insert_contrato(self, cargo_id, fecha_inicio, fecha_fin, \
                        categoria_profesional_id, persona_id, \
                        hacer_commit = True):
        '''Inserción de contrato
        Tabla: contrato
        '''

        # Se define entidad.
        entidad = self.__db.entity("contrato")

        # Si la fecha fin es nula, la ponemos como 31-12-2099.
        if fecha_fin is None: fecha_fin = self.fechaPython("2099-12-31")
        else: fecha_fin = self.fechaPython(fecha_fin)
        
        # Se inserta nuevo elemento.
        entidad.insert(cargo_id = cargo_id, \
                       fecha_inicio = self.fechaPython(fecha_inicio), \
                       fecha_fin = fecha_fin, \
                       categoria_profesional_id = categoria_profesional_id, \
                       persona_id = persona_id) 

        # ALGG 04-03-2017 Flush, para control de solapamiento.
        self.__db.flush()

        # Se hace commit.
        if hacer_commit: self.__db.commit()        
        
    def update_contrato(self, _id, campo, valor, hacer_commit = True):
        '''Actualización de campo
        Tabla: contrato
        '''
 
        # Se define entidad.
        entidad = self.__db.entity("contrato")
 
        # Buscamos la fila apropiada.
        ret = entidad.get(_id)
 
        # Actualizamos los campos que se consideren oportunos.
        if campo == "cargo_id": ret.cargo_id = valor
        if campo == "fecha_inicio": ret.fecha_inicio = self.fechaPython(valor)
        if campo == "fecha_fin": ret.fecha_fin = self.fechaPython(valor)
        if campo == "cp_id": ret.categoria_profesional_id = valor
        if campo == "persona_id": ret.persona_id = valor
                
        # ALGG 04-03-2017 Flush, para control de solapamiento.
        self.__db.flush()
        
        # Commit.
        if hacer_commit: self.__db.commit()
         
    def exists_solapamiento_in_contrato(self):
        '''Devuelve: True si existe solapamiento entre contratos para un
        trabajador y False en caso contrario
        Tabla: contrato
        '''

        # Se define consulta.
        cadenaSQL = '''
            select 1 
             where exists (select c1.fecha_inicio a, 
                                  c1.fecha_fin b, 
                                  c2.fecha_inicio c, 
	                          c2.fecha_fin d
                             from contrato c1 join contrato c2 on c1.persona_id = c2.persona_id
                            where c1.id <> c2.id  
                              and (a <= d and b >= c))
            '''

        # Se crea objeto conexión.
        conn = self.__db.connection()

        ret = conn.execute(cadenaSQL)

        # Se recuperan datos.
        ret = ret.fetchall()

        if len(ret) == 0: ret = False
        else: ret = True

        # Estado devuelto.
        return ret    
             
    def exists_ausencias_not_in_contrato(self):
        '''Devuelve: True si existen ausencias que se inician o terminan fuera
        de las fechas de un contrato, y False en caso contrario.
        Tabla: contrato
        '''
 
        # Se define consulta.
        cadenaSQL = '''
             select 1
               from contrato join contrato_ausencia on contrato_ausencia.contrato_id = contrato.id
              where not (contrato.fecha_inicio <= contrato_ausencia.fecha_inicio and  
                         contrato_ausencia.fecha_fin <= contrato.fecha_fin)
                        '''
        
        # Se crea objeto conexión.
        conn = self.__db.connection()
 
        ret = conn.execute(cadenaSQL)
        
        # Se recuperan datos.
        ret = ret.fetchall()
 
        if len(ret) == 0: ret = False
        else: ret = True
 
        # Estado devuelto.
        return ret                 
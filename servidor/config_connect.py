# -*- coding: utf-8 -*-
# ALGG 25-09-2016 Creación de fichero de configuración de app (config.db)
# en SQLite. Aquí es donde se guardan las cadenas de conexión de la app, según 
# el tipo de base de datos a la que se quiera acceder.

# Módulos 
import sqlite3

# Variables globales.
__FICH_CONF_APP__ = 'config_connect.db'
__SQL__ = 'select engine, url, schema, db, backend from conexion where activo = "S"'

class Config_app(object):
    '''Configuración de app'''
    
    def __init__(self, fich_conf):
        '''Constructor'''
        self.__fich_conf = fich_conf
        
    def get_info_connect(self, consultaSQL):
        '''Recupera información de conexión actual de la app.
        Devuelve:
        Es correcto: True, engine, url, schema, db
        Es incorrecto: False, None, None, None, None'''
        
        try:
            conn = sqlite3.connect(self.__fich_conf)
            c = conn.cursor()        
            c.execute(consultaSQL)
            engine, url, schema, db, backend = c.fetchone()
            c.close()
            ret = True
        except:
            ret = False
            engine = url = schema = db = None

        return ret, engine, url, schema, db, backend

def configApp():
    '''Función de configuración de app.
       Devuelve: <True, engine, url, schema, db> si es correcto o <False, None,
       None, None, None> si hubi error.
    '''
    
    a = Config_app(__FICH_CONF_APP__)
    ret, engine, url, schema, db, backend = a.get_info_connect(__SQL__)

    return ret, engine, url, schema, db, backend


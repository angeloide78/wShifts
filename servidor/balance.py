# -*- coding: utf-8 -*-

# ALGG 25-01-2017 Creación de módulo balance.

from w_model import w_turno
from calendar import monthrange
from pprint import pprint

class Balance(object):
    '''Clase Balance'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_horas(self, mes = None, anno = None, fecha_inicio = None, \
                    fecha_fin = None, persona_id = None, \
                    cf_id = None, sf_id = None, eq_id = None, p_id = None):
        '''Devuelve el total de horas entre un rango de fechas.
        Filtro: centro físico <cf_id>, servicio <sf_id>, equipo <eq_id>, 
        puesto <p_id>, ident. del trabajador <persona_id>'''
        
        # ALGG 10-06-2017 Si no hay mes, por defecto se coge el año entero.
        if mes is None: 
            mes_ini = 1
            mes_fin = 12
        else:
            mes_ini = mes_fin = mes
        
        if anno is not None:
            # ALGG 05-02-2017 Se crean fechas de búsqueda.
            fecha_inicio = "%s-%s-%s" % (anno,mes_ini,'1')
            fecha_fin = "%s-%s-%s" % (anno,mes_fin,monthrange(anno, mes_fin)[1])
            
        ret = self.__get_horas(fecha_inicio, fecha_fin, persona_id, cf_id, \
                               sf_id, eq_id, p_id)

        return ret
    
    def __get_horas(self, fecha_inicio, fecha_fin, persona_id = None, \
                    cf_id = None, sf_id = None, eq_id = None, p_id = None):
        '''Devuelve el total de horas entre un rango de fechas.
        Filtro: centro físico <cf_id>, servicio <sf_id>, equipo <eq_id>, 
        puesto <p_id>, ident. del trabajador <persona_id>'''
       
        # Se recuperan datos del balance
        ret = self.__conn.get_horas(fecha_inicio, fecha_fin, persona_id, \
                                    cf_id, sf_id, eq_id, p_id)
    
        # Diccionario principal. 
        data = {}
    
        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        
    
        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
            # Se forma diccionario.
            d.setdefault('horas', ret[i].horas)
            d.setdefault('mes', ret[i].mes)
            d.setdefault('anno', ret[i].anno)
            d.setdefault('cf', ret[i].cf)
            d.setdefault('sf', ret[i].sf)
            d.setdefault('eq', ret[i].eq)
            d.setdefault('p', ret[i].p)
            d.setdefault('trabajador', ret[i].trabajador)
            d.setdefault('balance', ret[i].balance)
            
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data      

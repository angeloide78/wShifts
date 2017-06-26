# -*- coding: utf-8 -*-

import requests
import webbrowser
from datetime import datetime
import hashlib
import os
from requests.auth import HTTPBasicAuth

# 23-10-2016 Módulo de Jasper Reports.

class jasperreports(object):
    '''Clase de configuración de informes para Jasper Reports'''
    
    def __init__(self, maquina, puerto, recurso):
        self.__maquina = maquina
        self.__puerto = puerto
        self.__recurso = recurso
        self.__session = requests.Session()
        self.__token = self.__generador_token()
        self.__usuario = None
        self.__passwd = None
        self.__cookie = None
        self.__url = None
        
    def __generador_token(self):
        '''Generador de token'''
        return hashlib.sha1(os.urandom(128)).hexdigest()
    
    def login(self, usuario, passwd):
        '''Clase login para acceso a JasperServer'''
        
        # Formación de URL para login.
        url = "http://%s:%s/jasperserver/rest/login" % (self.__maquina, \
                                                        self.__puerto)

        # Formación de cuerpo y cabecera.
        data = "j_username=%s&j_password=%s" % (usuario, passwd) 
        header = {"content-type" : "application/x-www-form-urlencoded"}
        
        # Se envían datos ed inicio de sesión.
        ret = self.__session.post(url, data, headers = header)
        
        # Se guarda cookie, usuario y contraseña.
        self.__cookie = ret.cookies['JSESSIONID']
        self.__usuario = usuario
        self.__passwd = passwd
        
        # Algo de información.
        print('Cookie.............: %s' % self.__cookie)
        print('Login response.....:')
        
    def report(self, ParentFolderUri, reportUnit, params = None):
        '''Método de lanzamiento de informe'''
        
        # Cabeceras.
        headers = {"Authorization": "Basic " + self.__token}           
               
        # Cookie.
        cookies = dict(cookies=self.__cookie)
        
        # Autenticación.
        auth = HTTPBasicAuth(self.__usuario, self.__passwd)        
        
        # Se crea la URL manualmente...
        url = "http://%s:%s/jasperserver/flow.html?_flowId=" % (self.__maquina, \
                                                                self.__puerto)
        url += "viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=" 
        url += "%s&reportUnit=%s&standAlone=true" % (ParentFolderUri, \
                                                     reportUnit)
        
        # ALGG 27-10-2016 Y se incluye usuario y contraseña en la url...
        url += "&j_username=%s&j_password=%s" % (self.__usuario, \
                                                 self.__passwd) 
        
        # Se lanza el get...
        ret = self.__session.get(url, auth = auth, cookies = cookies, headers = headers)
        
        # Damos algo de información.
        print('Report.............: %s' % ret.url)
        print('Report Response....: %s' % ret)
        
        try:
            webbrowser.open(ret.url)
        except:
            nomfich = 'temp_error_%s.html' % str(datetime.now())
            f = open('temp/%s' % nomfich,'w')
            f.write(ret.text)
            f.close()    
            webbrowser.open('temp/%s' % nomfich)
    
    def info(self):
        url = 'http://%s:%s/%s/rest_v2/serverInfo' % (self.__maquina, \
                                                  str(self.__puerto), \
                                                  self.__recurso)

        # Se realiza petición de información al servidor JasperServer... 
        ret = requests.get(url,headers={"accept":"application/json"}).json()
    
        # Se recupera información del servidor si todo ha ido bien...
        data = { 'dateFormatPattern' : ret['dateFormatPattern'],
                 'datetimeFormatPattern' : ret['datetimeFormatPattern'],
                 'version' : ret['version'],
                 'edition' : ret['edition'],
                 'build' : ret['edition']
                 }
    
        # Se devuelven datos.
        return data
           
    def logout(self):
        if self.__cookie is None: 
            print("Logout..........: No hay cookie")
        else:

            url = "http://%s:%s/jasperserver/logout.html" % (self.__maquina, \
                                                             self.__puerto)

            ret = self.__session.get(url, \
                                     headers = {'JSSESIONID' : self.__cookie})
        
            print('Logout response....: %s' % ret)        
        
  

 
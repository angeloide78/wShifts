# -*- coding: utf-8 -*-
# ALGG 25-09-2016 Diseño de servicios web con Flask. Uso se curl para simular
# peticiones de servicio.
# ALGG 14-10-2016 Diseño de api_usuario, api_recurso
# ALGG 15-10-2016 Diseño de api_rol
# ALGG 17-10-2016 Diseño de api_rol_usuario, api_rol_recurso
# ALGG 22-10-2016 Diseño de api_usuario_update
# ALGG 23-10-2016 Pruebas de integración de informes Jasper Reports por REST API
# ALGG 01-11-2016 Diseño de api para gestión de turnos.
# ALGG 06-11-2016 Diseño de api para gestión de calendarios de festividades.
# ALGG 03-01-2017 Diseño de api para gestión de contratos de personas.
# ALGG 05-02-2017 Diseño de api para balance horario del trabajador.


# ############################
# CURL INFORMES JASPER REPORTS
# ############################

# curl -H "accept: application/json" http://localhost:8080/jasperserver/rest_v2/serverInfo
# curl -H "Content-Type: application/json" -X GET http://127.0.0.1:5000/info_reports
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/reports/usuario
# curl -H "application/x-www-form-urlencoded" -X POST http://localhost:8080/jasperserver/rest/login? -d "j_username=jasperadmin&j_password=jasperadmin"
# curl -D- -u jasperadmin:jasperadmin -X GET http://localhost:8080/jasperserver/rest/resources
# curl -H "application/x-www-form-urlencoded" -X GET http://localhost:8080/jasperserver/rest/resources -d - -u "jasperadmin:jasperadmin"

# ###############
# CURL APLICACIÓN
# ###############

# ###########################
# curl http://127.0.0.1:5000/
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/login -d "{ \"usuario\":\"usu1\", \"passwd\":\"pusu1\"}"
# curl -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -X POST http://127.0.0.1:5000/login -d "usuario=usu1&passwd=pusu1"
# curl -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -X POST http://127.0.0.1:5000/login -d "usuario=usu1&passwd=pusu1"
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/usuario
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/recurso
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/rol
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/rol2
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/rol_usuario
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/rol_recurso
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/usuario_update -d "{ \"datos\":\"bloque_datos_json\"}"
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/turno
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/ciclo
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/cicloSemana -d "{ \"id_ciclo\":\"1\" }"
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/festivos
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/centro_fisico
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/buscar_persona
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/estructura -d "{ \"activo\":\"S\"}
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/puesto_ciclo
# curl -H "Content-Type: application/json" -X POST http://127.0.0.1:5000/planificacion/update -d "{ \"puesto_id\":\"7\"}
# ###########################

# Módulos.
from datetime import datetime 
# Módulos de extensión.
from flask import Flask, url_for, request, json, jsonify, Response
from flask_cors import CORS, cross_origin

# Módulos de app.
from config_connect import configApp
from jasperreports import jasperreports
from db_base import Db
from config_app import Basica
from seguridad import Login, Usuario, Recurso, Rol, RolUsuario, RolRecurso, \
     UsuarioEstructura
from turnos import Turno, Ciclo
from calendario import CalendarioFestivo
from estructura import Unit, Estructura
from rrhh import Persona, ContratoPersona, CategoriaProfesional, Cargo, \
     ContratoAusenciaPersona, ServiciosPrevios, Ausencia, CategoriaEquipo
from planificacion import PuestoCiclo, Planificacion, PlanificacionDiaria, \
     CoberturaEquipo, CoberturaServicio
from asignacion import Tarea, AsignarTrabajador, CambioTurno
from balance import Balance
from jornada_teorica import JornadaTeorica

# Variables global de conexión a base de datos.
__CONN__ = None 

# ALGG 22012017 URL del backend
__BACKEND__ = None

# Se instancia app de Flask.
app = Flask(__name__)

# 10102016 ALGG Se inicializa CORS.
CORS(app)

def response_(json_data):
    '''Función que incluye cabecera a la respuesta'''
    js = json.dumps(json_data)
    resp = Response(js, status=200, mimetype='application/json')
    resp.headers['Link'] = __BACKEND__
    # Devolvemos respuesta
    return resp


# #############################################################################
# DATOS BÁSICOS DE APLICACIÓN
# #############################################################################

@app.route('/', methods =['GET'])
def api_root():
    basica = Basica(__CONN__)
    data = basica.get_conf_aplic()
    print data
    ret = {'data' : u'%s - %s, versión %s, revisión %s' % (str(data[2]), \
                                                             str(data[3]), \
                                                             str(data[0]), \
                                                             str(data[1]))}
    return response_(ret)

@app.route('/basica', methods = ['POST'])
def api_basica():
    print("api_basica")
    if request.headers['Content-Type'] == 'application/json':
        # Datos básicos.
        basica = Basica(__CONN__)
        data = basica.get_basica()
        return response_(data)

@app.route('/basica/update', methods = ['POST'])
def api_basica_update():
    print("api_basica_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']        
        # Datos básicos.
        basica = Basica(__CONN__)
        data = basica.set_basica(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# LOGIN
# #############################################################################

@app.route('/login', methods = ['POST'])
def api_message_login():
    print("api_message_login")
    if request.headers['Content-Type'] == 'application/json':
        # Se recupera login/password.
        nick = request.json['usuario']
        passwd = request.json['passwd']
        # Validación.
        login = Login(__CONN__)
        existe, msj = login.existe_login(nick, passwd)
        # Formamos estructura JSON.
        print("Enviando: %s %s" % (str(existe), msj))
        ret = {'existe' : existe, 'msj' : msj}
        return response_(ret)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        ret = {'existe' : existe, 'msj' : msj}        
        return response_(ret)

# #############################################################################
# USUARIO
# #############################################################################

@app.route('/usuario', methods = ['POST'])
def api_usuario():
    print("api_usuario")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']        
        usuario_ = datos['usuario']
        es_activo = datos['activo']
        # Usuario.
        usuario = Usuario(__CONN__)
        data = usuario.get_usuario(usuario_, es_activo)
        #print("Devolviendo:")
        #print(data)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/usuario/update', methods = ['POST'])
def api_usuario_update():
    print("api_usuario_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']        
        # Se envían datos al objeto para su tratamiento.
        # Usuario.
        usuario = Usuario(__CONN__)
        data = usuario.set_usuario(datos)
        print("Devolviendo:")
        print(response_(data))
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# RECURSO
# #############################################################################

@app.route('/recurso', methods = ['POST'])
def api_recurso():
    print("api_recurso")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']           
        codigo = datos['codigo']
        activo = datos['activo']
        # Recurso.
        recurso = Recurso(__CONN__)
        data = recurso.get_recurso(codigo, activo)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/recurso/update', methods = ['POST'])
def api_recurso_update():
    print("api_recurso_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']        
        # Recurso.
        recurso = Recurso(__CONN__)
        data = recurso.set_recurso(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# ROL 
# #############################################################################

@app.route('/rol', methods = ['POST'])
def api_rol():
    print("api_rol")
    if request.headers['Content-Type'] == 'application/json':
        # Parámetros.
        datos = request.json['datos']        
        codigo_rol = datos['codigo']
        es_activo = datos['activo']
        # Rol.
        rol = Rol(__CONN__)
        data = rol.get_rol(codigo_rol, es_activo)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/rol/update', methods = ['POST'])
def api_rol_update():
    print("api_rol_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']             
        # Rol.
        rol = Rol(__CONN__)
        data = rol.set_rol(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# ROL - USUARIO
# #############################################################################
        
@app.route('/rol_usuario', methods = ['POST'])
def api_rol_usuario():
    print("api_rol_usuario")
    if request.headers['Content-Type'] == 'application/json':
        # Recurso.
        rolUsuario = RolUsuario(__CONN__)
        data = rolUsuario.get_rol_usuario()
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/rol_usuario/update', methods = ['POST'])
def api_rol_usuario_update():
    print("api_rol_usuario_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']             
        # Rol.
        rolUsuario = RolUsuario(__CONN__)
        data = rolUsuario.set_rol_usuario(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# ROL - RECURSO
# #############################################################################
        
@app.route('/rol_recurso', methods = ['POST'])
def api_rol_recurso():
    print("api_rol_recurso")
    if request.headers['Content-Type'] == 'application/json':
        # Rol - Recurso.
        rolRecurso = RolRecurso(__CONN__)
        data = rolRecurso.get_rol_recurso()
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/rol_recurso/update', methods = ['POST'])
def api_rol_recurso_update():
    print("api_rol_recurso_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']             
        # Rol - Recurso.
        rolRecurso = RolRecurso(__CONN__)
        data = rolRecurso.set_rol_recurso(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# USUARIO - ESTRUCTURA
# #############################################################################
        
@app.route('/usuario_estructura', methods = ['POST'])
def api_usuario_estructura():
    print("api_usuario_estructura")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']             
        usuario_id = datos['usuario_id'] 
        cf_id = datos['cf_id'] 
        sf_id = datos['sf_id']
        eq_id = datos['eq_id']
        activo = datos['activo']        
        # Usuario - Estructura.
        usuarioEstructura = UsuarioEstructura(__CONN__)
        data = usuarioEstructura.get_usuario_estructura(usuario_id, cf_id, \
                                                        sf_id, eq_id, activo)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/usuario_estructura/update', methods = ['POST'])
def api_usuario_estructura_update():
    print("api_usuario_estructura_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']             
        # Usuario - Estructura.
        usuarioEstructura = UsuarioEstructura(__CONN__)
        data = usuarioEstructura.set_usuario_estructura(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# REPORTING - JASPER SERVER
# #############################################################################

@app.route('/info_reports', methods = ['GET'])
def info_reports():
    print("api_info_reports")
    if request.headers['Content-Type'] == 'application/json':
        jr = jasperreports("localhost", 8080, "jasperserver")
        data = {'data' : jr.info()}
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/reports/usuario', methods = ['POST'])
def reports_usuario():
    print("api_reports_usuario")
    if request.headers['Content-Type'] == 'application/json':
        jr = jasperreports("localhost", 8080, "jasperserver")
        jr.login('jasperadmin', 'jasperadmin')
        jr.report('/wshifts/Corporativo', '/wshifts/Corporativo/usuario')
        jr.logout()
        data = {'data' : {}}
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# TURNOS
# #############################################################################

@app.route('/turno', methods = ['POST'])
def api_turno():
    print("api_turno")
    if request.headers['Content-Type'] == 'application/json':
        datos = request.json['datos']    
        codigo = datos['codigo']
        activo = datos['activo']
        solo_libres = datos['solo_libres']
        # Turno.
        turno = Turno(__CONN__)
        data = turno.get_turno(codigo, activo, solo_libres)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/turno/update', methods = ['POST'])
def api_turno_update():
    print("api_turno_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Turno.
        turno = Turno(__CONN__)
        data = turno.set_turno(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# CICLOS
# #############################################################################

@app.route('/ciclo', methods = ['POST'])
def api_ciclo():
    print("api_ciclo")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']    
        # Ciclo.
        ciclo = Ciclo(__CONN__)
        if datos is None: data = ciclo.get_ciclo()
        else:
            id_ciclo = datos['id_ciclo']
            es_activo = datos['es_activo']
            semana = datos['semana']
            data = ciclo.get_ciclo(id_ciclo = id_ciclo, es_activo = es_activo, \
                                   semana = semana)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/ciclo/update', methods = ['POST'])
def api_ciclo_update():
    print("api_ciclo_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Ciclo.
        ciclo = Ciclo(__CONN__)
        data = ciclo.set_ciclo(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# CICLOS POR SEMANA
# #############################################################################

@app.route('/cicloSemana', methods = ['POST'])
def api_ciclo_semana():
    print("api_ciclo_semana")
    if request.headers['Content-Type'] == 'application/json':
        # Se recupera identificador de ciclo.
        id_ciclo = request.json['id_ciclo']
        print("Petición de ciclo %s" % str(id_ciclo))
        # Ciclo semanal.
        ciclo = Ciclo(__CONN__)
        data = ciclo.get_ciclo(id_ciclo = id_ciclo, semana = True)
        print ("Respondiendo" + str(data))
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# CALENDARIO DE FESTIVOS
# #############################################################################

@app.route('/festivos', methods = ['POST'])
def api_festivos():
    print("api_festivos")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        anno = datos['anno']
        cf_id = datos['cf_id']
        # Calendario de festividades.
        calendario_festivos = CalendarioFestivo(__CONN__)
        data = calendario_festivos.get_calendario_festivo(cf_id, anno)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/festivos/update', methods = ['POST'])
def api_festivos_update():
    print("api_festivos_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Calendario de festividades.
        calendario_festivos = CalendarioFestivo(__CONN__)
        data = calendario_festivos.set_calendario_festivo(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# CENTROS FÍSICOS
# #############################################################################

@app.route('/centro_fisico', methods = ['POST'])
def api_centro_fisico():
    print("api_centro_fisico")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        centro_fisico_id = datos['id']
        activo = datos['activo']
        # Centros físicos
        cf = Unit(__CONN__)
        data = cf.get_centro_fisico(id_=centro_fisico_id, es_activo=activo)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/centro_fisico/update', methods = ['POST'])
def api_centro_fisico_update():
    print("api_centro_fisico_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        # Centros físicos
        cf = Unit(__CONN__)
        data = cf.set_unit(datos, opcion = 'centro_fisico')
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# SERVICIOS
# #############################################################################

@app.route('/servicio', methods = ['POST'])
def api_servicio():
    print("api_servicio")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        servicio_id = datos['id']
        codigo = datos['codigo']
        activo = datos['activo']
        cf_id = datos['cf_id']
        asig_pend = True if datos['asig_pend'] == 'S' else False
        # Servicios
        sf = Unit(__CONN__)
        data = sf.get_servicio(id_=servicio_id, codigo = codigo, \
                               es_activo=activo, cf_id = cf_id, \
                               asig_pend = asig_pend)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/servicio/update', methods = ['POST'])
def api_servicio_update():
    print("api_servicio_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        # Servicios
        sf = Unit(__CONN__)
        data = sf.set_unit(datos, opcion = 'servicio')
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# EQUIPOS
# #############################################################################

@app.route('/equipo', methods = ['POST'])
def api_equipo():
    print("api_equipo")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        equipo_id = datos['id']
        activo = datos['activo']
        codigo = datos['codigo']
        sf_id = datos['sf_id']
        asig_pend = True if datos['asig_pend'] == 'S' else False
        # Equipos
        eq = Unit(__CONN__)
        data = eq.get_equipo(id_ = equipo_id, codigo = codigo, \
                             es_activo=activo, sf_id = sf_id, \
                             asig_pend = asig_pend)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/equipo/update', methods = ['POST'])
def api_equipo_update():
    print("api_equipo_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        # Equipos
        eq = Unit(__CONN__)
        data = eq.set_unit(datos, opcion = 'equipo')
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# PUESTOS
# #############################################################################

@app.route('/puesto', methods = ['POST'])
def api_puesto():
    print("api_puesto")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        puesto_id = datos['id']
        activo = datos['activo']
        codigo = datos['codigo']
        eq_id = datos['eq_id']
        asig_pend = True if datos['asig_pend'] == 'S' else False
        # Puestos
        p = Unit(__CONN__)
        data = p.get_puesto(id_ = puesto_id, codigo = codigo, \
                            es_activo = activo, eq_id = eq_id, \
                            asig_pend = asig_pend)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/puesto/update', methods = ['POST'])
def api_puesto_update():
    print("api_puesto_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        # Puestos
        p = Unit(__CONN__)
        data = p.set_unit(datos, opcion = 'puesto')
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# BUSCAR PERSONA
# #############################################################################

@app.route('/buscar_persona', methods = ['POST'])
def api_buscar_persona():
    print("api_buscar_persona")
    if request.headers['Content-Type'] == 'application/json':
        # Personas.
        persona = Persona(__CONN__)
        data = persona.get_persona(busqueda=True)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# PERSONA (TRABAJADOR)
# #############################################################################

@app.route('/persona', methods = ['POST'])
def api_persona():
    print("api_persona")
    if request.headers['Content-Type'] == 'application/json':
        # Personas.
        datos = request.json['datos']
        id_ = datos['id']
        persona = Persona(__CONN__)
        data = persona.get_persona(id_ = id_, busqueda=False)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/persona/update', methods = ['POST'])
def api_persona_update():
    print("api_persona_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Persona.
        persona = Persona(__CONN__)
        data = persona.set_persona(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 
    
# #############################################################################
# ESTRUCTURA 
# #############################################################################

@app.route('/estructura', methods = ['POST'])
def api_estructura():
    print("api_estructura")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']           
        activo = datos['activo']
        # ALGG 01032017  Parametrización de la recuperación de combos cuando 
        # se quieren incluir servicios, grupos y puestos que están pendientes 
        # de asignar.
        # try: pend_asig = True if datos['pend_asig'] == 'S' else False
        # except: pend_asig = False
        # Estructura (tupla).
        estructura = Estructura(__CONN__)
        data = estructura.get_estructura(activo = activo) #, pend_asig = pend_asig)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
@app.route('/estructura/update', methods = ['POST'])
def api_estructura_update():
    print("api_estructura_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']           
        # Estructura.
        estructura = Estructura(__CONN__)
        data = estructura.set_estructura(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# PUESTO - CICLO (ASIGNACIÓN DE CICLOS A PUESTOS)
# #############################################################################

@app.route('/puesto_ciclo', methods = ['POST'])
def api_puesto_ciclo():
    print("api_puesto_ciclo")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']        
        puesto_id = datos['puesto_id']        
        # Puesto - Ciclo.
        puestoCiclo = PuestoCiclo(__CONN__)
        data = puestoCiclo.get_puesto_ciclo(puesto_id)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/puesto_ciclo/update', methods = ['POST'])
def api_puesto_ciclo_update():
    print("api_puesto_ciclo_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']           
        # Puesto - Ciclo.
        puestoCiclo = PuestoCiclo(__CONN__)
        data = puestoCiclo.set_puesto_ciclo(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# PLANIFICACIÓN
# #############################################################################

@app.route('/planificacion', methods = ['POST'])
def api_planificacion():
    print("api_planificacion")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']        
        print(datos)
        anno = datos['anno']
        mes = datos['mes']
        equipo_id = datos['equipo_id']
        ver = datos['ver']
        # Planificacion.
        planificacion = Planificacion(__CONN__)
        data = planificacion.get_planificacion(anno, mes, \
                                               equipo_id = equipo_id, \
                                               visualizacion = ver)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
@app.route('/planificacion/update', methods = ['POST'])
def api_planificacion_update():
    print("api_planificacion_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']        
        puesto_id = datos['puesto_id']
        ciclo_id = datos['ciclo_id']
        fecha_inicio = datos['fecha_inicio']
        fecha_fin = datos['fecha_fin']
        turno_libre_id = datos['turno_libre_id']
        semana = datos['semana']
        # Planificacion.
        planificacion = Planificacion(__CONN__)
        data = planificacion.crear_planificacion(puesto_id, ciclo_id, \
                                                 fecha_inicio, fecha_fin, \
                                                 turno_libre_id, semana)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# CONTRATOS PERSONA
# #############################################################################

@app.route('/contrato', methods = ['POST'])
def api_contrato():
    print("api_contrato")
    if request.headers['Content-Type'] == 'application/json':
        # Contratos de personas.
        datos = request.json['datos']
        persona_id = datos['persona_id']
        contratoPersona = ContratoPersona(__CONN__)
        data = contratoPersona.get_contrato(persona_id)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/contrato/update', methods = ['POST'])
def api_contrato_update():
    print("api_contrato_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Persona.
        persona = ContratoPersona(__CONN__)
        data = persona.set_contrato(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 

# #############################################################################
# CATEGORÍA PROFESIONAL
# #############################################################################

@app.route('/categoria_profesional', methods = ['POST'])
def api_categoria_profesional():
    print("api_categoria_profesional")
    if request.headers['Content-Type'] == 'application/json':
        # Categorías profesionales.
        datos = request.json['datos']
        cp_id = datos['id_']
        activo = datos['activo']
        cp = CategoriaProfesional(__CONN__)
        data = cp.get_cp(cp_id, activo)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/categoria_profesional/update', methods = ['POST'])
def api_categoria_profesional_update():
    print("api_categoria_profesional_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Cat. Prof.
        cp = CategoriaProfesional(__CONN__)
        data = cp.set_cp(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 

# #############################################################################
# CARGO
# #############################################################################

@app.route('/cargo', methods = ['POST'])
def api_cargo():
    print("api_cargo")
    if request.headers['Content-Type'] == 'application/json':
        # Cargo.
        datos = request.json['datos']
        cargo_id = datos['id_']
        activo = datos['activo']
        cargo = Cargo(__CONN__)
        data = cargo.get_cargo(cargo_id, activo)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/cargo/update', methods = ['POST'])
def api_cargo_update():
    print("api_cargo_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Cargo
        cargo = Cargo(__CONN__)
        data = cargo.set_cargo(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 
    
# #############################################################################
# AUSENCIAS EN CONTRATOS
# #############################################################################

@app.route('/contrato_ausencia', methods = ['POST'])
def api_contrato_ausencia():
    print("api_contrato_ausencia")
    if request.headers['Content-Type'] == 'application/json':
        # Cargo.
        datos = request.json['datos']
        contrato_id = datos['contrato_id']
        activo = datos['activo']
        ausencia = ContratoAusenciaPersona(__CONN__)
        data = ausencia.get_contrato_ausencia(contrato_id, activo)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/contrato_ausencia/update', methods = ['POST'])
def api_contrato_ausencia_update():
    print("api_contrato_ausencia_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Ausencias en contrato.
        ausencia = ContratoAusenciaPersona(__CONN__)
        data = ausencia.set_contrato_ausencia(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 

# #############################################################################
# AUSENCIAS
# #############################################################################

@app.route('/ausencia', methods = ['POST'])
def api_ausencia():
    print("api_ausencia")
    if request.headers['Content-Type'] == 'application/json':
        # Ausencia.
        datos = request.json['datos']
        id_ = datos['id']
        codigo = datos['codigo']
        activo = datos['activo']
        ausencia = Ausencia(__CONN__)
        data = ausencia.get_ausencia(id_, codigo, activo)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/ausencia/update', methods = ['POST'])
def api_ausencia_update():
    print("api_ausencia_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Ausencia.
        ausencia = Ausencia(__CONN__)
        data = ausencia.set_ausencia(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 
    
# #############################################################################
# SERVICIOS PREVIOS
# #############################################################################

@app.route('/servicios_previos', methods = ['POST'])
def api_servicios_previos():
    print("api_servicios_previos")
    if request.headers['Content-Type'] == 'application/json':
        # Servicios Previos.
        datos = request.json['datos']
        persona_id = datos['persona_id']
        anno = datos['anno']
        sp = ServiciosPrevios(__CONN__)
        data = sp.get_sp(persona_id, anno)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/servicios_previos/update', methods = ['POST'])
def api_servicios_previos_update():
    print("api_servicios_previos_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Serv. Prev.
        sp = ServiciosPrevios(__CONN__)
        data = sp.set_sp(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 

# #############################################################################
# CATEGORÍAS PROFESIONALES EN EQUIPOS DE TRABAJO
# #############################################################################

@app.route('/categoria_equipo', methods = ['POST'])
def api_categoria_equipo():
    print("api_categoria_equipo")
    if request.headers['Content-Type'] == 'application/json':
        # Categoría en equipos.
        datos = request.json['datos']
        eq_id = datos['eq_id']
        cat_id = datos['cat_id']
        cat_eq = CategoriaEquipo(__CONN__)
        data = cat_eq.get_catEq(eq_id, cat_id)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/categoria_equipo/update', methods = ['POST'])
def api_categoria_equipo_update():
    print("api_categoria_equipo_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Cat. en equipos.
        cat_eq = CategoriaEquipo(__CONN__)
        data = cat_eq.set_catEq(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 
    
# #############################################################################
# PLANILLA
# #############################################################################

@app.route('/planificacion_diaria', methods = ['POST'])
def api_planificacion_diaria():
    print("api_planificacion_diaria")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']        
        print(datos)
        anno = datos['anno']
        mes = datos['mes']
        equipo_id = datos['equipo_id']
        # Planificacion diaria.
        planilla = PlanificacionDiaria(__CONN__)
        data = planilla.get_planificacion_diaria(anno, mes, \
                                                 equipo_id = equipo_id)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
    
# #############################################################################
# TAREAS (ASIGNACIONES)
# #############################################################################

@app.route('/tarea', methods = ['POST'])
def api_tarea():
    print("api_tarea")
    if request.headers['Content-Type'] == 'application/json':
        # Tareas.
        datos = request.json['datos']
        eq_id = datos['equipo_id']
        anno = datos['anno']
        tarea = Tarea(__CONN__)
        data = tarea.get_tarea(eq_id, anno)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/tarea/update', methods = ['POST'])
def api_tarea_update():
    print("api_tarea_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Tarea.
        tarea = Tarea(__CONN__)
        data = tarea.set_tarea(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 
    
# #############################################################################
# BUSCAR ASIGNACIONES TRABAJADOR
# #############################################################################

@app.route('/buscar_trabajadores_asignar', methods = ['POST'])
def api_buscar_trabajadores_asignar():
    print("api_buscar_tarea_trabajador")
    if request.headers['Content-Type'] == 'application/json':
        datos = request.json['datos']
        eq_id = datos['equipo_id']
        fecha = datos['fecha']        
        # Asignaciones.
        trab = AsignarTrabajador(__CONN__)
        data = trab.get_asignar_trabajador(eq_id, fecha)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# CAMBIO DE TURNO
# #############################################################################

@app.route('/cambio_turno/update', methods = ['POST'])
def api_cambio_turno_update():
    print("api_cambio_turno_update")
    if request.headers['Content-Type'] == 'application/json':
        datos = request.json['datos']
        # Asignaciones.
        cambio_turno = CambioTurno(__CONN__)
        data = cambio_turno.set_cambio_turno(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# COBERTURAS DE EQUIPO
# #############################################################################

@app.route('/cobertura_equipo', methods = ['POST'])
def api_cobertura_equipo():
    print("api_cobertura_equipo")
    if request.headers['Content-Type'] == 'application/json':
        # Cobertura.
        datos = request.json['datos']
        cobertura = CoberturaEquipo(__CONN__)
        data = cobertura.get_cobertura_equipo()
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})
        
@app.route('/cobertura_equipo/update', methods = ['POST'])
def api_cobertura_equipo_update():
    print("api_cobertura_equipo_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']          
        # Cobertura.
        cobertura = CoberturaEquipo(__CONN__)
        data = cobertura.set_cobertura_equipo(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({}) 
    
# #############################################################################
# COBERTURAS DE SERVICIO
# #############################################################################

@app.route('/cobertura_servicio', methods = ['POST'])
def api_cobertura_servicio():
    print("api_cobertura_servicio")
    if request.headers['Content-Type'] == 'application/json':
        # Cobertura de servicio.
        datos = request.json['datos']
        equipo_id = datos['equipo_id']
        mes = datos['mes']
        anno = datos['anno']
        cobertura = CoberturaServicio(__CONN__)
        data = cobertura.get_coberturaServicio(equipo_id, mes, anno)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# BALANCE HORARIO
# #############################################################################

@app.route('/balance', methods = ['POST'])
def api_balance():
    print("api_balance")
    if request.headers['Content-Type'] == 'application/json':
        # Balance horario.
        datos = request.json['datos']
        persona_id = datos['persona_id']
        mes = datos['mes']
        anno = datos['anno']
        # ALGG 10-06-2017. Se incluyen los demás parámetros de la llamada.
        fecha_inicio =  datos['fecha_inicio']
        fecha_fin =  datos['fecha_fin']
        cf_id =  datos['cf_id']
        sf_id =  datos['sf_id']
        eq_id =  datos['eq_id']
        p_id =  datos['p_id']        
        balance = Balance(__CONN__)
        data = balance.get_horas(mes, anno, fecha_inicio, fecha_fin, \
                                 persona_id, cf_id, sf_id, eq_id, p_id)
        # print("enviando balance")
        # print(data)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# JORNADA TEÓRICA
# #############################################################################

@app.route('/jornada_teorica', methods = ['POST'])
def api_jornada_teorica():
    print("api_jornada_teorica")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        cf_id = datos['cf_id']
        anno = datos['anno']
        # Jornada teórica
        jt = JornadaTeorica(__CONN__)
        data = jt.get_jt(cf_id, anno) 
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

@app.route('/jornada_teorica/update', methods = ['POST'])
def api_jornada_teorica_update():
    print("api_jornada_teorica_update")
    if request.headers['Content-Type'] == 'application/json':
        # Se recuperan datos.
        datos = request.json['datos']
        # Jornada teórica
        jt = JornadaTeorica(__CONN__)
        data = jt.set_jt(datos)
        return response_(data)
    else:
        msj = "[ERROR] Se esperaba formato json"
        print (msj)
        return response_({})

# #############################################################################
# FUNCIÓN PRINCIPAL DE ENTRADA - FLASK APPLICATION
# #############################################################################

def info():
    return '''
    
    ###########################################################################
    ###########################################################################
        
                                 w S h i f t s  
        
                G e s t o r  d e  T u r n o s  d e  T r a b a j o

    ###########################################################################
    ###########################################################################
        
    '''

def comprobar_usuario_bd():
    '''Se comprueba si existe usuario en base de datos. Por defecto si no 
    hay usuarios, se crea usuario admin, con contraseña admin'''

    ret = True
    
    usuario = Usuario(__CONN__)
    data = usuario.get_usuario(es_activo = 'S')
    if len(data['data']) == 0:
        print(u"No se han encontrado usuarios activos en el sistema.")
        
        datos = {'celdas_a_modificar' : [], \
                 'filas_a_eliminar' : [], \
                 'filas_a_insertar' : [{'nick' : 'admin', \
                                       'passwd' : 'admin', \
                                       'fecha_alta' : datetime.today(), \
                                       'intentos' : 5, \
                                       'activo' : 'S'}]}
        
        ret = usuario.set_usuario(datos)
        if ret['data'][0]['estado']:
            print(u'Se ha creado usuario "admin" con contraseña "admin".')
        else:
            print(u'Error al crear usuario "admin". ¡No se puede inicializar!')
            ret = False
 
    # Se devuelve estado.
    return ret   
    
if __name__ == '__main__':
    # Carga de datos de configuración de app.
    seguir, engine, url, schema, db, __BACKEND__ = configApp()
    if not seguir:
        print("No se han podido cargar datos de configuración de wShifts.")
        print("No se puede levantar servicio.")
    else:
        
        cadena = '''Datos conexión:
        Motor: %s
        URL base de datos: %s
        Schema: %s
        Base de datos: %s
        URL Servidor: %s
        ''' % (engine, url, schema, db, __BACKEND__)

        # Conexión con base de datos.
        __CONN__ = Db(engine, url, schema, db)

        if __CONN__.connect(): 
            # Logo e información.
            print(info())
            print(cadena)
            # Se comprueba si hay usuarios activos.
            if comprobar_usuario_bd():
                # Se ejecuta servidor para servicio web.
                app.run()
        else:
            print("No se ha podido conectar a la base de datos.")
            print("No se puede levantar servicio.") 
            
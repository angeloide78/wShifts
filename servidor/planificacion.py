# -*- coding: utf-8 -*

# ALGG 07-12-2016 Creación de módulo planificación. 
# ALGG 11-12-2016 Creación de clase Planificacion.

from datetime import datetime, date
from calendar import monthrange
from w_model import w_calendar, w_turno, w_ciclo, w_planificacion, w_puesto
from pprint import pprint

class PuestoCiclo(object):
    
    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn        
  
    def get_puesto_ciclo(self, puesto_id = None):
        '''Devuelve: (ciclo_id, ciclo_desc, cf_id, cf_desc, sf_id, sf_desc, 
        eq_id, eq_desc, p_id, p_desc, observ, finicio, ffin, semana turno_libre_id)
        Tabla: puesto_ciclo (asignación de ciclos a puestos)
        '''
        
        ret = self.__conn.get_puesto_ciclo(puesto_id = puesto_id)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        
        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
    
            # Se forma cadena de información compacta.
            cadena = '%s - %s - %s - %s' % (ret[i].cf_desc, ret[i].sf_desc, \
                                            ret[i].eq_desc, ret[i].p_desc)    

            # Se forma diccionario.
            d.setdefault('id', ret[i].id)
            d.setdefault('ciclo_id', ret[i].ciclo_id)
            d.setdefault('ciclo_desc', ret[i].ciclo_desc)
            d.setdefault('p_id', ret[i].p_id)
            d.setdefault('p_desc', cadena)
            d.setdefault('finicio', ret[i].finicio)
            d.setdefault('ffin', ret[i].ffin)
            d.setdefault('semana', ret[i].semana)
            d.setdefault('observ', ret[i].observ)
            d.setdefault('libre_id', None)            
            
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_puesto_ciclo(self, datos):
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
           
        # ALGG 10012017 Se recupera puesto y fecha de inicio para cada fila que
        # va a ser eliminada, con el propósito de borrar las planificaciones 
        # asociadas, si procede.
        
        aux_eliminar = []
        for i in filas_a_eliminar:
            aux = self.__conn.get_puesto_ciclo(id_ = i)
            if len(aux) !=0:
                aux_fini = aux[0][12]
                aux_puesto_id = aux[0][9] 
                aux_eliminar.append((aux_fini, aux_puesto_id))
            else:
                ret = False
                msj = u'No se ha podido recuperar la planificación a eliminar'
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
            
            # En este caso hay que controlar que las filas a insertar no hayan 
            # sido eliminadas.
            
            aux = []
            
            for i in filas_a_insertar:
                if i['id'] in filas_a_eliminar: continue
                aux.append(i)
            
            # ALGG 11012017 Comprobación de datos básicos para realizar la 
            # planificación.
            for i in filas_a_insertar:
                if i['libre_id'] is None:
                    ret = False
                    msj = u'Se tiene que elegir un Turno Libre'
                    break
                
        # ##############
        # ENVÍO DE DATOS
        # ##############
        
        if ret:
            ret, msj = self.__conn.actualizar_puesto_ciclo(celdas, \
                                                           filas_a_insertar, \
                                                           filas_a_eliminar, \
                                                           aux_eliminar)
           
        if ret: 
            # ALGG 08012017 Creación de planificación si se cambió algo en los
            # parámetros de configuración: fechas, semana, ciclo o si se creó
            # una nueva relación puesto-ciclo.
                        
            # #############################
            # MODIFICACIÓN DE PLANIFICACIÓN
            # #############################
            
            # ALGG 18032017 No se permite modificar asociaciones ya que 
            # no se sabe cuando se modifica una celda a qué planificación está
            # afectando. Así que si se quiere modificar una asociación, se 
            # elimina y se crea otra con la asociación correcta. 
                        
            # ##########################
            # INSERCIÓN DE PLANIFICACIÓN
            # ##########################
            
            p = Planificacion(self.__conn)
            
            for i in filas_a_insertar:
                ciclo_id = i['ciclo_id']
                puesto_id = i['p_id']
                aux = i['finicio'].split('-')
                fecha_inicio = (int(aux[0]), int(aux[1]), int(aux[2]))
                aux = i['ffin'].split('-')
                fecha_fin = (int(aux[0]), int(aux[1]), int(aux[2]))
                if i['semana'] is None: semana = 1
                else: semana = i['semana']
                turno_libre_id = i['libre_id']  
                
                #puesto_id = 7 
                #ciclo_id = 1
                #fecha_inicio = (2016, 1, 20)
                #fecha_fin = (2016, 2, 7)
                #turno_libre_id = 7 
                #semana=1     
                
                ret, msj = p.set_planificacion(puesto_id, ciclo_id, \
                                               fecha_inicio, fecha_fin, \
                                               turno_libre_id, semana)
            
                if not ret: 
                    print msj
                    break

        # Devolvemos estado.
        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}
        return ret
    
class Planificacion(object):
    
    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn        
        
    def __montar_pk(self, mes, anno, puesto_id, fecha_inicio):
        '''Monta clave primaria de planificación'''
        
        return str(mes) + str(anno) + str(puesto_id) + \
               str(fecha_inicio).replace('-','')

    def __get_ciclo(self, ciclo_id):
        '''Devuelve los turnos del ciclo'''
        
        # Se recupera el ciclo que se quiere planificar, recuperando si el ciclo
        # cuenta o no festivo, y los códigos de los turnos, que serán los que
        # se planifiquen.        
       
        ret = self.__conn.get_ciclo(id_ = ciclo_id, activo = 'S')
    
        ciclo_id = ret[0][0]
        ciclo_cod = ret[0][1]
        ciclo_desc = ret[0][2]
        cuenta_festivo = ret[0][3]
        turnos = []
        texto = ""
        for i in ret:
            turnos.append(i[6])
            texto += '%s ' % i[6]
    
        # Info.
        print("Ciclo id=%s (%s) %s" % (ciclo_id, ciclo_cod, ciclo_desc))
        print("\t+Cuenta Festivo: %s" % cuenta_festivo)
        print("\t+Turnos: %s" % texto.strip())        

        # Se crea el objeto turno, que contendrá todos los turnos que compone
        # el ciclo.
        t = w_turno()
    
        # Se recuperan los turnos que componen el ciclo.
    
        for i in turnos:
    
            ret = self.__conn.get_turno(codigo = i, activo = 'S')
    
            horarios = []
            for j in ret:
                id_ = j[0]
                codigo = j[1]
                descripcion = j[2]
                cuenta_horas = j[3]
                activo = j[4]
                horarios.append([{'id' : j[5]},
                                 {'dia_inicial' : j[6]}, 
                                 {'dia_final' : j[7]}, 
                                 {'hora_inicio': j[8]}, 
                                 {'hora_fin' : j[9]}])
    
            # Se crea el turno.
            ret, msj = t.newTurno(codigo, descripcion, horarios, \
                                  cuenta_horas, activo = 'S', \
                                  chequearRepeticionCodigo = False)            
            if not ret:
                print(u"[ERROR TURNO] %s" % msj)
                return False, msj
    
        # Se comprueba que no haya solapamiento entre turnos.
        ret, msj = t.existeSolapamientoTurnos(turnos)
        if ret: 
            print("[ERROR TURNO] %s" % msj)
            return False, msj
    
        # Se forma la lista de turnos que conforman el ciclo.
        lista_turnos = t.getTurnos(turnos)

        # Info.
        print(u"Configuración de los turnos que componen el ciclo:")
        pprint(lista_turnos)
        
        # Se crea ciclo a partir de los turnos.
        ciclo = w_ciclo()
        ciclo.newCiclo(ciclo_cod, ciclo_desc, cuenta_festivo, lista_turnos)

        # Devuelve el ciclo.
        return True, ciclo
    
    def __get_libre(self, turno_libre_id):
        '''Devuelve turno libre'''
        
        # Configuración de turno que se usará como libre.
        turno_libre = self.__conn.get_turno(activo = 'S', \
                                            id_m = turno_libre_id, \
                                            solo_libres = True)
        if len(turno_libre) == 0:
            msj = u"No se ha encontrado un turno que no cuente horas en el sistema"
            print("[ERROR TURNO] %s" % msj)
            return False, msj

        return True, turno_libre
    
    def set_planificacion(self, puesto_id, ciclo_id, \
                            fecha_inicio, fecha_fin, turno_libre_id, \
                            semana = 1):
        '''Crea una planificación'''
        
        # Lista de particiones.
        particiones = []
        
        # Se recupera el centro físico del que cuelga el puesto.
        ret = self.__conn.get_estructura(puesto_id = puesto_id, activo = 'S')
        
        cf_id = int(ret[0][0])
        cf_cod = ret[0][1]
        cf_desc = ret[0][2]
        sf_id = ret[0][3]
        sf_cod = ret[0][4]
        sf_desc = ret[0][5]
        eq_id = ret[0][6]
        eq_cod = ret[0][7]
        eq_desc = ret[0][8]
        p_id = ret[0][9]
        p_cod = ret[0][10]
        p_desc = ret[0][11]
        
        # info.
        print("Centro físico id=%s (%s) %s" % (cf_id, cf_cod, cf_desc))
        print("\t|--> Servicio id=%s (%s) %s" % (sf_id, sf_cod, sf_desc))
        print("\t\t|--> Equipo id=%s (%s) %s" % (eq_id, eq_cod, eq_desc))
        print("\t\t\t|--> Puesto id=%s (%s) %s" % (p_id, p_cod, p_desc))
        
        # Se recupera el ciclo que se quiere planificar.
        
        ret, ciclo = self.__get_ciclo(ciclo_id)
        
        # Si ha habido algún tipo de error en la creación de los ciclos con
        # los turnos, salimos.
        if not ret: return ret, ciclo
        
        anno = int(fecha_inicio[0])
        
        # Info de búsqueda de festivos.
        print("Buscando para CF %d los festivos para el año %d" % (cf_id, anno))

        # Se recuperan los festivos por año y centro físico.
        cal_festivo = self.__conn.get_calendario_festivo(cf_id, anno)
        
        # Se obtienen únicamente las fechas de lo devuelto en las festividades.
        aux = []
        for i in cal_festivo: 
            y, m, d = i[4].split('-')
            aux.append((int(y),int(m),int(d)))
        cal_festivo = aux
        
        # Info.        
        print("Festivos del centro físico %s para %s:" % (cf_desc, str(anno)))
        pprint(cal_festivo)
        
        # Se recuperan de los datos básicos la configuración de días festivos
        # semanales.

        ret = self.__conn.get_basica()
        es_lunes_festivo = ret[0].es_lunes_festivo
        es_martes_festivo = ret[0].es_martes_festivo
        es_miercoles_festivo = ret[0].es_miercoles_festivo
        es_jueves_festivo = ret[0].es_jueves_festivo
        es_viernes_festivo = ret[0].es_viernes_festivo
        es_sabado_festivo = ret[0].es_sabado_festivo
        es_domingo_festivo = ret[0].es_domingo_festivo        
        
        # Info.
        print(u"Datos de configuración de festividades semanales:")
        print(u"\t Lunes festivo......: %s" % es_lunes_festivo)
        print(u"\t Martes festivo.....: %s" % es_martes_festivo)
        print(u"\t Miércoles festivo..: %s" % es_miercoles_festivo)
        print(u"\t Jueves festivo.....: %s" % es_jueves_festivo)
        print(u"\t Viernes festivo....: %s" % es_viernes_festivo)
        print(u"\t Sábado festivo.....: %s" % es_sabado_festivo)
        print(u"\t Domingo festivo....: %s" % es_domingo_festivo)
        
        # Configuración de turno que se usará como libre.
        ret, turno_libre = self.__get_libre(turno_libre_id)
        if not ret: return ret, turno_libre
        
        # Se crea objeto planificación para realizar la planificación del ciclo.
        plan = w_planificacion()
        ret, planilla, extra = plan.newPlanificacion(fecha_inicio, fecha_fin, \
                                                     ciclo, turno_libre, \
                                                     semana, es_lunes_festivo, \
                                                     es_martes_festivo, \
                                                     es_miercoles_festivo, \
                                                     es_jueves_festivo, \
                                                     es_viernes_festivo, \
                                                     es_sabado_festivo, \
                                                     es_domingo_festivo, \
                                                     cal_festivo, False)
    
        if not ret: return False, planilla   
        
        # Se calculan las particiones por meses para la nueva planificación.
        particion_nueva = plan.particionarPlanificacion(planilla), extra
        
        # ####################################################################
        # Se recuperan planificaciones del puesto para los 12 meses del año en
        # curso.
        # ####################################################################
        
        planificaciones_originales = []
        
        for i in range(12):
            mes = i + 1
            ret = self.__conn.get_planificacion(anno = anno, mes = mes, \
                                                puesto_id = puesto_id)

            if len(ret) > 0:
                planificaciones_originales.append(ret)
                    
        # print planificaciones_originales
        # raw_input("kk")
        
        # Cada planificación se regenera a partir de su configuración.
        for planificacion in planificaciones_originales:
            
            # Se recuperan datos básicos de configuración de planificación.
            mes_ = planificacion[0][0]
            anno_ = planificacion[0][1]
            puesto_id_ = planificacion[0][2]
            puesto_cod_ = planificacion[0][3] 
            puesto_desc_ =planificacion[0][4]
            f_ini_ = (int(planificacion[0][5][0:4]), \
                      int(planificacion[0][5][5:7]), \
                      int(planificacion[0][5][8:]))
            ciclo_id_ = planificacion[0][6]
            f_fin_ = (int(planificacion[0][7][0:4]), \
                      int(planificacion[0][7][5:7]), \
                      int(planificacion[0][7][8:]))
            n_dias_mes_ = planificacion[0][8] 
            ult_sem_ = planificacion[0][9]
            es_lunes_festivo_ = planificacion[0][41]
            es_martes_festivo_ = planificacion[0][42]
            es_miercoles_festivo_ = planificacion[0][43]
            es_jueves_festivo_ = planificacion[0][44]
            es_viernes_festivo_ = planificacion[0][45]
            es_sabado_festivo_ = planificacion[0][46]
            es_domingo_festivo_ = planificacion[0][47]  
            turno_libre_id_ = planificacion[0][48]  
            
            # Info.
            print(u"\t[PLANIFICACIÓN]")
            print(u"Año %d, mes %d, puesto %s - %s - %s" % (anno_, mes_, \
                                                             puesto_id_, \
                                                             puesto_cod_, \
                                                             puesto_desc_))
            print("Fecha inicio: %s" % str(f_ini_))
            print("Fecha fin: %s" % str(f_fin_))
            
            print("Ciclo id = %d" % ciclo_id_)
            print(u"No días mes: %d" % n_dias_mes_)
            print(u"Última semana: %d" % ult_sem_)
            
            # raw_input("pulsa tecla")
            
            # Se recupera el ciclo que se quiere planificar.
            ret, ciclo_ = self.__get_ciclo(ciclo_id_)
            if not ret: return ret, ciclo_
            
            # ...turno que se usará como libre.
            ret, turno_libre_ = self.__get_libre(turno_libre_id_)
            if not ret: return ret, turno_libre_
            
            # Planificación del ciclo.
            plan = w_planificacion()
            ret, planilla_, extra_ = plan.newPlanificacion(f_ini_, f_fin_, \
                                                           ciclo_, turno_libre_, \
                                                           ult_sem_, \
                                                           es_lunes_festivo_, \
                                                           es_martes_festivo_, \
                                                           es_miercoles_festivo_, \
                                                           es_jueves_festivo_, \
                                                           es_viernes_festivo_, \
                                                           es_sabado_festivo_, \
                                                           es_domingo_festivo_, \
                                                           cal_festivo, False)
            
            if not ret: return False, planilla_               
            
            # Cálculo de particiones por meses.
            particion_ = plan.particionarPlanificacion(planilla_), extra_
            
            # ...partición en lista... escuchando BSO Conan The Barbarian...
            particiones.append(particion_)

        # #############################
        # Creación de puesto w_puesto #
        # #############################
        
        puesto = w_puesto()
        
        # Inserción de planificaciones originales y nueva en puesto.
        for i in particiones:
            ret, msj = puesto.add_planificacion(i[0], i[1], \
                                                chequearSolapamiento = False)
            if not ret: return False, msj 

        # Se incluye partición de planificación nueva dentro de las particiones
        # de las planificaciones originales (las que ya estaban en BBDD).
        ret, msj = puesto.add_planificacion(particion_nueva[0], \
                                            particion_nueva[1], \
                                            chequearSolapamiento = True)
        if not ret: return False, msj 
    
        # ################################################
        # Si todo ha ido bien, se guarda partición nueva #
        # ################################################
            
        puesto = w_puesto()
        puesto.add_planificacion(particion_nueva[0], particion_nueva[1])
        ultima_semana = puesto.ultimaSemanaPlanificacion()[2]
        
        for i in range(12):
            mes = i + 1
            lista_dias_mes = puesto.get_planificacion_mensual(anno, mes, True)
            total_dias = puesto.diasMes(anno, mes)
            # ALGG 18-12-2016 Si no hay nada planificado en el mes, no se 
            # planifica.
            seguir = False
            for k in lista_dias_mes: 
                if k is not None: 
                    seguir = True
                    break
            if not seguir: continue
            # Se inserta.
            ret = self.__conn.insert_planificacion(mes, puesto_id, anno, \
                                                   fecha_inicio, ciclo_id, \
                                                   fecha_fin, total_dias, \
                                                   ultima_semana, lista_dias_mes, \
                                                   es_lunes_festivo, \
                                                   es_martes_festivo, \
                                                   es_miercoles_festivo, \
                                                   es_jueves_festivo, \
                                                   es_viernes_festivo, \
                                                   es_sabado_festivo, \
                                                   es_domingo_festivo, \
                                                   turno_libre_id, \
                                                   hacer_commit = False)
         
        ret = self.__conn.actualizar()
        
        return ret
      
    def festivos(self, l, m, x, j, v, s, d, total_dias, mes, anno, equipo_id):
        '''Devuelve estructura de festivos'''
        
        d = {}
        
        for dia in range(1,29):
            aux = datetime(anno, mes, dia,0,0,0,0)
            if aux.weekday() == 0 and l == 'S': d.setdefault('dia%s' % dia, 'S')
            else: d.setdefault('dia%s' % dia, 'N')
            
            if aux.weekday() == 1 and m == 'S': d.setdefault('dia%' % dia, 'S')
            else: d.setdefault('dia%s' % dia, 'N')
            
            if aux.weekday() == 2 and x == 'S': d.setdefault('dia%' % dia, 'S')
            else: d.setdefault('dia%s' % dia, 'N')
                                              
            if aux.weekday() == 3 and j == 'S': d.setdefault('dia%' % dia, 'S')
            else: d.setdefault('dia%s' % dia, 'N')
                                                        
            if aux.weekday() == 4 and v == 'S': d.setdefault('dia%' % dia, 'S')
            else: d.setdefault('dia%s' % dia, 'N')

            if aux.weekday() == 5 and s == 'S': d.setdefault('dia%' % dia, 'S')
            else: d.setdefault('dia%s' % dia, 'N')
                                     
            if aux.weekday() == 6 and d == 'S': d.setdefault('dia%' % dia, 'S')
            else: d.setdefault('dia%s' % dia, 'N')
              
        return d
    
    def get_planificacion(self, anno, mes, puesto_id = None, \
                          fecha_inicio = None, equipo_id = None, \
                          visualizacion = 0):
        '''Devuelve: ()
        Tabla: planificacion (planificaciones de ciclos asociados a puestos)
        '''
        
        ret = self.__conn.get_planificacion(anno, mes, puesto_id, \
                                            fecha_inicio, equipo_id, \
                                            visualizacion)
        
        # ALGG 19032017 Se recuperan festivos.
        if len(ret) > 0 :
            festivos = self.festivos(ret[0].es_lunes_festivo, \
                                     ret[0].es_martes_festivo, \
                                     ret[0].es_miercoles_festivo, \
                                     ret[0].es_jueves_festivo, \
                                     ret[0].es_viernes_festivo, \
                                     ret[0].es_sabado_festivo, \
                                     ret[0].es_domingo_festivo, \
                                     ret[0].total_dias, \
                                     ret[0].mes, 
                                     ret[0].anno, 
                                     equipo_id)
        
        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        
        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
    
            # ALGG 11122016 Se forma un ID ficticio compuesto por las PK.
            ID = self.__montar_pk(ret[i].mes, ret[i].anno, \
                                  ret[i].puesto_id, ret[i].fecha_inicio)
               
            # Se forma diccionario.
            d.setdefault('id', ID)
            d.setdefault('mes', ret[i].mes)
            d.setdefault('anno', ret[i].anno)
            d.setdefault('puesto_id', ret[i].puesto_id)
            d.setdefault('puesto_cod', ret[i].puesto_cod)
            d.setdefault('puesto_desc', ret[i].puesto_desc)
            d.setdefault('fecha_inicio', ret[i].fecha_inicio)
            d.setdefault('ciclo_master_id', ret[i].ciclo_master_id)
            d.setdefault('fecha_fin', ret[i].fecha_fin)
            d.setdefault('total_dias', ret[i].total_dias)
            d.setdefault('semana', ret[i].semana)
            d.setdefault('dia1', ret[i].dia1)
            d.setdefault('dia2', ret[i].dia2)
            d.setdefault('dia3', ret[i].dia3)
            d.setdefault('dia4', ret[i].dia4)
            d.setdefault('dia5', ret[i].dia5)
            d.setdefault('dia6', ret[i].dia6)
            d.setdefault('dia7', ret[i].dia7)
            d.setdefault('dia8', ret[i].dia8)
            d.setdefault('dia9', ret[i].dia9)
            d.setdefault('dia10', ret[i].dia10)
            d.setdefault('dia11', ret[i].dia11)
            d.setdefault('dia12', ret[i].dia12)
            d.setdefault('dia13', ret[i].dia13)
            d.setdefault('dia14', ret[i].dia14)
            d.setdefault('dia15', ret[i].dia15)
            d.setdefault('dia16', ret[i].dia16)
            d.setdefault('dia17', ret[i].dia17)
            d.setdefault('dia18', ret[i].dia18)
            d.setdefault('dia19', ret[i].dia19)
            d.setdefault('dia20', ret[i].dia20)
            d.setdefault('dia21', ret[i].dia21)
            d.setdefault('dia22', ret[i].dia22)
            d.setdefault('dia23', ret[i].dia23)
            d.setdefault('dia24', ret[i].dia24)
            d.setdefault('dia25', ret[i].dia25)
            d.setdefault('dia26', ret[i].dia26)
            d.setdefault('dia27', ret[i].dia27)
            d.setdefault('dia28', ret[i].dia28)
            d.setdefault('dia29', ret[i].dia29)
            d.setdefault('dia30', ret[i].dia30)
            d.setdefault('dia31', ret[i].dia31)
            d.setdefault('es_lunes_festivo', ret[i].es_lunes_festivo)
            d.setdefault('es_martes_festivo', ret[i].es_martes_festivo)
            d.setdefault('es_miercoles_festivo', ret[i].es_miercoles_festivo)
            d.setdefault('es_jueves_festivo', ret[i].es_jueves_festivo)
            d.setdefault('es_viernes_festivo', ret[i].es_viernes_festivo)
            d.setdefault('es_sabado_festivo', ret[i].es_sabado_festivo)
            d.setdefault('es_domingo_festivo', ret[i].es_domingo_festivo)
            d.setdefault('turno_libre_id', ret[i].turno_libre_id)
            d.setdefault('festivos', festivos)
            
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        # data.setdefault('festivo', {'dia1' : S, 'dia2' : N })
                
        print(data)
        return data        

class PlanificacionDiaria(object):
    
    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn        
        
    def __montar_pk(self, mes, anno, puesto_id, fecha_inicio):
        '''Monta clave primaria de planificación'''
        
        return str(mes) + str(anno) + str(puesto_id) + \
               str(fecha_inicio).replace('-','')
      
    def get_cambios_turnos(self, fini_t, ffin_t, tarea_id):
        '''Se recuperan los posibles cambios de turnos de 
        la planificación diaria para una tarea entre un rango de fechas de
        tarea.'''

        ret = self.__conn.get_cambios_turnos(fini_t, ffin_t, tarea_id)
        return ret
        
    def get_ausencias_trab(self, fini_t, ffin_t, contrato_id):
        '''Se recuperan las ausencias del trabajador'''
        
        ret = self.__conn.get_contrato_ausencia(contrato_id, \
                                                'S', fini_t, ffin_t)
        
        # Para la asignación (fini_t, ffin_t) hay que buscar todas las ausencias.
        # En un mismo día puede haber más de una ausencia.
        
        print(fini_t)
        print(ffin_t)
       
        # Se transforman las fechas de texto en tuplas numéricas.
        aux = fini_t.split('-')
        fini_t = (int(aux[0]), int(aux[1]), int(aux[2]))
        aux = ffin_t.split('-')
        ffin_t = (int(aux[0]), int(aux[1]), int(aux[2]))
        
        d = {}
        
        for i in ret:
            # Se obtienen los datos de la ausencia.
            id_ = i['id']
            contrato_id = i['contrato_id']
            aus_id = i['aus_id']
            aus_cod = i['aus_cod']
            aus_desc = i['aus_desc']
            fecha_inicio = i['fecha_inicio']
            fecha_fin = i['fecha_fin']
            anno_devengo = i['anno_devengo']
            # Se transforman fechas de texto en tuplas numéricas.
            aux = fecha_inicio.split('-')
            fini_a = (int(aux[0]), int(aux[1]), int(aux[2]))
            aux = fecha_fin.split('-')
            ffin_a = (int(aux[0]), int(aux[1]), int(aux[2]))
            # Se comprueban que las fechas de asignación están dentro de las 
            # fechas de ausencias.
            a = fini_t[2]
            b = ffin_t[2]
            while a<=b:
                if a >= fini_a[2] and a <=ffin_a[2]:
                    clave = "dia%s" % str(a)
                    fini_ = datetime.strptime(str(fecha_inicio), \
                                              '%Y-%m-%d').strftime('%d/%m/%y')
                    ffin_ = datetime.strptime(str(fecha_fin), \
                                              '%Y-%m-%d').strftime('%d/%m/%y')                    
                    valor = u'''Ausencia %s (%s)
                    Entre %s y %s. Devengo: %s''' % \
                                                  (aus_cod, aus_desc, fini_, \
                                                   ffin_, anno_devengo)
                    # Se añade o se crea la ausencia.
                    try: 
                        d[clave] = "%s\n%s" % (d[clave], valor)
                    except: 
                        d.setdefault(clave, valor)
                
                # Y seguimos con el siguiente día...
                a +=1
        
        # Se devuelve diccionario de ausencias.
        return d
            
    def get_planificacion_diaria(self, anno, mes, puesto_id = None, \
                                 fecha_inicio = None, equipo_id = None):
        '''Devuelve: La planilla
        Tablas: planificacion, tarea (planilla)
        '''
        
        ret = self.__conn.get_planificacion_diaria(anno, mes, puesto_id, \
                                                   fecha_inicio, equipo_id)
        
        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        
        for i in range(len(ret)):
            # Se crea diccionario.
            d = {}
    
            # ALGG 11122016 Se forma un ID ficticio compuesto por las PK.
            ID = self.__montar_pk(ret[i].mes, ret[i].anno, \
                                  ret[i].puesto_id, ret[i].fecha_inicio)
    
            # ALGG 18012017 Incluyo campo título, que será el que se muestre 
            # como fila del nombre del trabajador.
            nombre = ret[i].nombre
            ape1 = ret[i].ape1
            ape2 = '' if ret[i].ape2 is None else ret[i].ape2
            dni = ret[i].dni
            tlfno1 = ret[i].tlfno1
            contrato_id = ret[i].contrato_id
            fini_t = datetime.strptime(str(ret[i].fini_t), \
                                       '%Y-%m-%d').strftime('%d/%m/%y')
            ffin_t = datetime.strptime(str(ret[i].ffin_t), \
                                       '%Y-%m-%d').strftime('%d/%m/%y')
            tarea_id = ret[i].tarea_id            
            titulo = '%s %s %s (%s) - [Teléfono %s] Asignado al equipo ' + \
                'desde el %s hasta el %s.' 
            titulo = titulo % (ape1, ape2, nombre, dni, tlfno1,fini_t, ffin_t)
            
            # Se forma diccionario.
            d.setdefault('id', ID)
            d.setdefault('nombre_completo', ret[i].nombre_completo)
            d.setdefault('contrato_id', ret[i].contrato_id)
            d.setdefault('titulo', titulo)
            d.setdefault('tarea_id', ret[i].tarea_id)
            d.setdefault('persona_id', ret[i].persona_id)
            d.setdefault('nombre', ret[i].nombre)
            d.setdefault('ape1', ret[i].ape1)
            d.setdefault('ape2', ret[i].ape2)
            d.setdefault('dni', ret[i].dni)
            d.setdefault('tlfno1', ret[i].tlfno1)
            d.setdefault('mes', ret[i].mes)
            d.setdefault('anno', ret[i].anno)
            d.setdefault('puesto_id', ret[i].puesto_id)
            d.setdefault('puesto_cod', ret[i].puesto_cod)
            d.setdefault('puesto_desc', ret[i].puesto_desc)
            d.setdefault('fecha_inicio', ret[i].fecha_inicio)
            d.setdefault('ciclo_master_id', ret[i].ciclo_master_id)
            d.setdefault('fecha_fin', ret[i].fecha_fin)
            d.setdefault('total_dias', ret[i].total_dias)
            d.setdefault('semana', ret[i].semana)
            d.setdefault('dia1', ret[i].dia1)
            d.setdefault('dia2', ret[i].dia2)
            d.setdefault('dia3', ret[i].dia3)
            d.setdefault('dia4', ret[i].dia4)
            d.setdefault('dia5', ret[i].dia5)
            d.setdefault('dia6', ret[i].dia6)
            d.setdefault('dia7', ret[i].dia7)
            d.setdefault('dia8', ret[i].dia8)
            d.setdefault('dia9', ret[i].dia9)
            d.setdefault('dia10', ret[i].dia10)
            d.setdefault('dia11', ret[i].dia11)
            d.setdefault('dia12', ret[i].dia12)
            d.setdefault('dia13', ret[i].dia13)
            d.setdefault('dia14', ret[i].dia14)
            d.setdefault('dia15', ret[i].dia15)
            d.setdefault('dia16', ret[i].dia16)
            d.setdefault('dia17', ret[i].dia17)
            d.setdefault('dia18', ret[i].dia18)
            d.setdefault('dia19', ret[i].dia19)
            d.setdefault('dia20', ret[i].dia20)
            d.setdefault('dia21', ret[i].dia21)
            d.setdefault('dia22', ret[i].dia22)
            d.setdefault('dia23', ret[i].dia23)
            d.setdefault('dia24', ret[i].dia24)
            d.setdefault('dia25', ret[i].dia25)
            d.setdefault('dia26', ret[i].dia26)
            d.setdefault('dia27', ret[i].dia27)
            d.setdefault('dia28', ret[i].dia28)
            d.setdefault('dia29', ret[i].dia29)
            d.setdefault('dia30', ret[i].dia30)
            d.setdefault('dia31', ret[i].dia31)
            d.setdefault('es_lunes_festivo', ret[i].es_lunes_festivo)
            d.setdefault('es_martes_festivo', ret[i].es_martes_festivo)
            d.setdefault('es_miercoles_festivo', ret[i].es_miercoles_festivo)
            d.setdefault('es_jueves_festivo', ret[i].es_jueves_festivo)
            d.setdefault('es_viernes_festivo', ret[i].es_viernes_festivo)
            d.setdefault('es_sabado_festivo', ret[i].es_sabado_festivo)
            d.setdefault('es_domingo_festivo', ret[i].es_domingo_festivo)
            d.setdefault('turno_libre_id', ret[i].turno_libre_id)
            
            # ALGG 04-02-2017 Se crean fechas de búsqueda de cambios de turnos
            # y de ausencias.
            fini = "%s-%s-%s" % (ret[i].anno,ret[i].mes,'1')
            ffin = "%s-%s-%s" % (ret[i].anno,ret[i].mes,monthrange(anno, mes)[1])
            
            # Se buscan los cambios...
            ret1 = self.get_cambios_turnos(fini, ffin, tarea_id)
            
            if len(ret1) > 0:
                for j in ret1:
                    dia = j[0].split('-')
                    dia = 'dia%s' % str(int(dia[2]))
                    valor = str(j[2])
                    d[dia] = valor
 
            # Se buscan ausencias...
            ret2 = self.get_ausencias_trab(fini, ffin, contrato_id)
            
            for k in range(1,32):
                clave = "dia%s" % k
                clave_aus = "%s_aus" % clave
                try: d.setdefault(clave_aus, ret2[clave])
                except: d.setdefault(clave_aus, None)
                
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

class CoberturaEquipo(object):
    '''Clase cobertura de servicio para equipo de trabajo'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_cobertura_equipo(self, equipo_id = None, fecha = None):
        '''Devuelve: (id, fecha_inicio, categoria_id, lunes, martes, miercoles,
        jueves, viernes, sabado, domingo, fecha_fin)
        Opciones de filtrado: equipo_id <id equipo>, fecha <fecha en donde la 
        cobertura es efectiva>'''

        ret = self.__conn.get_cobertura_equipo(equipo_id, fecha)

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
            d.setdefault('fecha_inicio', ret[i].fecha_inicio)
            d.setdefault('fecha_fin', ret[i].fecha_fin)
            d.setdefault('lunes', ret[i].lunes)
            d.setdefault('martes', ret[i].martes)
            d.setdefault('miercoles', ret[i].miercoles)
            d.setdefault('jueves', ret[i].jueves)
            d.setdefault('viernes', ret[i].viernes)
            d.setdefault('sabado', ret[i].sabado)
            d.setdefault('domingo', ret[i].domingo)
            # Se añade diccionario a la lista.
            lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        print(data)
        return data        

    def set_cobertura_equipo(self, datos):
        '''Actualización de datos.
        Tabla: cobertura_equipo
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
            # Se comprueba si lo que se ha insertado son números...
            if i['field'] in ['lunes', 'martes', 'miercoles', 'jueves', \
                              'viernes', 'sabado', 'domingo']:
                try: int(i['valor_nuevo'])
                except: 
                    ret = False
                    msj = u'Solo se permiten valores numéricos para coberturas'
                    break
                
            aux.append(i)

        celdas = aux 

        # ################################
        # TRATAMIENTO DE CELDAS A INSERTAR
        # ################################
        
        if ret:
            # Se comprueba que los datos de coberturas son numéricos.
            for i in filas_a_insertar:
                try:
                    int(i['lunes'])
                    int(i['martes'])
                    int(i['miercoles'])
                    int(i['jueves'])
                    int(i['viernes'])
                    int(i['sabado'])
                    int(i['domingo'])
                except: 
                    ret = False
                    msj = u'Solo se permiten valores numéricos para coberturas'
                    break
                     
        # ##############
        # ENVÍO DE DATOS
        # ##############

        if ret:
            ret, msj = self.__conn.actualizar_cobertura_equipo(celdas, \
                                                               filas_a_insertar, \
                                                               filas_a_eliminar)

        ret = {'data' : [{'estado' : ret}, {'mensaje' : msj}]}

        # Devolvemos estado.
        return ret        

class CoberturaServicio(object):
    '''Cobertura de servicio. Información de presencias en planificación diaria'''

    def __init__(self, conn):
        '''Constructor'''
        # Conexión.
        self.__conn = conn

    def get_coberturaServicio(self, equipo_id, mes, anno):
        '''Devuelve: (dia_trab, dia_semana, descuadre, info)
        Tabla: cobertura_equipo, tarea, v_planificacion
        Esta query da las coberturas de servicio en planificación diaria, 
        teniendo en cuenta turnos que cuenten o no horas, ausencias que cuenten
        ó no presencias (días) y cambios de turnos. Además soporta diferentes
        coberturas para un mismo mes.'''

        ret = self.__conn.get_coberturaServicio(equipo_id, mes, anno)

        # Diccionario principal. 
        data = {}

        # Valor del diccionario data, que será una lista de diccionarios. 
        lista = []        

        # Se crea diccionario.
        d = {}

        # Se crean todos los días y el dia0 para temas de visualización...
        for i in range(0,32): d.setdefault('dia%s' % i, None)
        
        d['dia0'] = 'COBERTURAS'
            
        # Se actualizan con las coberturas de servicio.
        for i in range(len(ret)):
            # Formamos la clave y el valor
            clave = ret[i].columna
            valor = {'presencias' : ret[i].presencias, \
                     'info' : 'faltan', \
                     'descuadre': ret[i].descuadre,
                     'dia_semana': ret[i].dia_semana,
                     'dia_trab': ret[i].dia_trab}
            # Se actualiza tablas hash.
            d[clave] = valor
            
        # Se añade diccionario a la lista.
        lista.append(d)

        # Se incluye clave, valor que será "data" : lista de diccionarios 
        data.setdefault('data', lista)
        pprint(data)
        return data        

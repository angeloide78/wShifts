# -*- coding: utf-8 -*-

# ALGG 29-10-2016 Creación de clase w_turno, w_ciclo.
# ALGG 29-10-2016 Creación de clase w_planificacion, w_calendar
# ALGG 01-11-2016 Creación de clase w_puesto.

# #################################
# work Shifts <-> Turnos de trabajo
# MODELO
# #################################

import re
from datetime import datetime, timedelta, date
from pprint import pprint
from calendar import monthcalendar, weekday, SATURDAY, SUNDAY, MONDAY, \
     THURSDAY, WEDNESDAY, TUESDAY, FRIDAY, monthrange
from datetime import date, timedelta

class w_calendar(object):
    '''Clase calendario'''
    def __init__(self):
        pass

    def getNombreMes(self, mes, mayus = False):
        '''Devuelve el nombre del mes'''
        if mes == 1: ret = u"Enero"
        if mes == 2: ret = u"Febrero"
        if mes == 3: ret = u"Marzo"
        if mes == 4: ret = u"Abril"
        if mes == 5: ret = u"Mayo"
        if mes == 6: ret = u"Junio"
        if mes == 7: ret = u"Julio"
        if mes == 8: ret = u"Agosto"
        if mes == 9: ret = u"Septiembre"
        if mes == 10: ret = u"Octubre"
        if mes == 11: ret = u"Noviembre"
        if mes == 12: ret = u"Diciembre"
        if mayus: ret = ret.upper()
        
        return ret
                                                
    def __newCalendario(self, anno):
        '''Devuelve el calendario de año anno'''
        calendario = []
        for i in range(12): 
            calendario.append([int(anno), i + 1,monthcalendar(int(anno), i + 1)])
    
        # Se devuelve el calendario
        return calendario
    
    def getMes(self, calendario, mes, por_pantalla = True):
        '''Devuelve el mes del calendario'''
    
        semanas = []
        
        if por_pantalla: print u"\tLUN\tMAR\tMIÉ\tJUE\tVIE\tSÁB\tDOM"
        for i in calendario:
            if i[1] == mes:
                semanas = i[2]
                if por_pantalla:
                    for semana in semanas:
                        aux = ""
                        for dia in semana:
                            if str(dia).strip() == "0": 
                                aux += "\t%s" % str(dia).replace("0", "")
                            else:
                                aux += "\t%s" % str(dia)
                        print aux
        
        return semanas
    
    def newFestivos(self, anno, calendario, festivos = list(), \
                    lunes_festivo = False, martes_festivo = False, \
                    miercoles_festivo = False, jueves_festivo = False, \
                    viernes_festivo = False, sabado_festivo = True, \
                    domingo_festivo = True):
        '''Devuelve estructura de festivos'''
    
        ret = {}
        
        print("###################################################")
        print("###################################################")
        print("###################################################")
        print("###################################################")
        print("###################################################")
        print("###################################################")
        print("###################################################")

        print(festivos)
        
        print("###################################################")
        print("###################################################")
        print("###################################################")
        print("###################################################")
        print("###################################################")
        print("###################################################")
        print("###################################################")
        
        # Festivos [(año, mes, dia), ...].
        for i in festivos:
            anno = i[0]
            mes = i[1]
            dia = i[2]
            clave = '%s-%s-%s' % (anno, mes, dia)
            ret.setdefault(clave, True)
    
        # Detectar días de la semana como festivos.
        for i in calendario:
            anno = i[0]
            mes = i[1]
            semanas = i[2]
            for semana in semanas:
                for dia in semana:
                    if dia == 0: continue
                    if (weekday(anno, mes, dia) == MONDAY and lunes_festivo == 'S') or \
                       (weekday(anno, mes, dia) == TUESDAY and martes_festivo == 'S') or \
                       (weekday(anno, mes, dia) == WEDNESDAY and miercoles_festivo == 'S') or \
                       (weekday(anno, mes, dia) == THURSDAY and jueves_festivo == 'S') or \
                       (weekday(anno, mes, dia) == FRIDAY and viernes_festivo == 'S') or \
                       (weekday(anno, mes, dia) == SATURDAY and sabado_festivo == 'S') or \
                       (weekday(anno, mes, dia) == SUNDAY and domingo_festivo == 'S'): 
                        clave = '%s-%s-%s' % (anno, mes, dia)
                        ret.setdefault(clave, True)
    
        # Se devuelve diccionario de festivos.
        return ret
    
    def getNombreDia(self, anno, mes, dia, mayus = False, abrev = False):
        '''Devuelve nombre de día de la semana y sigla'''
        
        if self.getDiaSemana(anno, mes, dia) == 0: ret = (u"Lunes", "L")
        if self.getDiaSemana(anno, mes, dia) == 1: ret = (u"Martes", "M")
        if self.getDiaSemana(anno, mes, dia) == 2: ret = (u"Miércoles", "X")
        if self.getDiaSemana(anno, mes, dia) == 3: ret = (u"Jueves", "J")
        if self.getDiaSemana(anno, mes, dia) == 4: ret = (u"Viernes", "V")
        if self.getDiaSemana(anno, mes, dia) == 5: ret = (u"Sábado", "S")
        if self.getDiaSemana(anno, mes, dia) == 6: ret = (u"Domingo", "D")
        if abrev: ret = (ret[0][0:3], ret[1])
        if mayus: ret = (ret[0].upper(), ret[1])
        return ret
        
    def getDiaSemana(self, anno, mes, dia):
        '''Devuelve día se la semana 0..6 <-> Lunes.. Domingo'''
        return weekday(int(anno), int(mes), int(dia))
    
    def esFestivo(self, festivo, festivos):
        '''Devuelve True si es festivo y False en caso contrario'''
        # Festivo = (anno, mes, dia)
        clave = '%s-%s-%s' % (str(festivo[0]), str(festivo[1]), str(festivo[2]))
        try: ret = festivos[clave]
        except: ret = False
        
        return ret
    
    def diferenciaDias(self, fecha1, fecha2, festivos = list()):
        '''Devuelve una tupla con la diferencia entre dos fechas:
        (diferencia de días totales (días normales, festivos y fines de semana),
        diferencia de días sin contar días festivos, sábados y domingos.
        diferencia de días sin contar los días festivos)'''
        
        # Fecha: (anno, mes, dia)
        fecha_inicio = date(fecha1[0], fecha1[1], fecha1[2])
        fecha_fin = date(fecha2[0], fecha2[1], fecha2[2])
        
        # Se ordenan las fechas.
        if fecha_inicio > fecha_fin:
            aux = fecha_fin
            fecha_fin = fecha_inicio
            fecha_inicio = aux
            
        # Total de días de diferencia.
        dif_total = (fecha_fin - fecha_inicio).days + 1
        
        # Análisis de días de diferencia.
        d = timedelta(days = 1)
        dias = list()
        dia = fecha_inicio
        fest = nsab = ndom = 0
        while dia <= fecha_fin:
            if es_festivo((dia.year, dia.month, dia.day), festivos):
                fest += 1
            else:
                # Sábados y domingos.
                if dia.weekday == SATURDAY: nsab += 1
                if dia.weekday == SUNDAY: ndom += 1
                
            # Se guarda el día.
            dias.append((dia.year, dia.month, dia.day))
            
            # Se incrementa el día
            dia = dia + d
        
        # Devuelve el número de días de diferencia, los días sin contar
        # festivos y fines de semana, días sin contar festivos y una lista
        # con los días de diferencia, donde cada día es una tupla (año, mes, dia).
        return dif_total, fest + nsab + ndom, fest, dias
        
    def getCalendario(self, anno, festivos, \
                      lunes_festivo = False, martes_festivo = False, \
                      miercoles_festivo = False, jueves_festivo = False, \
                      viernes_fetivo = False, sabado_festivo = True, \
                      domingo_festivo = True):
        '''Devuelve estructura:
         ret = {'calendario' : c,
               'festivos' : f} 
        de calendario con festivos'''
       
        # Creación de calendario.
        c = self.__newCalendario(anno)
        f = self.newFestivos(anno, c, festivos, lunes_festivo, \
                             martes_festivo, miercoles_festivo, \
                             jueves_festivo, viernes_fetivo, \
                             sabado_festivo, domingo_festivo)
        
        ret = {'calendario' : c,
               'festivos' : f}    
    
        # Se devuelve la estructura.
        return ret

class w_turno(object):
    '''Clase turno'''
    def __init__(self):
        self.__turnos = []
        self.__id = 1
        
    def __addTurno(self, turno):
        '''Se añade un turno'''
        self.__turnos.append(turno)
        
    def esTurnoLibre(self, turno):
        '''Devuelve True si el turno es Libre (no cuenta horas) y False
        en caso contrario'''
        if turno['cuenta_horas'] == 'S': return False
        if turno['cuenta_horas'] == 'N': return True
        
    def newTurno(self, codigo, descripcion, horario, cuenta_horas, \
                 activo = 'S', _id = None, chequearRepeticionCodigo = True):
        '''Creación de un nuevo Turno. Devuelve <True, ""> si todo ha ido bien
        y <False, mensaje de error> si ha habido fallo. Parámetros:
        
        codigo: Código unívoco identificativo del turno.
        descripcion: Descripción del turno.
        cuenta_horas: <'S'> El turno cuenta las horas. <'N'> el turno no cuenta
        horas, independientemente de lo que tenga en horario. Para definir turnos
        que no cuenten horas, como libres o salientes de noche, usar este valor.
        activo: <'S'> si el turno está activo y <'N'> si no está activo.
        horario: [
                  [{'id' : 1},
                   {'dia_inicial' : X}, 
                   {'dia_final' : X}, 
                   {'hora_inicio': 'hh:mm'}, 
                   {'hora_fin' : 'hh:mm'}],
                   ...
                   ...
                  [{'id' : n},
                   {'dia_inicial' : X}, 
                   {'dia_final' : X}, 
                   {'hora_inicio': 'hh:mm'}, 
                   {'hora_fin' : 'hh:mm'}]
                 ]
                 donde X = -1 si la franja horaria nace en el día anterior.
                       X =  0 si la franja horaria nace en el día actual.
                       X =  1 si la franja horaria nace en el día siguiente.
        '''
        
        t = {'id' : self.__id if _id is None else _id, 
             'codigo' : str(codigo).strip(),
             'descripcion' : str(descripcion).strip(),
             'cuenta_horas': str(cuenta_horas).upper().strip(),
             'activo' : str(activo).upper().strip(),
             'horario' : horario,
             'total_horas' : None}
        
        # 'total_horas' : self.__cuentaHoras(horario)}
    
        # ALGG 31-10-2016 Validamos si el turno está bien formado.
        ret, msj = self.__esTurnoValido(t, chequearRepeticionCodigo = \
                                        chequearRepeticionCodigo)
        if ret:
            # Se incrementa el identificador del turno.
            self.__id += 1
            # Se añade el turno a la lista de turnos.
            self.__addTurno(t)
       
       
        # Se devuelve estado y mensaje.
        return ret, msj
    
    def __esTurnoValido(self, turno, chequearRepeticionCodigo= True):
        '''Devuelve la tupla <True,""> si el turno pasado como parámetro es 
        válido y <False, "motivo de no validez"> en caso contrario'''
        # Se recuperan datos.
        codigo = turno['codigo']
        descripcion = turno['descripcion']
        cuenta_horas = turno['cuenta_horas']
        activo = turno['activo']
        horarios = turno['horario']
        # Código y descripción correctos.
        if len(codigo) == 0 or len(codigo) > 5: 
            return False, u"El código de turno debe tener longitud entre 1 y 5 caracteres"
        # Se comprueba que el código de Turno no existe para evitar duplicidades.
        if chequearRepeticionCodigo:
            for i in self.__turnos: 
                if i['codigo'] == codigo: return False, \
                   u"Código de turno %s ya existe" % codigo
        if len(descripcion) == 0 or len(descripcion) > 255:
            return False, u"La descripción del turno debe tener longitud entre 1 y 255 caracteres"
        # Validez de flag de turno activo.
        if activo not in ('S', 'N'):
            return False, u"La bandera activo solo puede tener valores 'S' o 'N'"
        # Validez de flag de turno activo.
        if cuenta_horas not in ('S', 'N'):
            return False, u"La bandera de contar horas solo puede tener valores 'S' o 'N'"
        # Prefijo.
        prefijo = msj = u"Turno %s - " % codigo
        # ALGG 08-12-2016 Si el turno no cuenta horas (es una actividad de Libre
        # o cualquier otra que no cuenta horas), no se verifican horarios.
        if cuenta_horas == 'S':
            # Formación de horarios correctos.
            bolsa_ids = []
            for horario in horarios:
                # Dato de horario.
                id_franja_horaria = horario[0]['id']
                dia_inicial = int(horario[1]['dia_inicial'])
                dia_final = int(horario[2]['dia_final'])
                hora_inicio = horario[3]['hora_inicio']
                hora_fin = horario[4]['hora_fin']
                # Verificación de no repetición de id's de franjas horarias.
                if id_franja_horaria not in bolsa_ids: 
                    bolsa_ids.append(id_franja_horaria)
                else:
                    return False, msj + u"Id de franja horaria repetido"                
                # Verificación de formación válida de datos para días inicial y final.
                if dia_final not in (-1, 0, 1): 
                    return False, msj + u"Valor no permitido en definición" + \
                           u" de horario para día de finalización"
                if dia_inicial not in (-1, 0, 1): 
                    return False, msj + u"Valor no permitido en definición de " + \
                           u"horario para día de inicio"
                if (dia_inicial, dia_final) not in ((-1,-1), (-1,0), \
                                                    (0,0), (0,1), (1,1), (-1, 1)):
                    return False, msj + u"Valores de inicio y fin de franja horaria " + \
                           "mal formados"                
                # Verificación de formación de horas.
                patron = re.compile("[2][0-3]|[0-1]?[0-9]:[0-5][0-9]")
                if patron.match(hora_inicio) is None:
                    return False, msj + u"Hora de inicio mal formada"
                if patron.match(hora_fin) is None:
                    return False, msj + u"Hora de fin mal formada"
            # Control de solapamientos de horarios.
            '''
                 00:00                 23:59
            -------|---------------------|-------
            
            '''
                      
            for horario in horarios:
                # Datos de horario actual.
                id_franja_horaria = horario[0]['id']
                dia_inicial = int(horario[1]['dia_inicial'])
                dia_final = int(horario[2]['dia_final'])
                hora_inicio = horario[3]['hora_inicio']
                hora_fin = horario[4]['hora_fin']
                # Info...
                msj = "dia inicial = %s, dia_final = %s, " % (str(dia_inicial), \
                                                              str(dia_final))
                msj += "hora_inicio = %s, hora_fin = %s" % (str(hora_inicio), \
                                                            str(hora_fin))
                print(msj)
                # Se compara entre todos los horarios.
                for i in horarios:
                    # Recogemos datos del elemento a comparar.
                    aux_id = i[0]['id']
                    aux_dia_inicial = int(i[1]['dia_inicial'])
                    aux_dia_final = int(i[2]['dia_final'])
                    aux_hora_inicio = i[3]['hora_inicio']
                    aux_hora_fin = i[4]['hora_fin']
                    # Saltamos el propio turno.
                    if aux_id == id_franja_horaria: continue
                    # Info.
                    msj = "dia inicial = %s, dia_final = %s, " % (aux_dia_inicial, \
                                                                  aux_dia_final)
                    msj += "hora_inicio = %s, hora_fin = %s" % (aux_hora_inicio, \
                                                                aux_hora_fin)
                    print("\tComparando con %s" % msj)
                    
                    # Se recuperan horas y minutos.
                    hmi = datetime(2016, 1, 1, \
                                   int(hora_inicio.split(':')[0]), \
                                   int(hora_inicio.split(':')[1])).time()
                    hmf = datetime(2016, 1, 1, \
                                   int(hora_fin.split(':')[0]), \
                                   int(hora_fin.split(':')[1])).time()
                    aux_hmi = datetime(2016, 1, 1, \
                                       int(aux_hora_inicio.split(':')[0]), \
                                       int(aux_hora_inicio.split(':')[1])).time()
                    aux_hmf = datetime(2016, 1, 1, \
                                       int(aux_hora_fin.split(':')[0]), \
                                       int(aux_hora_fin.split(':')[1])).time()
                    
                    # Comprobación para hora inicio <= hora fin.
                    if (dia_final == dia_inicial) and not hmi <= hmf:
                        return False, prefijo + u"Hora de inicio y fin incorrecto" 
                    
                    # #######################################################
                    # CASO: MISMA FRANJA HORARIA
                    # #######################################################
                    
                    # Elementos booleanos...
                    b = aux_dia_final == aux_dia_inicial == dia_final == dia_inicial
    
                    # Comparativa para misma franja horaria.
                    if b and not (hmf <= aux_hmi or aux_hmf <= hmi):
                        return False, prefijo + u"Solapamiento de horas y/o minutos"      
    
                    if not b:
                        
                        # #######################################################
                        # CASO: HORA INICIAL Y FINAL EN LA MISMA FRANJA HORARIA
                        # #######################################################
        
                        # Elementos booleanos...
                        b = (dia_final == aux_dia_inicial)
                        
                        # Comparativa para misma franja horaria.
                        if b and not (hmf <= aux_hmi):
                            return False, prefijo + u"Solapamiento de horas y/o minutos"      
                        
                        # Elementos booleanos...
                        b = (aux_dia_final == dia_inicial)
                        
                        # Comparativa para misma franja horaria.
                        if b and not (aux_hmf <= hmi):
                            return False, prefijo + u"Solapamiento de horas y/o minutos"      
                   
                        # #######################################################
                        # CASO: SUPERPOSICIÓN DE FRANJAS HORARIAS
                        # #######################################################
                        
                        # Elementos booleanos...
                        b = (dia_inicial < aux_dia_final and aux_dia_inicial < dia_final) or \
                            (aux_dia_inicial < dia_final and dia_inicial < aux_dia_final)
                                                                
                        # Comparativa para superposición de fanja horaria.
                        if b:
                            return False, prefijo + u"Solapamiento de horas por superposición"      
                        
        # Se devuelve estado.
        return True, ""
    
    def modificarTurno(self, turno):
        '''Cambia el turno "turno" por el nuevo valor de "turno". Devuelve 
        <False, msj> si no se pudo modificar el turno y <True, ""> si se 
        modificó correctamente.'''
        # Se busca el turno.
        ret = False
        msj = u'No se encontró el turno a modificar'
        p = -1
        for i in self.__turnos:
            p += 1
            if turno['id'] == i['id']:
                # Se crea nuevo turno.
                t = {'id' : i['id'], 
                     'codigo' : str(i['codigo']).strip(),
                     'descripcion' : str(i['descripcion']).strip(),
                     'cuenta_horas': i['cuenta_horas'].upper().strip(),
                     'activo' : i['activo'].upper().strip(),
                     'horario' : i['horario'],
                     'total_horas' : self.__cuentaHoras(i['horario'])}
                # Se comprueba que el turno modificado es correcto.
                ret, msj = self.__esTurnoValido(t)
                if ret: self.__turnos[p] = ret
                
                # Y nos vamos.
                break
        
        # Devolvemos estado.
        return ret, msj
    
    def __cuentaHoras(self, horarios):
        '''Devuelve tupla <horas, minutos segundos> con el total de horas 
        de un horario'''
        total_horas = total_minutos = total_segundos = 0
        for horario in horarios:
            # Dato de horario.
            id_franja_horaria = horario[0]['id']
            dia_inicial = int(horario[1]['dia_inicial'])
            dia_final = int(horario[2]['dia_final'])
            hora_inicio = horario[3]['hora_inicio']
            hora_fin = horario[4]['hora_fin']
            # Hora de inicio.
            hmi = datetime.strptime(hora_inicio,'%H:%M')
            # Casos de hora de fin.
            if dia_inicial == dia_final:
                # Hora de fin.
                hmf = datetime.strptime(hora_fin,'%H:%M')
                # Vemos la diferencia.
                dif = hmf - hmi
                h = int(str(dif).split(':')[0])
                m = int(str(dif).split(':')[1])
                s = int(str(dif).split(':')[2])                
                # Info.
                #print("Franja horaria de %s a %s: %d:%02d:%02d" % (str(hmi.time()), \
                #                                                   str(hmf.time()), \
                #                                                   h,m,s))                
                # Se guarda el tiempo.
                total_horas += h
                total_minutos += m
                total_segundos += s
            
            if (dia_inicial == -1 and dia_final == 1):
                print("caso de varios días")
                
            if (dia_inicial == -1 and dia_final == 0) or \
               (dia_inicial == 0 and dia_final == 1):
                # Hora de fin.
                hmf = datetime.strptime('23:59','%H:%M')
                # Vemos la diferencia.
                min1 = timedelta(0,60) # datetime.strptime('00:01','%H:%M')
                dif = hmf - hmi + min1
                # print str(dif + datetime.strptime('00:01','%H:%M'))
                h = int(str(dif).split(':')[0])
                m = int(str(dif).split(':')[1])
                s = int(str(dif).split(':')[2])                
                # Info.
                #print("Franja horaria de %s a %s: %d:%02d:%02d" % (str(hmi.time()), \
                #                                                   str(hmf.time()), \
                #                                                   h,m,s))
                
                # Se guarda el tiempo.
                total_horas += h
                total_minutos += m
                total_segundos += s
                # Hora de inicio y hora de fin.
                hmi = datetime.strptime('00:00','%H:%M')
                hmf = datetime.strptime(hora_fin,'%H:%M')
                dif = hmf - hmi 
                h = int(str(dif).split(':')[0])
                m = int(str(dif).split(':')[1])
                s = int(str(dif).split(':')[2])                
                # Se guarda el tiempo.
                total_horas += h
                total_minutos += m
                total_segundos += s
                # Info.
                #print("Franja horaria de %s a %s: %d:%02d:%02d" % (str(hmi.time()), \
                #                                                   str(hmf.time()), \
                #                                                   h,m,s))                
        
        # Algo de info.
        # print "Tiempo total: %d:%02d:%02d" % (total_horas, total_minutos, total_segundos)                
        
        # Se devuelve tupla (h,m,s)
        return total_horas, total_minutos, total_segundos

    def sonTurnosSolapados(self, ti, tj):
        '''Método que devuelve <True, msj> si el turno ti se solapa en el tiempo
        con el turno t2, donde el orden es j = i + 1. Devuelve <False, msj> si no hay 
        solapamiento'''
        
        # Se obtienen códigos de turnos.
        turno_i = ti['codigo']
        turno_j = tj['codigo']
        
        # Se obtienen los horarios de los dos turnos.
        horario_i = ti['horario']
        horario_j = tj['horario']
        
        # Se itera sobre todos los horarios.
        for i in horario_i:
            # Horas de turno i.
            hora_inicio_i = i[3]['hora_inicio']
            hora_fin_i = i[4]['hora_fin']           
            # Se recuperan horas y minutos.
            hmi_i = datetime(2016, 1, 1, \
                             int(hora_inicio_i.split(':')[0]), \
                             int(hora_inicio_i.split(':')[1])).time()
            hmf_i = datetime(2016, 1, 1, \
                             int(hora_fin_i.split(':')[0]), \
                             int(hora_fin_i.split(':')[1])).time()
            for j in horario_j:
                # ALGG 08-12-2016 Si está cada turno en su día, no se hace nada.
                if (i[2]['dia_final'] == 0 and j[1]['dia_inicial'] >= 0):
                    pass
                else:                
                    # ...las horas... del turno j... 
                    hora_inicio_j = j[3]['hora_inicio']
                    hora_fin_j = j[4]['hora_fin']           
                    # Se recuperan horas y minutos de los dos turnos.
                    hmi_j = datetime(2016, 1, 1, \
                                     int(hora_inicio_j.split(':')[0]), \
                                     int(hora_inicio_j.split(':')[1])).time()
                    hmf_j = datetime(2016, 1, 1, \
                                     int(hora_fin_j.split(':')[0]), \
                                     int(hora_fin_j.split(':')[1])).time()
                    
                    # Hay solapamiento si hora fin de Ti.sgte >= hora inicio Tj.ant.
                    if hmf_i > hmi_j:
                        return True, "Solapamiento entre turnos %s y %s" % (turno_i, \
                                                                            turno_j)  
            
        # Si todo ha ido bien, no hay solapamiento.
        return False, ''
        
    def existeSolapamientoTurnos(self, patron = None):
        '''Devuelve <True, msj> si hay turnos solapados y <False, msj> en caso
        contrario, para los turnos agregados dentro de la clase'''
        ret = False
        msj = ''
        
        set_turnos = self.getTurnos(patron)
        num_turnos = len(set_turnos)

        for k in range(num_turnos):
            # Turno i.
            turno_i = set_turnos[k]
            # Se comprueba si no hay siguiente turno a comparar.
            if k + 1 >= num_turnos: break
            # Turno j
            turno_j = set_turnos[k + 1]
            # ALGG 08-12-2016 Se comprueba si alguno de los turnos es Libre (que
            # no cuenta horas). Si no cuenta horas, no se compara nada.
            if self.esTurnoLibre(turno_i) or \
               self.esTurnoLibre(turno_j): 
                pass
            else:
                # Se comparan turnos... escuchando Depeche Mode... a question of time
                ret, msj = self.sonTurnosSolapados(turno_i, turno_j)
            # Al primer solapamiento, se sale.
            if ret: break

        # Se devuelve estado y mensaje.
        return ret, msj
        
    def __categorizar_horario(self, m,t,n):
        pass
    
    def getTurnos(self, patron = None):
        '''Devuelve lista con los turnos de la clase.
        Parámetros: 
        patron = None, devuelve todos los turnos por orden de creación.
        patron = (<codigo>, <codigo>, <codigo>, ...) devuelve
        una lista ordenada con los códigos definidos. Por ejemplo, se podría
        devolver getTurnos(('M','M','T','N','-') para devolver un patrón de 
        un posible ciclo. Devuelve los turnos en ese orden con respecto a sus
        códigos de turno.
        '''
        
        if patron is not None:
            bolsa = []
            for i in patron:
                for j in self.__turnos:
                    if j['codigo'] == i:
                        bolsa.append(j)
                        break
            return bolsa
        else: return self.__turnos
            
    def getTurnoByCodigo(self, codigo):
        '''Devuelve un <True, turno> a partir de su código pasado como parámetro
        y <False, None> si el turno no existe'''
        ret = False
        turno = None
        
        for i in self.__turnos:
            if i['codigo'] == codigo:
                ret = True
                turno = i
                break
        
        # Devolvemos datos.
        return ret, turno
    
    def getHoraTurno(self, turno):
        '''Devuelve el tiempo total de un turno <horas, minutos, segundos>'''

        # ALGG 08122016 Si el turno es Libre, no se cuentan horas.
        if self.esTurnoLibre(turno): return 0, 0, 0
        else: return self.__cuentaHoras(turno['horario'])
    
    def getHoraPatron(self, patron):
        '''Devuelve el tiempo total de un patrón <horas, minutos, segundos>'''
        
        total_horas = total_minutos = total_segundos = 0
        
        if patron is not None:
            for i in patron:
                h, m, s = self.getHoraTurno(i)
                total_horas += h
                total_minutos += m
                total_segundos += s
                
        return total_horas, total_minutos, total_segundos        
        
    def extenderHorarioTurno(self, turno, dia_inicial, dia_final, \
                             hora_inicio, hora_fin, actualizarTurno = True):
        '''Extiende el horario de un turno, devolviendo <True, msj> si todo
        ha ido bien y <False, msj> si hubo algún tipo de error
        '''
        
        # ALGG 08-12-2016 No se puede extender una actividad Libre.
        if self.esTurnoLibre(turno):
            ret, msj = False, "No se puede extender un turno que no cuente horas"
        else:
                
            # Se busca el turno en la estructura.
            p = self.__turnos.index(turno)
            
            # Se busca el siguiente identificador de horario.
            id_ = 0
            
            print("TurnoHorario: " + str(turno['horario']))
            
            for i in turno['horario']:
                if id_ < i[0]['id']: id_ = i[0]['id']
            id_ += 1
            
            # Se forma el horario.
            horario = [{'id' : id_},
                       {'dia_inicial' : dia_inicial}, 
                       {'dia_final' : dia_final}, 
                       {'hora_inicio': hora_inicio}, 
                       {'hora_fin' : hora_fin}]
            
            # Y se incluye en el horario del turno.
            turno['horario'].append(horario)
    
            # Se valida...
            ret, msj = self.__esTurnoValido(turno, False)
    
            # Se actualiza el turno en la estructura.
            if ret and actualizarTurno:
                self.__turnos[p] = turno
                
        # Se devuelve estado...
        return ret, msj
        
    
class w_ciclo(object):       
    '''Clase ciclo'''
     
    def __init__(self):
        '''Constructor'''
        # Ciclo, compuesto por un conjunto de objetos w_turno.
        self.__ciclo = [{'ciclo' : None}, {'horas_ciclo' : None},
                        {'semanas' : None}, {'codigo' : None}, 
                        {'descripcion' : None}, {'cuenta_festivo' : None}, \
                        {'planilla' : None}]
 
    def cuentaFestivo(self):
        '''Devuelve True si el ciclo cuenta festivos como días de trabajo
        y False en caso contrario'''
        if self.__ciclo[5]['cuenta_festivo'] == 'S': return True
        if self.__ciclo[5]['cuenta_festivo'] == 'N': return False
        
    def getCicloSemanalPorCodTurno(self, ciclo = []):
        '''Método que devuelve una estructura con la planificación de 
        códigos de turnos, por semanas'''
        semanas = self.__newSemanasCiclo(ciclo)
        return semanas
    
    def newCiclo(self, codigo, descripcion, cuenta_festivo, ciclo, \
                 por_pantalla = True):
        '''Crea un ciclo'''
        semanas = self.__newSemanasCiclo(ciclo)
        if por_pantalla: 
            print u"\tCiclo %s - %s\n" % (codigo, descripcion)
            print u"\tLUN\tMAR\tMIÉ\tJUE\tVIE\tSÁB\tDOM"
        total_turnos = []
        for semana in semanas:
            aux = ''
            for dia in semana:
                total_turnos.append(dia)
                aux += u"\t%s" % dia['codigo']
            if por_pantalla: print aux
    
        # Se calcula el total de horas del ciclo.
        t = w_turno()
        total_horas_ciclo = t.getHoraPatron(total_turnos)
        print("Total horas: %d Total minutos: %d Total segundos: %d") % \
             (total_horas_ciclo[0], \
              total_horas_ciclo[1], \
              total_horas_ciclo[2])
        
        # Se guarda el ciclo.
        self.__ciclo[0]['ciclo'] = total_turnos
        # Se guardan las horas del ciclo.
        self.__ciclo[1]['horas_ciclo'] = total_horas_ciclo
        # Se guardan las semanas.
        self.__ciclo[2]['semanas'] = semanas
        # Se guarda el codigo y descripción del ciclo.
        self.__ciclo[3]['codigo'] = codigo
        self.__ciclo[4]['descripcion'] = descripcion
        # ALGG 08-12-2016 Se guarda si cuenta festivo como día trabajado.
        self.__ciclo[5]['cuenta_festivo'] = cuenta_festivo
        
    def __newSemanasCiclo(self, patron, unidades_por_particion = 7):
        '''Crea un ciclo'''
        
        # Cálculo de número de semanas.
        if len(patron) % unidades_por_particion == 0: num_sem = len(patron) / unidades_por_particion 
        else: num_sem = len(patron)
        
        ciclo = []
        puntero = 0
        for i in range(num_sem):
            semana = []
            for j in range(unidades_por_particion):
                try: 
                    semana.append(patron[puntero])
                    puntero += 1
                except:
                    puntero = 0
                    semana.append(patron[puntero])
                    puntero += 1
            ciclo.append(semana)
        
        print "CICLO"
        
        print ciclo
        
        # Se devuelve el ciclo.
        return ciclo
    
    def __proyectarCiclo(self, ciclo, calendario, semana_inicio, \
                         dia_sem_inicio, festivos, turno_libre, \
                         por_pantalla = True):
        '''Proyecta un ciclo en un calendario. Devuelve el ciclo expandido.'''
        
        semana = semana_inicio - 1
        dia = dia_sem_inicio
        planilla = []
        
        # ALGG 15122016 Se crea objeto diccionario para actividad de libre.
        id_libre = turno_libre[0][0]
        cod_libre = turno_libre[0][1]
        desc_libre = turno_libre[0][2]
        aux = {}
        aux.setdefault('cuenta_horas', 'N')
        aux.setdefault('id', id_libre)
        aux.setdefault('codigo', cod_libre)
        aux.setdefault('descripcion', desc_libre)
        turno_libre = aux
        
        # Ciclo de inserción de festivos.
        for i in calendario:
            # ALGG 08-12-2016 Se ve si cuenta festivos. Si no los cuenta, se 
            # tiene que incluir un libre especificado por los parámetros de 
            # entrada del método.
            
            item = [dia, ciclo[semana][dia]]
            
            if not self.cuentaFestivo():
                i_aux = '%s-%s-%s' % (i[0], i[1], i[2])
                try:
                    if festivos[i_aux]: item = [dia, turno_libre]
                except:pass
            
            # Se incluye [(anno, mes, dia), [actividad]] 
            planilla.append([i,item])
            # Se incrementa el día, comprobando si se pasa a la semana siguiente.
            if dia + 1 not in (range(7)): 
                dia = 0
                semana += 1
            else: dia += 1
            if semana + 1 not in (range(len(ciclo)+1)): semana = 0
        
        # Se visualiza por pantalla.
        if por_pantalla:
            print u"\tPLANIFICACIÓN DE CICLO EN CALENDARIO - Última semana: %d" % \
                  (semana + 1)
            # Visualización de días del mes.
            centinela = True
            mes_actual = ano_actual = None
            inicio = puntero = 0
            cal = w_calendar()
            for i in planilla:
                anno = i[0][0] 
                mes = i[0][1]
                dia = i[0][2]
                tur = i[1][1]['codigo']
                nomdia, sigla = cal.getNombreDia(anno, mes, dia, True, True)
                print "\t[%s-%s-%s]\t%s\tTurno: %s" % (dia, mes, anno, nomdia, tur)
        
        # ALGG 09122016 Se devuelve planilla y semana de última planificación.
        return planilla, semana + 1
        
    def planificarCiclo(self, calendario, semana_inicio, \
                        fecha_desde, fecha_hasta, turno_libre, \
                        por_pantalla = True):
        '''Planifica una ciclo y la expande a lo largo de un calendario. Devuelve
        el número de última semana planificada.'''
        
        cal = w_calendar()
        # Datos del ciclo.       
        fdesde = fecha_desde
        fhasta = fecha_hasta
        semanas_ciclo = self.__ciclo[2]['semanas']
        nombre_ciclo = "[%s] %s" % (self.__ciclo[3]['codigo'] , \
                                    self.__ciclo[4]['descripcion'])
        
        # Día de la semana por la que se empieza.
        dia_sem_inicio = cal.getDiaSemana(fdesde[0], fdesde[1], fdesde[2])

        # Algo de info.
        if por_pantalla: 
            print "Ciclo %s - Planificando desde %s-%s-%s hasta %s-%s-%s" % \
                  (nombre_ciclo, str(fdesde[2]), str(fdesde[1]), \
                   str(fdesde[0]), str(fhasta[2]), str(fhasta[1]), \
                   str(fhasta[0])) 

        # Selección del calendario, por meses.        
        cal = calendario['calendario'][int(fdesde[1]) - 1:int(fhasta[1])]
        planilla = []
        p_ini = semanas_ciclo[int(semana_inicio) - 1][dia_sem_inicio]
        for mes in cal:
            anno = mes[0]
            n_mes = mes[1]
            sem_cal = mes[2]
            # Se recorren las semanas.
            seguir = False
            for sem in sem_cal:
                for d in sem:
                    if (d > fhasta[2]) and (n_mes == fhasta[1]): break
                    if (d < fdesde[2]) and (n_mes <= fdesde[1]): continue
                    
                    # Se incluyen días en la planilla.
                    if d >= 1 and d <= 31: planilla.append((anno, n_mes, d))
                    
        # ALGG 08-12-2016 Se recuperan los festivos.
        festivos = calendario['festivos']
        
        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

        print festivos
        
        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        
        # Se proyecta el ciclo en el calendario.
        planilla_proyectada, ultima_semana_planificada = \
            self.__proyectarCiclo(semanas_ciclo, planilla, \
                                  int(semana_inicio), dia_sem_inicio, festivos, \
                                  turno_libre, por_pantalla)
        
        # Se guardan los datos.
        self.__ciclo[6]['planilla'] = planilla_proyectada
        
        # Se devuelve el número de última semana planificada.
        return ultima_semana_planificada
    
    def getPlanilla(self):
        '''Devuelve la planificación del ciclo sobre el calendario'''
        return self.__ciclo[6]['planilla']
  
class w_planificacion(object):
    '''Clase planificación'''
    
    def __init__(self):
        '''Constructor'''
        self.__fecha_desde = None
        self.__fecha_hasta = None
        self.__ultima_semana_planificada = None
        
    def newPlanificacion(self, fecha_desde, fecha_hasta, ciclo, turno_libre, \
                         semana_inicio = 1, \
                         lunes_festivo = False, martes_festivo = False, \
                         miercoles_festivo = False, jueves_festivo = False, \
                         viernes_festivo = False, sabado_festivo = True, \
                         domingo_festivo = True, festivos = [], \
                         por_pantalla = True):
        '''Creación de una planificación para un año. Devuelve <True, planilla,
        [fecha_inicio, fecha_fin, ultima_semana_planificada]>
        si todo es correcto y <False, mensaje, None> si hubo error.
        Parámetros:
        fecha_desde: Tupla (año, mes, dia)
        fecha_hasta: Tupla (año, mes, dia)
        ciclo: Ciclo tipo w_ciclo
        turno_libre: Código de turno que no cuenta horas para usar cuando se 
        tenga que cambiar un turno por una actividad que no cuente horas, como
        Libres o Salientes de Noche.
        semana_inicio: Nº de semana por la que se quiere planificar
        sabado_festivo: El sábado se cuenta como día festivo.
        festivos: Lista de festivos [(año, mes, dia), ..., (año, mes, dia)]
        por_pantalla: True pintará la planilla en pantalla y False no lo hará
        '''
        
        # Solo se puede planificar para un año.
        if fecha_desde[0] != fecha_hasta[0]:
            return False, u"Solo se puede planificar para un solo año", None
        
        calendario = w_calendar()
        c = calendario.getCalendario(fecha_desde[0], festivos, lunes_festivo, \
                                     martes_festivo, miercoles_festivo, \
                                     jueves_festivo, viernes_festivo, \
                                     sabado_festivo, domingo_festivo) 
        
        ultima_semana_planificada = ciclo.planificarCiclo(c, semana_inicio, \
                                                          fecha_desde, \
                                                          fecha_hasta, \
                                                          turno_libre, True)
        
        planilla = ciclo.getPlanilla()

        # ALGG 01-11-2016 Se guardan las fechas de inicio y fin de la 
        # planificación.
        self.__fecha_desde = fecha_desde
        self.__fecha_hasta = fecha_hasta
        # ALGG 09-12-2016 Se guarda última semana planificada.
        self.__ultima_semana_planificada = ultima_semana_planificada
        
        # Algo de info...
        if por_pantalla:
            cal = w_calendar()
            for i in planilla:
                anno = i[0][0] 
                mes = i[0][1]
                dia = i[0][2]
                tur = i[1][1]['codigo']
                nomdia, sigla = cal.getNombreDia(anno, mes, dia, True, True)
                print "\t[%s-%s-%s]\t%s\tTurno: %s" % (dia, mes, anno, nomdia, tur)        
        
        # Se devuelve estado y planilla y lista de fechas con última semana
        # planificada.
        return True, planilla, [fecha_desde, fecha_hasta, ultima_semana_planificada]
     
    def getUltimaSemanaPlanificada(self):
        '''Devuelve la última semana planificada del ciclo'''
        return self.__ultima_semana_planificada
    
    def getFechasPlanificacion(self):
        '''Devuelve tupla <fecha_inicio, fecha_fin> de planificación'''
        return self.__fecha_desde, self.__fecha_hasta    
        
    def particionarPlanificacion(self, planilla):
        '''Particionamiento de planilla en meses. Se devuelve una lista,
        donde cada elemento es un mes, según los elementos de la planilla
        pasada como parámetro'''
        
        # ALGG 08012017 Inicializo esto que sino peta.
        dia = mes = anno = 0
        dia_inicial = None
        
        cambio = True
        particion = []
        particion_mes = []
        num_dias_mes = 0
        
        centinela = True
        
        for i in planilla:
            mes = i[0][1]
            anno = i[0][0]
            dia = i[0][2]
            if centinela:
                centinela = False
                dia_inicial = (anno, mes, dia) 

            codigo = i[1][1]['codigo']
            if cambio:
                mes_actual = mes
                anno_actual = anno
                cambio = False
                
            if anno_actual == anno and mes_actual == mes:
                particion_mes.append((dia, codigo))
                num_dias_mes += 1
            else:
                # Se cambia de mes, por lo que se guarda fila, con
                # formato [anno, mes, nº días mes, día inicial del ciclo, 
                # [elementos], None / ültimo día de planificación en el 
                # último elemento de la última fila].
                particion.append([anno_actual, mes_actual, num_dias_mes, \
                                  dia_inicial, particion_mes, None])
                # Se reinicia el mes.
                particion_mes = []
                particion_mes.append((dia, codigo))
                num_dias_mes = 1
                cambio = True
                
        # Se guarda lo último.
        dia_final = (anno, mes, dia)
        particion.append([anno, mes, num_dias_mes, dia_inicial, \
                          particion_mes, dia_final])
   
        return particion
    
class w_puesto(object):
    '''Clase puesto de trabajo'''
    
    def __init__(self):
        '''Constructor'''
        self.__codigo = None
        self.__descripcion = None
        self.__planificaciones = []
        self.__activo = None
        self.__extras = []
        
    def haySolapamiento(self, f1_inicio, f1_fin, f2_inicio, f2_fin):
        '''Devuelve True si hay solapamiento entre el rango de fechas f1 y f2
        y False en caso contrario. Cada uno de los parámetros tiene que tener
        el formato (año, mes, dia)'''
        
        fi1 = date(f1_inicio[0], f1_inicio[1], f1_inicio[2])
        ff1 = date(f1_fin[0], f1_fin[1], f1_fin[2])
        
        fi2 = date(f2_inicio[0], f2_inicio[1], f2_inicio[2])
        ff2 = date(f2_fin[0], f2_fin[1], f2_fin[2])
   
        if fi2 <= ff1 and fi1 <= ff2:
            return True, "Existe solapamiento entre planificaciones [%s, %s] y [%s, %s]" % \
                   (str(f1_inicio), str(f1_fin), str(f2_inicio), str(f2_fin))
        elif fi1 > ff1 or fi2 > ff2:
            return True, "Existen fechas de fin superiores a fechas de inicio"
        else:
            return False, ""
    
    def ultimaSemanaPlanificacion(self):
        '''Devuelve la última semana de la planificación más reciente de entre
        todas las planificaciones que tiene el puesto'''
  
        ffin_actual = (1900,1,1)
        fini_actual = None
        semana = 0
        for i in self.__extras:
            fini = i[0]
            ffin = i[1]
            sem = i[2]
            if ffin_actual < ffin: 
                ffin_actual = ffin
                fini_actual = fini
                semana = sem
    
        return fini_actual, ffin_actual, semana
    
    def add_planificacion(self, planilla, extra, chequearSolapamiento = True):
        '''Añadir una planificación a un puesto. Se pasa por parámetro la 
        planilla, el identificador del ciclo, y las fechas de inicio y fin
        junto con la última semana de planificación del ciclo'''
        
        # ALGG 09-12-2016 En extra está [fecha inicio planificación, 
        # fecha fin planificación, última semana de planificación]
        self.__extras.append(extra)
                
        ret = True
        msj = ''
        
        # ALGG 08-12-2016 Se comprueba solapamiento entre planificaciones.
        # Se obtiene la fecha de inicio de planificación.
        dia_inicial_nuevo = planilla[0][3]
        tam = len(planilla)
        dia_final_nuevo = planilla[tam - 1][5]
        
        # Se itera por todas las planificaciones, chequeando la fecha de inicio.
        for i in self.__planificaciones:
            dia_inicial = i[0][3]
            tam = len(i)
            dia_final = i[tam - 1][5]
            
            if chequearSolapamiento:
                # Se comprueba si hay solapamiento de fechas.
                ret, msj = self.haySolapamiento(dia_inicial_nuevo, \
                                                dia_final_nuevo, \
                                                dia_inicial, dia_final)
                
                # Si, parece una tontería, pero mejor así que cambiar el nombre
                # de los métodos... amén!
                if ret:
                    ret = False 
                    break
                else: ret = True
            
        if ret:
            self.__planificaciones.append(planilla)
        
        # Se devuelve estado y mensaje.
        return ret, msj
        
    def get_planificaciones(self):
        print("Planificaciones de puesto")
        return self.__planificaciones
        
    def diasMes(self, anno, mes):
        '''Devuelve el número de días de un mes'''
        return monthrange(anno, mes)[1]
        
    def get_planificacion_mensual(self, anno, mes, por_pantalla = True):
        '''Devuelve la planificación mensual de un mes dado, dentro de un 
        año, para el puesto. Devuelve todos los días del mes, que puede incluir
        más de una planificación (más de un ciclo). Los días que no se hayan 
        planificado se incluirá un nulo.'''
        
        bolsa_dias = []

        # Se buscan todos los días del mes y año dado de entre todas las 
        # planificaciones existentes en el puesto.
       
        for planif_ in self.__planificaciones:
            for mes_ in planif_:
                mes_planif = mes_[1]
                anno_planif = mes_[0]
                if mes_planif == mes and anno_planif == anno:
                    # Año y mes a tratar...
                    bolsa_dias.append(mes_)

        # Se crea lista mensual, donde cada elemento es un día con el código
        # de actividad. Si un día no tiene actividad (turno), se inserta un 
        # nulo.
        
        ret_mes = []
        max_dias = self.diasMes(anno, mes)
        
        for i in range(max_dias): ret_mes.append(None)
        
        for item in bolsa_dias:
            items = item[4]
            for j in items:
                dia = j[0]
                codigo = j[1]
                ret_mes[dia - 1] = codigo
        
        if por_pantalla:
            print u"\tPLANIFICACIÓN MENSUAL - AÑO %d , MES %d" % (anno, mes)
            cabecera = ""
            for i in range(max_dias): 
                cabecera += "%s\t" % (i + 1)
            print cabecera
            
            dias = ""
            for i in ret_mes:
                if i == None: dia = ""
                else: dia = i
                dias += "%s\t" % dia
            print dias
            
        return ret_mes
    
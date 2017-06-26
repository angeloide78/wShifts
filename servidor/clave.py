# -*- coding: utf-8 -*-

# Función de creación de clave.

def montar_clave(fecha, ciclo_id, puesto_id, separador = '00'):
    
    cadena = '%s%s%s%s%s' % (fecha.replace('-',''), separador, \
                             ciclo_id, separador, puesto_id)
    
    return cadena

def desmontar_clave(clave, separador = '00'):
    cadena = clave.split(separador)
    fecha = cadena[0]
    ciclo_id = cadena[1]
    puesto_id = cadena[2:]
    
    if ciclo_id.startswith('0'):
        fecha += '0'
        ciclo_id = ciclo_id[1:]
    
    print puesto_id
    
    aux = ''
    puntero = 0
    for i in puesto_id:
        if len(i) == 0: aux += '00'
        elif i.startswith('0'): 
            aux += '0'
            break
        puntero += 1
    
    ciclo_id += aux
    
    puesto_id = puesto_id[puntero:]
    
    aux = ''
    for i in puesto_id:
        if len(i) == 0: aux += '00'
        elif i == '0': aux += '000'
        else: aux += i
        
    puesto_id = aux
    
    
    
    return fecha, ciclo_id, puesto_id, cadena

fecha = '2016-10-20'
ciclo_id = 13000300
puesto_id = 2000603800

print("fecha: ", fecha)
print("ciclo_id: ", ciclo_id)
print("puesto_id ", puesto_id)

ret = montar_clave(fecha, ciclo_id, puesto_id)
print("\n")
print("Clave: ", ret)

ret = desmontar_clave(ret)
print("\n")
print("Valores:", ret)







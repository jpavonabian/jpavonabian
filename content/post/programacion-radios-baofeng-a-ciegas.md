---
title: "Programación de radios Baofeng a ciegas"
date: 2024-10-06T16:47:59+02:00
reply:
uri: "https://jesuspavonabian.es/post/programacion-radios-baofeng-a-ciegas"
categories: ["anything else"]
tags:
draft: false
---
Lo primero que diré:  Programar una radio baofeng utilizando un lector de pantallas es   un engorro. Ni el software de programación de estos equipos ni el programa libre que hay llamado [CHIRP](https://chirpmyradio.com/projects/chirp/wiki/Home) son accesibles al menos que uses alguna distro de Linux, en cuyo caso algo se puede hacer con el anteriormente mencionado.

Por suerte podemos hacer un par de truquitos de esos que hacemos los usuarios de lector de pantallas para resolver las barreras de accesibilidad, apunta, que el proceso es sencillo: Solo tienes que aprender qué es un CSV, tirar de navegador de objetos de NVDA (asumo que el cursor de JAWS también podría servir) y echarle paciencia.
## Consiguiendo lo necesario
- en primer lugar, descarga la última versión de [CHIRP](https://chirpmyradio.com/projects/chirp/wiki/Home) para Windows.
- Después descarga la [versión del software adecuada para programar tu Baofeng](https://www.baofengradio.com/pages/download). Los elementos que despliegan las descargas no reciben foco, así que tendrás que usar un poco de magia negra: Ponte encima del elemento con el nombre de tu equipo de radio y pulsa enter. si hay suerte, se desplegarán los enlaces de descarga. si no, tendrás que mover el ratón encima del elemento y dar click de ratón.

¿Tenemos todo? Podemos continuar.
## Preparando el CSV
Un CSV es un archivo que almacena elementos separados por comas en forma de tabla. Lo verás más claro con un ejemplo:
```
Nombre,Apellido
José,Pérez
Antonio,Flóres
```
Como ves, en la primera línea ponemos lo que sería la cabecera de la tabla y en las siguientes colocamos los distintos valores. Eso se guarda como archivo con extensión csv y se puede usar para alimentar bases de datos, para leerlo más tarde, para exportar contenido a un formato legible por distintas aplicaciones al ser texto plano...

Pues un CSV es lo que necesitamos para configurar nuestro cacharro, ya que meter los datos a mano es inaccesible, aunque sería mucho más cómodo y menos propenso a errores.
Los campos que requiere nuestro CSV son los siguientes:
```
Location,Name,Frequency,Duplex,Offset,Tone,rToneFreq,cToneFreq,DtcsCode,DtcsPolarity,Mode,TStep,Comment
```
Colocando eso como primera línea en nuestro archivo .csv solo tendríamos que rellenar las siguientes filas con la información de los canales que queremos añadir, dejando vacíos los campos que no nos interesen. Por ejemplo:
```
6,ISS,437.800000,-,-0.145000,CTCSS,67.0,67.0,023,NN,FM,5,"ISS Repeater"
```
´Significa lo siguiente:
1. **Location**:  
   - Valor: `6`
   - Explicación: Es el canal o ubicación en una lista de repetidores. En este caso, el número 6 está asociado a este repetidor.

2. **Name**:  
   - Valor: `ISS`
   - Explicación: Nombre del repetidor. En este caso, es el repetidor de la Estación Espacial Internacional (International Space Station, ISS).

3. **Frequency**:  
   - Valor: `437.800000 MHz`
   - Explicación: Frecuencia de operación del repetidor. En este caso, transmite en 437.8 MHz.

4. **Duplex**:  
   - Valor: `-`
   - Explicación: El valor "-" indica que la frecuencia es de bajada (downlink), es decir, la frecuencia a la que el repetidor transmite hacia los usuarios. Si estuviera vacío, indicaría que no hay una diferencia entre la frecuencia de transmisión y recepción.

5. **Offset**:  
   - Valor: `-0.145000 MHz`
   - Explicación: Diferencia entre la frecuencia de recepción (transmisión del usuario) y la frecuencia de transmisión del repetidor. Aquí se especifica un desplazamiento negativo de 145 kHz.

6. **Tone**:  
   - Valor: `CTCSS`
   - Explicación: Tipo de tono usado para acceder al repetidor.

7. **rToneFreq**:  
   - Valor: `67.0 Hz`
   - Explicación: La frecuencia del tono CTCSS (tono de silenciamiento) para transmisión (TX). Aquí, el tono requerido es 67.0 Hz.

8. **cToneFreq**:  
   - Valor: `67.0 Hz`
   - Explicación: La frecuencia del tono CTCSS para recepción (RX). En este caso, es también 67.0 Hz, coincidiendo con el tono de transmisión.

9. **DtcsCode**:  
   - Valor: `023`
   - Explicación: Código DCS (Digital Coded Squelch) que puede ser usado en lugar del CTCSS. Aquí se especifica el código 023.

10. **DtcsPolarity**:  
    - Valor: `NN`
    - Explicación: Polaridad DCS, que indica la dirección de la codificación digital (normal o invertido). Aquí `NN` significa normal en transmisión y normal en recepción.

11. **Mode**:  
    - Valor: `FM`
    - Explicación: El modo de transmisión que utiliza el repetidor. En este caso, es FM (Frecuencia Modulada).

12. **TStep**:  
    - Valor: `5`
    - Explicación: Este es el paso de frecuencia o el "step" que se utiliza al ajustar manualmente la frecuencia. Aquí, es un paso de 5 kHz.

13. **Comment**:  
    - Valor: `"ISS Repeater"`
    - Explicación: Comentario adicional o información descriptiva sobre el repetidor. En este caso, se menciona que es el repetidor de la ISS.

Otro ejemplo de repetidor es el siguiente:
```
2,"ED7YAX Huelva",438.625000,-,7.6,Tone,88.5,88.5,023,NN,FM,5,"Huelva",
```
Resuelto el tema de los CSV ([Repeater Book](https://www.repeaterbook.com/) es tu amigo si no quieres hacerlos a mano o modificarlos lo mínimo posible) toca subirlos a la radio.
## Subir el CSV a la radio
No es difícil, aún así lo dejo documentado.
- Encendemos la radio con el volumen al máximo.
- Le colocamos el cable de programación y lo enchufamos a un USB libre.
-- Abrimos CHIRP.
- Pulsamos alt para ir a la barra de menús y buscamos el menú radio con las flechas.
- Pulsamos en la opción de descargar desde radio.
- Seleccionamos el controlador y el puerto.
- Pulsamos aceptar y esperamos que la barra de porcentaje llegue al 100.
- Guardamos con CTRL + S la imagen de la radio por si algo sale mal poder restaurarla.
- Pulsamos CTRL+Tab hasta llegar a la lista de pestañas y seleccionamos la de memoria.
- Con la pestaña seleccionada, sin hacer nada más que seleccionarla, pulsamos alt para ir a la barra de menú y seleccionamos importar.
- Localizamos nuestro archivo CSV y volvemos a darle a importar.
- cuando esté todo listo, volvemos a la barra de menú y le damos a cargar a la radio desde el menú radio, seguimos las instrucciones y si todo va bien y no tenemos ningún error tendremos los canales colocados en nuestra Baofeng y podemos desconectarla.

## ¿Y entonces para qué me has hecho descargar el software de programación original?
Con CHIRP no podemos acceder a programar todos los parámetros. Con el Software de programación original y la ayuda del navegador de objetos y mucha paciencia podemos toquetear el resto de parámetros. Es bastante intuitivo, y si hemos hecho todo bien, tendremos un .img con la configuración de fábrica que podremos restaurar desde CHIRP desde la opción adecuada de la barra de menú, abriéndolo antes de enchufar la radio y cargándolo sin bajar los datos antes.

Espero que este post sirva al menos para poder empezar a trastear con estos equipos.
Por cierto, el Martes pasado me dieron el indicativo, soy **EA7LEE**.
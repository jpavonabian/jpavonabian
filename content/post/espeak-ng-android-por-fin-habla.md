---
title: "Por fin habla eSpeak NG en Android"
date: 2026-10-10T18:30:00+02:00
reply:
uri: "https://jesuspavonabian.es/post/espeak-ng-android-por-fin-habla"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

En el [post anterior](https://jesuspavonabian.es/post/cambiar-tts-grapheneos-adb) terminé pidiendo que, si alguien conseguía que eSpeak NG funcionara en Android, me avisara. Nadie me avisó, así que me tocó a mí. Esta tarde he hecho que hable, he descubierto que se callaba a los dos minutos y he arreglado eso también. Hay una [pull request](https://github.com/espeak-ng/espeak-ng/pull/2587) abierta con el arreglo.

Utilicé claude Code, si no no hubiera dado con el fallo tan rápido.

## Por qué decía "0 voces"

Con la 1.52.0 de GitHub, lo que me salía al abrir los ajustes era "Lo sentimos, espeak no ha podido inicializarse". La [issue 1078](https://github.com/espeak-ng/espeak-ng/issues/1078) lleva años abierta con el mismo síntoma, y en los comentarios hay varias teorías.

Saqué el log del móvil con `adb logcat` mientras cambiaba a eSpeak, y ahí estaba. Cuando el servicio arranca y no encuentra las voces, intenta abrir una pantalla para extraerlas. Pero Android 10 y posteriores no dejan que una app abra pantallas por su cuenta desde segundo plano, y un servicio de voz está siempre en segundo plano. El sistema bloquea la pantalla (`Background activity launch blocked`), las voces nunca se extraen y el motor se queda sin nada que decir.

Esto ya lo habían arreglado. Desde marzo, `master` extrae las voces dentro del propio servicio, sin pantallas de por medio ([el commit](https://github.com/espeak-ng/espeak-ng/commit/1e632364)). Lo que pasa es que la 1.52.0 es de diciembre de 2024 y no se ha publicado ninguna versión desde entonces. Quien instala la última release se encuentra con el bug resuelto en un sitio al que no puede llegar.

## Compilarlo en Windows

Si no hay release, se compila. En mi ordenador eso fue más aventura de lo que esperaba:

- Java por defecto era la 8. Me valió el que trae Android Studio.
- Gradle se bajó solo el NDK y CMake, que no tenía.
- El paso que genera los datos de voz necesita un compilador de Windows (MSVC o gcc), y no tengo ninguno. Generé las voces en WSL, que sí tiene gcc, y le pasé la carpeta a Gradle con un apaño temporal en un fichero de CMake que luego revertí.

El APK salió bien. Desinstalé la 1.52.0 (la firma es distinta y no se puede instalar encima) e instalé el mío. Y no veía la app. Es normal: en móviles no tiene icono de lanzador, solo se llega a sus ajustes desde el engranaje que sale junto a eSpeak en Ajustes, Salida de texto a voz. Una vez ahí, eSpeak habló.

## Y a los dos minutos se callaba

Lo celebré demasiado pronto. Al abrir los ajustes de Espeak... Silencio mortal.

Esta vez no había nada en el log que dijera "error". Las peticiones llegaban, el motor respondía que todo había ido bien y el audio salía casi vacío. Así que hice un APK de diagnóstico que apuntaba, por cada frase, el texto, cuánto audio producía y por qué terminaba.

Y salió algo que no esperaba. Una frase normal producía unos 26.000 fragmentos de audio. Justo después de abrir una pantalla de ajustes, frases igual de normales producían 110. Entre una cosa y otra había una segunda llamada a `espeak_Initialize`.

La explicación es que eSpeak guarda su estado en variables globales del proceso, y cada pantalla de ajustes crea su propio objeto de voz para listar los idiomas, que vuelve a inicializar el motor. Si el servicio estaba hablando en ese momento, le reseteaban el motor por debajo. En el log, además, el proceso de eSpeak desaparecía y aparecía otro justo después, aunque eso no lo he llegado a confirmar.

El arreglo es pequeño: inicializar una sola vez por proceso y devolver el mismo resultado a quien lo pida después. Lo probé en el móvil y dejó de callarse.

## El test que no probaba nada

Para la PR quería un test, y aquí hay una lección para mí. Mi primera versión fallaba sin el arreglo, pero también con él: la diferencia entre la primera y la segunda frase era de 28 bytes y no tenía nada que ver con el bug. La segunda versión pasaba siempre, con y sin arreglo. Un test que nunca falla no protege nada.

El problema estaba en el idioma. Cuando eSpeak se reinicializa vuelve al inglés, y mi test hablaba en inglés, justo el único caso en el que el fallo no se nota. En español sí: sin el arreglo, 115 KB de audio se quedan en 220 bytes (los 110 fragmentos del log). Con el arreglo, pasa. Lo ejecuté en el Pixel y lo dejé escrito en la descripción de la PR.

## El susto del final

Ejecutar tests instrumentados desde Gradle en el móvil tiene una pega que yo no esperaba: al terminar, desinstala la app que ha probado. Me quedé con eSpeak puesto como motor, sin que eSpeak estuviera instalado. TalkBack, por supuesto, se calló. Si has leído el post anterior, ya sabes cómo me sentó. Reinstalé el APK, lo volví a seleccionar y vuelve a hablar, pero la lección es la de siempre: antes de tocar el motor de voz, ten a mano el comando para volver atrás.

## Dónde queda esto

- La PR [#2587](https://github.com/espeak-ng/espeak-ng/pull/2587) espera revisión. No sé cuánto tardarán, ni si les parecerá bien.
- Para que le sirva a alguien más hace falta una release que incluya el arreglo de marzo y el mío. Dejé un comentario en la [issue 1078](https://github.com/espeak-ng/espeak-ng/issues/1078) pidiéndola.
- Mientras tanto, yo voy con un APK de depuración propio. No se actualiza solo y, cuando salga la versión oficial, tendré que desinstalarlo antes de instalarla.

Si te topas con el "0 voces" en la 1.52.0, ya sabes que no eres tú. Y si consigues compilarlo por tu cuenta, [la PR](https://github.com/espeak-ng/espeak-ng/pull/2587) tiene el arreglo para que no se te calle a los dos minutos.

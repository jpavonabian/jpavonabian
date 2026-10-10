---
title: "Primeros pasos con GrapheneOS"
date: 2026-10-10T19:00:00+02:00
reply:
uri: "https://jesuspavonabian.es/post/primeros-pasos-grapheneos"
categories: ["anything else"] # note, reply, anything else
tags:
draft: true
---

Esta es la guía que me habría gustado tener cuando compré el Pixel 10: instalar GrapheneOS usando solo NVDA y el navegador, dejar TalkBack hablando en castellano y no quedarte sin voz por el camino. Incluye los sustos que me llevé yo, que no fueron pocos, y todo lo que conté antes sobre el motor de voz.

## Antes de empezar

La instalación se hace desde el ordenador. En el móvil solo hay que pulsar botones físicos en dos momentos. Calcula una hora con calma.

Necesitas:

- Un ordenador con Windows 10 u 11 actualizado, con al menos 2 GB de RAM y 32 GB de disco libres. Nada de máquinas virtuales: el USB falla a menudo.
- Chrome o Edge actualizados, y sin modo incógnito, porque no deja espacio para descomprimir el sistema. Brave solo con los Shields desactivados.
- El cable USB-C que viene en la caja del Pixel, conectado directo a un puerto del portátil o a uno trasero del PC. Sin hubs ni puertos frontales, que son la causa más habitual de errores.
- Una wifi a mano para el primer arranque del Android de fábrica.

Dos avisos de accesibilidad. Hay dos pantallas sin voz: la del modo bootloader (Fastboot) y la de confirmación de desbloqueo y bloqueo. Te digo exactamente qué botones pulsar, pero si quieres ir sobre seguro, ten a alguien que vea cerca en esos dos momentos. Además, el instalador web es una página con cuatro botones en orden (desbloquear, descargar, flashear y bloquear), y debajo de cada uno aparece un texto de estado. NVDA puede no anunciarlo solo, así que revísalo con el cursor después de cada paso.

Si te atascas, el canal oficial de chat de GrapheneOS (Matrix o Discord) suele tener gente dispuesta a ayudar.

## Paso 1: preparar el Android de fábrica

Solo hay un objetivo: activar el desbloqueo OEM. Todo lo que configures aquí se borra después, así que haz lo mínimo y sin cuenta de Google.

1. Enciende el móvil y, en la pantalla de bienvenida, mantén pulsados los dos botones de volumen a la vez unos segundos. Se activa TalkBack.
2. Conéctate a la wifi. Hace falta, porque el desbloqueo OEM solo se activa si el móvil puede comprobar por internet que no lo ha bloqueado una operadora.
3. Salta todo lo demás: cuenta de Google (busca "Omitir"), copia de datos, huella, PIN y asistente. No pongas PIN, te ahorra pasos.
4. Si te ofrece una actualización del sistema puedes instalarla, pero no es imprescindible: GrapheneOS actualiza el firmware igualmente.
5. Activa las opciones de desarrollador: Ajustes → Información del teléfono → Número de compilación, y púlsalo unas siete veces seguidas hasta que avise de que ya eres desarrollador.
6. Activa el desbloqueo OEM en Ajustes → Sistema → Opciones para desarrolladores → Desbloqueo de OEM. Confirma el aviso.

Si el interruptor aparece desactivado o no te deja tocarlo, no sigas. Espera unos minutos con wifi y reinicia.

Al terminar, apaga el móvil.

## Paso 2: instalar GrapheneOS

Abre en el ordenador [el instalador web de GrapheneOS](https://grapheneos.org/install/web) y sigue este orden.

1. Arranca el móvil en modo bootloader. Con el móvil apagado, mantén pulsado bajar volumen y, sin soltarlo, enciéndelo con el botón de encendido. Suelta cuando vibre y pasen un par de segundos. No hay voz: en pantalla sale un triángulo rojo y "Fastboot Mode". No pulses el botón de encendido después, porque arrancaría el sistema.
2. Conecta el cable al ordenador. Windows 10 y 11 actuales ya traen el controlador. Si no reconoce el móvil, busca en Windows Update → Actualizaciones opcionales un controlador llamado "LeMobile Android Device".
3. Pulsa "Unlock bootloader" en la página. El navegador te pedirá elegir el dispositivo USB: selecciona el Pixel y acepta.
4. Confirma en el móvil, en la pantalla sin voz. La opción por defecto es no desbloquear. Pulsa una vez un botón de volumen para pasar a "Unlock the bootloader" y después el botón de encendido para confirmar. Esto borra el móvil, como esperábamos. Mira el texto de estado de la página para comprobar que dice desbloqueado.
5. Pulsa "Download release". Tarda unos minutos, así que espera a que el estado diga que ha terminado.
6. Pulsa "Flash release". Instala firmware y sistema y reinicia el móvil al bootloader varias veces por sí solo. No lo toques hasta que la página diga que ha terminado. Si tras un reinicio el navegador vuelve a pedirte el dispositivo, selecciónalo otra vez.

Si algo falla aquí, casi siempre es el cable o el puerto. Prueba otro y repite desde el paso que falló.

## Paso 3: bloquear el bootloader

Este paso no es opcional. Sin bloquear no hay arranque verificado, que es la base de la seguridad de GrapheneOS. Hazlo antes de configurar nada, porque bloquear borra el móvil otra vez.

1. Con el móvil todavía en modo bootloader y conectado, pulsa "Lock bootloader" en la página.
2. Confirma en el móvil, en la pantalla sin voz, igual que al desbloquear: una pulsación de volumen para pasar a la opción de bloquear y después el botón de encendido.
3. Comprueba en la página que el estado dice bloqueado.
4. Desconecta el cable y pulsa el botón de encendido. La opción por defecto en esa pantalla es "Start" y arranca GrapheneOS.

Al arrancar verás, sin voz, un aviso amarillo de unos segundos que dice que el móvil lleva otro sistema operativo. Es normal y saldrá en cada encendido. Muestra un código que, si alguien te lo lee, puedes comparar con el oficial del Pixel 10: empieza por `3f7415ea` y termina en `c7ea02c7`. No es imprescindible comprobarlo.

El desbloqueo OEM se desactiva en la última pantalla de la configuración inicial, que es el siguiente paso.

## Paso 4: primer arranque y TalkBack

Desde la versión de mayo de 2026, GrapheneOS trae su propia versión de TalkBack y su motor de voz (GrapheneOS Speech Services), así que debería hablar sin instalar nada. Eso sí, en mi caso la voz que trae es la que es, y yo quería algo que me dejara usar el móvil en castellano y a buena velocidad. De ahí salió el resto de la guía.

1. Activa TalkBack en la primera pantalla manteniendo pulsados los dos botones de volumen, como en el Android de fábrica.
2. Si suena la activación pero no habla, o habla en un idioma que no entiendes, el motor no tiene la voz adecuada. Pide ayuda para terminar la configuración y luego instala RHVoice (paso 5).
3. Elige español y sigue el asistente. Conéctate a la wifi para que busque actualizaciones.
4. Pon un PIN o una contraseña. Yo recomiendo una contraseña larga y la huella para el día a día. Si quieres, activa después la opción de huella más PIN corto como segundo factor.
5. La última pantalla del asistente trae marcada por defecto una casilla para desactivar el desbloqueo OEM. Déjala marcada.

Como comprobación final, entra en Ajustes → Sistema → Actualización del sistema y pulsa "Buscar actualizaciones". Si descarga algo, reinicia cuando avise.

Verificar la instalación con la app Auditor requiere un segundo móvil Android, así que puedes saltarlo: el arranque verificado ya protege el sistema en cada encendido.

## Paso 5: el motor de voz

Esta es la parte donde más tiempo perdí, y donde más fácil es quedarse sin TalkBack. Antes de tocar nada, mira cuál es el motor que tienes ahora y apúntalo:

```
adb shell settings get secure tts_default_synth
```

Para usar adb necesitas la depuración USB activada (Ajustes → Opciones para desarrolladores), las platform-tools de Android en el PC y los APKs que vayas a instalar en una carpeta. Comprueba que el móvil se ve con `adb devices`. La primera vez te pide autorizar el ordenador: acepta y marca "permitir siempre". Tiene que aparecer como `device`, no como `unauthorized`.

### El botón del pánico

Antes de probar motores, deja preparado un `.bat` en el escritorio del PC. Devuelve el motor al predeterminado y el sistema a inglés, que es el estado en el que la voz de serie sí habla:

```
adb shell settings delete secure tts_default_synth
adb shell settings put system system_locales en-US
adb reboot
```

Lo hice a la tercera vez que me quedé sin voz, y te recomiendo no esperar a la tercera.

### La regla que no te saltes

El idioma del sistema y el idioma de la voz tienen que coincidir. TalkBack le pide la voz al motor en el idioma del sistema, y si el motor no lo tiene, en lugar de buscarse la vida con otro se queda en silencio. Me pasó dos veces.

Si cambias uno, ten el comando para cambiar el otro justo después. Y la forma de poner un motor por defecto es esta:

```
adb shell settings put secure tts_default_synth com.github.olga_yakovleva.rhvoice.android
```

Después, reinicia TalkBack: mantén pulsadas las dos teclas de volumen unos segundos para apagarlo y otra vez para encenderlo.

### RHVoice, el que me quedaría si no hubiera arreglado eSpeak

[RHVoice](https://f-droid.org/packages/com.github.olga_yakovleva.rhvoice.android/) está pensado para lectores de pantalla (tiene hasta complemento para NVDA), es ligero y tiene español. La pega es que no publican APK en GitHub, solo en F-Droid y Play. Yo descargué el APK desde la web de F-Droid, sin instalar su cliente, y comprobé la firma antes de instalarlo:

```
apksigner verify --print-certs com.github.olga_yakovleva.rhvoice.android_118040.apk
```

`apksigner` no viene con adb, está en las build-tools del SDK de Android. En mi caso lo firma F-Droid y no el proyecto. No es lo que yo quería, pero decidí tirar para adelante.

Los pasos, con cabeza y con miedito:

1. Instálalo con `adb install com.github.olga_yakovleva.rhvoice.android_118040.apk`.
2. Abre RHVoice, entra en Español e instala una voz. Se descargan desde la app, así que necesita el permiso de Red de GrapheneOS.
3. Pruébalo sin ponerlo por defecto: Ajustes → Salida de texto a voz → engranaje de RHVoice → "Escuchar un ejemplo".
4. Solo si el ejemplo suena en español, ponlo por defecto con el comando de arriba y reinicia TalkBack.

Instalarlo no basta, hay que elegirlo en Ajustes → Accesibilidad → Salida de texto a voz.

### eSpeak NG

La 1.52.0 es la voz clásica de los lectores de pantalla y la que yo quería. La release de GitHub me recibió con un "0 voces instaladas" y, al abrir los ajustes, con un "Lo sentimos, espeak no ha podido inicializarse". La [issue 1078](https://github.com/espeak-ng/espeak-ng/issues/1078) lleva años abierta con el mismo síntoma, y esa versión no la arreglas tocando nada en el móvil. La explicación está en el log (`adb logcat`): cuando el servicio arranca y no encuentra las voces, intenta abrir una pantalla para extraerlas, y Android 10 y posteriores no dejan que una app abra pantallas desde segundo plano, que es donde vive siempre un servicio de voz. El sistema la bloquea (`Background activity launch blocked`) y el motor se queda sin nada que decir.

Eso ya está arreglado en `master` desde marzo, que extrae las voces dentro del propio servicio ([el commit](https://github.com/espeak-ng/espeak-ng/commit/1e632364)). El problema es que la 1.52.0 es de diciembre de 2024 y no ha salido ninguna versión desde entonces.

Así que compilé yo `master` en Windows, y fue más aventura de lo que esperaba. Java por defecto era la 8, y me valió el que trae Android Studio. Gradle se bajó solo el NDK y CMake. El paso que genera los datos de voz necesita un compilador de Windows (MSVC o gcc) y yo no tengo ninguno, así que generé las voces en WSL y le pasé la carpeta a Gradle con un apaño temporal en un fichero de CMake que luego revertí. Desinstalé la 1.52.0 (la firma es distinta y no se puede instalar encima) e instalé el mío. Y no veía la app, pero es normal: en móviles no tiene icono, solo se llega a sus ajustes desde el engranaje junto a eSpeak en Ajustes → Salida de texto a voz. Una vez ahí, hablaba.

Lo celebré demasiado pronto, porque a los dos minutos se callaba. Esta vez no había ningún error en el log: las peticiones llegaban, el motor decía que todo iba bien y el audio salía casi vacío. Hice un APK de diagnóstico que apuntaba por cada frase el texto, el audio producido y por qué terminaba. Una frase normal producía unos 26.000 fragmentos de audio, y justo después de abrir una pantalla de ajustes, frases igual de normales producían 110. Entre una cosa y otra había una segunda llamada a `espeak_Initialize`.

eSpeak guarda su estado en variables globales del proceso, y cada pantalla de ajustes crea su propio objeto de voz para listar los idiomas, que vuelve a inicializar el motor. Si el servicio estaba hablando en ese momento, le reseteaban el motor por debajo. El arreglo es pequeño: inicializar una sola vez por proceso y devolver el mismo resultado a quien lo pida después. Lo probé en el móvil y dejó de callarse. Utilicé Claude Code para esto, y sin él no habría dado con el fallo tan rápido.

Abrí una [pull request](https://github.com/espeak-ng/espeak-ng/pull/2587) con el arreglo. Para ella quería un test, y me costó. El primero fallaba con y sin arreglo, y el segundo pasaba con y sin él, porque hablaba en inglés: justo el idioma al que vuelve eSpeak al reinicializarse y el único caso en el que el fallo no se nota. En español sí: sin el arreglo, 115 KB de audio se quedan en 220 bytes. Con el arreglo, pasa.

Un último susto: ejecutar tests instrumentados desde Gradle en el móvil desinstala la app al terminar. Me quedé con eSpeak como motor sin que eSpeak estuviera instalado, y TalkBack, por supuesto, se calló. Por eso el botón del pánico.

La PR espera revisión y no sé cuánto tardarán. Para que le sirva a alguien más hace falta una release que incluya el arreglo de marzo y el mío, y dejé un comentario en la issue pidiéndola. Mientras tanto, el APK que compiles tú no se actualiza solo, y tendrás que desinstalarlo antes de instalar la versión oficial. Para el día a día te recomiendo RHVoice, a menos que estés tan loco como yo.

## Paso 6: primeros ajustes

Empieza con todo en el perfil principal y sin Google. Ya habrá tiempo de crear perfiles.

1. Instala Accrescent desde la tienda de GrapheneOS. Después, Obtainium para apps publicadas en GitHub o GitLab, y F-Droid solo para lo que no encuentres en otro sitio.
2. Bitwarden con Vaultwarden: instálalo desde GitHub con Obtainium, inicia sesión con la URL de tu servidor, activa la huella y ponlo como servicio de autorrelleno.
3. GrapheneOS oculta por defecto las contraseñas al escribir. Si las prefieres visibles como en Android normal: Ajustes → Seguridad y privacidad → Privacidad → Mostrar contraseñas.
4. Las actualizaciones ya son automáticas. En Ajustes → Sistema → Actualización del sistema puedes limitarlas a wifi o activar el reinicio automático cuando el móvil esté inactivo.
5. El puerto USB solo carga mientras el móvil está bloqueado. Para pasar archivos al ordenador, desbloquéalo antes de conectar.

Más adelante, si necesitas apps que dependen de Google (el banco, WhatsApp con notificaciones fiables), crea un perfil aparte e instala ahí Google Play desde la tienda de GrapheneOS. Recuerda activar TalkBack en ese perfil nuevo con el atajo de los dos botones de volumen.

## Si algo sale mal

El móvil es muy difícil de estropear: mientras puedas entrar en modo bootloader, siempre puedes reinstalar.

- Si el navegador no ve el móvil, prueba otro puerto USB, el cable original, Chrome o Edge actualizados y sin incógnito. Revisa el controlador en Windows Update.
- Si falla a mitad del flasheo, vuelve a modo bootloader (bajar volumen más encendido) y repite "Flash release".
- Si TalkBack no habla tras instalar, termina la configuración con ayuda e instala RHVoice. Y si ya cambiaste de motor y se calló, el `.bat` del paso 5.
- Para volver al Android de fábrica (garantía o venta), con el bootloader desbloqueado usa primero el botón "Remove non-stock key" del final de la página del instalador de GrapheneOS, y después la [herramienta oficial de Google](https://flash.android.com/back-to-public) para instalar el sistema original y bloquear el bootloader.

## Resumen para no repetir mis errores

- Apunta el motor de voz que tienes antes de cambiarlo.
- No cambies de motor sin el PC conectado y el comando de vuelta atrás preparado.
- Prueba la voz con "Escuchar un ejemplo" antes de ponerla por defecto.
- El idioma del sistema y el de la voz tienen que coincidir, o TalkBack se calla.
- No desinstales un motor que esté puesto por defecto.

## Fuentes

- [GrapheneOS: instalador web](https://grapheneos.org/install/web)
- [GrapheneOS: guía de uso (accesibilidad, actualizaciones, Google Play en sandbox)](https://grapheneos.org/usage)
- [Foro de GrapheneOS: versión 2026052400 con motor de voz propio](https://discuss.grapheneos.org/d/35816-grapheneos-version-2026052400-released)
- [Issue 1078 de eSpeak NG](https://github.com/espeak-ng/espeak-ng/issues/1078) y [PR 2587](https://github.com/espeak-ng/espeak-ng/pull/2587)

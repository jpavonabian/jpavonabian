---
title: "Cambiar el motor de voz en GrapheneOS por ADB"
date: 2026-10-10T17:10:00+02:00
reply:
uri: "https://jesuspavonabian.es/post/cambiar-tts-grapheneos-adb"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

Actualización, esa misma tarde: las causas que apunto más abajo para las 0 voces de eSpeak NG no eran las buenas, y ya lo tengo hablando en el móvil. Lo cuento en [Por fin habla eSpeak NG en Android](https://jesuspavonabian.es/post/espeak-ng-android-por-fin-habla).

Ya tengo el Pixel con GrapheneOS. TalkBack viene incluido, pero el motor de voz que trae es el que es, y yo quería algo que me dejara usar el móvil en castellano y a buena velocidad. El plan era sencillo: instalar eSpeak NG por adb, ponerlo como motor por defecto y a correr.

No salió como esperaba. Esta es la guía que me habría gustado tener esta mañana, sustos incluidos.

## Antes de empezar

- Depuración USB activada en el móvil: Ajustes → Acerca del teléfono → pulsar 7 veces en el número de compilación → Opciones de desarrollador → Depuración USB.
- Las platform-tools de Android en el PC, que es donde viene `adb`.
- Los APKs que vayas a instalar en una carpeta del PC.

Comprueba que el móvil se ve:

```
adb devices
```

La primera vez, el móvil pide autorizar el ordenador. Acepta y marca "permitir siempre desde este ordenador". El dispositivo tiene que aparecer como `device`, no como `unauthorized`.

Y antes de tocar nada, apunta el motor de voz que tienes ahora:

```
adb shell settings get secure tts_default_synth
```

Parece una tontería, pero luego lo vas a necesitar.

## Intento 1: eSpeak NG, cero voces

Descargué el APK de eSpeak NG de las releases de GitHub (la 1.52.0), lo instalé con `adb install` y lo abrí. Me recibió con un precioso "0 voces instaladas".

Probé de todo: borrar los datos de la app, forzar la extracción de datos de voz por adb, mirar el `logcat`... La extracción se ejecutaba sin un solo error y aun así seguía en cero. Probé también versiones antiguas, pero esas solo traen librerías de 32 bits y los Pixel modernos son solo de 64, así que ni se instalan (`INSTALL_FAILED_NO_MATCHING_ABIS`).

Resulta que no era cosa mía: [la app de eSpeak NG para Android lleva rota años](https://github.com/espeak-ng/espeak-ng/issues/1078). En la issue se apuntan dos causas: un problema al empaquetar los datos de voz en el APK y un fallo del motor, que no se reinicializa después de extraerlos. Hay más gente con GrapheneOS en la misma situación.

Para desinstalarlo:

```
adb uninstall com.reecedunn.espeak
```

## Intento 2: sherpa-onnx, o el primer susto

La alternativa libre que encontré fue [sherpa-onnx](https://k2-fsa.github.io/sherpa/onnx/tts/apk-engine.html), que publica motores de voz para Android con voces neuronales. Cada APK lleva una sola voz; para un Pixel hay que coger los que ponen `arm64-v8a` y para castellano los `spa`. Yo cogí el más ligero, `es_ES-carlfm-x_low`.

Lo instalé, abrí la app y habló. Así que lo puse como motor por defecto:

```
adb shell settings put secure tts_default_synth com.k2fsa.sherpa.onnx.tts.engine
```

Y TalkBack se calló. Del todo.

Por suerte tenía el PC conectado. Este comando devuelve el motor por defecto al que elija el sistema:

```
adb shell settings delete secure tts_default_synth
```

¿Por qué se calló? Porque el sistema estaba en inglés. TalkBack le pide la voz al motor en el idioma del sistema, sherpa solo tenía castellano, y en lugar de buscarse la vida con otro motor, TalkBack se queda en silencio.

## El segundo susto: cambiar el idioma del sistema

Sabiendo eso, cambié el sistema a castellano. Con la voz por defecto, que no habla castellano. Y me quedé sin TTS otra vez. Oh, maravilla.

El `delete` de antes no servía ahora, porque volvía a poner precisamente la voz que no habla castellano. Lo que hacía falta era lo contrario: poner el motor que sí lo habla.

```
adb shell settings put secure tts_default_synth com.k2fsa.sherpa.onnx.tts.engine
```

Reiniciar TalkBack (mantener pulsadas las dos teclas de volumen unos segundos para apagarlo y otra vez para encenderlo) y a hablar. Susto que me dio el hijoputa.

La lección: el idioma del sistema y el idioma de la voz tienen que coincidir. Si cambias uno, ten preparado el comando para cambiar el otro justo después.

## Intento 3: RHVoice, el que se queda

sherpa hablaba, sí, pero con voces neuronales cada fragmento tarda un poco en generarse, y al escribir eso se nota en cada tecla. Para un lector de pantalla no sirve. Y eso si tienes suerte, porque la letra H la pronunciaba como "shiasshahahahaaeee". ¿Has visto cuando Harry Potter habla Parsel en la Cámara Secreta? Pues igual. Total, que habla, pero no puedes escribir.

Así que acabé en [RHVoice](https://f-droid.org/packages/com.github.olga_yakovleva.rhvoice.android/), que está pensado para lectores de pantalla (tiene hasta complemento para NVDA), es ligero y tiene español. La pega es que no publican APK en GitHub: solo F-Droid y Play. Descargué el APK desde la web de F-Droid, sin instalar su cliente, y comprobé la firma antes de instalarlo:

```
apksigner verify --print-certs com.github.olga_yakovleva.rhvoice.android_118040.apk
```

`apksigner` no viene con adb, está en las build-tools del SDK de Android. En mi caso lo firma F-Droid, no el proyecto. No es lo que yo quería, pero decidí tirar para adelante.

Los pasos, esta vez con cabeza y con miedito, mucho miedito:

1. Instalarlo: `adb install com.github.olga_yakovleva.rhvoice.android_118040.apk`
2. Abrir RHVoice, entrar en Español e instalar una voz. Las voces se descargan desde la app, así que necesita el permiso de Red de GrapheneOS.
3. Probarlo sin ponerlo por defecto: Ajustes → Salida de texto a voz → engranaje de RHVoice → "Escuchar un ejemplo".
4. Solo si el ejemplo suena en español, ponerlo por defecto:

```
adb shell settings put secure tts_default_synth com.github.olga_yakovleva.rhvoice.android
```

5. Reiniciar TalkBack.

Cuando ya funcionaba, quité sherpa.

```
adb uninstall com.k2fsa.sherpa.onnx.tts.engine
```

## El botón del pánico

Lo más útil que saqué de la tarde es un `.bat` en el escritorio del PC para cuando todo se tuerza. Devuelve el motor al predeterminado y el sistema a inglés, que es el estado en el que la voz de serie sí habla:

```
adb shell settings delete secure tts_default_synth
adb shell settings put system system_locales en-US
adb reboot
```

## Resumen para no repetir mis errores

- Apunta el motor de voz que tienes antes de cambiarlo.
- No cambies de motor sin el PC conectado y el comando de vuelta atrás preparado.
- Prueba la voz con "Escuchar un ejemplo" antes de ponerla por defecto.
- El idioma del sistema y el de la voz tienen que coincidir, o TalkBack se calla.
- No desinstales un motor que esté puesto por defecto.
- Si eres usuario de lector de pantalla, huye de las voces neuronales para el día a día: suenan muy bien, pero el retardo al escribir no compensa.

Y si alguien consigue que eSpeak NG funcione en Android, que me avise, por favor.
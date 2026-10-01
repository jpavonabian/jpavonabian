---
title: "¿Se puede configurar desde el arranque /e/OS siendo una persona ciega?"
date: 2026-10-01T15:43:39+02:00
reply:
uri: "https://jesuspavonabian.es/post/configurar-eos-persona-ciega"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

Llevo unos días dándole vueltas a pillarme un Android sin Google como dispositivo secundario: mi principal sigue siendo un iPhone, con su VoiceOver y sus regresiones, que eso da para otro post. Me han comentado que estaría bien una app de Tu Guiador para Android y aunque me he negado siempre de forma sistemática, he decidido que si la hago la publicaría en F-Droid porque me niego a pasar por Google, y de paso quiero ver si un sistema libre me convence para el día a día.

¿El candidato? Un Fairphone con /e/OS. pero claro,, si me lo pillo, ¿podré configurarlo solo sin ayuda de nadie?

Podría pedir ayuda para instalar TalkBack (el que se publica libre, sin mierdas de google) y un motor de voz, pero quiero ser lo más autónomo posible.

Por lo que sé, en GrapheneOS, TalkBack viene incluido, pero sin motor de voz, que es como el tío que yo tenía en Granada, que ni era tío ni era nada.

Así que tocó ponerse a investigar.

## A preguntar

Escribí a Fairphone y a Murena con lo obvio: si se puede activar TalkBack desde el primer arranque, qué voces trae el sistema y si puedo instalar otras.

Fairphone respondió rápido. Automáticamente. El correo empezaba con un "Dear Correo" y me invitaba amablemente a hablar con Tin, su asistente virtual. Que si el robot no podía responderla que les respondiera al correo y ya me respondería un humano si eso.

Resulta que el robot no pudo, así que les envié una respuesta y esperando la respuesta estoy.

También pregunté lo mismo a Murena, por si acaso.

Pero me aburro cosa mala estos días y tengo poca paciencia.

/e/OS es software libre. Así que pensé... ¿Tendré la capacidad de sacar la respuesta del código?

## Investigación

El código de /e/OS vive en gitlab.e.foundation. Pero Android no es un repositorio: son cientos. Se gestionan con la herramienta `repo` a partir de un manifiesto, unos XML que dicen qué repositorio va en qué ruta y en qué versión.

Bajarse el código entero son más de cien gigas. Para cotillear, lo inteligente, según Claude, es clonar solo el manifiesto y usarlo de mapa:

```
git clone https://gitlab.e.foundation/e/os/android.git
cd android
grep -ri -E "talkback|tts|speech|prebuilt|setupwizard|accessib" default.xml snippets
```

`default.xml` es el AOSP de toda la vida. Lo interesante está en `snippets/eos.xml`, donde /e/OS dice qué cambia respecto a LineageOS. Ahí salieron las pistas:

- `e/os/picotts`: un motor de voz cutre, pero que existe, que ya es un pasito.
- `e/os/android_packages_apps_SetupWizard`: su propio asistente de configuración, que sustituye al de LineageOS.
- `e/os/android_prebuilts_prebuiltapks_lfs`: las apps precompiladas que se meten en el sistema.
- `e/os/android_vendor_lineage` y `e/os/android_vendor_eos`: la configuración del sistema, donde se decide qué va activado por defecto.

## Lo que encontré

Todo apunta a que /e/OS parece permitir que una persona ciega pueda configurarlo sola. Vamos por partes.

### TalkBack viene de serie

El repositorio de apps precompiladas usa Git LFS. Para no bajarse gigas de APK, se clona solo con los punteros:

```
set GIT_LFS_SKIP_SMUDGE=1
git clone https://gitlab.e.foundation/e/os/android_prebuilts_prebuiltapks_lfs.git
```

(En bash, `export` en lugar de `set`.)

Dentro hay una carpeta `Talkback` con su `Android.bp`, que importa el APK `talkback-foss-phone-arm64-v8a-release-unsigned.apk`. Y en `config/common.mk`, línea 45, `Talkback` está en la lista de paquetes que entran en la imagen. Es TalkBack FOSS: la versión libre compilada desde el código que publica Google, sin sus servicios.

### Hay voz desde el primer arranque

En `android_vendor_eos/config/common.mk`:

```
# PicoTTS
include $(call inherit-product, external/svox/svox_tts.mk)
```

PicoTTS, el motor de voz de SVOX. suena a muerte auditiva, pero suena.

### El atajo de volumen parece que apunta a TalkBack

En el overlay del framework, `android_vendor_eos/overlay/common/frameworks/base/core/res/res/values/config.xml`:

```
<string name="config_defaultAccessibilityService" translatable="false">app.talkbackfoss/com.google.android.marvin.talkback.TalkBackService</string>
```

Eso define a TalkBack como el servicio de accesibilidad por defecto. Traducido: mantener pulsadas las dos teclas de volumen debería activar TalkBack desde la primera pantalla, sin tener que encontrar nada.

### TalkBack no tiene que pedir permisos

En `android_vendor_eos/config/permissions/eos-permissions.xml` hay una excepción para `app.talkbackfoss`: el sistema le concede los permisos sin preguntar.

### El asistente de configuración también está pensado

En su `SetupWizard`, la pantalla de bienvenida (`welcome_activity.xml`) tiene un botón de "Ajustes de accesibilidad" (`launch_accessibility`) que abre `ACCESSIBILITY_SETTINGS_FOR_SUW`, los ajustes pensados para la configuración inicial.

Y el detalle que más me gustó: el selector de idioma (`LocalePicker.java`) tiene una implementación de accesibilidad hecha a mano, con un `AccessibilityNodeProvider` y botones virtuales para subir, bajar y el campo de texto, cada uno con su foco. Esos selectores tipo ruleta suelen ser un infierno con lector de pantalla. Aquí alguien se lo curró.

Si quieres comprobarlo tú, estos son los repositorios y la búsqueda que me dio las respuestas:

```
git clone https://gitlab.e.foundation/e/os/android_packages_apps_SetupWizard.git
git clone https://gitlab.e.foundation/e/os/android_vendor_lineage.git
git clone https://gitlab.e.foundation/e/os/android_vendor_eos.git
grep -rn -i -E "defaultAccessibilityService|talkback|pico|tts" android_vendor_lineage android_vendor_eos --exclude-dir=.git
```

Bien hecho, /e/OS. Una empresa pequeña, y parecen hacer las cosas bien, al menos por lo que se puede cotillear en el código. Lo único que les reprocharía es no documentarlo: una frase en algún sitio me habría ahorrado una tarde. Aunque, siendo sincero, me lo he pasado bien y he aprendido cositas, que siempre viene bien.
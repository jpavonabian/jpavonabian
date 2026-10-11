---
title: "Perfiles en GrapheneOS: Google Play aparte y TalkBack con voz"
date: 2026-10-11T08:36:00+02:00
reply:
uri: "https://jesuspavonabian.es/post/perfiles-grapheneos-talkback"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

En [la guía de primeros pasos con GrapheneOS](https://jesuspavonabian.es/post/primeros-pasos-grapheneos/) dejé el perfil principal limpio y sin Google. Pero hay apps de las que todavía no puedo escapar, WhatsApp la primera, y para esas he creado un perfil aparte al que he llamado Bigtech. Aquí cuento cómo se monta, el susto de TalkBack que te llevas nada más crearlo y cómo hacer que las notificaciones te lleguen igual.

## Por qué un perfil aparte

En GrapheneOS, Google Play es una app más, dentro de un sandbox, con los permisos limitadísimos. De hecho, el propio sistema engaña a la aplicación para que piense que tiene más permisos de los que realmente tiene. Técnicamente podría instalarse en el perfil principal y funcionaría de forma aislada sin tocar las narices ni recopilar datos.  Pero claro, este enfoque tiene un problema. El día que te equivoques y otorgues un permiso que no querías sin querer Google mete las pezuñas en el teléfono, aunque sea durante segundos.

Si lo instalas en otro perfil, solo existe en ese. Y como ese perfil solo tiene lo que tú quieres que tenga y como tú quieres que lo tenga puedes limitarlo. Cuando no uses  apps que dependan de Google play o que solo están en Play Store cambias al perfil principal y Google deja de recopilar los pocos datos que le has decidido entregar (si es que le entregas alguno de valor).

Así que me he hecho un perfil secundario llamado "Bigtech" para meter ahí toda la mierda de la cual todavía no puedo escapar por falta de alternativas.

## Crear el perfil

Se hace en Ajustes → Sistema → Varios usuarios. Añades un usuario, le pones nombre y cambias a él. ¡Sigue leyendo, no cambies todavía si usas TalkBack!

## TalkBack no habla de primeras

Un perfil nuevo arranca con el motor de voz por defecto de GrapheneOS, que habla en inglés de Estados Unidos. Si usas otro idioma, como yo, TalkBack se queda sin voz. Los perfiles se crean limpios y limpio implica que no tienes el sintetizador que usas en el principal, claro.

Antes de nada, necesitas tener `adb` en el ordenador y la depuración USB activada en el móvil, como en la guía anterior.

1. Desde el perfil principal, entra en Ajustes → Sistema → Varios usuarios, abre el perfil nuevo y pulsa "Instalar apps disponibles". Marca eSpeak NG o el motor de voz que uses tú.
2. Lista los perfiles con este comando y apunta el ID del tuyo. En mi caso fue el 10.

   ```
   adb shell pm list users
   ```

3. Instala el motor en ese perfil. El paquete que pongo es el de eSpeak NG, tú usa el de tu motor:

   ```
   adb shell pm install-existing --user 10 com.reecedunn.espeak
   ```

4. Ponlo como motor por defecto de ese perfil, con el mismo paquete:

   ```
   adb shell settings --user 10 put secure tts_default_synth com.reecedunn.espeak
   ```

Si no sabes cuál es el paquete de tu motor, adapta el siguiente comando con el nombre del sintetizador que quieras:

```
adb shell pm list packages | grep -i -e espeak
```

Después cambia al perfil nuevo y activa TalkBack con el atajo de los dos botones de volumen. Debería hablar. Si no habla, reinícialo apagándolo y encendiéndolo con ese mismo atajo.

## Las notificaciones

GrapheneOS puede reenviar al perfil activo las notificaciones de los perfiles que siguen funcionando en segundo plano. Viene desactivado, y se activa en cada perfil desde el que quieras reenviar. Yo lo tengo puesto en Bigtech, así que desde el principal me llegan los avisos de WhatsApp y de lo demás sin cambiar de perfil. Aparecen en su propio canal de notificaciones.

Hay una condición: el perfil tiene que seguir en marcha. Si lo cierras del todo, no llega nada. Así que no lo cierres ni lo detengas, y cambia de perfil sin más.

## Y ahora, los contactos

Un perfil nuevo también viene sin contactos, así que WhatsApp no te reconoce a nadie. En [el siguiente post](https://jesuspavonabian.es/post/contactos-mailbox-grapheneos/) explico cómo los sincronizo con Mailbox.org y DAVx⁵ en los dos perfiles.

## Fuentes

- [GrapheneOS: guía de uso](https://grapheneos.org/usage)
- [GrapheneOS: funciones](https://grapheneos.org/features)

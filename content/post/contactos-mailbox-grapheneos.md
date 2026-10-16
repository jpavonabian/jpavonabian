---
title: "Sincronizar los contactos de Mailbox.org en GrapheneOS con DAVx⁵"
date: 2026-10-11T09:36:54+02:00
tags:
draft: false
---

Si seguiste [la guía de primeros pasos con GrapheneOS](https://jesuspavonabian.es/post/primeros-pasos-grapheneos/), ahora mismo tienes un móvil sin contactos. Y en el perfil con Google Play también. Aquí cuento cómo traerlos desde Mailbox.org con DAVx⁵, en el perfil principal y en el de bigtech. Si aún no tienes el segundo perfil, [aquí explico cómo crearlo](https://jesuspavonabian.es/post/perfiles-grapheneos-talkback/). Cada perfil tiene su propia agenda, así que hay que configurarlo en los dos: primero el principal y luego se repite en el otro.

## Antes de empezar (en el ordenador)

Si tienes la verificación en dos pasos activada en Mailbox.org, crea una contraseña de aplicación en los ajustes de seguridad de tu cuenta. Si no, te vale tu contraseña normal, aunque una de aplicación es más limpia: la revocas cuando quieras sin tocar nada más.

## Perfil principal

1. Abre Obtainium, pulsa "Añadir app", pega `https://github.com/bitfireAT/davx5-ose` y confirma. Después pulsa "Instalar".
2. Abre DAVx⁵ y acepta todo lo que te pida: contactos, notificaciones y, sobre todo, la exención de optimización de batería. Si no se la das, Android acaba matando la sincronización y un día descubres que lleva semanas parada.
3. Pulsa el botón de añadir cuenta y elige "Iniciar sesión con URL y nombre de usuario". Los datos son estos:
   - URL: `https://dav.mailbox.org`
   - Usuario: tu dirección de correo de Mailbox.org
   - Contraseña: la de aplicación o la normal.
4. Cuando te pregunte el nombre de la cuenta, deja tu dirección de correo. El método de grupos déjalo como venga.
5. Entra en la cuenta que acabas de crear, ve a la pestaña CardDAV y activa el interruptor de tu libreta de direcciones. Vienen todas desactivadas, y si te lo saltas no se sincroniza nada y tampoco sale ningún error. CalDAV déjalo apagado, salvo que también quieras el calendario, yo lo tengo.
6. Pulsa "Sincronizar ahora" y comprueba en la app de Contactos que aparecen.
7. En Contactos, entra en ajustes y pon la cuenta de DAVx⁵ como predeterminada para los contactos nuevos. Si no lo haces, se guardan en el teléfono y nunca llegan a Mailbox.org.

## Perfil bigtech

8. Para instalar DAVx⁵ ahí tienes dos caminos. El cómodo es hacerlo desde el perfil principal: Ajustes → Sistema → Varios usuarios → bigtech → "Instalar aplicaciones disponibles", y marcas DAVx⁵. Las actualizaciones que hagas desde el principal le llegan también. El otro es cambiar al perfil bigtech e instalar Obtainium allí otra vez, que es más trabajo para nada.
9. Cambia al perfil bigtech y repite los pasos del 2 al 7 tal cual.
10. Abre WhatsApp o la app chunga que necesite contactos y comprueba que ya ve los nombres. Si no los ve, revisa en sus permisos que tenga acceso a contactos (o a los contactos que tu quieras, que no tienes por qué darle el permiso entero si no quieres).

Y si aún tienes los contactos repartidos entre Google y Apple, cómo llevarlos a Mailbox.org lo conté [en este otro post](https://jesuspavonabian.es/post/migrarcontactosmailbox/).
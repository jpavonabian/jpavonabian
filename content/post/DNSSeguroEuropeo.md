---
title: "El DNS público europeo que hace tu Internet más seguro"
date: 2023-12-12T15:15:42+01:00
reply:
uri: https://jesuspavonabian.es/post/dnsseguroeuropeo/
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---
Actualización 18/10/2025: Han cerrado el servicio.

El título de esta entrada suena a Clickbait, ya lo sé. Pero tras probarlo he comprobado que es cierto, [dns0](https://www.dns0.eu/es) cumple lo que promete. hacer la navegación por internet más segura.

## ¿Qué hace exactamente?

Resumiendo mucho, bloquea dominios maliciosos e impide que entres a ellos.

Por ejemplo, esta mañana me llegó un SMS de estafa en el que ponía que mi paquete estaba retenido porque la dirección estaba incompleta. en ese mensajito venía un enlace la mar de mono para recopilar datos. Por supuesto, la dirección no tenía nada que ver con Correos. Por hacer la prueba lo pulsé y DNS0 entró en acción. Al estar el dominio en su lista negra lo bloqueó, impidiendo que pasara algo grabe.

Pero esto no es todo. DNS0 no solo permite bloquear dominios maliciosos. Permite activar una especie de control parental para hacer más segura la navegación para niños bloqueando dominios de adultos o webs de citas, entre otras opciones.

## ¿Cómo lo configuro?

Utilizar este servicio gratuito es sencillo. Solo tienes que utilizar uno de sus servidores DNS para gestionar las peticiones que se hacen a internet.

Basta con acceder a la web de [dns0](https://www.dns0.eu/es) y seguir sus instrucciones para configurar sus DNS en nuestros dispositivos.

Lo que yo he hecho ha sido configurar las DNS de la [VPN y del Pi-hole](https://jesuspavonabian.es/crear-una-vpn-con-wireguard-mas-pihole-para-olvidarnos-de-los-anuncios-y-acceder-a-nuestras-cosas-desde-cualquier-lugar/) utilizando las instrucciones para configurar las DNS en un Router.

A partir de ahora, siempre que navegue utilizando la VPN o desde la red local de casa estaré bastante protejido.

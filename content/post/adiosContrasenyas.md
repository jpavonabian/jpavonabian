---
title: "Adiós, contraseñas"
date: 2024-01-03T20:32:32+01:00
reply:
uri:
categories: ["anything else"] # note, reply, anything else
tags: ["Informática"]
draft: false
---

Llevo un par de semanas utilizando un gestor de contraseñas. Y me ha cambiado la vida.

En un principio usaba el Llavero de Apple. Pero la sincronización con Windows mediante sus extensiones de navegador es simplemente horrorosa. Además, es un sistema cerrado, no da pie a hacer experimentos con él.

Por suerte para mi, encontré [Bitwarden](https://bitwarden.com/) y todos mis problemas se acabaron.

En un principio dudé. ¿Debía alojarlo en algún servidor utilizando [Vaultwarden](https://github.com/dani-garcia/vaultwarden) o debía pagar a Bitwarden? La decisión era difícil.

Si alojaba Vaultwarden me evitaría pagar el premium de Bitwarden. Pero claro, eso significaría que tendría que contratar otro servidor. Podría aprovechar para instalar en él también [Wallabag](https://wallabag.org/) y matar dos pájaros de un tiro, pero estamos hablando de contraseñas y soy novato en esto. El más mínimo error de configuración en el servidor, una actualización mal hecha o cualquier otra cosa que se escapara a mis manos y tendría un problema gordísimo.

## ¿Por qué [Bitwarden](https://bitwarden.com/) y no otro gestor de contraseñas?

El principal motivo no es otro que la accesibilidad. Me estuve informando y leí que tratan siempre que pueden hacer que sus aplicaciones cumplan el nivel AA de las WCAG.

Por otro lado, es código libre y existe como he comentado más arriba [Vaultwarden](https://github.com/dani-garcia/vaultwarden). Si me da por ahí y hago el cambio de servidores para ahorrar gastos, que tengo varias máquinas dispersas que podría unificar, podría salirme rentable autoalojar.

Existe también bw, una aplicación que permite gestionar las contraseñas desde la línea de comandos. Esto me ha permitido alojar en la bóveda las claves ssh y tenerlas sincronizadas entre varios equipos. Acceder con `bssh root@ip` al servidor de turno desde uno de mis dos equipos es una pasada, haré una entrada explicando cómo he montado el invento.

Como decía antes, no conozco ninguna de mis contraseñas. Y si la conozco, la voy cambiando. Bitwarden se integra bien con iOS y puede sustituir incluso a la aplicación autenticator. He acabado con mis problemas de sincronización de credenciales de un plumazo.

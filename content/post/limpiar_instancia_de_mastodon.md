---
title: "Limpiar instancia de Mastodon"
date: 2024-09-15T13:15:29+02:00
reply:
uri: "https://jesuspavonabian.es/post/limpiar_instancia_de_mastodon"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

Hace poco cambié la instancia de Mastodon para que se ejecutase utilizando Docker. Esto me facilitó la vida en muchos aspectos y me la complicó en el de limpiarla. El script que tenía para ello no funcionaba.

Así que cuando saqué un poco de tiempo libre decidí arreglar el asunto.

Os comparto aquí ambos scripts por si a alguien le sirve.

## Script para Mastodon en Docker
```
#!/bin/bash
# Limpiamos la instancia de Mastodon en Docker
# Definir el nombre del contenedor
CONTAINER_NAME=live_web_1
# Ejecutar los comandos dentro del contenedor
docker exec -it $CONTAINER_NAME bin/tootctl statuses remove --days 90
docker exec -it $CONTAINER_NAME bin/tootctl media remove --days 5
docker exec -it $CONTAINER_NAME bin/tootctl media remove --prune-profiles --days 5
docker exec -it $CONTAINER_NAME bin/tootctl media remove --attachments --avatars --headers --days 5
docker exec -it $CONTAINER_NAME bin/tootctl media remove-orphans
docker exec -it $CONTAINER_NAME bin/tootctl preview_cards remove --days 90
docker exec -it $CONTAINER_NAME bin/tootctl accounts prune
docker exec -it $CONTAINER_NAME bin/tootctl accounts cull
docker exec -it $CONTAINER_NAME bin/tootctl cache clear
docker exec -it $CONTAINER_NAME bin/tootctl emoji purge --remote-only
docker exec -it $CONTAINER_NAME bin/tootctl cache recount accounts
docker exec -it $CONTAINER_NAME bin/tootctl cache recount statuses
```
## Script para Mastodon sin Docker
```
#!/bin/bash
# Limpiamos la instancia
RAILS_ENV=production /home/mastodon/live/bin/tootctl statuses remove --days 90
RAILS_ENV=production /home/mastodon/live/bin/tootctl media remove --days 5
RAILS_ENV=production /home/mastodon/live/bin/tootctl media remove --prune-profiles --days 5
RAILS_ENV=production /home/mastodon/live/bin/tootctl media remove --attachments --avatars --headers --days 5
RAILS_ENV=production /home/mastodon/live/bin/tootctl media remove-orphans
RAILS_ENV=production /home/mastodon/live/bin/tootctl preview_cards remove --days 90
RAILS_ENV=production /home/mastodon/live/bin/tootctl accounts prune
RAILS_ENV=production /home/mastodon/live/bin/tootctl accounts cull
RAILS_ENV=production /home/mastodon/live/bin/tootctl cache clear
RAILS_ENV=production /home/mastodon/live/bin/tootctl emoji purge --remote-only
RAILS_ENV=production /home/mastodon/live/bin/tootctl cache recount accounts
RAILS_ENV=production /home/mastodon/live/bin/tootctl cache recount statuses
```
## Modo de uso:
Tras guardarlo como limpiar.sh podeis meterlo en un Crontab y ejecutarlo una vez al mes o ejecutarlo a mano, como os resulte más práctico.
¡Cuidado con Docker! No olvideis cambiar la variable CONTAINER_NAME para que apunte a vuestro contenedor de web.

---
title: "Montar un servidor de Stardew Valley de forma accesible"
date: 2026-01-24T09:28:38+01:00
reply:
uri: "https://jesuspavonabian.es/post/montar_servidor_stardew_valley"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---
Llevo un tiempo jugando [Stardew Valley](https://store.steampowered.com/app/413150/Stardew_Valley/?l=spanish). Tanto en cooperativo como en local.

El caso es que a unos amigos y a mi nos daba mucho la lata el tener que esperar al anfitrión de la partida. Si no quería jugar, no jugaba nadie, si se le iba la luz a tomar por saco el progreso... Un engorro, vaya. Así que nos pusimos a investigar...

Y dimos con un repositorio que levanta un servidor del juego mediante Docker llamado [Puppy Stardew Server](https://github.com/truman-world/puppy-stardew-server/). ¿el problema? Lo conseguíamos levantar, pero requería conectarse mediante VNC para cargar la primera partida. Y claro, ahí no había accesibilidad ninguna.

Buscamos por la red. Dimos vueltas a google, encontramos las bolas de dragón y pedimos un deseo... Y nada. Que a la gente le molaba VNC.

así que tiramos de la solución de la cual tiramos muchos cegatos cuando no podemos hacer algo: "Persona con ojos más cercana, ¿haces aquí un par de clicks?" y el problema se arregló.

Pero me molestaba. Muchísimo. Si lo que se necesitaba era tener una partida se podía hacer a mano editando un archivo, seguro.

Y se pudo, aprovechando que no podía dormir.

## Cosas a tener en cuenta antes de entrar en materia

No es mucho, pero es conveniente saberlo.

- El script levanta un servidor con Docker y descarga el juego de una cuenta de Steam. Así que es necesario tener el juego comprado. Solo usa Steam únicamente para descargar los archivos.
- Intenté ejecutarlo en una Raspberry Pi y petó por todo lo alto. Supongo que alguien con tiempo podría cohnstruir una imagen.
- Se pueden añadir más mods añadiéndolos a la carpeta Mods. No todos funcionan, ojo cuidao.
- Si quieres  crear más cabañas porque no configuraste bien la partida, tendrás que liar la de Dios es Cristo, luego lo explico.
- Si alguien tiene mods de esos de hacer la vida más fácil, como el que sirve para pescar podrá usarlos. Esto garantiza que podemos jugar en cualquier servidor con nuestros mods de accesibilidad. También garantiza que si tienes un colega tramposillo puede hacer lo que le sale del pie, pues el servidor hace de servidor y la mayoría de cosas se gestionan desde los clientes.

## Al lío

El primer paso es instalar Docker. No lo explicaré aquí, lo siento.

Una vez hecho esto y teniendo a nuestro usuario de turno con permisos para ejecutar docker sin sudo ejecutamos el script oficial de instalación rápida:

```
curl -sSL https://raw.githubusercontent.com/truman-world/puppy-stardew-server/main/quick-start.sh | bash
```

Nos saldrá un asistente maravilloso en inglés. Le damos a la Y y a enter para meter nuestros datos de Steam y esperamos que haga su magia. llegará un momento que nos preguntará si queremos ver los logs. Podemos decirle alegremente que no con la N y enter. Cuidado con la contraseña de VNC. Pon alguna que sea difícil, no quieres a nadie trasteando con tu granja.

Si tenemos SteamGuard activado tenemos que meter el código. Así que como deberíamos estar en el prompt del sistema nos iremos al contenedor docker que nos ha creado:

```
docker attach puppy-stardew
```

No nos preguntará nada al pulsar enter ni veremos tampoco nada. Pegamos el código que nos habrá llegado por correo y le damos enter.

Ahora toca un paso delicadísimo: Esperar. En serio, tarda lo suyo. Podemos aprovechar para ir por un café, una cerveza o lo que toque. Cuando termine pulsamos Ctrl + P y luego Ctrl + Q para ¿desacoplarnos? del contenedor. Deberíamos volver al prompt del sistema.

ya falta poco. para continuar tenemos que apagar el servidor, pues se ha quedado esperando que alguien entre por VNC.

```
docker compose down
```

## Crear la granja sin VNC

Aquí está el truco. Si lo piensas es sencillo, pero hay que dar con ello.

- Abre Stardew Valley en tu ordenador.
- Crea una granja cooperativa con las cabañas necesarias.
- Salta la historia.
- Duerme para que se guarde, siempre puedes retrasar el día perdido con debug world_setday 1.
- Cierra el juego.
- Copia la partida: encontrarás su directorio en %appdata%\StardewValley\Saves
- Copia el save al servidor. No puedo poner la ruta completa porque no sé tu usuario, pero no es difícil de encontrar: puppy-stardew-server/data/saves/Saves
- Edita con nano puppy-stardew-server/data/game/Mods/ServerAutoLoad/config.json: encontrarás algo como "SaveFileName":"", Coloca entre las comillas vacías el nombre del archivo. Quedará algo como "SaveFileName": "Granjaprueb_428913504",


Debería bastar. Arranca el servidor con docker compose up -d y prueba a conectarte tras un par de minutos colocando la IP o el dominio del servidor en el Stardew Valley que tienes instalado en el ordenador.

Si por alguna razón no funciona continúa con el siguiente paso.

## ¡No puedo conectar!

Tranquilidad, se puede arreglar.

- Para el contenedor:

   ```
   docker compose down
   ```

- Descarga este zip: [SVConfig.zip](https://jesuspavonabian.es/files/svConfig.zip)
- Descomprímelo y coloca los dos archivos que están dentro de la carpeta que se genera en puppy-stardew-server/data/saves reemplazando los que ya hay.

Ahora sí, debería funcionar. Prueba a levantarlo con docker compose up -d y conecta tras unos minutos.

## ¡Quiero crear otra cabaña y no quiero entrar por VNC!

Venga, te doy el truco, aunque sospecho que a estas alturas ya sabes cuál es...

- Dile a quien juegue contigo que dormir es necesario. si no duerme antes de que hagas el invento este, perderá el día. Quien avisa no es traidor. ¡Dormid todos!
- Ejecuta docker compose down para apagar el servidor.
- Descarga el save a tu ordenador.
- Cópialo a tu juego local.
- Carga la partida.
- Ve con Robin y crea una cabaña o las que sean necesarias.
- Retrasa un día con el comando que coloqué antes.
- Duerme y sal.
- Sube el save al servidor.

¡Listo!

Dudas, comentarios, tirones de orejas por el formato, mejoras... Sabéis dónde encontrarme.

¡Cultivad mucho!
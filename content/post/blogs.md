---
title: "Blogs, Blogs, Blogs"
date: 2026-08-28T16:29:28+02:00
reply:
uri: "https://jesuspavonabian.es/post/blogs"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

Llevaba media vida con dos tareas pendientes. De esas que dices "Sí, ahora luego cuando saque un hueco lo hago", pero nunca lo hacía. Una, por pereza. La otra... Porque requería meditar, pensar, darle una vuelta y programar algo. Y me daba una pereza asombrosa.

Solo he tardado un año y pico en terminar ambas cosas. Pero ya está: el Blog de [Némesis](https://alareiradenemesis.es) y el ahora resucitado [O recuncho do lector](https://orecunchodolector.es) funcionan como deberían.

Ahora corren sobre [WriteFreely](https://writefreely.org), autoalojado en mi propio VPS, cada uno con su propio servicio systemd, su propia base de datos SQLite y su propio puerto al que Nginx dirige las llamadas https que recibe.

Os cuento ambas migraciones, que tienen su aquel.

## La base: un WriteFreely por blog, sin depender de una sesión de `screen`

Lo primero fue [montar el tinglao, tutorial aquí](https://writefreely.org/start): Cada blog en su propia instancia de WriteFreely, con su propio `config.ini`, su propio puerto y su propio `writefreely.db` en SQLite.

Para no depender de tener una sesión de `screen` abierta (así es como arrancaba las cosas al principio, `./writefreely` a lo bruto por SSH, burro que es uno), usé una plantilla systemd en vez de un `.service` por blog:

```ini
# /etc/systemd/system/writefreely@.service
[Unit]
Description=WriteFreely instance (%i)
After=network.target

[Service]
Type=simple
User=patata
Group=patata
WorkingDirectory=/home/patata/%i/writefreely
ExecStart=/home/patata/%i/writefreely/writefreely
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

El `%i` se sustituye por lo que venga después de la `@`. Así, arrancar un blog nuevo es:

```bash
sudo systemctl enable writefreely@alareira
sudo systemctl start writefreely@alareira
```

Y cada instancia solo necesita su propio directorio con WriteFreely. Reinicio automático si peta, arranque en el boot, logs con `journalctl -u writefreely@alareira -f`.

## Caso 1: A Lareira de Némesis, la migración fácil

Este fue el caso fácil. Exportación WXR estándar (Herramientas → Exportar → Todo el contenido, desde el propio WordPress) para traerme el contenido del Blog y [wp-import](https://github.com/writeas/wp-import), de la propia gente de Write.as para importarlo a la instancia recién levantada.

El repo de wp-import no publica releases. Tocó instalar Go desde cero:

```bash
wget https://go.dev/dl/go1.26.7.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.26.7.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin' >> ~/.bashrc
```

Después bastó con instalar, sin más.

```bash
git clone https://github.com/writeas/wp-import.git
cd wp-import
go install ./...
```

Me cargué el WordPress, cambié dónde apuntaba Nginx y listo. El comando de wp-import funcionó a la primera.

Un detalle que me tuvo fastidiado durante unas horas: El `--blog` de `wp-import` no es la ruta de la URL (con `single_user = true` el blog se sirve en la raíz igualmente), parece ser el alias interno de la colección en la base de datos, aún no lo tengo del todo claro. Se puede sacar de la base de datos con algo como esto:

```bash
sqlite3 /home/patata/alareira/writefreely/writefreely.db "SELECT alias FROM collections;"
```

## Caso 2: O Recuncho do Lector y el fiaje en el tiempo

En 2021 el WordPress que movía O recuncho daba más por culo que un zapato apretao, aquello estaba roto por todos lados, no había forma de moverlo todo a un Blog limpio sin que se rompiera todo... Y al final, tras un cabreo que ya no recuerdo por qué fue... Decidí mandarlo todo a la mierda... sin acordarme de hacer un BackUP antes. 

Hablando con una de las autoras del blog llegamos a la conclusión de que estaría bien recuperarlo, pero que el Jesús del pasado fue un poco gilipollas. Si hubiese hecho una copia de seguridad el contenido no se hubiera perdido sin remedio. Por suerte, archive.org sí que hizo una, porque en su día se me ocurrió que era una buena idea que lo hiciera. Gracias, yo del pasado.

La descarga del sitio archivado se hizo con la gema Ruby `wayback_machine_downloader_straw`. Un engorro. Lo tengo documentado, pero no merece la pena explicarlo aquí, no creo que sirva para otro Blog.

Con el HTML crudo de cada página archivada (en este caso, 1577 ficheros entre HTML, CSS/JS del tema y las pocas imágenes que sí sobrevivieron) pude proceder.

Un script de extracción en Python (`beautifulsoup4` + `lxml` + `markdownify`) hizo todo el trabajo: detectar posts y páginas por las clases del `<body>`, sacar título, fecha real (del meta `article:published_time`, no la fecha de la captura), autoría, categorías y tags; limpiar el cuerpo quitando botones de compartir, posts relacionados, índice automático y el widget de audio TTS que traía el tema...

Resultado: 487 entradas detectadas, 482 posts convertidos a Markdown, 5 páginas estáticas... nada mal.

Las imágenes dieron muchísima lata. Más que nada porque no se almacenaron. Tras tratar de darle una vuelta, consultarlo con la almohada, meditarlo y volverlo a meditar otra vez, no fuese que la primera meditación fallase, decidí que a veces hay que rendirse. si archive.org no las tiene, no las tiene.

Las páginas también las descarté, quedándome únicamente con los posts. Alguna cosilla rara puede haber, aunque he limpiado concienzudamente los .md a mano.

Teniendo todo recopilado, le pedí a Claude ayuda con el script para subir el contenido al Blog, ya que estuve un par de semanas dándole vueltas al tema y me atascaba. solo tardó 10 minutos en hacerlo. IA 1, humano 0. Qué remedio.

## Finalmente

Ambos blogs federan por ActivityPub, así que si usas Mastodon puedes seguirlos como a cualquier cuenta: `@nemesis@alareiradenemesis.es` y `@orecuncho@orecunchodolector.es`.

Un detalle curioso de WriteFreely: puedes mencionar a alguien de Mastodon desde un post del blog y le llega la notificación de verdad. Pero al revés, si mencionas al blog desde Mastodon, no pasa nada. WriteFreely no tiene bandeja de entrada ni sistema de comentarios propio.
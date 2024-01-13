---
title: "añadir S3 a una instancia de Mastodon y migrar sus datos"
date: 2023-12-12T15:15:42+01:00
reply:
uri:
categories: ["anything else"] # note, reply, anything else
tags: ["Mastodon", "S3"]
draft: false
---

Llevo un tiempo administrando la instancia de Mastodon [Universo alterno (se abre en una nueva ventana)](https://mst.universoalterno.es). Al principio, todo iba bien. hasta que el disco duro comenzó a llenarse. Los usuarios subían contenidos y el contenido de las instancias federadas se cacheaba, lo que ocasionó que tuviese que limpiar la caché y varios elementos una vez al día.

Obviamente esto no era óptimo, porque muchos usuarios perdían notificaciones, había contenido que desaparecía con muchísima rapidez... Un jaleo horroroso. Como solución temporal servía, pero había que darle una vuelta al tema.

Así pues decidí dejar de complicarme la vida. Ampliar el servidor no era una opción, se me iba de precio con una facilidad pasmosa, además de de tener que ir ampliando si la instancia crecía. Por suerte, existen los almacenamientos de objetos S3.

Lo primero que tuve que hacer fue una búsqueda de cuál me interesaba más. Al final, tras mucho investigar, me decidí por Scaleway. ¿Por qué Scaleway? Porque es barato, cobran en euro y porque sus centros de datos están en Europa.

Como la información que encontré estaba bastante difuminada y no hay nada en español con este servicio, me he decidido a escribir un tutorial unificando los trozos de información que fui recogiendo de aquí y de allá. Vamos al lío.

## Registro en Scaleway

Lo primero que necesitaremos será crearnos una cuenta en [Scaleway (se abre en una nueva ventana)](https://www.scaleway.com/). el registro no es complicado; lo más difícil será verificar el método de pago, que requerirá introducir un código que nos llegará al banco al hacer un pago de un euro que luego nos devolverán.

## Creando el Object Storage

Tras iniciar sesión y verificar nuestro método de pago, tenemos que crear un Object Storage. allí será donde enviaremos los archivos de nuestra instancia y donde se subirán los nuevos.

Para ello, pulsamos el botón Storage y el enlace Object Storage.

Crearlo es sencillo; escogemos la región más cercana al servidor de la instancia y nos aseguramos de que el bucket sea privado, pues no queremos que google u otros rastreadores puedan acceder al listado de medios de nuestra instancia, pero sí queremos que se puedan acceder a los archivos mediante URLs específicas.

Importante: Tenemos que tener cuidado con qué nombre le ponemos al Bucket. No podemos usar puntos. Mi.instancia no sería válido, nos dará problemas a futuro. Por el contrario, mi-instancia sí que lo es. Mi consejo es que lo llameis como el nombre de vuestra instancia. Por ejemplo en mi caso el nombre es, sin las comillas, "universoalterno".

Una vez creado, nos aparecerá la información del Bucket. Deberemos guardarla para tenerla a mano.

## Configurando un proxy Nginx

Esto es opcional, pero es altamente recomendable para ahorrar dinero. básicamente, lo que hacemos aquí es cachear el contenido para que no tengamos que hacerle una petición al Bucket cada vez que queramos acceder a él y podamos ahorrar tráfico. Para ello, el procedimiento es el siguiente:

En primer lugar, necesitamos crear un registro A en la zona DNS de nuestro dominio para añadir un subdominio. A ese subdominio irán las peticiones de multimedia. Deberemos apuntar ese registro a la máquina que contiene la instancia. En mi caso he creado un media.universoalterno.es que apunta a la misma ip que mst.universoalterno.es.

hecho esto, deberemos configurar el proxy Nginx. Accedemos a la máquina que contiene la instancia y tecleamos sin las comillas (con sudo delante si no somos root) "nano /etc/nginx/sites-available/media" para entrar al editor de textos y crear un archivo nuevo. El contenido será el siguiente:

`server { listen 443 ssl http2; listen [::]:443 ssl http2; server_name files.example.com; root /var/www/html;  keepalive_timeout 30;  location = / { index index.html; }  location / { try_files $uri @s3; }  set $s3_backend 'https://YOUR_BUCKET_NAME.YOUR_S3_HOSTNAME';  location @s3 { limit_except GET { deny all; }  resolver 8.8.8.8; proxy_set_header Host YOUR_BUCKET_NAME.YOUR_S3_HOSTNAME; proxy_set_header Connection ''; proxy_set_header Authorization ''; proxy_hide_header Set-Cookie; proxy_hide_header 'Access-Control-Allow-Origin'; proxy_hide_header 'Access-Control-Allow-Methods'; proxy_hide_header 'Access-Control-Allow-Headers'; proxy_hide_header x-amz-id-2; proxy_hide_header x-amz-request-id; proxy_hide_header x-amz-meta-server-side-encryption; proxy_hide_header x-amz-server-side-encryption; proxy_hide_header x-amz-bucket-region; proxy_hide_header x-amzn-requestid; proxy_ignore_headers Set-Cookie; proxy_pass $s3_backend$uri; proxy_intercept_errors off;  proxy_cache CACHE; proxy_cache_valid 200 48h; proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504; proxy_cache_lock on;  expires 1y; add_header Cache-Control public; add_header 'Access-Control-Allow-Origin' '*'; add_header X-Cache-Status $upstream_cache_status; add_header X-Content-Type-Options nosniff; add_header Content-Security-Policy "default-src 'none'; form-action 'none'"; } }`

Tenemos que reemplazar files.example.com por nuestro dominio (en mi caso media.universoalterno.es), YOUR\_BUCKET\_NAME por el nombre de nuestro bucket (en mi caso universoalterno), YOUR\_S3\_HOSTNAME por el host de nuestro bucket (lo conseguimos cuando creamos el Bucket, es lo que viene después del punto que va después del nombre).

Guardamos el archivo con ctrl + x y respondiendo y y generamos un enlace al archivo con el siguiente comando (sin comillas) "ln -s /etc/nginx/sites-available/media /etc/nginx/sites-enabled/".

Casi terminamos con esto. Lo siguiente que tenemos que hacer es reiniciar el servidor web y generar un certificado SSL, cosa que haremos con "systemctl reload nginx", "certbot --nginx -d files.example.com" (Tenemos que reemplazar files.example.com por nuestro subdominio) y otra vez "systemctl reload nginx" para que pille los cambios del certificado.

## Subiendo datos al Bucket y configurando Mastodon

Casi lo tenemos hecho. solo nos falta decirle a Mastodon donde debe ir a buscar los datos y subir los que tenemos en el servidor al Bucket. Para ello, deberemos conseguir las claves de acceso para nuestro Bucket. En Scaleway pulsamos en el avatar (una imagen sin etiquetar si usas lector de pantallas) y después pulsamos en Manage Identity and Access with IAM.

Una vez hecho esto, pulsamos en la pestaña api-keys y luego en Generate API key.

Seguimos las instrucciones (no es complicado) y guardamos la clave de acceso y la clave secreta en un lugar seguro.

Teniendo estos datos, podemos configurar nuestro mastodon. en primer lugar, abriremos otra sesión a parte para ir subiendo los datos mientras tanto.

Subir los datos no es difícil. Nos logueamos como usuario mastodon (su mastodon) y nos vamos al directorio live, que suele estar en /home/mastodon/live al menos que lo tengas en otro lado por tener una configuración personalizada. Una vez allí, instalamos awscli con "pip install awscli".

Lo siguiente que tenemos que hacer es configurarlo, así que ejecutamos aws configure y seguimos los pasos:

- Ingresamos la clave conforme nos las va pidiendo.
- en región, si escogimos parís ponemos "fr-par" y si escogimos Ámsterdam "nl-ams" (sin las comillas).
- En la pregunta de output format nos limitamos a pulsar enter.

Casi estamos listos. Podríamos intentar subir todo nuestro contenido tal cual, pero es preferible hacer algo de limpieza primero, así que ejecutamos los siguientes comandos, sin comillas y esperando que termine de ejecutarse el primero para ejecutar el segundo. "RAILS\_ENV=production bin/tootctl media remove" y "RAILS\_ENV=production bin/tootctl media remove-orphans".

Ya está todo configurado y estamos listos para subir nuestro contenido multimedia. en teoría, si hemos seguido bien el artículo, estaremos en /home/mastodon/live y podremos proceder. Para ello, tecleamos el siguiente comando (adáptalo con tus datos): aws s3 sync --acl public-read public/system/ s3://universoalterno --endpoint=https://s3.fr-par.scw.cloud

Esto puede tardar (y lo hará), así que dejamos esa ventana abierta y nos ponemos con el resto de configuraciones: En /home/mastodon/live realizamos lo siguiente:

en primer lugar y para evitar sustos, hacemos una copia del archivo .env.production de la siguiente forma: cp .env.production copia.env.production

A continuación añadimos el siguiente contenido (reemplaza los datos necesarios) al final del archivo .env.production: nano .env.production

`S3_ENABLED=true S3_BUCKET=universoalterno AWS_ACCESS_KEY_ID=tu_clave AWS_SECRET_ACCESS_KEY=tu_clave_secreta S3_ALIAS_HOST=media.universoalterno.es S3_HOSTNAME=media.universoalterno.es S3_REGION=fr-par S3_ENDPOINT=https://s3.fr-par.scw.cloud`

Guardamos, salimos del usuario mastodon con "exit" y reiniciamos los servicios: "systemctl restart mastodon-sidekiq" y "systemctl reload mastodon-web".

¡Listo! A partir de ahora, los datos irán a parar a nuestro Bucket y podremos dejar de sufrir por el espacio en disco del servidor.

Es probable que mientras toqueteábamos configuraciones alguien hiciera algo y sus cambios quedaran en el limbo. No pasa nada. Cuando termine de copiar los archivos, vuelve a ejecutar el comando para subirlos todos.

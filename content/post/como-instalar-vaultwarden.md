---
title: "Vaultwarden, o cómo dejar de pagar por guardar mis contraseñas"
date: 2026-05-19
reply:
uri: "https://jesuspavonabian.es/post/como-instalar-vaultwarden"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

Van a subir el precio de Bitwarden.

Así que como le tengo manía a los precios que suben me he montado mi propio servidor de Vaultwarden y resuelto el problema.

Pensé que sería más engorrosillo, pero ha sido fácil.

## ¿Qué es Vaultwarden?

Es una reimplementación del servidor de Bitwarden escrita en Rust. Funciona con todas las apps oficiales, da igual que uses la del navegador, la del móvil o la de escritorio. La diferencia es que corre en un solo contenedor Docker, consume unos 50 MB de RAM y no le debes nada a nadie.

El servidor oficial de Bitwarden requiere SQL Server y varios contenedores. Vaultwarden es lo mismo para uso personal o familiar sin tener que llenar de mierda el servidor.

## Antes de montar nada: exporta tus contraseñas

Antes de tocar nada, entra en [vault.bitwarden.com](https://vault.bitwarden.com), ve a *Tools → Export Vault* y descarga el `.json` en formato cifrado. Cifrado, no en texto plano.

Este archivo tiene todas tus contraseñas protegidas con tu clave maestra. Si lo exportas en texto plano y alguien te mira el escritorio en el momento equivocado, ese alguien tiene tus contraseñas. Con el formato cifrado, sin la clave maestra no es más que ruido.

Guárdalo en un sitio seguro y no lo pierdas. Lo necesitarás en el paso 7.

## La estructura de directorios

```bash
mkdir -p /opt/vaultwarden/vw-data
cd /opt/vaultwarden
```

Todo vive aquí. El `docker-compose.yml`, el `.env` con la configuración y el directorio `vw-data` donde Vaultwarden guarda la base de datos SQLite y los adjuntos. Si haces backup de esta carpeta, tienes todo.

## El ADMIN_TOKEN ya no es texto plano

Desde la versión 1.28, el token del panel `/admin` tiene que ser un hash argon2id. Si pones texto plano explota.

Para generar el hash usas un contenedor temporal del propio Vaultwarden:

```bash
docker run --rm -it vaultwarden/server /vaultwarden hash
```

Te pide una contraseña, la introduces y te escupe un hash que empieza por `$argon2id$...`. Ese hash es lo que va en el `.env`. La contraseña que pusiste la necesitas para entrar al panel de admin, así que apúntala en algún sitio que no sea el propio Vaultwarden, por razones obvias.

## El .env

```bash
# /opt/vaultwarden/.env
DOMAIN=https://vault.tudominio.es
ADMIN_TOKEN='$argon2id$v=19$m=65540,t=3,p=4$...'
SIGNUPS_ALLOWED=true
WEBSOCKET_ENABLED=true
TZ=Europe/Madrid
```

El `DOMAIN` es crítico. Tiene que coincidir exactamente con la URL desde la que accedes, `https://` incluido. Si no coincide, el cliente de Bitwarden te dice que eso no es un servidor válido y tienes que ponerte a buscar qué has hecho mal. Experiencia propia.

## El docker-compose.yml

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:80"
    volumes:
      - ./vw-data:/data
      - /etc/localtime:/etc/localtime:ro
    env_file:
      - .env
```

El puerto va bindeado a `127.0.0.1` a propósito. Así el tráfico externo entra solo a través del proxy inverso y no le llega directamente al contenedor.

## Nginx

Si ya tienes Nginx y Certbot montados, esto es añadir un virtual host más. Lo único que no es obvio es el bloque de WebSockets, que necesita unas cabeceras específicas para que la sincronización funcione en tiempo real en lugar de ir tirando de polling cada rato:

```nginx
server {
    listen 80;
    server_name vault.tudominio.es;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name vault.tudominio.es;

    ssl_certificate     /etc/letsencrypt/live/vault.tudominio.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vault.tudominio.es/privkey.pem;

    client_max_body_size 100m;

    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-Proto https;

    # WebSockets
    location /notifications/hub {
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:8080;
    }

    location /notifications/hub/negotiate {
        proxy_pass http://127.0.0.1:8080;
    }

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

Luego:

```bash
certbot --nginx -d vault.tudominio.es
nginx -t && systemctl reload nginx
```

## Arranca el invento

```bash
cd /opt/vaultwarden
docker compose up -d
docker compose logs -f
```

Si los logs no dicen nada raro y puedes acceder a `https://vault.tudominio.es`, ya está levantado. Crea una cuenta con el mismo email que usas en Bitwarden cloud.

## Importar las contraseñas

Desde la interfaz web de tu instancia: *Tools → Import Data → Bitwarden (json)*. Subes el archivo que exportaste al principio. Si elegiste formato cifrado te pedirá la contraseña maestra para descifrarlo.

Los vaults grandes tardan unos minutos. No refresques la página mientras importa, que luego hay que volver a empezar.

## Migrar los clientes

En cada dispositivo: cierra sesión → en la pantalla de login busca el selector de región o el icono de engranaje → elige *Self-hosted* → introduce `https://vault.tudominio.es` → inicia sesión.

A partir de ahí, el cliente usa tu servidor. Ya está.

## Cerrar el chiringuito después de instalar

Una vez creadas todas las cuentas que necesites, edita el `.env`:

```bash
SIGNUPS_ALLOWED=false
```

Y reinicia:

```bash
docker compose down
docker compose up -d
```

Si dejas los registros abiertos y el servidor es público, tarde o temprano alguien crea una cuenta en tu gestor de contraseñas. No es algo que quieras.

## Backups

Toda la información vive en `/opt/vaultwarden/vw-data/`. Un cron básico:

```bash
# crontab -e
0 3 * * * tar -czf /backups/vaultwarden-$(date +\%F).tar.gz \
  /opt/vaultwarden/vw-data && \
  find /backups -name 'vaultwarden-*.tar.gz' -mtime +30 -delete
```

Y copia los backups fuera del servidor. Si el disco falla y los backups están en el mismo disco, los backups no sirven de nada. Esto aplica a todo, no solo a Vaultwarden.

## Actualizar

```bash
cd /opt/vaultwarden
docker compose pull
docker compose down
docker compose up -d
```

Las migraciones de base de datos las hace automáticamente al arrancar. Haz backup antes de actualizar, como con cualquier cosa que importe.

---

Llevo ya un tiempo con esto funcionando y no he echado de menos nada de Bitwarden cloud. Las apps oficiales funcionan exactamente igual que antes. La sincronización va, los adjuntos suben, el 2FA funciona. Y mis contraseñas están en mi servidor, no en el de otra persona.

Dudas, erratas, mejoras… sabéis dónde encontrarme.

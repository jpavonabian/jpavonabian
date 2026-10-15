---
title: "Pi-hole con Unbound: un DNS sin depender de nadie"
date: 2026-10-15
reply:
uri: "https://jesuspavonabian.es/post/pihole-unbound"
categories: ["anything else"] # note, reply, anything else
tags: ["PiHole", "DNS", "Unbound", "Privacidad"]
draft: false
---

Otra vez sin DNS.

Hace un tiempo os hablé de [dns0, el DNS público europeo](https://jesuspavonabian.es/post/dnsseguroeuropeo/). Cerró. Así que puse el Pi-hole a tirar de xdp.es. Y hoy, xdp.es se ha caído.

Podría haber puesto los de Cloudflare y a correr, pero supongo que volvería a tener movidas con la pelotita. Llevo meses [desgooglezando mi vida](https://jesuspavonabian.es/post/desgooglezando-mi-vida) por lo que el famoso 8.8.8.8 de google también lo descarto. Así que me he montado el chiringuito en la raspberry y andando.

## ¿Qué es Unbound y por qué?

Cuando escribes una dirección en el navegador, alguien tiene que traducir ese nombre a una IP. Normalmente ese alguien es tu operadora, Google, Cloudflare o quien hayas puesto en el Pi-hole. Y ese alguien ve todo lo que consultas.

Unbound es un resolvedor recursivo. En vez de preguntarle a un intermediario, va directamente a la fuente y pregunta a los servidores raíz.

Lo bueno:

- No dependes de ningún proveedor.
- Nadie tiene un registro centralizado de todo lo que consultas.
- Valida DNSSEC, así que es más difícil que te cuelen respuestas falsas.

Lo no tan bueno:

- Las consultas a los servidores autoritativos no van cifradas, así que tu operadora puede verlas si quiere.
- La primera vez que visitas un dominio tarda un poco más. Luego se guarda en caché y tarda menos.

## Lo que necesitas

- Pi-hole ya funcionando sobre Debian, Raspberry Pi OS o similar. Si no lo tienes, lo conté en [el post de la VPN con WireGuard y Pi-hole](https://jesuspavonabian.es/post/crear-una-vpn-con-wireguard-mas-pihole-para-olvidarnos-de-los-anuncios-y-acceder-a-nuestras-cosas-desde-cualquier-lugar/).
- Acceso por SSH y `sudo`.
- Diez minutos.
- Un café (opcional).

## ¡Al lío!

### 1. Instalar Unbound

```
sudo apt install unbound
```

### 2. Configurarlo

```
sudo nano /etc/unbound/unbound.conf.d/pi-hole.conf
```

```
server:
    verbosity: 0
    interface: 127.0.0.1
    port: 5335
    do-ip4: yes
    do-udp: yes
    do-tcp: yes
    do-ip6: yes
    prefer-ip6: no
    harden-glue: yes
    harden-dnssec-stripped: yes
    use-caps-for-id: no
    edns-buffer-size: 1232
    prefetch: yes
    num-threads: 1
    so-rcvbuf: 1m
    private-address: 192.168.0.0/16
    private-address: 169.254.0.0/16
    private-address: 172.16.0.0/12
    private-address: 10.0.0.0/8
    private-address: fd00::/8
    private-address: fe80::/10
```

Unbound escucha solo en `127.0.0.1`, puerto `5335`. Es decir, solo le habla al Pi-hole, nadie más de la red lo ve. Si no tienes IPv6 funcionando en casa, cambia `do-ip6` a `no`.

### 3. Quitar el resolvconf de Unbound

En Debian 11 y posteriores, Unbound trae un servicio que puede hacer que acabe reenviando las consultas a otro DNS en vez de resolverlas él, así que lo quitamos del medio.

```
sudo systemctl disable --now unbound-resolvconf.service
sudo sed -Ei 's/^unbound_conf=/#unbound_conf=/' /etc/resolvconf.conf
sudo rm -f /etc/unbound/unbound.conf.d/resolvconf_resolvers.conf
sudo systemctl restart unbound
```

Si el `sed` te dice que no encuentra `/etc/resolvconf.conf`, como me pasó a mí, no pasa nada. Significa que no tienes el paquete `resolvconf` instalado, así que no hay nada que tocar ahí. Lo que importa es que se desactive el servicio, y eso lo hace la primera línea.

### 4. Comprobar que funciona

```
dig pi-hole.net @127.0.0.1 -p 5335
```

Tiene que salir `status: NOERROR`.

Ahora comprobamos DNSSEC:

```
dig fail01.dnssec.works @127.0.0.1 -p 5335
dig dnssec.works @127.0.0.1 -p 5335
```

El primero es un dominio con la firma rota a propósito y tiene que dar `SERVFAIL`. El segundo está bien firmado y tiene que dar `NOERROR`. Si es así, Unbound está rechazando respuestas falsas como debe.

### 5. Decirle al Pi-hole que use Unbound

Puedes hacerlo desde la web, pero ya que estamos en la consola...

```
sudo pihole-FTL --config dns.upstreams '["127.0.0.1#5335"]'
```

Esto sustituye la lista de servidores entera, así que el que tuvieras antes desaparece, comprueba en la web que todo es correcto.

### 6. Prueba final

Desde otro ordenador de la red:

```
dig pi-hole.net @IP_DE_TU_PIHOLE
```

Si responde y en el registro de consultas del Pi-hole aparece reenviada a `127.0.0.1#5335`, ya está.

Y ya estaría.
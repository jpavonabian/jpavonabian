---
title: "Crear una VPN con Wireguard más PiHole para olvidarnos de los anuncios y acceder a nuestras cosas desde cualquier lugar"
date: "2023-06-23"
reply:
uri: https://jesuspavonabian.es/post/crear-una-vpn-con-wireguard-mas-pihole-para-olvidarnos-de-los-anuncios-y-acceder-a-nuestras-cosas-desde-cualquier-lugar
categories: ["anything else"] # note, reply, anything else
tags: ["VPN", "PiHole", "VPS"]
draft: false
---

Vamos con otro tutorial. Esta vez sobre cómo montar una VPN más Pihole para eliminar los anuncios de la red.

## ¿Cuál es el punto?

Odio los anuncios. De verdad, me ponen de una mala leche increíble, tengo una guerra eterna contra ellos. Desde que instalé Pihole los hice medio desaparecer, pero no es suficiente. ¡Si me voy de casa los sigo viendo!

Así que nada mejor que montar una VPN a la cual poder conectarme. Así, de paso, tengo acceso a todos los cacharros que están en mi red de casa desde cualquier lado.

## ¡Eh, yo también quiero! ¿Qué necesito?

Apunta, necesitarás lo siguiente:

- Un ordenador fijo con Linux. Una raspberry pi te hace el apaño si no tienes uno. Necesitamos algo conectado 24/7 al router de casa. Un VPS también puede valer si tienes suficiente tráfico.
- Una velocidad medio en condiciones.
- Abrir puertos en el router si no usas VPS.

## Vale, tengo todo, ¡al lío!

Venga, vamos. Lo primero, necesitamos Debian o Ubuntu. Yo prefiero Debian, Raspbian en mi caso. Tras instalarlo, usaremos Raspbian como referencia, pero sirve igual para otros sistemas, configuraremos la IP estática de la máquina. Necesitamos asegurarnos de que no nos da la lata el cambio de IP, así que comprobamos en nuestro router cuál es el rango de DHCP y le metemos una que esté fuera del rango. En mi caso, como 192.168.1.1 es una IP muy común y al acceder a cacharros desde fuera me daba conflicto porque fuera también hay 192.168.1.1, decidí cambiarla a 10.0.0.1 y tener el DHCP empezando en 10.0.0.33. Con esto me aseguro de que los cacharros conectados a la red tengan 10.0.0.34, 10.0.0.35, etc., y que todo lo que meta por debajo de 33 no va a entrar en conflicto. PiHole nos configura la IP estática el solito cuando se instala. Una vez nuestro sistema está instalado y configurado haremos lo siguiente:

1. Entrar como root. Si no podemos: `sudo su`
2. Actualizar repositorios: `apt update`
3. Actualizar el sistema: `apt upgrade`
4. Instalar curl si no lo tenemos: `apt install curl`
5. Instalar PiHole: `curl -sSL https://install.pi-hole.net | bash`

Nos saldrá un asistente muy chulo. Si usas DHCP en el router, decidle que no lo active. Nos preguntará varias cosas, entre ellas si queremos dejar la IP actual como estática. Decidle que sí. También nos dejará escoger DNS, es un instalador intuitivo. Cuando os pida DNS, podéis decirle que 8.8.8.8 y 1.1.1.1 o algún otro servicio de esos chulos de DNS. Os dará los datos de acceso por web para que podáis tocar cosas. Aunque ya por cómo viene por defecto se cepilla suficientes anuncios, yo he metido alguna lista más. Google puede ayudar en este caso.

Si queremos, cambiamos la contraseña de PiHole: `pihole -a -p`

Cambiamos las DNS del router a la IP de nuestro cacharro. Cada router es un mundo, así que ahí no me meto. Reiniciamos el cacharro con `sudo reboot` y nos mentalizamos para instalar Wireguard. Para ello usaremos pivpn, un script que nos facilita mucho el trabajo. Asumiremos que tenemos un usuario llamado dherhion.

En primer lugar nos vamos a su home, para ello teclearemos lo siguiente:  
`cd /home/dherhion/`

Ahora procedemos a actualizar los repositorios, sé que lo hemos hecho antes, pero bueno:  
`sudo apt update`

Continuamos por fin instalando Wireguard:  
`sudo curl -L https://install.pivpn.io | bash`

Cuando pregunte qué VPN queremos, escogemos Wireguard. Cuando nos pregunte si queremos usar IP o DNS, escogemos DNS. Sé que no hemos configurado nada todavía, pero eso se hace luego. Nos pedirá un dominio. Yo uso duckdns con un cron y lo explicaré más adelante, así que dherhion.duckdns.org en mi caso. Podéis usar noip, zapto o cualquiera de los gratuitos. Hay routers que permiten actualizar la IP automáticamente. El instalador ahora detectará que tenemos PiHole instalado y nos preguntará si queremos usarla en la VPN. Le decimos que sí, obviamente.

Una vez el asistente finalice, tenemos que hacer que la VPN se inicie con el sistema:  
`sudo systemctl enable wg-quick@wg0.service`  
`sudo systemctl start wg-quick@wg0.service`

Casi terminamos. Lo siguiente que tenemos que hacer es abrir el puerto 51820 en el router y configurar el dominio.

## Crear usuarios, configurar dominio dinámico y conectar

Para continuar, vamos a crear dos usuarios y conectarnos a la VPN. Sigue los pasos a continuación:

1. Usa el comando `pivpn -a` para crear un usuario llamado "pepeordenador" y otro llamado "pepemovil". Si prefieres ahorrarte preguntas, puedes utilizar `pivpn -a -n pepeordenador`. Esto creará perfiles de usuario en la carpeta "configs". Deberías tener los archivos "pepeordenador.conf" y "pepemovil.conf" listos para usar.
2. Ahora, vamos a configurar el DNS antes de generar el QR para el usuario "pepemovil". Regístrate en duckdns.org y crea una cuenta. Luego, añade un dominio. Para que la ip a la que apunta el dominio se actualice sola, añade la siguiente línea al crontab utilizando el comando `crontab -e`:

`*/1 * * * * /home/dherhion/actualizarip.sh >/dev/null 2>&1`

Crea un archivo llamado "actualizarip.sh" en la ruta "/home/dherhion/" utilizando el comando `nano /home/dherhion/actualizarip.sh` y añade el siguiente contenido:

`echo url="https://www.duckdns.org/update?domains=dherhion&token=tu_token&ip=" | curl -k -o ~/duckdns/duck.log -K -`

Reemplaza "dherhion" y "tu\_token" por los valores correspondientes. Luego, ejecuta `chmod +x actualizarip.sh` para darle permisos de ejecución al script.

## ¿Cómo probar si funciona?

Casi lo tenemos. ¡Probemos a conectar! Explicaré cómo hacerlo desde un móvil, pero conectar desde Windows, Mac o Linux no es difícil, solo tienes que importar el archivo .conf que se genera en configs.

1. Descarga la aplicación Wireguard desde Google Play Store o App Store.
2. Abre la aplicación y selecciona la opción para escanear un código QR.
3. Maximiza la pantalla de la terminal en tu dispositivo.
4. Ejecuta el comando `pivpn -qr`.
5. Selecciona el perfil correspondiente al usuario "pepemovil".
6. En el móvil, agrega un nuevo túnel utilizando la configuración generada.
7. ¡Listo! Desconecta la conexión Wi-Fi y activa el nuevo túnel creado. Navega durante unos minutos y luego utiliza el comando `pivpn -c` en la terminal de tu ordenador para ver los dispositivos conectados. Si todo está configurado correctamente, deberías poder acceder al panel de PiHole cuando te conectes a la VPN.

## Bonus: Acceder a los dispositivos de la red como si estuvieras conectado localmente

Para acceder a los dispositivos de la red como si estuvieras conectado localmente, sigue estos pasos:

`sudo nano /etc/sysctl.conf`

Descomenta la línea:  
`net.ipv4.ip_forward = 1`

Guarda los cambios con `Ctrl + X`. Luego, ejecuta el comando `ip route list default` para obtener la interfaz de red.

Abre el archivo de configuración de Wireguard utilizando el comando:  
`sudo nano /etc/wireguard/wg0.conf`

Agrega las siguientes líneas debajo de la configuración existente en la sección "ListenPort", asegurándote de no duplicar líneas:

`SaveConfig = true`  
`PostUp = iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE`  
`PreDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE`

Guarda los cambios con `Ctrl + X`. Finalmente, reinicia el sistema con `sudo reboot`.

¡Listo! Ahora puedes acceder a los dispositivos de tu red como si estuvieras conectado localmente.

P.D.: Dherhion.duckdns.org no existe.

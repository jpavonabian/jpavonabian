---
title: "Instalar un cliente Torrent en una raspberry Pi"
date: 2024-07-02
reply:
uri: "https://jesuspavonabian.es/post/instalar-cliente-torrent-raspberry-pi"
categories: ["anything else"]
tags:
draft: false
---
¡Buenas!
Hoy os traigo un tutorial para instalar y configurar un cliente Torrent en una Raspberry Pi. Lo tenía configurado desde hace un par de meses pero soy un desastre, así que he decidido convertir mis apuntes en un tutorial para que no se me olvide. Con suerte le vale a alguien.

Utilizaremos Transmission, un cliente Torrent ligero y eficiente. También configuraremos un disco duro externo como almacenamiento para nuestras descargas.

### Paso 1: Conectar el Disco Duro
Si vamos a usar un disco duro externo para almacenar nuestras descargas, primero debemos conectarlo a la Raspberry Pi y verificar su ubicación en el sistema. Abrimos una terminal y utilizamos el siguiente comando para identificar el disco duro:

```lsblk -fm```

En mi caso, el disco duro está ubicado en /dev/sda1.
### Paso 2: Montar el Disco Duro
Montamos el disco duro en el sistema editando el archivo /etc/fstab:

`sudo nano /etc/fstab```

Añadimos la siguiente línea al final del archivo para montar el disco duro en /mnt/disco (puede cambiarse "disco" por otro nombre si se prefiere):

`/dev/sda1 /mnt/disco ntfs defaults 0 0`

Guardamos los cambios presionando Control + X, tecleamos Y y presionamos ENTER. Luego, reiniciamos el sistema para aplicar los cambios:

`sudo reboot`

Asumiremos que la ruta de nuestro disco es /mnt/disco.
### Paso 3: Instalar Transmission
Una vez que el disco duro está montado, procedemos a instalar Transmission:

```sudo apt install transmission-daemon```

Detenemos el servicio de Transmission para configurarlo:

```sudo service transmission-daemon stop```

### Paso 4: Configurar Transmission
Editamos el archivo de configuración de Transmission:

```sudo nano /etc/transmission-daemon/settings.json```

Realizamos las siguientes modificaciones:

```
Directorio de descargas: Configuramos la ruta donde se guardarán nuestros archivos descargados.
"download-dir": "/mnt/disco/descargas",
Número máximo de peers globales.
"max-peers-global": 200,
Puerto de conexión.
"peer-port": 51413,
Límite de peers por torrent.
"peer-limit-per-torrent": 50,
Usuario y contraseña para la interfaz web: Configuramos el usuario y la contraseña (se cifrará automáticamente al iniciar el servicio).
"rpc-username": "USUARIO",
"rpc-password": "CONTRASEÑA",
Puerto para la interfaz web.
"rpc-port": 9091,
Whitelist para la interfaz web: Desactivamos la whitelist para permitir el acceso a la interfaz web desde cualquier IP.
"rpc-whitelist-enabled": false,
```

Guardamos los cambios presionando Control + X, tecleamos Y y presionamos ENTER.
### Paso 5: Gestionar Permisos
Editamos el archivo de inicio de Transmission para cambiar el usuario a root:

```sudo nano /etc/init.d/transmission-daemon```

Modificamos la línea USER=debian-transmission a USER=root.
Guardamos los cambios presionando Control + X, tecleamos Y y presionamos ENTER.
A continuación, cambiamos el propietario y los permisos del directorio del disco:

```sudo chown -R root /mnt/disco
sudo chmod -R 755 /mnt/disco```

### Paso 6: Iniciar Transmission
Finalmente, iniciamos el servicio de Transmission:

```sudo service transmission-daemon start```

### Paso 7: Disfrutar
¡Eso es todo! Ahora podemos acceder a http://ip:9091 e iniciar sesión con las credenciales que pusimos en el archivo de configuración.

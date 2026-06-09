---
title: "Cómo remapear una tecla en el Keychron V6 con QMK (y casi cargarte el teclado en el intento)"
date: 2026-06-09T09:00:00+02:00
reply:
uri: "https://jesuspavonabian.es/post/keychron-v6-qmk-remap"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

Mi teclado hacía algo raro de narices. Había una tecla que enviaba `Win+D` cada vez que la pulsaba. En concreto, la tecla que debería ser `PAUSE`.

Y diréis... ¿Para qué sirve esa tecla? Pues para cambiar el control del teclado en las apps de Windows, por ejemplo. Pero claro, al pulsarla se me iba al escritorio, una maravilla que le deseo probar a todo el mundo, que el teclado haga cosas raras no tiene precio y ejercita la paciencia.

El Keychron V6 viene con QMK. Eso significa que puedes remapear cualquier tecla... si no tienes problemas de visión, claro. Si eso pasa, puedes, pero en modo sufrimiento nivel profesional.

En principio solo tienes que compilar un firmware, flashearlo y listo. Fácil, sencillo y para toda la familia.

## El entorno

El V6 usa un microcontrolador STM32, así que necesitas la toolchain de ARM para compilar. Yo lo hice desde WSL (Ubuntu 22.04 en Windows), que se conoce que en Windows el invento no funciona del todo fino.

Primero instala QMK CLI:

```bash
pip install qmk
qmk setup
```

El setup clona el repositorio entero de QMK firmware. Tarda un rato. Cuando termine verás un montón de warnings sobre dependencias que faltan. En Ubuntu los paquetes tienen nombres distintos a los que espera QMK:

```bash
sudo apt install gcc-arm-none-eabi gcc-avr avrdude dfu-programmer dfu-util
```

`gcc-avr` en lugar de `avr-gcc`. Detalle que no está en ningún sitio. Gracias, Claude.

El `avr-gcc` del repositorio de Ubuntu es viejo y se quejará de ello. No importa: el V6 usa ARM, no AVR. Puedes ignorar ese warning y seguir.

## El keymap

El V6 tiene varias variantes. La mía tiene perilla (encoder) y layout ISO español, así que es `keychron/v6/iso_encoder`:

```bash
qmk new-keymap -kb keychron/v6/iso_encoder -km tunombre
```

Esto crea una copia del keymap por defecto en:

```
~/qmk_firmware/keyboards/keychron/v6/iso_encoder/keymaps/tunombre/keymap.c
```

Ábrelo con tu editor. Busca la capa `WIN_BASE`, que es la que usa el teclado en modo Windows. La primera fila tiene esto:

```c
KC_ESC,   KC_F1, ... KC_F12,  KC_MUTE,  KC_PSCR,  KC_NO,  RM_NEXT, ...
```

Ese `KC_NO` entre `KC_PSCR` (Imprimir Pantalla) y `RM_NEXT` es la tecla conflictiva. `KC_NO` significa literalmente "no hacer nada", pero Windows la interpreta como `Win+D` por alguna razón que no me apetece investigar.

Cámbialo por `KC_PAUSE`:

```c
KC_ESC,   KC_F1, ... KC_F12,  KC_MUTE,  KC_PSCR,  KC_PAUSE,  RM_NEXT, ...
```

Guarda y compila:

```bash
qmk compile -kb keychron/v6/iso_encoder -km tunombre
```

## El flasheo, o cómo casi me quedo sin teclado

Aquí está la parte interesante.

WSL no tiene acceso directo a dispositivos USB. Para flashear desde WSL necesitas `usbipd`, que expone el dispositivo USB de Windows al subsistema Linux:

```powershell
# En PowerShell como administrador
winget install usbipd
```

Ahora pon el teclado en modo bootloader. Hay dos formas:

**Opción A:** Desconecta, mantén pulsado `Escape`, vuelve a conectar.

**Opción B (si al Flashear se te queda como un pisapapeles caro y da error el flasheo):** Quita el keycap de la barra espaciadora. Debajo, a la izquierda del switch, hay un botón de reset en la PCB. Mantén ese botón pulsado mientras conectas el USB.

Con el teclado en modo DFU, comprueba el BUSID en Powershell como administrador:

```powershell
usbipd list
# Busca: STM Device in DFU Mode
```

Comparte el dispositivo con WSL. Otra vez, como administrador, por favor:

```powershell
usbipd bind --busid X-X
usbipd attach --wsl --busid X-X
```

Y flashea desde WSL:

```bash
qmk flash -kb keychron/v6/iso_encoder -km tunombre
```

### Lo que puede salir mal

Si el flash falla a mitad (error `ERASE_PAGE` al 74%, por ejemplo), el firmware queda corrupto. El teclado enciende pero no es reconocido por el PC como dispositivo USB. Pánico.

La solución es forzar el modo bootloader por hardware usando el botón de la PCB. Quitando el keycap del espacio llegas a él sin abrir nada. Con el teclado en modo DFU puedes reflashear sin problema aunque el firmware esté corrupto, porque el bootloader del STM32 vive en una zona protegida del chip que un flash normal no puede tocar.

Repite el proceso: botón de reset + USB, `usbipd attach`, `qmk flash`. A la segunda va. O a la tercera, ¿por qué no?

## El resultado

Tecla remapeada. ¿A que ha sido sencillito?
---
title: "TTS No Habla"
date: 2024-06-28
reply:
uri: "https://jesuspavonabian.es/post/TTS-no-habla"
categories: ["anything else"]
tags:
draft: false
---
Los otros días me encontré con que las voces de Microsoft no reproducían contenido, aparentemente.

Tras mucho darle vueltas y Googlear en el soporte de Microsoft no encontré nada y acabé bastante frustrado.

Resulta que al final, en contra de lo que yo pensaba, sí que se reproducían los audios que generaban esas voces. Tuve que hacerme un Script en Python para poder probarlo.

Entonces, si los audios se reproducen, ¿por qué yo no escuchaba nada?

La respuesta estaba en el configurador de Sapi, que no puede estar más escondido. Se había cambiado el dispositivo de salida de estas voces.

¿La solución? ir a "C:\Windows\SysWOW64\Speech\SpeechUX\sapi.cpl" y cambiar el dispositivo de salida al predeterminado del sistema.

¡Espero que a alguien le sirva este minipost!
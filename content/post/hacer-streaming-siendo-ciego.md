---
title: "¿Hacer streaming siendo ciego?"
date: "2021-09-29"
reply:
uri: https://jesuspavonabian.es/post/hacer-streaming-siendo-ciego
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

Soy ciego y quiero montar mi canal de Youtube, Twitch y demás, pues considero que tengo cosas que mostrarle al mundo. ¿Se puede sin morir en el intento? ¡He buscado en Google y me he quedado igual!

Claro que se puede, aunque he de decir que el resultado no será el adecuado sin un poco de ayuda visual. Pero al menos, si me lees, harás algo menos el ridículo. ¡Adiós, transmisiones con pantalla negra! Os dejo por aquí a modo de guía rápida (o de recolección de recursos) todo lo necesario para empezar.

Es cierto que hay bastante información (no estoy escribiendo nada nuevo, la hay incluso repetida), pero suele estar en vídeos o en audiotutoriales. Y voy a ser franco, muchas veces acaban con mi paciencia. Prefiero lo escrito, que puedo leer cuantas veces necesite y sin complicarme la existencia. Iré actualizando esta entrada o creando otras nuevas con los recursos que me vaya encontrando por la red. Sin más, vamos a lo que nos interesa.

## Equipamiento necesario

Para dar inicio a tu aventura en el streaming necesitarás:

- Un ordenador con Windows 10 como mínimo, una buena tarjeta gráfica y bastante memoria RAM.
- La última versión de [NVDA (Abre en una nueva ventana)](https://nvda.es). Podrías usar JAWS o Narrador, pero la forma más fiable de asegurar que todo funcione bien la he encontrado con este lector de pantallas.
- Necesitarás saber manejar el navegador de objetos de NVDA, así como el OCR que viene integrado. Si no sabes, antes de seguir adelante con esto, es un buen momento para aprender.
- La última versión de [OBS (abre en una nueva ventana)](https://obsproject.com/es/download).
- El [complemento de NVDA para OBS Studio (abre en una nueva ventana)](https://nvda.es/2021/07/02/obs-studio/) (opcional, yo no lo utilizo).
- Una cuenta en Twitch y/o YouTube.
- Si usas Twitch o YouTube, [descarga VeTube (abre en una nueva ventana)](https://github.com/metalalchemist/VeTube) para leer chats.

## Comenzando

Bien, ya tenemos todo lo que necesitamos. Podemos continuar.

Lo primero que tenemos que hacer es instalar OBS Studio. No me voy a detener aquí pues es una instalación bastante sencilla.

Cuando lo abramos por primera vez, nos saldrá un asistente de configuración. hay quien prefiere saltarlo y configurarlo todo luego desde los ajustes, pero si se tiene claro para qué se desea el programa, es bastante útil, pues acaba ahorrando más de un dolor de cabeza. ¡Aprovéchalo!

Lo siguiente que tenemos que hacer, una vez abierto el programa, es ignorar la ventana de Twitch o Youtube, si es que nos sale alguna. Usa el navegador de objetos para desplazarte a la ventana del programa y mueve el foco a dicha ventana para continuar.

Por lo general, OBS nos pilla algunos ajustes ya por defecto. Pero no está demás ir a la barra de menús con alt y revisar en los ajustes. Por defecto, nos capturará el audio del escritorio (todo lo que se escuche por nuestros altavoces o auriculares) y el micrófono predeterminado.

Comencemos. Lo primero que tenemos que hacer es, si no lo hemos hecho en el asistente de configuración, configurar el destino de nuestra transmisión. En ajuste tienes todas las opciones, revísalas bien y sigue las instrucciones.

Lo siguiente que haremos será crear tres escenas que incluirán varias fuentes. Nos detendremos un momento aquí para explicar el concepto de forma bastante rápida.

Una escena es una colección de fuentes que pueden o no mostrarse.

Una fuente es, como su nombre indica, una fuente de contenido. Puede ser desde nuestra pantalla del ordenador hasta un archivo multimedia, pasando incluso por lo que nos devuelva un navegador web. ¡Anímate a buscar en google para más información!

En mi caso particular, yo utilizo tres escenas. Una llamada cara, otra llamada pantalla y otra llamada cámara y pantalla. El contenido de cada una son las siguientes fuentes, sin contar alertas y cosas más avanzadas que pueden añadirse:

### Cara

Contiene una única fuente que ocupa todo el tamaño de la pantalla. para crearla he seguido los siguientes pasos, una vez en la ventana principal de OBS.

- Con navegador de objetos me he desplazado a la ventana de escenas. He accedido a la barra de herramientas y he pulsado en el botón agregar. En el cuadro de edición para darle un nombre he escrito cara y he pulsado enter.
- A continuación, de vuelta en la ventana principal de OBS, he pulsado ctrl+n para añadir una vuente y he seleccionado una fuente de captura de dispositivo de vídeo. He seguido el asistente, le he puesto de nombre cámara para fuente cara y he seleccionado mi cámara, no he tocado nada más.
- para acabar, he seleccionado la fuente con control 1 y le he dado a CTRL + f para ajustarla a la pantalla.

\`

### Pantalla

Esta escena consiste exactamente en hacer lo mismo que la anterior, pero cambiando la fuente de dispositivo de captura de vídeo por la de captura de pantalla. Ponle un nombre descriptivo y deja el resto de ajustes tal cuál están. ¡No olvides pulsar cuando termines CTRL+f para ajustarla a toda la pantalla!

### Cara y pantalla

Esta escena es una mezcla de las dos anteriores. Cuidado que tiene su aquel. Creé una que se llamó pantalla y cara y seguí estas instrucciones.

- En primer lugar, pulsé CTRL+n para añadir una fuente captura de pantalla.
- Cuando la tuve, no pulsé CTRL+f, pues no queremos ajustarla a la pantalla, necesitamos que la siguiente se superponga y quede más o menos bien.
- Para acabar, añadí la fuente de captura de dispositivo de vídeo, donde seleccioné mi cámara.

Por alguna razón que tiene su lógica pero que yo no puedo explicaros con exactitud (cosas de no ver), hay que seguir dicho orden para que ambas fuentes se vean.

En lo que respecta al audio, hay una nueva fuente disponible que permite capturar el audio de una aplicación específica, lo cual es útil si no deseas capturar todo el audio del sistema.

## Atajos de teclado

Una de las cosas buenas que tiene OBS es que permite personalizar los atajos de teclado para hacer la mayoría de sus acciones de forma rápida. Ve a los ajustes y explora la parte de teclado. El navegador de objetos te será útil aquí. Una de las primeras cosas que añadí a los atajos fue el cambiar entre escenas. Shift f1 me lleva a la escena de solo pantalla, shift f2 me lleva a la escena de solo cámara y shift f3 me lleva a la de cámara y pantalla. Es muy útil si estás transmitiendo y necesitas cambiar rápidamente.

Truco: Con tabulador puedes moverte entre cuadros de edición y botones, Usa la convinación de teclas para mover el navegador de objetos hacia atrás para ver en qué opción estás, pues esa parte no termina de ir bien con NVDA. si no te consigues aclarar, escribe un comentario y lo explico con más detalle.

## Pantalla en negro

Hay una última cosa que me gustaría comentar en este artículo. La pantalla en negro. Es una comprobación que hago siempre cuando instalo OBS antes que nada. Por alguna razón, en determinados portátiles, cuando capturas una pantalla se ve en negro.

La forma rápida de comprobarlo siendo ciego, si no tenemos unos ojitos que nos puedan echar una mano, es la siguiente:

- Activa una escena donde solo se capture tu pantalla.
- Inicia una grabación.
- Dirígete a un procesador de textos y escribe cualquier cosa. si puedes abrir un documento con mucho texto, mejor. Maximízalo.
- Mantén esa ventana al frente durante unos 30 o 40 segundos. Después, finaliza la grabación.
- Abre el vídeo y pásale el OCR con NVDA. si puedes leer parte del texto, tu pantalla no se ve en negro.

Si por alguna razón No te funciona este truco, pide ayuda a alguien que vea para garantizar que en efecto tu pantalla se ve en negro. si te ha tocado este caso lo siento, te toca buscar en google y probar a ver qué solución te funciona a ti.

En mi caso, el problema se arregló con cerrar OBS y borrar el contenido de la carpeta "C:\ProgramData\obs-studio-hook\" y recreando las fuentes de captura de juegos, pero otros necesitarán cambiar la gráfica por la que se ejecuta el programa o lo que desean capturar.

## Para finalizar

Utiliza tantas escenas como necesites. Desde que escribí este artículo fui añadiendo escenas más específicas. Por ejemplo, una para capturar juegos, otra para juegos y cámara, otra para una aplicación específica, otra para una aplicación específica con cámara y una que lo único que hace es mostrar una imagen donde pone "BRB, I'm AFK" para cuando necesite ausentarme.

Investiga mucho y pide ayuda a gente que vea. Podemos llegar hasta un punto, pero terminar de configurarlo todo requiere que unos ojitos funcionales nos echen una mano. Técnicamente con lo explicado aquí se puede transmitir, pero seamos sinceros, queda más bonito que un vidente te encuadre la fuente de la cámara en un marco con colorines ajustado a la temática de tu Stream, por ejemplo. Lo bueno es que solo necesitarás ayuda una vez. cuando esté todo configurado, puedes hacerte una copia de la configuración.

Hay mucho más que contar, por supuesto. Pero lo dejaré aquí por hoy. Como habrás podido comprobar, he dejado cosas en los requisitos de las cuales no he escrito nada. Las dejaré para futuras entradas, aunque tienes una buena base para investigar por ti mismo, creo que lo básico está cubierto.

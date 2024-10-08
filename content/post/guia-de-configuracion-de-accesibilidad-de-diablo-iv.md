---
title: "Guía de configuración de la accesibilidad de Diablo IV"
date: 2024-06-24
reply:
uri: "https://jesuspavonabian.es/post/guia-de-configuracion-de-accesibilidad-de-diablo-iv"
categories: ["anything else"]
tags:
draft: false
---
Actualizada el 9 de Octubre de 2024.

Recientemente he comenzado a jugar Diablo IV y me he dado cuenta de que no hay nada de información sobre su accesibilidad en español.
Así pués, basándome en [esta guía del foro de audiogames](https://forum.audiogames.net/topic/53635/diablo-iv-getting-started-totally-blind-players/) he decidido documentar lo que vaya encontrando. La iré actualizando por mi cuenta, pero si sabes inglés, recomiendo echarle un vistazo.

Gracias, UltraLeetJ.

Esta guía está en progreso y la actualizaré a medida que encuentre nuevas cosas. Hay algunos hilos en en el foro de Audiogames sobre la discusión general del juego, pero el más completo es [este (preguntas sobre diablo en inglés)](https://forum.audiogames.net/topic/48574/diablo-questions/). También hay una [versión recuperada del año pasado para la ¿wiki ciega?](https://web.archive.org/web/20230620085008/https://diablo-iv-blind-accessibility-resource.fandom.com/wiki/Diablo_IV_Blind_Accessibility_Resource_Wiki) y un [servidor de discord para hablar sobre el juego en inglés también](https://discord.gg/mrFkV6SVYw).

Diablo IV es un juego de rol de acción en línea, de rastreo de mazmorras, desarrollado y publicado por Blizzard Entertainment en 2023. Usas tus habilidades para completar misiones a través del combate. También puedes tener un clan y hacer combates jugador contra jugador. Lee todo sobre ello en [su entrada en wikipedia](https://en.wikipedia.org/wiki/Diablo_IV). Para obtener el juego puedes hacerlo desde [el sitio de Diablo IV de Blizzard](https://diablo4.blizzard.com/), el juego está [también disponible en Steam](https://store.steampowered.com/app/2344520/Diablo_IV/). Para jugar, puedes usar un ratón y teclado o un controlador, o ambos, aunque para la mejor experiencia un controlador es esencial, ya que puedes navegar y configurar las opciones del juego de esta manera. El juego también tiene descuentos de vez en cuando, así que estate atento.

### configuración y cosas útiles para descargar

Yo utilizo la versión de Battle.net. Es probable que el lector de pantallas no lea nada cuando abras el juego por primera vez, pero abordaremos eso más adelante. ¡sigue leyendo!
Nota para usuarios de Steam o Xbox: para hacer las cosas mucho más fáciles, deberías conectar o [enlazar tus cuentas de Steam o Xbox y Battle.net desde esta página](https://account.blizzard.com/connections) antes de comenzar el juego. Te conectarás automáticamente tan pronto como el juego se ejecute y el lector de pantalla te notificará todo, también automáticamente.

La primera pantalla en la que aterrizas si ya estás conectado es el lector de pantalla para el juego. Al presionar confirmar aquí (el botón A en los controladores de Xbox, el botón X en los controladores de PlayStation) dejarás que el juego sepa que deseas habilitar el lector de pantalla y luego serás llevado a una pantalla de brillo. Puedes presionar el mismo botón de confirmación y luego serás llevado a la pantalla de selección de resaltado. Desde aquí, deberías haber recibido algún discurso ya sea a través de cualquier voz de OneCore, o cualquiera de las disponibles en el panel de control de Windows 10/11. Si este no es el caso, consulta la sección de solución de problemas del lector de pantalla a continuación.

Si llegas a la pantalla de configuración, usa los botones R1 o R2 para moverte entre las distintas categorías. Luego, confirma tus cambios cuando estés en la última categoría a la derecha y estarás casi listo. También puedes habilitar lectores de pantalla de terceros como NVDA (asegurándote de obtener los archivos del cliente de controlador de NVDA dentro de la carpeta ejecutable de Diablo) y JAWS (funciona sin necesidad de utilizar ninguna configuración).

A lo largo de todo este tiempo la comunidad ha estado creando cosas increíbles para el juego. Puedes instalar el [complemento de normalizador de codificación](https://cloud.tiflo-games.ru/s/XqtenYdado83CWy) y [ver su hilo en el foro de audiogames en inglés aquí](https://forum.audiogames.net/topic/52685/fix-broken-encoding-in-diablo-iv-for-nonenglish-players). También puedes obtener los archivos del cliente de NVDA para colocar dentro del directorio en el que Diablo está instalado, en Steam es: `C:\Program Files (x86)\Steam\steamapps\common\Diablo IV` y por defecto desde Battle.net es: `C:\Program Files\Diablo\`. Usa [este enlace, luego busca el último enlace para el zip del cliente de controlador](https://www.nvaccess.org/files/nvda/releases/stable/).

### navegación y uso del juego

Una de las preguntas más comunes que la gente tiene es cómo navegar por el juego.

Uno de los botones que usarás mucho es el botón para la pantalla del mapa. En Xbox es el botón de vista o menú (el izquierdo opuesto a pausa/inicio), en el teclado es m, y en PlayStation es el panel táctil.

Necesitas recordar dos cosas. primero, puedes teletransportarte a los puntos de referencia en el mapa una vez que los hayas encontrado. segundo, necesitas explorar usando el mapa y haciendo zoom para encontrar cosas.

Por ejemplo, abre la pantalla del mapa. Para hacer zoom usas el stick derecho (escucharás un sonido de vibración cuando cambie el nivel de zoom), usa el stick derecho hacia abajo para alejar, el stick derecho hacia arriba para acercar. aleja todo el camino, luego acércate un nivel. usa el stick izquierdo, muévelo ligeramente hacia la derecha, luego presiónalo para centrar la cámara en ti mismo. muévelo hacia arriba y hacia la derecha, centra. luego hacia arriba, luego centra. luego hacia arriba y hacia la izquierda, luego presiónalo para centrar de nuevo.

Así es como encuentras cosas. también puedes ir arriba arriba centro, abajo abajo centro, si algo está más lejos.

También puedes presionar el stick derecho en la pantalla del mapa para filtrar qué lugares se te anuncian a medida que te mueves por el mapa. Cuando desbloqueas un punto de referencia, en el mapa, cada vez que lo encuentras puedes presionar el botón X en él para teletransportarte.

Una vez has seleccionado un objetivo en el mapa y has salido de él se activará el sistema de navegación de audio si lo tienes activado en las opciones del juego.

Es un sistema confuso al principio, pero potente. Consta de tres sonidos:

- Uno de ellos es una especie de tambor tocando 3 veces. Significa que vas mal encaminado.
- Otro es el mismo tambor, pero con un ligero click. Eso significa que estás yendo a una dirección aproximada de tu objetivo.
- Si se oye más el click que el tambor, estás bien encaminado.

Cuando estés en la primera parte del prólogo, Anochecer en la Montaña, te encontrarás con algunos enemigos a los que tendrás que atacar. El juego tiene audio posicional para que puedas apuntar y atacar con éxito. También puedes configurar desde las opciones si el bloqueo de enemigos se realiza automáticamente y también puedes usar el stick derecho para seleccionar y presionarlo para bloquear un objetivo.

También es una buena idea tener el complemento de Speech history de NVDA, ya que algunos controles, como en la pantalla del mapa, no se anuncian ya que el discurso se trunca de alguna manera incluso con el lector de pantalla incluido, y anuncia los dos últimos, pero si revisas el texto anunciado aquí se revelará todo.

### solución de problemas del lector de pantalla

Entonces, comenzaste el juego y cero discurso, incluso después de saltarte el mensaje del lector de pantalla... ¿qué hacer ahora? primero que todo, usa OCR para confirmar que las pantallas están cambiando. Los sonidos cuando mueves el cursor y confirmas opciones se reproducen incluso si no se lee nada.
Esto normalmente y a menudo ocurre cuando tienes un idioma diferente y no está completamente instalado, o voces rotas en la configuración de Windows 10/11. Ten en cuenta que incluso si obtienes asistencia visual, el lector de pantalla no se habilitará hasta que resuelvas cualquier problema con las voces de OneCore y/o sapi5 de Windows.
Así que primero, sal del juego, y ve al panel de control, y abre la categoría de idioma, hora y región, luego tabula para elegir la subsección voz que es la última en la lista. Luego tabula alrededor hasta que escuches, elige una voz, y cambia la voz a la primera disponible. Esa es la que el juego espera y usará. Para asegurarte de que se reproduce, selecciona el botón de vista previa de voz. Si no se reproduce, entonces necesitas reinstalar los paquetes de idiomas haciendo lo siguiente:
Desde esta pantalla, vuelve a la lista de subsecciones para hora e idioma, y luego desde allí elige la segunda, idioma y región. Tabula dos veces para agregar un idioma, selecciónalo de la lista, asegúrate de que haya texto a voz disponible para él (se anunciará cuando selecciones el idioma), y luego presiona siguiente. Luego, una vez dentro de ese diálogo, desmarca todo excepto texto a voz y luego presiona instalar. Dale unos minutos, se anunciará el progreso y la instalación se completará. Luego previsualiza tus voces nuevamente. Si no suenan, hay un último recurso en el juego pero tienes que asegurarte de tener instalado y funcionando el idioma inglés de Estados Unidos de texto a voz, más específicamente la voz de Microsoft David (escritorio).
Luego ve a Steam y cambia el idioma del juego a inglés, esto provocará y desencadenará una descarga de 1 GB. El juego debería funcionar ahora en inglés. Luego puedes habilitar el lector de pantalla de terceros, guardar tus opciones, y tan pronto como lo hagas, sal del juego y luego cámbialo al idioma que quieras usar (en este momento sé que inglés, español, francés, italiano y portugués son compatibles con lectores de pantalla). Esto provocará otra descarga de aproximadamente 1 GB (imagino que para diálogos y demás), pero al menos obtendrás el juego funcionando. Para comprobar que las preferencias se están guardando correctamente, puedes inspeccionar el archivo local prefs.txt en tu carpeta de documentos\diablo IV.

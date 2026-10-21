---
title: "Traducción: Deja de hacer lectores de pantalla con vibecoding"
date: 2026-10-21T18:02:10+02:00
tags: ["Vibecoding","IA","Lector de pantalla"]
categories: []
summary: ""
description: ""
inReplyTo: "https://fireborn.mataroa.blog/blog/stop-vibecoding-screen-readers/" 
draft: false
---

A riesgo de ganarme enemigos varios y variados, dejo por aquí una traducción un tanto chapucera de [Este post](https://fireborn.mataroa.blog/blog/stop-vibecoding-screen-readers/) de [Aaron](https://dragonscave.space/@fireborn), pues lo considero bastante interesante.

Si teneis conocimientos de inglés o sabéis usar un traductor recomiendo echarle un ojo al Blog, merece bastante la pena.

## El post en cuestión

Hay una tendencia en Android ahora mismo que va a acabar haciendo daño a alguien. Daño en el sentido de que una persona ciega coja su teléfono en el peor momento posible y descubra que aquello de lo que depende para interactuar con el mundo ha decidido, sencillamente, dejar de funcionar.

Las bifurcaciones de TalkBack están por todas partes. Cada pocas semanas aparece un proyecto nuevo, cada uno repleto de promesas. Más parecido a VoiceOver. Gestos más rápidos. Mejor verbosidad. Menor latencia. Algunos incluso consiguen cumplir una o dos de esas promesas. Pero todos y cada uno salen a la calle con errores tan evidentes, tan vergonzosos, tan fáciles de detectar para un desarrollador que sabe lo que está haciendo, que solo hay una explicación posible para que hayan llegado a publicarse.

El desarrollador no tenía ni idea de lo que estaba construyendo.

### Los fallos son evidentes

El foco acaba en el lugar equivocado después de desplazarse por una lista. Las acciones personalizadas se ejecutan en un orden incorrecto. El cursor de lectura salta por los campos de edición. La salida braille pierde caracteres cuando aumenta la carga de trabajo. La exploración táctil deja de detectar el primer intento después de volver a encenderse la pantalla.

Estas son las cinco primeras cosas que miras cuando coges tu teléfono. Un desarrollador que conozca la arquitectura de accesibilidad detecta estos problemas antes de publicar. La exploración táctil tiene particularidades temporales que resultan completamente predecibles en cuanto sabes que existen. Las frecuencias de actualización del búfer de pantalla interactúan con el envío de gestos de formas documentadas, conocidas y perfectamente manejables si has dedicado tiempo de verdad al framework. Cualquiera que lo hubiera hecho tendría estos problemas en su lista mental de comprobaciones.

Estos desarrolladores están pidiendo código mediante prompts sin entenderlo, metiéndolo en Android Studio, parcheando los errores de compilación y publicándolo. El árbol de `AccessibilityNodeInfo`, los conflictos entre los gestores de envío de gestos, los modelos de concurrencia: no han reflexionado sobre nada de eso, porque el LLM se ha encargado, y el LLM no sabe lo que no sabe. Ellos tampoco. Así que los errores llegan a producción.

Que el LLM escriba las pruebas no soluciona nada. El LLM escribe pruebas para el comportamiento que creía estar implementando. Pasa por alto las mismas cosas que pasó por alto la primera vez. Las pruebas escritas por el mismo sistema que escribió el código confirman que el código hace lo que el LLM creía que querías. Eso es información inútil.

### La confianza es un requisito técnico

Tienes que poder confiar en un lector de pantalla del mismo modo que confías en tus ojos.

Tus ojos no son una herramienta que evalúas antes de confiar en ellos. No miras de reojo el marco de una puerta y te preguntas si tu corteza visual ha interpretado correctamente lo que ves. Simplemente lo sabes. Un lector de pantalla tiene que ganarse esa misma confianza automática o no está cumpliendo su función.

Un lector de pantalla que puede enfocar el elemento equivocado te obliga a comprobar manualmente el resultado después de cada interacción. Uno que pierde contenido significa que nunca puedes estar seguro de si una notificación realmente no ha llegado. Uno que se comporta de forma inconsistente te obliga a cuestionar constantemente tu propio dispositivo. Es agotador. Es desmoralizador. Y es la consecuencia directa de que alguien publique software que no entiende en un contexto en el que sus usuarios no tienen ninguna alternativa.

O el lector de pantalla informa del estado de la interfaz con precisión y fiabilidad, o no es un lector de pantalla. Es un objeto con forma de lector de pantalla que falla en la única tarea para la que existe.

### Sé sincero sobre lo que has construido

Los archivos README dicen «experiencia TalkBack mejorada», «diseñado teniendo en cuenta la accesibilidad» y «se agradecen los comentarios».

Se agradecen los comentarios. Como si las personas que notifican problemas con la gestión del foco le estuvieran haciendo un favor al desarrollador, en lugar de ser el desarrollador quien les ha fallado antes incluso de que instalaran la aplicación por primera vez.

Si no te sientes cómodo escribiendo «esto lo ha escrito un LLM» en el README, no deberías publicarlo. Esa incomodidad es tu propio criterio diciéndote que algo va mal.

Las personas ciegas instalan estas aplicaciones de buena fe, se encuentran con estos errores en situaciones reales y descubren las consecuencias por las malas. Todas y cada una de esas personas confiaron en que el desarrollador no les haría perder el tiempo ni pondría en peligro su acceso al dispositivo. Esa confianza no se ganó y se ha malgastado.

### Entiendo el atractivo

Si llevas años viendo cómo TalkBack se estanca, cómo Google trata la accesibilidad como una casilla que hay que marcar, cómo las funciones se rompen entre versiones y siguen rotas durante meses mientras el rastreador de errores acumula polvo, la idea de sentarte delante de un LLM y conseguir algo que parece funcionar en menos de una hora puede parecer una maravilla.

No tienes que esperar a Google. No tienes que abrir otra incidencia que no va a ninguna parte. Puedes construirlo tú mismo.

El LLM no puede construir esto. Ha leído la documentación. Puede generar código que compila, se ejecuta y parece funcionar en una demostración. No puede percibir que el comportamiento del foco es incorrecto. No puede detectar que hay algo ligeramente extraño en la forma en que el cursor de lectura se desplaza por una lista de conversaciones: ese tipo de cosas que cuesta explicar con palabras, pero que resultan inmediatamente evidentes para cualquiera que lleve años navegando por listas de conversaciones con un lector de pantalla.

Genera código que evalúa alguien cuya principal cualificación para juzgarlo es que quería que fuese bueno.

La frustración con TalkBack es legítima. Esta no es la solución.

### Hazlo bien o no lo hagas

Conocer la arquitectura es el requisito imprescindible. Punto.

Hay desarrolladores ciegos que conocen este framework al dedillo. Hay desarrolladores videntes que llevan años trabajando con las API de accesibilidad. La mayoría de quienes publican estas bifurcaciones no tienen ni lo uno ni lo otro, y eso se nota en cada informe de errores.

Si no tienes esos conocimientos, busca a personas que sí los tengan antes de publicar. Personas que utilicen un lector de pantalla como principal método de acceso, a diario, para todo. Págales. Reconoce su contribución. Escúchalas, incluso cuando eso signifique desechar aquello de lo que estabas más orgulloso.

Di qué has utilizado para construirlo. Las personas que instalan tu software merecen conocer la procedencia de aquello que están interponiendo entre ellas y su dispositivo.

Constrúyelo bien o no lo construyas. Las personas que lo necesitan no pueden permitirse pagar el precio de tu curva de aprendizaje.
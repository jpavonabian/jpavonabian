---
title: "Script para añadir alt a imágenes"
date: 2024-03-31T00:00:00+02:00
reply:
uri: "https://jesuspavonabian.es/post/script-anadir-alt-a-imagenes"
categories: ["anything else"]
tags: ["Informática"]
draft: false
---

Una de las cosas que echaba de menos en Firefox es el cambio que se hizo en el motor Chromium con respecto al tema de las imágenes sin alt.

Lo que se ha hecho es añadir un atributo alt avisando de que no hay descripción en las imágenes que no tienen dicho atributo. Y puede parecer una tontería, pero a ellos les viene bien para que le des click derecho y actives el autodescriptor de imágenes, bien sea el de Google o el de Edge, y a los que utilizamos lector de pantallas nos viene espectacular porque tengamos o no la descripción inteligente de imágenes activa sabemos que hay una imagen y puede ser importante (aunque en la mayoría de casos, al menos en mi experiencia sea decorativa).

Así que me he hecho un [script de Tampermonkey](https://jesuspavonabian.es/files/anyadirAltImagenes.js) que arregla el problema. No tiene acceso a un descriptor de imágenes (más que nada porque pese a que sería posible sería también carísimo pedirle a GPT o similares descripciones cada vez que se carga una imagen sin alt), pero para hacer auditorías de accesibilidad y para navegar por algunas páginas webs donde las imágenes deberían tener un alt especificando qué son y directamente no lo tienen me es bastante útil.

Lo dejo por aquí porque si sabes qué estás haciendo (o buscando) puede ahorrar varios dolores de cabeza.

Solo necesitais (una vez instalada la extensión) pulsar en el [enlace del script de Tampermonkey](https://jesuspavonabian.es/files/anyadirAltImagenes.js) instalarlo y dejar que haga su magia.

Cuando navegueis por la web y se encuentre una imagen sin atributo alt, el script le añadirá uno avisando de que la imagen no tiene alt.
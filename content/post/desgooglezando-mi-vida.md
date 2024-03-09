---
title: "Desgooglezando Mi Vida"
date: 2024-01-28T23:01:28+01:00
reply:
uri: "https://jesuspavonabian.es/post/desgooglezando-mi-vida"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

Que google sabe muchísimo sobre nosotros es un hecho, no estoy diciéndoos nada nuevo. Lee nuestros correos electrónicos, utiliza nuestros recivos de compras para registrarlas (a saber con qué objetivo, no quiero pensarlo mucho), sabe dónde estamos y cuánto tiempo hemos estado en algún sitio, si queremos comprarnos una lavadora nueva porque lo hemos buscado en su potentísimo buscador... Lo dicho, No os digo nada nuevo. Cuando el servicio es gratis, el producto es el usuario.

Y a la mayoría de la gente le da igual. Las cosas funcionan y no tienen que complicarse la vida. De hecho, cuando lo he comentado con familiares y amigos, la respuesta ha sido algo como "ya, ¿y qué? Estamos fichados por todos lados. ¿Qué van a sacar de ti porque sepan que quieras comerte una pizza?"

Quizás me esté volviendo paranoico, quizás me haya dado muy fuerte y tenga el coco comido de tanto leer gente en el Fediverso, pero desde que he empezado a des-googlear mi vida estoy más tranquilo.

- Los anuncios han desaparecido casi por completo como comenté en [otra entrada](https://jesuspavonabian.es/post/crear-una-vpn-con-wireguard-mas-pihole-para-olvidarnos-de-los-anuncios-y-acceder-a-nuestras-cosas-desde-cualquier-lugar/), y los que veo, ya no están tan personalizados, algún que otro servicio queda por ahí rastreando.
- Sé que mi correo es "mío" (cuidado con las comillas) y está cifrado.
- Mis resultados de búsqueda han variado muchísimo. Os parecerá mentira, pero he llegado a notar el sesgo, pude comprobarlo al buscar desde dispositivos distintos, variaban los resultados.
- No dependo de un solo proveedor. Al final, depender del servicio que sea únicamente no siempre es lo mejor.
- Uso Software Libre.

## Primero, el correo
Ha sido lo más fácil, aunque suene extraño. Una de las características más útiles de [ProtonMail](https://proton.me/es-419) para mi gusto es la opción de reenviar automáticamente los correos de la antigua cuenta de Gmail al nuevo correo. Avisar a la gente de que he cambiado de correo es un coñazo y lo estoy tomando con calma, pero gracias a esto puedo permitirme ese lujo.

Otra cosa que mola de ProtonMail es la gran cantidad de enlaces directos a las opciones para cambiar el correo de distintos sitios. ¿Quieres cambiar tu correo de GitHub, por decir algún servicio? Pulsas el enlace adecuado y plaf, directo a la opción.

Como dije más arriba, los correos están cifrados. Según [su web](https://proton.me/es-419/about), "Proton nació en Suiza en 2014, cuando un equipo de científicos que se conocieron en el CERN (la Organización Europea de Investigación Nuclear) decidió construir un mejor Internet con la privacidad como estandarte."

Tienen una cuenta de pagho que permite usar dominio propio, así que creo que acabaré migrando el correo que tengo con Apple, así unifico de paso ambos correos y no tengo todo esperriado por la red y me quito la dependencia de otra BigTech.

En un principio me planteé hacer SelfHost del correo, pero por muy tentador que es, hay cosas que prefiero que gestione gente que sabe más que yo, que me minimizan riesgos.

## SearxNG, el metabuscador
Está clarísimo. Si hablamos de buscar en internet, lo primero que se nos viene a la cabeza es Google. Es cierto que hay otros como Bing, pero la gran mayoría de mis conocidos es lo que usa.

Le estuve dando vueltas a la cuestión durante mucho tiempo. Podría usar [DuckDuckGo](https://duckduckgo.com/) o un navegador similar, pero por alguna razón, nunca dí el paso. Estaba también [Ecosia, el buscador que planta árboles](https://www.ecosia.org/?c=es), pero tampoco pude migrar a él.

Finalmente descubrí [SearxNG](https://searxng.org/) y tras hprobarlo durante un tiempo, acabó como buscador principal en Firefox.

[SearxNG](https://searxng.org/) no es un buscador per se. Es lo que se llama un Metabuscador. Lo que hace es utilizar varios buscadores para mostrarte los resultados, sin almacenar las búsquedas que realizas. Respeta la privacidad y hace imposible a cualquiera de dichos buscadores rastrear tus búsquedas.

Puedes usar una instancia pública o crear la tuya propia, como he hecho yo. No pide registros de ningún tipo. Cuando accedes, si modificas las preferencias, guarda una Cookie en tu navegador con ellas para actuar como tú quieras que actúe.

Es código libre, por lo que cualquiera puede echar una mano o plantear mejoras al proyecto, o si se tiene la inspiración suficiente, crear una bifurcación.

Es bastante flexible y poderoso. ¿Quieres evitar los muros de pago? Configúralo en las preferencias.

Si quieres, puedes probarlo [accediendo a la instancia que he montado](https://buscador.universoalterno.es/), que tras un par de meses de pruebas he decidido hacer pública.
## Todavía falta

Lo siguiente que voy a fusilar va a ser Dropbox, Google Drive e iCloud Drive, en ese orden. Haré otra entrada explicando qué voy a montarme.

La idea no es dejar de usar definitivamente estos servicios, sea Google o sea cual sea. La idea es usarlos lo menos posible, controlar qué datos tienen míos y usarlos para lo que yo quiero usarlos, como  yo quiero usarlos y cuando yo quiero usarlos. ¿Sería lo ideal prescindir de ellos por completo? Sí, pero actualmente es complicado.

La tecnología tiene que estar al servicio de las personas.
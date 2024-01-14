---
title: "Conocer los procesos que más memoria RAM ocupan en un VPS"
date: "2021-07-19"
reply:
uri: https://jesuspavonabian.es/post/conocer-los-procesos-que-mas-memoria-ram-ocupan-en-un-vps
categories: ["anything else"] # note, reply, anything else
tags: ["Procesos", "Linux", "VPS"]
draft: false
---

Iba yo a escribir una entrada para este blog cuando la RAM de mi VPS se disparó. Se conoce que tengo algo chupando memoria RAM a lo burro. De hecho, he tenido que aumentar memoria al menos temporalmente, hasta ver qué le pica al servidor. el caso es que tras conseguir acceso por ssh, cosa que costó lágrimas, sudor y sangre, di con parte de la solución a mi problema: Saber qué procesos consumen más memoria y cuánta está consumiendo cada uno. La magia la realiza el comando ps de la siguiente manera: ps aux --width 30 --sort -rss | head Con este sencillo comando podremos ver los 10 procesos que consumen más memoria RAM en nuestro VPS. Fácil y sencillo. Ahora me falta saber por qué se está comiendo casi toda la memoria un simple script .js.

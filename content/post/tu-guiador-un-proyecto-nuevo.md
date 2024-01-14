---
title: "Tu guiador: Un proyecto nuevo"
date: "2023-01-02"
reply:
uri: https://jesuspavonabian.es/post/tu-guiador-un-proyecto-nuevo
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

soy una persona que cuando tiene que ir a un sitio apunta los recorridos para no olvidarse. Concienzudamente, además. Cualquier mínimo detalle, por mínimo que sea, me sirve. Sobre todo lo hago si es un recorrido que haré pocas veces o que haré muchas veces, pero espaciadas en el tiempo.

En un principio utilizaba la aplicación de Notas de Apple, pero llegué a la conclusión de que necesitaba algo más. Los recorridos se me quedaban desordenados, tenía dificultades para leer las notas en medio de la calle... No era práctico

Así que decidí crear mi propia aplicación en seguida me topé con el primer problema: Necesitaba aprender Swift y SwiftUI. Un curso de 100 días lo solucionó.

en principio parecía fácil. Una base de datos para apuntar los recorridos, un par de botones... No pintaba demasiado complicado.

Y en efecto, no es demasiado complicado. el problema fue que yo me empeñé en complicarlo.

Cuando tuve algo que funcionaba, lo comenté con un par de colegas y me dijeron algo como... "La idea mola, pero le falta algo que no se qué es". Y ahí quedó la cosa hasta que hablé con [este señor (abre en una nueva ventana)](https://programaraciegas.net), que además de recordarme reglas básicas de programación que no había seguido, me dio un par de ideas para simplificar el código y añadirle alguna cosilla más.

Y aquello quedó ahí. Tenía que rehacerlo todo y me daba una pereza horrorosa, y eso que el primer beneficiado de la aplicación soy yo.

Finalmente me decidí. Borré todo lo que había hecho, aunque algo podría haber reutilizado y creé un nuevo repositorio privado.

Iba a empezar de cero, y lo iba a hacer bien. la primera regla era tener un código limpio. La segunda era comentar el código, de forma que cuando lo tuviera que mirar más adelante no tuviera que perder tiempo releyéndolo para saber qué hacía.

Y así empecé a programar. Y salió el chat de GPT.

Y cuando le pregunté por curiosidad una cosa sobre mi código, me encontró errores en los que yo no había caído.

Así que tocó reescribir la aplicación otra vez. Mismo proceso, borrar y volver a programar. Podría haberlo intentado arreglar, pero el código estaba volviéndose demasiado engorroso.

Dicen que a la tercera va la vencida y tienen razón.

ahora todo está en su sitio, y modificar una cosa no me rompe otras dos.

Cada función hace lo que tiene que hacer, y no depende de otra. Los nombres de variables son claros y la interfaz se limita a mostrar cosas por pantalla, dejando la lógica de la aplicación al controlador.

Por ejemplo, una de las funciones de la aplicación es, una vez guardado un recorrido, poderlo compartir con alguien. Para ello, se envía un json a la persona, y la persona ya lo importa en su aplicación.

Pues todo está separado. El botón por su lado, el crear el json por otro y el acceso al recorrido por otro.

func obtenerJSONRecorrido(recorrido: Recorrido) -> String { let encoder = JSONEncoder() if let data = try? encoder.encode(recorrido), let jsonString = String(data: data, encoding: .utf8) { return jsonString } else { return "" } }

A la aplicación todavía le falta para poderse lanzar, aunque he de decir que la he probado y cumple con lo que yo necesito.

- Puedes añadir recorridos.
- Puedes editarlos desde una sola pantalla.
- Puedes mostrar los detalles del recorrido e ir avanzando paso por paso con dos botones, siguiente y anterior.
- Puedes compartirlos con alguien usando tu app favorita.

Me falta por revisar la parte visual, que sospecho que la aplicación es bastante mejorable en ese aspecto. Por otro lado, me gustaría cambiar algunas cosillas del código, que pese a que me he esforzado, no le vendría mal que le refactorizara algunas cosillas. ¡Pronto daré más información! Por cierto, como curiosidad, del diseño para probar la app, se ha encargado el chat de gpt. He tenido que adaptar todo lo que me ha enviado como respuesta, pero facilita muchísimo la vida cuando sabes qué estás haciendo.

// ==UserScript==
// @name         Añadir alt a imágenes sin alt
// @namespace    https://jesuspavonabian.es
// @version      0.1
// @description  Busca todas las etiquetas img que no tienen un atributo alt y les añade uno con el valor "Imagen sin descripción".
// @author       Jesús Pavón Abián
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Función que busca y modifica las imágenes
    function añadirAltAImagenes() {
        // Busca todas las imágenes en el documento
        const imagenes = document.querySelectorAll('img:not([alt])');

        // Itera sobre cada imagen encontrada
        imagenes.forEach((imagen) => {
            // Añade el atributo alt con el valor deseado
            imagen.setAttribute('alt', 'Imagen sin alt');
        });
    }

    // Ejecuta la función cuando la página carga
    añadirAltAImagenes();
})();

---
title: "Migrar contactos a Mailbox"
date: 2026-10-09
reply:
uri: "https://jesuspavonabian.es/post/migrarcontactosmailbox"
categories: ["anything else"] # note, reply, anything else
tags:
draft: false
---

Hoy toca migrar los contactos a Mailbox.org.

Como siempre he tenido lo que yo llamo "mi orden caótico", un orden desordenado que solo yo entiendo, los contactos no podían ser menos y estaban esperriados. algunos en Google, otros en Apple... Y curiosamente, y eso que le he dado al botón de fusionar duplicados del iPhone, algunos todavía estaban duplicados.

Así que he decidido dos cosas. Sacarlos de las BigTech y ordenarlos.

## Paso 1: exportar

- **Gmail:** en contacts.google.com, el botón Exportar permite elegir "Contactos" y el formato vCard. Ojo con no exportar "Otros contactos": ahí Google guarda solo cualquier dirección a la que hayas escrito alguna vez, y normalmente es basura. La web de Google Contacts se maneja bien con NVDA.
- **iCloud:** desde iOS 16, en la app Contactos puedes ir a Listas, abrir las acciones de "Todos los contactos de iCloud" y elegir Exportar. Te genera un `.vcf` que guardas en Archivos. También se puede hacer desde icloud.com, pero Apple no sabe hacer webs accesibles, algún día aprenderán, todavía les tengo un poquito de fe.

## Paso 2: fusionar con un script

En vez de fiarme del buscador de duplicados de Apple, preparé un pequeño script en Python que cruza los contactos por teléfono y por correo, no solo por nombre:

- Si dos contactos comparten un teléfono o un correo, los fusiona en una sola tarjeta, con todos los teléfonos, correos, direcciones y notas, y sin repetir nada.
- Los teléfonos se comparan normalizados.
- Si dos contactos solo coinciden en el nombre, no los toca. Los apunta en un informe como dudosos para que decidas tú, porque dos "María López" pueden ser dos personas distintas.
- Genera un informe en texto plano (txt).

Solo requiere Pyhthon y funciona sin internet. Fusiona todos los archivos que le pases como argumento.

```
python fusionar_vcf.py google.vcf icloud.vcf -o contactos.vcf
```

El resultado en mi caso: 324 contactos de entrada y 214 de salida, con 110 fusiones y ningún dudoso.

Un consejo antes de importar: revisa el informe buscando grupos de tres o más tarjetas fusionadas, o con nombres que no tengan nada que ver. Un teléfono fijo compartido o un correo de familia pueden juntar a personas distintas. En mi caso estaba todo bien.

<details>
<summary>Ver el script completo</summary>

```python
#!/usr/bin/env python3
"""
Fusiona varios ficheros vCard (.vcf) en uno solo, quitando duplicados.

Criterios:
  - Fusiona automáticamente los contactos que comparten un teléfono o un correo.
  - Los que solo coinciden en el nombre NO se fusionan por defecto: salen en el
    informe como dudosos. Con --fusionar-nombres también se fusionan.

Al fusionar se juntan todos los teléfonos, correos, direcciones, notas, etc.,
sin repetir teléfonos (comparados por número normalizado) ni correos.

Uso:
  python fusionar_vcf.py gmail.vcf icloud.vcf -o contactos.vcf
  python fusionar_vcf.py gmail.vcf icloud.vcf -o contactos.vcf --fusionar-nombres

Genera también un informe de texto (contactos_informe.txt) junto al fichero de
salida. Solo usa Python 3.8+. No se conecta a nada.
"""

import argparse
import sys
import unicodedata
import uuid
from collections import defaultdict
from pathlib import Path

# Propiedades que se regeneran o no se copian al fusionar
OMITIR = {"BEGIN", "END", "VERSION", "PRODID", "REV", "UID", "FN", "N"}


# ---------- Lectura y análisis ----------

def leer_texto(ruta):
    datos = Path(ruta).read_bytes()
    for codificacion in ("utf-8-sig", "cp1252"):
        try:
            return datos.decode(codificacion)
        except UnicodeDecodeError:
            continue
    sys.exit(f"No se pudo leer {ruta}: codificación desconocida")


def desplegar(texto):
    """Une las líneas plegadas (las que empiezan por espacio o tabulador)."""
    lineas = []
    for linea in texto.splitlines():
        if linea[:1] in (" ", "\t") and lineas:
            lineas[-1] += linea[1:]
        elif linea.strip():
            lineas.append(linea)
    return lineas


def partir(linea):
    """Separa 'cabecera:valor' respetando los dos puntos dentro de comillas."""
    en_comillas = False
    for i, c in enumerate(linea):
        if c == '"':
            en_comillas = not en_comillas
        elif c == ":" and not en_comillas:
            return linea[:i], linea[i + 1:]
    return linea, ""


class Propiedad:
    def __init__(self, linea):
        cabecera, self.valor = partir(linea)
        nombre_completo, _, self.parametros = cabecera.partition(";")
        if "." in nombre_completo:
            self.grupo, _, nombre = nombre_completo.partition(".")
        else:
            self.grupo, nombre = None, nombre_completo
        self.nombre = nombre.upper()

    def linea(self, grupo=None):
        cabecera = f"{grupo}.{self.nombre}" if grupo else self.nombre
        if self.parametros:
            cabecera += ";" + self.parametros
        return f"{cabecera}:{self.valor}"


class Tarjeta:
    def __init__(self, propiedades, origen):
        self.props = propiedades
        self.origen = origen

    def primera(self, nombre):
        for p in self.props:
            if p.nombre == nombre:
                return p
        return None

    def nombre_visible(self):
        fn = self.primera("FN")
        if fn and fn.valor.strip():
            return desescapar(fn.valor).strip()
        n = self.primera("N")
        if n:
            partes = [desescapar(x).strip() for x in n.valor.split(";")]
            # N = apellidos;nombre;segundos nombres;prefijo;sufijo
            orden = [partes[i] for i in (3, 1, 2, 0, 4) if i < len(partes)]
            texto = " ".join(x for x in orden if x)
            if texto:
                return texto
        return ""

    def telefonos(self):
        return {t for p in self.props if p.nombre == "TEL"
                for t in [normalizar_telefono(p.valor)] if t}

    def correos(self):
        return {normalizar_correo(p.valor) for p in self.props
                if p.nombre == "EMAIL" and p.valor.strip()}


def leer_tarjetas(ruta):
    tarjetas, actual = [], None
    for linea in desplegar(leer_texto(ruta)):
        mayus = linea.strip().upper()
        if mayus == "BEGIN:VCARD":
            actual = []
        elif mayus == "END:VCARD":
            if actual is not None:
                tarjetas.append(Tarjeta(actual, Path(ruta).name))
            actual = None
        elif actual is not None:
            actual.append(Propiedad(linea))
    return tarjetas


# ---------- Normalización ----------

def desescapar(valor):
    return (valor.replace("\\n", "\n").replace("\\N", "\n")
            .replace("\\,", ",").replace("\\;", ";").replace("\\\\", "\\"))


def normalizar_telefono(valor):
    valor = valor.strip()
    if valor.lower().startswith("tel:"):
        valor = valor[4:]
    digitos = "".join(c for c in valor if c.isdigit())
    if digitos.startswith("00"):
        digitos = digitos[2:]
    if digitos.startswith("34") and len(digitos) == 11:
        digitos = digitos[2:]
    # Los 9 últimos dígitos bastan para cruzar números españoles con o sin prefijo
    return digitos[-9:] if len(digitos) >= 9 else (digitos or None)


def normalizar_correo(valor):
    valor = valor.strip()
    if valor.lower().startswith("mailto:"):
        valor = valor[7:]
    return valor.lower()


def normalizar_nombre(texto):
    sin_tildes = "".join(c for c in unicodedata.normalize("NFKD", texto)
                         if not unicodedata.combining(c))
    return " ".join(sin_tildes.casefold().split())


# ---------- Agrupación (union-find) ----------

class Conjuntos:
    def __init__(self, n):
        self.padre = list(range(n))

    def raiz(self, x):
        while self.padre[x] != x:
            self.padre[x] = self.padre[self.padre[x]]
            x = self.padre[x]
        return x

    def unir(self, a, b):
        ra, rb = self.raiz(a), self.raiz(b)
        if ra != rb:
            self.padre[rb] = ra


def agrupar(tarjetas, fusionar_nombres):
    conj = Conjuntos(len(tarjetas))
    vistos = {}
    for i, t in enumerate(tarjetas):
        claves = [("tel", x) for x in t.telefonos()] + \
                 [("correo", x) for x in t.correos()]
        for clave in claves:
            if clave in vistos:
                conj.unir(vistos[clave], i)
            else:
                vistos[clave] = i

    # Coincidencias solo por nombre entre grupos distintos
    por_nombre = defaultdict(set)
    for i, t in enumerate(tarjetas):
        nombre = normalizar_nombre(t.nombre_visible())
        if nombre:
            por_nombre[nombre].add(conj.raiz(i))
    dudosos = []
    for nombre, raices in por_nombre.items():
        if len(raices) > 1:
            dudosos.append(sorted(raices))
            if fusionar_nombres:
                raices = list(raices)
                for r in raices[1:]:
                    conj.unir(raices[0], r)

    grupos = defaultdict(list)
    for i in range(len(tarjetas)):
        grupos[conj.raiz(i)].append(i)
    return list(grupos.values()), dudosos


# ---------- Fusión ----------

def clave_dedup(p):
    if p.nombre == "TEL":
        return ("TEL", normalizar_telefono(p.valor))
    if p.nombre == "EMAIL":
        return ("EMAIL", normalizar_correo(p.valor))
    return (p.nombre, p.valor.strip())


def fusionar(grupo_tarjetas):
    # La tarjeta más completa manda en nombre y orden
    ordenadas = sorted(grupo_tarjetas, key=lambda t: len(t.props), reverse=True)
    principal = max(ordenadas, key=lambda t: len(t.nombre_visible()))

    lineas = ["BEGIN:VCARD", "VERSION:3.0", "PRODID:-//fusionar_vcf//ES",
              f"UID:{uuid.uuid4()}"]

    fn = principal.primera("FN")
    nombre = principal.nombre_visible()
    if not nombre:
        correos = sorted(set().union(*(t.correos() for t in ordenadas)))
        telefonos = sorted(set().union(*(t.telefonos() for t in ordenadas)))
        nombre = (correos or telefonos or ["Sin nombre"])[0]
    lineas.append(fn.linea() if fn and fn.valor.strip() else f"FN:{nombre}")

    n = principal.primera("N") or next(
        (t.primera("N") for t in ordenadas if t.primera("N")), None)
    lineas.append(n.linea() if n else f"N:;{nombre};;;")

    vistas = set()
    foto_puesta = False
    contador_grupos = 0

    for t in ordenadas:
        # 1.ª pasada: qué propiedades principales sobreviven y, con ellas, sus grupos
        conservar = []
        grupos_vivos = set()
        for p in t.props:
            if p.nombre in OMITIR or p.nombre.startswith("X-AB"):
                continue
            if p.nombre == "PHOTO":
                if foto_puesta:
                    continue
                foto_puesta = True
            else:
                clave = clave_dedup(p)
                if clave in vistas:
                    continue
                vistas.add(clave)
            conservar.append(p)
            if p.grupo:
                grupos_vivos.add(p.grupo)

        # Renombrar grupos (item1, item2...) para que no choquen entre tarjetas
        renombre = {}
        for g in sorted(grupos_vivos):
            contador_grupos += 1
            renombre[g] = f"item{contador_grupos}"

        for p in t.props:
            if p in conservar:
                lineas.append(p.linea(renombre.get(p.grupo)))
            elif p.nombre.startswith("X-AB") and p.grupo in renombre:
                # Etiquetas personalizadas (X-ABLabel) de grupos que siguen vivos
                lineas.append(p.linea(renombre[p.grupo]))
            elif (p.nombre.startswith("X-AB") and not p.grupo
                  and clave_dedup(p) not in vistas):
                vistas.add(clave_dedup(p))
                lineas.append(p.linea())

    lineas.append("END:VCARD")
    return lineas, nombre


def plegar(linea, limite=75):
    """Pliega a 75 octetos sin partir caracteres UTF-8."""
    if len(linea.encode("utf-8")) <= limite:
        return linea
    trozos, actual, tam = [], "", 0
    for c in linea:
        bytes_c = len(c.encode("utf-8"))
        if tam + bytes_c > limite:
            trozos.append(actual)
            actual, tam = c, 1 + bytes_c  # la continuación empieza con un espacio
        else:
            actual += c
            tam += bytes_c
    trozos.append(actual)
    return "\r\n ".join(trozos)


# ---------- Programa principal ----------

def main():
    ap = argparse.ArgumentParser(description="Fusiona ficheros vCard sin duplicados.")
    ap.add_argument("entradas", nargs="+", help="Ficheros .vcf de entrada")
    ap.add_argument("-o", "--salida", default="contactos_fusionados.vcf",
                    help="Fichero .vcf de salida")
    ap.add_argument("--fusionar-nombres", action="store_true",
                    help="Fusionar también los que solo coinciden en el nombre")
    args = ap.parse_args()

    tarjetas, recuento = [], []
    for ruta in args.entradas:
        leidas = leer_tarjetas(ruta)
        recuento.append(f"{Path(ruta).name}: {len(leidas)}")
        tarjetas.extend(leidas)

    grupos, dudosos = agrupar(tarjetas, args.fusionar_nombres)

    salida, informe_fusion, sin_nombre = [], [], []
    for indices in sorted(grupos, key=lambda g: tarjetas[g[0]].nombre_visible().casefold()):
        grupo = [tarjetas[i] for i in indices]
        lineas, nombre = fusionar(grupo)
        salida.extend(plegar(l) for l in lineas)
        if not grupo[0].nombre_visible() and all(not t.nombre_visible() for t in grupo):
            sin_nombre.append(nombre)
        if len(grupo) > 1:
            nombres = [t.nombre_visible() or "(sin nombre)" for t in grupo]
            origenes = sorted({t.origen for t in grupo})
            informe_fusion.append(f"- {nombre}: {len(grupo)} tarjetas "
                                  f"({' | '.join(nombres)}) de {', '.join(origenes)}")

    ruta_salida = Path(args.salida)
    ruta_salida.write_text("\r\n".join(salida) + "\r\n", encoding="utf-8")

    informe = ["INFORME DE FUSIÓN DE CONTACTOS", ""]
    informe.append("Contactos leídos: " + "; ".join(recuento))
    informe.append(f"Contactos resultantes: {len(grupos)}")
    informe.append("")
    informe.append(f"Fusionados ({len(informe_fusion)} contactos):")
    informe.extend(informe_fusion or ["- Ninguno"])
    informe.append("")
    estado = "FUSIONADOS" if args.fusionar_nombres else "NO fusionados, revísalos"
    informe.append(f"Coincidencias solo por nombre, {estado} ({len(dudosos)}):")
    for raices in dudosos:
        nombres = []
        for r in raices:
            t = tarjetas[r]
            datos = sorted(t.telefonos()) + sorted(t.correos())
            nombres.append(f"{t.nombre_visible()} [{', '.join(datos) or 'sin datos'}]")
        informe.append("- " + " / ".join(nombres))
    if not dudosos:
        informe.append("- Ninguna")
    informe.append("")
    informe.append(f"Contactos sin nombre ({len(sin_nombre)}):")
    informe.extend(f"- {x}" for x in sin_nombre) if sin_nombre else informe.append("- Ninguno")

    ruta_informe = ruta_salida.with_name(ruta_salida.stem + "_informe.txt")
    ruta_informe.write_text("\n".join(informe) + "\n", encoding="utf-8")

    print(f"Leídos {len(tarjetas)} contactos, resultan {len(grupos)}.")
    print(f"Fusionados: {len(informe_fusion)}. Dudosos por nombre: {len(dudosos)}.")
    print(f"Salida: {ruta_salida}")
    print(f"Informe: {ruta_informe}")


if __name__ == "__main__":
    main()
```

</details>

## Paso 3: importar en Mailbox.org

En la web de Mailbox.org, en Contactos, tras crear una libreta puedes importarlos. No es difícil, solo es cuestión de subir el ficherito.

## Paso 4: conectar el iPhone por CardDAV

Primero desactiva los contactos de iCloud y de Gmail en el iPhone, eligiendo eliminarlos del móvil para no tener duplicados, si no vas a liar la de Dios es Cristo.

Luego ve a Ajustes, Contactos, Cuentas, Añadir cuenta, Otra, "Añadir cuenta CardDAV":

- Servidor: `dav.mailbox.org`
- Usuario: tu dirección de correo
- Contraseña: la de Mailbox.org, o una contraseña de aplicación si tienes activada la verificación en dos pasos

## Paso 5: limpiar

Dentro de unos días, cuando esté seguro de que todo funciona, borraré los contactos de Google, incluida la papelera, y los de icloud.com. Mientras tanto guardo el `.vcf` como copia de seguridad.

Y ya estaría.
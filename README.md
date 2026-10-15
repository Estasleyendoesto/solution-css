# Solution CSS

> Framework CSS ultraligero, modular y de alto rendimiento basado en variables semánticas, rejilla reactiva por cascada y diseño adaptativo sin dependencias de runtime.

[![Tamaño Minificado](https://img.shields.io/badge/size-9.5_KB-blue.svg)](solution.min.css)
[![Entorno Bun](https://img.shields.io/badge/runtime-Bun_1.4+-black.svg)](https://bun.sh)
[![Compilador](https://img.shields.io/badge/compiler-LightningCSS-orange.svg)](https://lightningcss.dev)
[![Licencia](https://img.shields.io/badge/license-MIT-green.svg)](#)

---

## 🚀 Características Principales

* **Rejilla Reactiva Declarativa (`.is-grid-r`)**: Configura columnas y expansiones por breakpoint directamente mediante Custom Properties CSS (`--cols-xs`, `--cols-md`, `--span-lg`), sin generar cientos de clases utilitarias.
* **Modo Oscuro / Claro 100% Compatible**: Integración nativa con `prefers-color-scheme` y control manual instantáneo con `[data-theme="dark"]` / `[data-theme="light"]`, sin parpadeos ni funciones experimentales.
* **Contenedor Fluido Moderno (`.is-container`)**: Centrado automático inteligente con cálculo `width: min(...)` de última generación.
* **Estilizado Nativo Accesible**: Soporte listo para usar en componentes HTML5 modernos: `<dialog>`, `<details>`, `<progress>`, `<figure>`, estados `:focus-visible` y validación `user-invalid`.
* **Herramientas de Depuración Visual (`.is-dev`)**: Inspección visual no intrusiva con `box-shadow` que no altera el cálculo de la caja ni el flujo del DOM.
* **Entorno Ultrarrápido con Bun**: Servidor de desarrollo con **Hot Swap de CSS en caliente** y compilación en **< 2 milisegundos** con LightningCSS.

---

## 📁 Estructura del Repositorio

```text
solucion-css/
├── solution.css       # Código fuente modular con variables y utilidades
├── solution.min.css   # Versión minificada para producción (~9.5 KB)
├── index.html         # Documentación interactiva y catálogo de componentes
├── test.html          # Laboratorio de pruebas de estrés para Grid y Flex
├── dev.js             # Servidor de desarrollo Bun con Hot Reload en vivo
├── build.js           # Script de compilación ultrarrápido con LightningCSS
├── package.json       # Configuración y scripts de ejecución
└── .gitignore         # Exclusiones de Git
```

---

## 🛠️ Instalación y Flujo de Trabajo

### Requisitos previos
* [Bun](https://bun.sh) (v1.0 o superior).

### 1. Instalar dependencias de desarrollo
```bash
bun install
```

### 2. Iniciar servidor de desarrollo (con Live Reload)
```bash
bun run dev
```
Iniciará el servidor local en `http://localhost:3000`:
* 📖 **Documentación**: [http://localhost:3000/index.html](http://localhost:3000/index.html)
* 🧪 **Laboratorio de Grids & Flex**: [http://localhost:3000/test.html](http://localhost:3000/test.html)

*Al editar `solution.css`, el archivo se recompila en ~2 ms y se actualiza en el navegador al instante sin recargar la página.*

### 3. Compilar para producción
```bash
bun run build
```
Genera `solution.min.css` optimizado y validado mediante LightningCSS.

---

## 📖 Guía Rápida de Uso

### 1. Rejilla Reactiva (`.is-grid-r`)

Define el comportamiento de las columnas directamente en línea o mediante reglas CSS:

```html
<!-- Grid que escala: 1 col (móvil) -> 2 cols (tablet) -> 4 cols (desktop) -->
<div class="is-grid-r" style="--cols-xs: 1; --cols-md: 2; --cols-lg: 4;">
  <div>Elemento 1</div>
  <div>Elemento 2</div>
  <div>Elemento 3</div>
  <div>Elemento 4</div>
</div>

<!-- Columna destacada con span responsivo -->
<div class="is-grid-r" style="--cols-xs: 1; --cols-md: 3;">
  <div style="--span-md: span 2;">Contenido Principal (2 cols en desktop)</div>
  <div>Barra lateral (1 col)</div>
</div>
```

#### Breakpoints Soportados
| Breakpoint | Ancho Mínimo | Variable de Columnas | Variable de Span |
| :--- | :--- | :--- | :--- |
| **XS** | `0px` | `--cols-xs` | `--span-xs` |
| **SM** | `576px` | `--cols-sm` | `--span-sm` |
| **MD** | `768px` | `--cols-md` | `--span-md` |
| **LG** | `1024px` | `--cols-lg` | `--span-lg` |
| **XL** | `1200px` | `--cols-xl` | `--span-xl` |
| **XXL** | `1400px` | `--cols-xxl` | `--span-xxl` |

---

### 2. Conmutador de Modo Oscuro / Claro

El framework aplica modo oscuro automáticamente si el sistema operativo lo prefiere. Si deseas alternarlo manualmente mediante un botón:

```javascript
function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = currentTheme === 'dark' || (!currentTheme && systemPrefersDark);

  const nextTheme = isDark ? 'light' : 'dark';
  root.setAttribute('data-theme', nextTheme);
}
```

---

### 3. Clases y Utilidades Frecuentes

* **Estructura**: `.is-container`, `.is-container-f`.
* **Flexbox**: `.is-flex`, `.is-center`, `.is-horizontal-list`, `.is-vertical-list`.
* **Botones**: `.is-btn`, `.is-btn.is-outline`, `.is-primary`, `.is-rounded`.
* **Tablas**: `.is-table-scroll`, `table.row-hoverable`, `table.first-column-bold`.
* **Depuración**: `.is-dev` (caja actual), `.is-dev-c` (caja e hijos).
* **Tipografía**: `.text-light`, `.text-bold`, `.text-center`, `.text-right`, `.text-justify`.

---

## 📄 Licencia

Código abierto bajo licencia MIT.

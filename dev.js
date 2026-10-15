import fs from 'node:fs';
import path from 'node:path';
import { buildCSS } from './build.js';

const PORT = 3000;
const clients = new Set();

// Notificar a los navegadores conectados
function notifyClients(event) {
  for (const client of clients) {
    try {
      client.write(`data: ${event}\n\n`);
    } catch {
      clients.delete(client);
    }
  }
}

// Compilación inicial
buildCSS();

// Inyección de script para Live Reload / Hot CSS Swap
const liveReloadScript = `
<script>
(() => {
  const es = new EventSource('/__live_reload');
  es.onmessage = (e) => {
    if (e.data === 'css-reload') {
      const link = document.querySelector('link[rel="stylesheet"][href*="solution.min.css"]');
      if (link) {
        const url = new URL(link.href, location.href);
        url.searchParams.set('_t', Date.now());
        link.href = url.toString();
        console.log('⚡ [LiveReload] CSS actualizado en caliente');
        return;
      }
    }
    location.reload();
  };
})();
</script>
`;

// Servidor HTTP con Bun
const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    // Endpoint de eventos SSE para live reload
    if (pathname === '/__live_reload') {
      let clientRef;
      const stream = new ReadableStream({
        start(controller) {
          clientRef = {
            write: (msg) => controller.enqueue(new TextEncoder().encode(msg)),
          };
          clients.add(clientRef);
        },
        cancel() {
          clients.delete(clientRef);
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    if (pathname === '/') pathname = '/index.html';
    const filePath = path.join(import.meta.dir, pathname.replace(/^\//, ''));

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      let file = Bun.file(filePath);

      // Si es HTML, inyectar el script de auto-reload
      if (pathname.endsWith('.html')) {
        return file.text().then((content) => {
          const injected = content.replace('</body>', `${liveReloadScript}</body>`);
          return new Response(injected, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache',
            },
          });
        });
      }

      // Si es CSS, asegurar headers para que no se cachee agresivamente
      if (pathname.endsWith('.css')) {
        return new Response(file, {
          headers: {
            'Content-Type': 'text/css; charset=utf-8',
            'Cache-Control': 'no-cache',
          },
        });
      }

      return new Response(file);
    }

    return new Response('404 Not Found', { status: 404 });
  },
});

console.log(`\n🚀 Servidor de desarrollo con Bun activo:`);
console.log(`   > Local:         http://localhost:${PORT}/`);
console.log(`   > Documentación: http://localhost:${PORT}/index.html`);
console.log(`   > Laboratorio:   http://localhost:${PORT}/test.html`);
console.log(`\n👀 Vigilando cambios en solution.css, index.html y test.html...\n`);

// Watcher con debounce
let timeoutCSS = null;
let timeoutHTML = null;

fs.watch('.', (eventType, filename) => {
  if (!filename) return;

  if (filename === 'solution.css') {
    clearTimeout(timeoutCSS);
    timeoutCSS = setTimeout(() => {
      try {
        buildCSS();
        notifyClients('css-reload');
      } catch (err) {
        console.error('❌ Error compilando CSS:', err.message);
      }
    }, 40);
  } else if (filename.endsWith('.html')) {
    clearTimeout(timeoutHTML);
    timeoutHTML = setTimeout(() => {
      console.log(`🔄 [HTML] Modificado ${filename}, recargando página...`);
      notifyClients('reload');
    }, 50);
  }
});

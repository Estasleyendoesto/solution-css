import fs from 'node:fs';
import path from 'node:path';
import { buildCSS } from './build.js';

const PORT = 3000;
const DOCS_DIR = path.resolve('docs');
const clients = new Set();

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
        console.log('[LiveReload] CSS updated in-place');
        return;
      }
    }
    location.reload();
  };
})();
</script>
`;

Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

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

    // Priorizar archivos en docs/, luego raíz
    let targetFile = path.join(DOCS_DIR, pathname.replace(/^\//, ''));
    if (!fs.existsSync(targetFile) || !fs.statSync(targetFile).isFile()) {
      targetFile = path.join(import.meta.dir, pathname.replace(/^\//, ''));
    }

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
      const file = Bun.file(targetFile);

      if (targetFile.endsWith('.html')) {
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

      if (targetFile.endsWith('.css')) {
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

console.log(`\nLocal dev server running:`);
console.log(`  > Documentation: http://localhost:${PORT}/`);
console.log(`  > Grid lab:      http://localhost:${PORT}/test.html`);
console.log(`\nWatching solution.css and docs/ for changes...\n`);

let timeoutCSS = null;
let timeoutDocs = null;

// Watcher para solution.css en raíz
fs.watch('solution.css', () => {
  clearTimeout(timeoutCSS);
  timeoutCSS = setTimeout(() => {
    try {
      buildCSS();
      notifyClients('css-reload');
    } catch (err) {
      console.error('Error rebuilding CSS:', err.message);
    }
  }, 40);
});

// Watcher para la carpeta docs/
fs.watch('docs', (eventType, filename) => {
  if (!filename) return;
  if (filename.endsWith('.css')) return; // Ya lo maneja el watcher de solution.css
  clearTimeout(timeoutDocs);
  timeoutDocs = setTimeout(() => {
    console.log(`[docs] ${filename} changed, reloading browser...`);
    notifyClients('reload');
  }, 50);
});

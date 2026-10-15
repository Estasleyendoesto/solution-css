import * as lightningcss from 'lightningcss';
import fs from 'node:fs';
import path from 'node:path';

export function buildCSS() {
  const start = performance.now();
  const raw = fs.readFileSync('solution.css');

  const result = lightningcss.transform({
    filename: 'solution.css',
    code: raw,
    minify: true,
  });

  // Salida en la raíz
  fs.writeFileSync('solution.min.css', result.code);

  // Salida para GitHub Pages en docs/
  const docsDir = path.resolve('docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(docsDir, 'solution.min.css'), result.code);

  const elapsed = (performance.now() - start).toFixed(2);
  const sizeKb = (result.code.length / 1024).toFixed(2);

  console.log(`[LightningCSS] Built solution.min.css (${sizeKb} KB) in ${elapsed} ms -> root and docs/`);
}

if (import.meta.main) {
  buildCSS();
}

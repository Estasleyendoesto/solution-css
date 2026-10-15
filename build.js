import * as lightningcss from 'lightningcss';
import fs from 'node:fs';

export function buildCSS() {
  const start = performance.now();
  const raw = fs.readFileSync('solution.css');
  
  const result = lightningcss.transform({
    filename: 'solution.css',
    code: raw,
    minify: true,
  });

  fs.writeFileSync('solution.min.css', result.code);
  const elapsed = (performance.now() - start).toFixed(2);
  const sizeKb = (result.code.length / 1024).toFixed(2);

  console.log(`⚡ [LightningCSS] Compilado solution.min.css (${sizeKb} KB) en ${elapsed} ms`);
}

// Ejecutar directamente si se llama como script
if (import.meta.main) {
  buildCSS();
}

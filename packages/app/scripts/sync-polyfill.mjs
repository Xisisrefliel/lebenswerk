// Copies vendor scripts from node_modules into public/vendor/ so Vite
// serves them as static assets. Runs before `dev` and `build`.

import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, '..');
const destDir = resolve(pkgRoot, 'public/vendor');
mkdirSync(destDir, { recursive: true });

const files = [
  {
    src: resolve(pkgRoot, 'node_modules/pagedjs/dist/paged.polyfill.js'),
    dest: resolve(destDir, 'paged.polyfill.js'),
  },
];

for (const { src, dest } of files) {
  copyFileSync(src, dest);
  console.log(`[sync-vendor] ${src} -> ${dest}`);
}

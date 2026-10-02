const { spawnSync } = require('node:child_process');
const path = require('node:path');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const proyectos = ['frontend-angular', 'frontend-nuxt'];

for (const proyecto of proyectos) {
  console.log(`\nInstalando dependencias de ${proyecto}...`);
  const resultado = spawnSync(npm, ['install'], {
    cwd: path.join(__dirname, proyecto),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (resultado.error) throw resultado.error;
  if (resultado.status !== 0) process.exit(resultado.status || 1);
}

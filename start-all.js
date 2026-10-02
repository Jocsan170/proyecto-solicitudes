const { spawn } = require('node:child_process');
const path = require('node:path');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const servicios = [
  { nombre: 'API', directorio: 'backend', comando: ['start'] },
  { nombre: 'Angular', directorio: 'frontend-angular', comando: ['start'] },
  { nombre: 'Nuxt', directorio: 'frontend-nuxt', comando: ['run', 'dev', '--', '--port', '3001'] },
];

const procesos = servicios.map((servicio) => {
  const proceso = spawn(npm, servicio.comando, {
    cwd: path.join(__dirname, servicio.directorio),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  proceso.on('error', (error) => {
    console.error(`[${servicio.nombre}] No se pudo iniciar: ${error.message}`);
    detener(1);
  });

  proceso.on('exit', (codigo, senal) => {
    if (!apagando) {
      console.log(`[${servicio.nombre}] terminó${senal ? ` (${senal})` : ` con código ${codigo}`}.`);
      detener(codigo || 0);
    }
  });

  return proceso;
});

let apagando = false;

function detener(codigo = 0) {
  if (apagando) return;
  apagando = true;
  for (const proceso of procesos) {
    if (proceso.exitCode === null && !proceso.killed) proceso.kill();
  }
  process.exitCode = codigo;
}

process.on('SIGINT', () => detener(0));
process.on('SIGTERM', () => detener(0));

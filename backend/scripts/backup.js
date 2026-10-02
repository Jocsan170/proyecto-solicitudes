const fs = require('fs');
const path = require('path');

const archivoDatos = path.join(__dirname, '..', 'data', 'solicitudes.json');
const directorioRespaldos = path.join(__dirname, '..', 'data', 'respaldos');

if (!fs.existsSync(archivoDatos)) {
  console.error('No se encontró data/solicitudes.json; inicia el servidor y registra una solicitud primero.');
  process.exit(1);
}

fs.mkdirSync(directorioRespaldos, { recursive: true });
const sello = new Date().toISOString().replace(/[:.]/g, '-');
const destino = path.join(directorioRespaldos, `solicitudes-${sello}.json`);
fs.copyFileSync(archivoDatos, destino);
console.log(`Respaldo creado: ${destino}`);

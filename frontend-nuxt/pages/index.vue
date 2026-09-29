<template>
  <div class="sitio">
    <!-- Barra de navegación -->
    <header class="nav">
      <div class="nav-interno">
        <a href="/" class="nav-marca">
          <img class="nav-logo" src="/senprende.jpg" alt="Escudo institucional SENPRENDE" />
          <span>SENPRENDE</span>
        </a>
        <nav class="nav-enlaces">
          <a href="https://senprende.hn/quienes-somos" target="_blank" rel="noopener">Institución</a>
          <a href="https://senprende.hn/ferias" target="_blank" rel="noopener">Ferias</a>
          <a href="https://senprende.hn/noticias" target="_blank" rel="noopener">Noticias</a>
          <a href="https://senprende.hn/documentos-institucionales" target="_blank" rel="noopener">Recursos</a>
        </nav>
        <a class="boton-nav" :href="urlRegistro">Registro de solicitudes</a>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-contenido">
        <p class="hero-eyebrow">Nuestros servicios</p>
        <h1 class="hero-titulo">Te acompañamos en cada paso de tu emprendimiento</h1>
        <p class="hero-texto">
          Desde la idea hasta el mercado, SENPRENDE te brinda las
          herramientas y el acompañamiento para hacer crecer tu negocio.
        </p>

        <a class="boton-principal" :href="urlRegistro">Registro de solicitudes</a>
        <p class="enlace-secundario">
          <NuxtLink to="/solicitudes">Ver solicitudes en trámite y resueltas</NuxtLink>
        </p>
      </div>
    </section>

    <!-- Carrusel de imágenes -->
    <section class="banda banda-clara">
      <div class="banda-interna">
        <p class="banda-eyebrow">Conócenos</p>
        <h2 class="banda-titulo">SENPRENDE en imágenes</h2>

        <div class="carrusel-contenedor">
          <img
            v-for="(slide, i) in slides"
            :key="slide.src"
            :src="slide.src"
            :alt="slide.alt"
            class="carrusel-imagen"
            :class="{ activa: i === slideActual }"
          />
          <div class="carrusel-puntos">
            <button
              v-for="(slide, i) in slides"
              :key="'punto-' + i"
              class="punto punto-oscuro"
              :class="{ activo: i === slideActual }"
              :aria-label="'Ir a la imagen ' + (i + 1)"
              @click="irASlide(i)"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Plataformas digitales -->
    <section class="banda banda-clara">
      <div class="banda-interna">
        <p class="banda-eyebrow">Plataformas digitales</p>
        <h2 class="banda-titulo">Nuestras plataformas</h2>
        <p class="banda-subtitulo">Servicios digitales diseñados para impulsar tu crecimiento empresarial.</p>

        <div class="rejilla-plataformas">
          <a
            v-for="p in plataformas"
            :key="p.nombre"
            class="tarjeta-plataforma"
            :href="p.url"
            target="_blank"
            rel="noopener"
          >
            <h3>{{ p.nombre }}</h3>
            <p>{{ p.descripcion }}</p>
            <span class="tarjeta-enlace">Acceder</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Plan Nacional de IA -->
    <section class="banda banda-oscura">
      <div class="banda-interna banda-ia">
        <div>
          <h2 class="banda-titulo banda-titulo-claro">Plan Nacional de IA y Comercio Electrónico</h2>
          <p class="banda-texto-claro">
            Una alianza para que cada MIPYME y emprendedor de Honduras tenga
            su propia tienda en línea, creada con inteligencia artificial y
            sin necesidad de conocimientos técnicos.
          </p>
        </div>
        <div class="banda-ia-accion">
          <a class="boton-claro" href="https://kolau.es/honduras" target="_blank" rel="noopener">
            Crear mi tienda en línea
          </a>
          <span class="etiqueta-gratis">Servicio gratuito</span>
        </div>
      </div>
    </section>

    <!-- Próximas ferias -->
    <section class="banda banda-clara">
      <div class="banda-interna">
        <p class="banda-eyebrow">Eventos</p>
        <h2 class="banda-titulo">Próximas ferias</h2>
        <p class="banda-subtitulo">Participa y conecta con oportunidades para hacer crecer tu emprendimiento.</p>

        <p class="mensaje-info">No hay ferias programadas por el momento. Vuelve pronto.</p>
      </div>
    </section>

    <!-- Sala de prensa -->
    <section class="banda banda-clara">
      <div class="banda-interna">
        <p class="banda-eyebrow">Noticias</p>
        <h2 class="banda-titulo">Sala de prensa</h2>
        <p class="banda-subtitulo">Conoce las acciones de SENPRENDE a favor de los emprendedores.</p>

        <a class="boton-secundario-sitio" href="https://senprende.hn/noticias" target="_blank" rel="noopener">
          Ver noticias
        </a>
      </div>
    </section>

    <!-- Aliados estratégicos -->
    <section class="banda banda-clara">
      <div class="banda-interna">
        <p class="banda-eyebrow">Alianzas</p>
        <h2 class="banda-titulo">Aliados estratégicos</h2>

        <div class="franja-aliados">
          <a v-for="a in aliados" :key="a.nombre" :href="a.url" target="_blank" rel="noopener" class="aliado">
            {{ a.nombre }}
          </a>
        </div>
      </div>
    </section>

    <!-- Preguntas frecuentes -->
    <section class="banda banda-clara">
      <div class="banda-interna">
        <p class="banda-eyebrow">Ayuda</p>
        <h2 class="banda-titulo">Preguntas frecuentes</h2>
        <p class="banda-subtitulo">Respuestas a las consultas más comunes sobre nuestros servicios.</p>

        <div class="acordeon">
          <div v-for="(item, i) in faq" :key="i" class="acordeon-item">
            <button class="acordeon-pregunta" @click="toggleFaq(i)">
              <span>{{ item.pregunta }}</span>
              <span class="acordeon-icono">{{ faqAbierta === i ? '−' : '+' }}</span>
            </button>
            <p v-if="faqAbierta === i" class="acordeon-respuesta">{{ item.respuesta }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Encuesta de satisfacción -->
    <section class="banda banda-clara">
      <div class="banda-interna banda-angosta">
        <p class="banda-eyebrow">Tu opinión</p>
        <h2 class="banda-titulo">Encuesta de satisfacción</h2>
        <p class="banda-subtitulo">Tu opinión nos ayuda a mejorar este servicio.</p>

        <div class="tarjeta-encuesta">
          <template v-if="!encuestaEnviada">
            <p class="encuesta-pregunta">¿Qué tan satisfecho estás con este servicio?</p>
            <div class="encuesta-calificacion">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                class="estrella"
                :class="{ activa: n <= calificacion }"
                :aria-label="n + ' de 5'"
                @click="calificacion = n"
              >
                ★
              </button>
            </div>

            <textarea
              v-model="comentario"
              class="encuesta-comentario"
              rows="3"
              placeholder="Cuéntanos qué podemos mejorar (opcional)"
            ></textarea>

            <p class="mensaje-error" v-if="errorEncuesta">{{ errorEncuesta }}</p>

            <button class="boton-principal" type="button" @click="enviarEncuesta">Enviar</button>
          </template>

          <p v-else class="mensaje-exito-sitio">
            ¡Gracias por tu opinión! Nos ayuda a mejorar el servicio.
          </p>
        </div>
      </div>
    </section>

    <!-- Pie de página -->
    <footer class="pie">
      <div class="pie-interno">
        <div class="pie-columna pie-marca">
          <img class="nav-logo" src="/senprende.jpg" alt="Escudo institucional SENPRENDE" />
          <p>Institución hondureña que impulsa el emprendimiento y el crecimiento de las MIPYME.</p>
          <div class="pie-redes">
            <a href="https://www.facebook.com/SENPRENDEHonduras/" target="_blank" rel="noopener">Facebook</a>
            <a href="https://www.instagram.com/senprendehonduras/" target="_blank" rel="noopener">Instagram</a>
            <a href="https://www.youtube.com/@senprende6265" target="_blank" rel="noopener">YouTube</a>
            <a href="https://x.com/senprende" target="_blank" rel="noopener">X</a>
          </div>
        </div>

        <div class="pie-columna">
          <h3>Este proyecto</h3>
          <a :href="urlRegistro">Registro de solicitudes</a>
          <NuxtLink to="/solicitudes">Portal público de trámites</NuxtLink>
        </div>

        <div class="pie-columna">
          <h3>Enlaces</h3>
          <a href="https://senprende.hn/quienes-somos" target="_blank" rel="noopener">Quiénes somos</a>
          <a href="https://senprende.hn/noticias" target="_blank" rel="noopener">Noticias</a>
          <a href="https://senprende.hn/descargas" target="_blank" rel="noopener">Descargas</a>
          <a href="https://senprende.hn/vacantes" target="_blank" rel="noopener">Vacantes</a>
          <a href="https://senprende.hn/marco-juridico" target="_blank" rel="noopener">Marco jurídico</a>
        </div>

        <div class="pie-columna">
          <h3>Contáctenos</h3>
          <p>Centro Cívico Gubernamental, Torre 2, Piso 12 y 21</p>
          <p>info&#64;senprende.hn</p>
          <p>2242-8101 / 2242-8102 / 2242-8104</p>
        </div>
      </div>

      <p class="pie-nota">
        Proyecto de entrenamiento inspirado en SENPRENDE Honduras — solicitudes ficticias, sin datos personales.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// URL de la app donde el ciudadano registra y da seguimiento a sus
// solicitudes (Angular). Ajusta el puerto si la corres distinto.
const urlRegistro = 'http://localhost:4200';

/* ---------- Carrusel del hero ---------- */
// Usa las imágenes que sí tenemos en buena calidad. Para agregar más
// fotos reales: colócalas en /public y súmalas aquí.
const slides = [
  { src: '/mision-mipyme.jpg', alt: 'Misión Mipyme — SENPRENDE' },
  { src: '/senprende.jpg', alt: 'Escudo institucional SENPRENDE' },
];
const slideActual = ref(0);
let intervalo = null;

function irASlide(i) {
  slideActual.value = i;
}

onMounted(() => {
  intervalo = setInterval(() => {
    slideActual.value = (slideActual.value + 1) % slides.length;
  }, 4500);
});

onBeforeUnmount(() => {
  if (intervalo) clearInterval(intervalo);
});

/* ---------- Plataformas digitales ---------- */
const plataformas = [
  {
    nombre: 'Mi Empresa en Línea',
    descripcion: 'Crea tu empresa en Honduras de manera rápida, segura y desde cualquier lugar.',
    url: 'https://miempresaenlinea.org/',
  },
  {
    nombre: 'Comercia HN',
    descripcion: 'Vende y compra productos hondureños en la plataforma de comercio electrónico.',
    url: 'https://comercia.hn/',
  },
  {
    nombre: 'SSE en Línea',
    descripcion: 'Registro y gestión del Sector Social de la Economía en un solo lugar.',
    url: 'https://sse.senprende.hn/',
  },
  {
    nombre: 'Chequeo Digital',
    descripcion: 'Evalúa el nivel tecnológico de tu empresa con recomendaciones personalizadas.',
    url: 'https://chequeodigital.senprende.hn',
  },
];

/* ---------- Aliados estratégicos ---------- */
const aliados = [
  { nombre: 'BANHPROVI', url: 'http://banhprovi.gob.hn/BANHPROVI/inicio.html' },
  { nombre: 'Crédito Solidario', url: 'https://creditosolidario.hn/csfrontend/csweb/index.php' },
  { nombre: 'CDE MIPYME', url: 'https://cdemipyme.org/' },
  { nombre: 'Presidencia de la República', url: 'https://www.presidencia.gob.hn/' },
  { nombre: 'Banco Central de Honduras', url: 'https://www.bch.hn/' },
  { nombre: 'CNBS', url: 'https://www.cnbs.gob.hn/' },
];

/* ---------- Preguntas frecuentes ---------- */
const faq = [
  {
    pregunta: '¿Qué es SENPRENDE y cuál es su misión?',
    respuesta:
      'Es la institución del Gobierno de Honduras encargada de impulsar el emprendimiento, las MIPYME y el Sector Social de la Economía, acompañando a los negocios desde la idea hasta su consolidación en el mercado.',
  },
  {
    pregunta: '¿Qué servicios ofrece SENPRENDE a emprendedores?',
    respuesta:
      'Asesoría, apoyo para formalizar el negocio, vinculación con financiamiento y espacios para acceder a nuevos mercados, entre otros programas de desarrollo empresarial.',
  },
  {
    pregunta: '¿Quién puede acceder a los servicios de SENPRENDE?',
    respuesta: 'Emprendedores, microempresarios y pequeñas y medianas empresas hondureñas, en cualquier etapa de su negocio.',
  },
  {
    pregunta: '¿Cómo es el proceso para recibir apoyo?',
    respuesta: 'Se inicia registrando una solicitud; un equipo la revisa y le da seguimiento hasta resolverla.',
  },
  {
    pregunta: '¿Cuáles son los requisitos para participar?',
    respuesta: 'Varían según el programa; en general basta con ser una persona emprendedora o una MIPYME hondureña.',
  },
  {
    pregunta: '¿Los servicios son gratuitos?',
    respuesta: 'La mayoría de los servicios de acompañamiento son gratuitos; algunos programas específicos pueden tener condiciones particulares.',
  },
  {
    pregunta: '¿En qué zonas de Honduras opera SENPRENDE?',
    respuesta: 'A nivel nacional, con actividades y ferias en distintos municipios del país.',
  },
  {
    pregunta: '¿Cómo puedo contactarlos para obtener más información?',
    respuesta: 'A través del correo, los teléfonos o las redes sociales que aparecen en el pie de esta página.',
  },
  {
    pregunta: '¿Existe alguna aplicación o plataforma digital para emprendedores?',
    respuesta: 'Sí — Mi Empresa en Línea, Comercia HN, SSE en Línea y Chequeo Digital, en la sección de Plataformas.',
  },
  {
    pregunta: '¿Cómo accedo a fondos semilla o apoyos especiales?',
    respuesta: 'Dando seguimiento a las convocatorias de programas y ferias que se publican periódicamente.',
  },
];
const faqAbierta = ref(null);
function toggleFaq(i) {
  faqAbierta.value = faqAbierta.value === i ? null : i;
}

/* ---------- Encuesta de satisfacción ---------- */
const calificacion = ref(0);
const comentario = ref('');
const encuestaEnviada = ref(false);
const errorEncuesta = ref(null);

function enviarEncuesta() {
  if (calificacion.value === 0) {
    errorEncuesta.value = 'Selecciona una calificación antes de enviar.';
    return;
  }
  errorEncuesta.value = null;
  // Encuesta de solo interfaz por ahora: no hay un endpoint en el
  // backend para guardarla. Si más adelante se agrega uno, este es el
  // lugar para llamarlo con { calificacion, comentario }.
  encuestaEnviada.value = true;
}
</script>

<style scoped>
.sitio {
  font-family: 'Public Sans', system-ui, sans-serif;
  color: var(--color-text);
}

/* Navbar */
.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
}

.nav-interno {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-marca {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--color-primary-dark);
  font-weight: 700;
  margin-right: auto;
}

.nav-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 6px;
}

.nav-enlaces {
  display: flex;
  gap: 1.4rem;
}

.nav-enlaces a {
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
}

.nav-enlaces a:hover {
  color: var(--color-primary);
}

.boton-nav {
  padding: 0.5rem 1.1rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
  white-space: nowrap;
}

.boton-nav:hover {
  background: var(--color-primary-dark);
}

/* Hero */
.hero {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  color: #fff;
  text-align: center;
  padding: 4.5rem 1.5rem;
}

.hero-contenido {
  max-width: 620px;
  margin: 0 auto;
}

.hero-eyebrow {
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: #cfe0f0;
}

.hero-titulo {
  margin: 0 0 1rem;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  line-height: 1.2;
}

.hero-texto {
  margin: 0 0 1.75rem;
  color: #dce8f4;
  font-size: 1.05rem;
}

.enlace-secundario {
  margin-top: 1rem;
  font-size: 0.88rem;
}

.enlace-secundario a {
  color: #cfe0f0;
}

.boton-principal {
  display: inline-block;
  padding: 0.85rem 2.1rem;
  background: #fff;
  color: var(--color-primary-dark);
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.boton-principal:hover {
  background: #e3edf6;
}

/* Carrusel de imágenes: tamaño contenido, sin recortar ni estirar */
.carrusel-contenedor {
  position: relative;
  max-width: 640px;
  height: 420px;
  margin: 0 auto;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}

.carrusel-imagen {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5rem;
  background: var(--color-surface);
  opacity: 0;
  transition: opacity 1s ease;
}

.carrusel-imagen.activa {
  opacity: 1;
}

.carrusel-puntos {
  position: absolute;
  bottom: 0.9rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.punto {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  padding: 0;
}

.punto.activo {
  background: #fff;
}

.punto-oscuro {
  background: var(--color-border);
}

.punto-oscuro.activo {
  background: var(--color-primary);
}

/* Bandas de sección, ancho completo */
.banda {
  padding: 4rem 1.5rem;
}

.banda-clara {
  background: var(--color-surface);
}

.banda-clara:nth-of-type(even) {
  background: var(--color-bg);
}

.banda-oscura {
  background: var(--color-primary-dark);
  color: #fff;
}

.banda-interna {
  max-width: 1100px;
  margin: 0 auto;
}

.banda-angosta {
  max-width: 640px;
}

.banda-eyebrow {
  margin: 0 0 0.4rem;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.banda-titulo {
  margin: 0 0 0.6rem;
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.banda-titulo-claro {
  color: #fff;
}

.banda-subtitulo {
  margin: 0 0 2rem;
  color: var(--color-text-muted);
  max-width: 60ch;
}

.banda-texto-claro {
  color: #d7e3ee;
  max-width: 55ch;
  margin: 0;
}

/* Plataformas */
.rejilla-plataformas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.tarjeta-plataforma {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.4rem;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow);
  transition: transform 0.15s ease;
}

.tarjeta-plataforma:hover {
  transform: translateY(-3px);
}

.tarjeta-plataforma h3 {
  margin: 0 0 0.5rem;
  color: var(--color-primary-dark);
  font-size: 1.05rem;
}

.tarjeta-plataforma p {
  margin: 0 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.tarjeta-enlace {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.88rem;
}

/* Banda IA */
.banda-ia {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.banda-ia-accion {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.boton-claro {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background: #fff;
  color: var(--color-primary-dark);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
}

.etiqueta-gratis {
  color: #a9c4de;
  font-size: 0.82rem;
}

/* Botón secundario de sección */
.boton-secundario-sitio {
  display: inline-block;
  padding: 0.6rem 1.3rem;
  border: 1.5px solid var(--color-primary);
  border-radius: 6px;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.boton-secundario-sitio:hover {
  background: var(--color-primary);
  color: #fff;
}

/* Aliados */
.franja-aliados {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.aliado {
  padding: 0.5rem 1rem;
  background: var(--color-primary-tint);
  color: var(--color-primary-dark);
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
}

.aliado:hover {
  background: var(--color-primary);
  color: #fff;
}

/* Acordeón FAQ */
.acordeon {
  border-top: 1px solid var(--color-border);
}

.acordeon-item {
  border-bottom: 1px solid var(--color-border);
}

.acordeon-pregunta {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  background: none;
  border: none;
  text-align: left;
  font: inherit;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
}

.acordeon-icono {
  color: var(--color-primary);
  font-size: 1.2rem;
  flex-shrink: 0;
}

.acordeon-respuesta {
  margin: 0 0 1.1rem;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  max-width: 70ch;
}

/* Encuesta */
.tarjeta-encuesta {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.75rem;
  box-shadow: var(--shadow);
  text-align: left;
}

.encuesta-pregunta {
  margin: 0 0 0.8rem;
  font-weight: 600;
}

.encuesta-calificacion {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.estrella {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: var(--color-border);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.estrella.activa {
  color: var(--color-accent-atendida);
}

.encuesta-comentario {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font: inherit;
  margin-bottom: 1rem;
  resize: vertical;
}

.encuesta-comentario:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-tint);
}

.mensaje-exito-sitio {
  margin: 0;
  color: #1f7a5c;
  font-weight: 600;
}

.mensaje-info,
.mensaje-error {
  padding: 0.65rem 0.9rem;
  border-radius: 6px;
  font-size: 0.9rem;
  display: inline-block;
}

.mensaje-info {
  color: var(--color-text-muted);
  background: var(--color-primary-tint);
}

.mensaje-error {
  color: var(--color-error);
  background: var(--color-error-tint);
}

/* Pie de página */
.pie {
  background: var(--color-primary-dark);
  color: #cfe0f0;
  padding: 3rem 1.5rem 1.5rem;
}

.pie-interno {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 2rem;
}

.pie-columna h3 {
  color: #fff;
  font-size: 0.95rem;
  margin: 0 0 0.9rem;
}

.pie-columna {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  font-size: 0.88rem;
}

.pie-columna a {
  color: #cfe0f0;
  text-decoration: none;
}

.pie-columna a:hover {
  color: #fff;
}

.pie-marca .nav-logo {
  margin-bottom: 0.75rem;
}

.pie-redes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.4rem;
}

.pie-nota {
  max-width: 1100px;
  margin: 2.5rem auto 0;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.8rem;
  color: #9fb6ca;
}

@media (max-width: 720px) {
  .nav-enlaces {
    display: none;
  }
  .pie-interno {
    grid-template-columns: 1fr 1fr;
  }
  .carrusel-contenedor {
    height: 300px;
  }
}
</style>

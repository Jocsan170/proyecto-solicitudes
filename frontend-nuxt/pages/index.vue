<template>
  <div class="sitio">
    <div class="cinta-oficial">
      <div class="cinta-interna">
        <span>Gobierno de Honduras</span>
        <span class="cinta-separador" aria-hidden="true">·</span>
        <span>Emprendimiento y MIPYME</span>
      </div>
    </div>

    <header class="nav">
      <div class="nav-interno">
        <NuxtLink to="/" class="nav-marca" aria-label="SENPRENDE, inicio">
          <img class="nav-logo" src="/senprende.jpg" alt="" />
          <span class="nav-identidad">
            <strong>Ventanilla digital</strong>
            <small>Emprendimiento y MIPYME</small>
          </span>
        </NuxtLink>

        <button
          class="nav-menu-boton"
          type="button"
          aria-controls="nav-principal"
          :aria-expanded="menuAbierto"
          @click="menuAbierto = !menuAbierto"
        >
          <span class="sr-only">{{ menuAbierto ? 'Cerrar menú' : 'Abrir menú' }}</span>
          <span class="nav-menu-linea"></span>
          <span class="nav-menu-linea"></span>
          <span class="nav-menu-linea"></span>
        </button>

        <nav id="nav-principal" class="nav-enlaces" :class="{ 'nav-enlaces-abierto': menuAbierto }" aria-label="Navegación principal">
          <a href="https://senprende.hn/quienes-somos" target="_blank" rel="noopener" @click="menuAbierto = false">Institución</a>
          <a href="https://senprende.hn/ferias" target="_blank" rel="noopener" @click="menuAbierto = false">Ferias</a>
          <a href="https://senprende.hn/noticias" target="_blank" rel="noopener" @click="menuAbierto = false">Noticias</a>
          <NuxtLink to="/solicitudes" @click="menuAbierto = false">Consultar solicitudes</NuxtLink>
          <a class="boton-nav" :href="urlRegistro" @click="menuAbierto = false">Registrar solicitud</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="hero-contenido">
          <div class="hero-copy">
            <p class="hero-eyebrow"><span></span> Acompañamiento para emprender</p>
            <h1 class="hero-titulo">Tu próximo paso empieza con una buena orientación.</h1>
            <p class="hero-texto">
              Encuentra servicios para impulsar tu negocio, formalizarlo y conectarlo con nuevas oportunidades.
              Cuéntanos qué necesitas y te orientaremos sobre el siguiente paso.
            </p>
            <div class="hero-acciones">
              <a class="boton-principal" :href="urlRegistro">
                Registrar una solicitud
                <span aria-hidden="true">→</span>
              </a>
              <NuxtLink class="boton-secundario-sitio" to="/solicitudes">Consultar una solicitud</NuxtLink>
            </div>
            <p class="hero-nota">Ten a mano tu número de gestión para consultar el avance.</p>
          </div>

          <div class="hero-visual" aria-label="Tres pasos para recibir orientación" role="img">
            <div class="hero-visual-circulo hero-visual-circulo-uno"></div>
            <div class="hero-visual-circulo hero-visual-circulo-dos"></div>
            <div class="hero-tarjeta">
              <div class="hero-tarjeta-encabezado">
                <span class="hero-emblema" aria-hidden="true">S</span>
                <div>
                  <strong>Una ruta clara</strong>
                  <span>Desde tu consulta hasta el seguimiento</span>
                </div>
              </div>
              <ol class="hero-pasos">
                <li class="hero-paso hero-paso-completo">
                  <span class="hero-paso-numero">01</span>
                  <span><strong>Cuéntanos qué necesitas</strong><small>Describe tu consulta</small></span>
                  <span class="hero-paso-check" aria-hidden="true">✓</span>
                </li>
                <li class="hero-paso hero-paso-completo">
                  <span class="hero-paso-numero">02</span>
                  <span><strong>Guarda tu número</strong><small>Consérvalo para seguimiento</small></span>
                  <span class="hero-paso-check" aria-hidden="true">✓</span>
                </li>
                <li class="hero-paso">
                  <span class="hero-paso-numero">03</span>
                  <span><strong>Consulta el avance</strong><small>Revisa el estado y los mensajes</small></span>
                  <span class="hero-paso-flecha" aria-hidden="true">→</span>
                </li>
              </ol>
              <NuxtLink class="hero-tarjeta-enlace" to="/solicitudes">Ver cómo funciona <span aria-hidden="true">↗</span></NuxtLink>
            </div>
            <div class="hero-sello"><span aria-hidden="true">✦</span> SENPRENDE · HONDURAS</div>
          </div>
        </div>
      </section>

      <section class="seccion seccion-servicios" aria-labelledby="servicios-titulo">
        <div class="seccion-cabecera">
          <div>
            <p class="seccion-etiqueta">A tu lado</p>
            <h2 id="servicios-titulo" class="seccion-titulo">Herramientas para cada etapa de tu negocio</h2>
            <p class="seccion-bajada">Explora plataformas que conectan a emprendedores y MIPYME con servicios digitales.</p>
          </div>
          <a class="enlace-texto" href="https://senprende.hn/" target="_blank" rel="noopener">Conoce SENPRENDE <span aria-hidden="true">↗</span></a>
        </div>

        <div class="rejilla-plataformas">
          <a v-for="(plataforma, indice) in plataformas" :key="plataforma.nombre" class="tarjeta-plataforma" :href="plataforma.url" target="_blank" rel="noopener">
            <span class="plataforma-indice">0{{ indice + 1 }}</span>
            <span class="plataforma-icono" aria-hidden="true">{{ plataforma.icono }}</span>
            <h3>{{ plataforma.nombre }}</h3>
            <p>{{ plataforma.descripcion }}</p>
            <span class="tarjeta-enlace">{{ plataforma.accion }} <span aria-hidden="true">↗</span></span>
          </a>
        </div>
      </section>

      <section class="seccion seccion-ruta" aria-labelledby="ruta-titulo">
        <div class="ruta-cabecera">
          <p class="seccion-etiqueta seccion-etiqueta-clara">Atención en línea</p>
          <h2 id="ruta-titulo" class="seccion-titulo seccion-titulo-claro">Un proceso sencillo, paso a paso.</h2>
          <p>Registra tu consulta y conserva el número para volver cuando quieras.</p>
        </div>
        <ol class="ruta-pasos">
          <li><span>01</span><div><h3>Registra</h3><p>Describe con claridad qué apoyo necesitas.</p></div></li>
          <li><span>02</span><div><h3>Guarda</h3><p>Recibe un número para identificar tu gestión.</p></div></li>
          <li><span>03</span><div><h3>Da seguimiento</h3><p>Consulta el estado y revisa las respuestas.</p></div></li>
        </ol>
        <div class="ruta-accion">
          <a class="boton-claro" :href="urlRegistro">Comenzar una solicitud <span aria-hidden="true">→</span></a>
          <NuxtLink to="/solicitudes">Ya tengo un número</NuxtLink>
        </div>
      </section>

      <section class="seccion seccion-ayuda" aria-labelledby="ayuda-titulo">
        <div class="ayuda-intro">
          <p class="seccion-etiqueta">Estamos para orientarte</p>
          <h2 id="ayuda-titulo" class="seccion-titulo">¿Tienes una pregunta?</h2>
          <p>Consulta información institucional y encuentra recursos para tu emprendimiento.</p>
          <a class="enlace-texto" href="https://senprende.hn/noticias" target="_blank" rel="noopener">Leer noticias y recursos <span aria-hidden="true">↗</span></a>
        </div>
        <div class="acordeon">
          <div v-for="(item, indice) in preguntas" :key="item.pregunta" class="acordeon-item">
            <h3>
              <button
                :id="`pregunta-${indice}`"
                class="acordeon-pregunta"
                :aria-expanded="preguntaAbierta === indice"
                :aria-controls="`respuesta-${indice}`"
                @click="togglePregunta(indice)"
              >
                <span>{{ item.pregunta }}</span>
                <span class="acordeon-icono" aria-hidden="true">{{ preguntaAbierta === indice ? '−' : '+' }}</span>
              </button>
            </h3>
            <div v-if="preguntaAbierta === indice" :id="`respuesta-${indice}`" class="acordeon-respuesta" role="region" :aria-labelledby="`pregunta-${indice}`">
              {{ item.respuesta }}
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="pie">
      <div class="pie-interno">
        <div class="pie-marca">
          <div class="pie-identidad"><img class="nav-logo" src="/senprende.jpg" alt="" /><strong>SENPRENDE</strong></div>
          <p>Servicio Nacional de Emprendimiento y de Pequeños Negocios de Honduras.</p>
          <a href="https://senprende.hn/" target="_blank" rel="noopener">Visitar el sitio institucional <span aria-hidden="true">↗</span></a>
        </div>
        <div class="pie-columna">
          <h2>Atención digital</h2>
          <a :href="urlRegistro">Registrar una solicitud</a>
          <NuxtLink to="/solicitudes">Consultar solicitudes</NuxtLink>
          <a :href="urlSeguimiento">Seguimiento de trámite</a>
        </div>
        <div class="pie-columna">
          <h2>Información</h2>
          <a href="https://senprende.hn/quienes-somos" target="_blank" rel="noopener">Quiénes somos</a>
          <a href="https://senprende.hn/ferias" target="_blank" rel="noopener">Ferias y eventos</a>
          <a href="https://senprende.hn/descargas" target="_blank" rel="noopener">Documentos y recursos</a>
        </div>
        <div class="pie-columna pie-contacto">
          <h2>Contacto institucional</h2>
          <a href="mailto:info@senprende.hn">info@senprende.hn</a>
          <a href="tel:+50422428101">2242-8101</a>
          <span>Centro Cívico Gubernamental, Torre 2, pisos 12 y 21</span>
        </div>
      </div>
      <div class="pie-final">
        <span>Propuesta de servicio digital para evaluación institucional.</span>
        <span>Honduras <span aria-hidden="true">·</span> SENPRENDE</span>
      </div>
    </footer>

    <aside class="ayudante" aria-label="Ayuda de Williams">
      <section v-if="ayudaAbierta" id="ayudante-panel" class="ayudante-panel" role="dialog" aria-modal="false" aria-labelledby="ayudante-titulo" @keydown.esc="cerrarAyuda">
        <header class="ayudante-cabeza">
          <div class="ayudante-avatar" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img"><path d="M24 5v6M21 5h6"/><rect x="7" y="13" width="34" height="27" rx="9"/><path d="M7 24H3m42 0h-4M17 26h.1M31 26h.1M17 33c3.8 3 10.2 3 14 0"/><circle cx="24" cy="8" r="2"/></svg>
          </div>
          <div><strong id="ayudante-titulo">Williams te ayuda</strong><span>Guía sencilla del portal</span></div>
          <button class="ayudante-cerrar" type="button" aria-label="Cerrar ayuda" @click="cerrarAyuda">×</button>
        </header>

        <div class="ayudante-contenido" aria-live="polite">
          <template v-if="temaAyuda === 'inicio'">
            <p class="ayudante-saludo">¡Hola! Puedo explicarte para qué sirve SENPRENDE o acompañarte para registrar y consultar una solicitud.</p>
            <p class="ayudante-pregunta">¿Qué necesitas hacer?</p>
            <div class="ayudante-opciones">
              <button type="button" @click="temaAyuda = 'senprende'">¿Qué hace SENPRENDE?</button>
              <button type="button" @click="temaAyuda = 'mision'">Conocer su misión</button>
              <button type="button" @click="iniciarGuia">Aprender a usar el registro</button>
              <NuxtLink to="/solicitudes">Consultar una solicitud</NuxtLink>
            </div>
            <p class="ayudante-nota">No escribas aquí información personal. Este asistente no recibe mensajes ni datos.</p>
          </template>

          <template v-else-if="temaAyuda === 'senprende'">
            <p class="ayudante-etiqueta">¿QUÉ HACE SENPRENDE?</p>
            <p class="ayudante-respuesta">SENPRENDE orienta a personas emprendedoras y pequeños negocios de Honduras. En su sitio oficial encontrarás información sobre asistencia técnica, formalización, acceso a mercados y vinculación financiera.</p>
            <a class="ayudante-enlace" href="https://www.senprende.hn/quienes-somos" target="_blank" rel="noopener">Ver información oficial <span aria-hidden="true">↗</span></a>
            <button class="ayudante-volver" type="button" @click="temaAyuda = 'inicio'">← Volver a las opciones</button>
          </template>

          <template v-else-if="temaAyuda === 'mision'">
            <p class="ayudante-etiqueta">MISIÓN INSTITUCIONAL</p>
            <p class="ayudante-respuesta">En palabras sencillas: apoyar a las personas hondureñas para que creen y desarrollen empresas sostenibles e innovadoras que generen empleo y desarrollo en sus comunidades.</p>
            <a class="ayudante-enlace" href="https://www.senprende.hn/quienes-somos" target="_blank" rel="noopener">Consultar la misión en SENPRENDE <span aria-hidden="true">↗</span></a>
            <button class="ayudante-volver" type="button" @click="temaAyuda = 'inicio'">← Volver a las opciones</button>
          </template>

          <template v-else>
            <p class="ayudante-etiqueta">PASO {{ pasoGuia + 1 }} DE {{ pasosGuia.length }}</p>
            <div class="guia-progreso" :aria-valuenow="pasoGuia + 1" aria-valuemin="1" :aria-valuemax="pasosGuia.length" role="progressbar"><span :style="{ width: `${((pasoGuia + 1) / pasosGuia.length) * 100}%` }"></span></div>
            <h3 class="ayudante-paso-titulo">{{ pasosGuia[pasoGuia].titulo }}</h3>
            <p class="ayudante-respuesta">{{ pasosGuia[pasoGuia].texto }}</p>
            <p v-if="pasoGuia === 1" class="ayudante-alerta">Esta propuesta todavía está en evaluación. No ingreses datos reales hasta que SENPRENDE autorice su uso.</p>
            <div class="ayudante-navegacion">
              <button type="button" class="ayudante-volver" @click="pasoAnterior">{{ pasoGuia > 0 ? '← Anterior' : '← Opciones' }}</button>
              <button v-if="pasoGuia < pasosGuia.length - 1" type="button" class="ayudante-siguiente" @click="pasoGuia++">Siguiente <span aria-hidden="true">→</span></button>
              <a v-else class="ayudante-siguiente" :href="urlRegistro">Ir al registro <span aria-hidden="true">→</span></a>
            </div>
            <NuxtLink v-if="pasoGuia === pasosGuia.length - 1" class="ayudante-consulta" to="/solicitudes">Ya tengo un número de gestión</NuxtLink>
          </template>
        </div>
      </section>

      <button class="ayudante-boton" type="button" :aria-expanded="ayudaAbierta" aria-controls="ayudante-panel" :aria-label="ayudaAbierta ? 'Cerrar ayuda de Williams' : 'Abrir ayuda de Williams'" @click="alternarAyuda">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5v6M21 5h6"/><rect x="7" y="13" width="34" height="27" rx="9"/><path d="M7 24H3m42 0h-4M17 26h.1M31 26h.1M17 33c3.8 3 10.2 3 14 0"/><circle cx="24" cy="8" r="2"/></svg>
        <span class="sr-only">Ayuda</span>
      </button>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const config = useRuntimeConfig();
const urlRegistro = config.public.registroUrl;
const urlSeguimiento = `${urlRegistro.replace(/\/$/, '')}/seguimiento`;
const menuAbierto = ref(false);
const preguntaAbierta = ref(0);
const ayudaAbierta = ref(false);
const temaAyuda = ref('inicio');
const pasoGuia = ref(0);

const plataformas = [
  { nombre: 'Mi Empresa en Línea', icono: '01', descripcion: 'Inicia el proceso de formalización de tu empresa en Honduras.', accion: 'Conocer plataforma', url: 'https://miempresaenlinea.org/' },
  { nombre: 'Comercia HN', icono: '02', descripcion: 'Conecta productos hondureños con nuevos espacios de venta.', accion: 'Explorar plataforma', url: 'https://comercia.hn/' },
  { nombre: 'SSE en Línea', icono: '03', descripcion: 'Consulta servicios para el Sector Social de la Economía.', accion: 'Visitar plataforma', url: 'https://sse.senprende.hn/' },
  { nombre: 'Chequeo Digital', icono: '04', descripcion: 'Conoce herramientas para evaluar la madurez digital de tu negocio.', accion: 'Iniciar evaluación', url: 'https://chequeodigital.senprende.hn/' },
];

const preguntas = [
  { pregunta: '¿Qué es SENPRENDE?', respuesta: 'El Servicio Nacional de Emprendimiento y de Pequeños Negocios impulsa el emprendimiento, las MIPYME y el Sector Social de la Economía en Honduras.' },
  { pregunta: '¿Qué puedo hacer desde este portal?', respuesta: 'Puedes registrar una consulta, guardar el número de gestión y usarlo para consultar el estado y continuar la comunicación.' },
  { pregunta: '¿Qué hago si ya tengo un número de gestión?', respuesta: 'Abre la sección de solicitudes o seguimiento e ingresa el número que recibiste al registrar tu consulta.' },
  { pregunta: '¿Dónde consulto los requisitos de un servicio?', respuesta: 'Los requisitos pueden variar por programa. Consulta la información y los recursos publicados en el sitio institucional de SENPRENDE.' },
];

const pasosGuia = [
  { titulo: 'Abre el registro', texto: 'En la portada, toca “Registrar una solicitud”. Se abrirá la ventanilla en otra sección del sistema.' },
  { titulo: 'Identifícate', texto: 'La propuesta solicita nombre completo y número de identidad para asociar la consulta con la persona. Después, escribe el asunto y explica brevemente qué orientación necesitas.' },
  { titulo: 'Envía y guarda el comprobante', texto: 'Toca “Enviar solicitud”. Cuando aparezca la confirmación, copia o anota el número de gestión y guárdalo en un lugar seguro.' },
  { titulo: 'Consulta el avance', texto: 'Vuelve a esta página y toca “Consultar solicitudes”. Escribe el código privado de tu comprobante. Solo entonces aparecerán el estado, el historial y la conversación.' },
];

function iniciarGuia() {
  pasoGuia.value = 0;
  temaAyuda.value = 'guia';
}

function cerrarAyuda() {
  ayudaAbierta.value = false;
  temaAyuda.value = 'inicio';
  pasoGuia.value = 0;
}

function alternarAyuda() {
  if (ayudaAbierta.value) return cerrarAyuda();
  temaAyuda.value = 'inicio';
  pasoGuia.value = 0;
  ayudaAbierta.value = true;
}

function pasoAnterior() {
  if (pasoGuia.value > 0) pasoGuia.value--;
  else temaAyuda.value = 'inicio';
}

function togglePregunta(indice) {
  preguntaAbierta.value = preguntaAbierta.value === indice ? null : indice;
}
</script>

<style scoped>
.sitio { color: var(--color-text); font-family: 'Public Sans', system-ui, sans-serif; }
.nav { position: sticky; top: 0; z-index: 20; border-bottom: 1px solid var(--color-border); background: rgb(255 255 255 / 96%); backdrop-filter: blur(14px); }
.nav-interno { display: flex; align-items: center; gap: 2rem; width: min(1180px, 100%); min-height: 82px; margin: 0 auto; padding: 0.7rem 1.5rem; }
.nav-marca, .nav-identidad, .nav-enlaces, .hero-acciones, .hero-tarjeta-encabezado, .hero-tarjeta-enlace, .ruta-accion, .pie-identidad { display: flex; align-items: center; }
.nav-marca { gap: 0.75rem; color: var(--color-primary-dark); text-decoration: none; }
.nav-logo { width: 54px; height: 54px; object-fit: contain; border-radius: 8px; background: #fff; }
.nav-identidad { align-items: flex-start; flex-direction: column; gap: 0.12rem; }
.nav-identidad strong { font-size: 0.92rem; letter-spacing: 0.08em; }
.nav-identidad small { color: var(--color-text-muted); font-size: 0.72rem; }
.nav-enlaces { gap: clamp(0.8rem, 2vw, 1.6rem); margin-left: auto; }
.nav-enlaces a { color: var(--color-text); font-size: 0.84rem; font-weight: 600; text-decoration: none; white-space: nowrap; }
.nav-enlaces a:hover { color: var(--color-primary); }
.nav-enlaces .boton-nav { padding: 0.7rem 1rem; border-radius: 7px; background: var(--color-primary); color: #fff; }
.nav-enlaces .boton-nav:hover { background: var(--color-primary-dark); color: #fff; }
.nav-menu-boton { display: none; }

.hero { position: relative; overflow: hidden; padding: clamp(3.5rem, 7vw, 6.5rem) 1.5rem; background: radial-gradient(ellipse at 78% 25%, #e9eff4 0, transparent 37%), linear-gradient(125deg, #f8f9fa 0%, #f3f6f8 58%, #eaf0f4 100%); }
.hero::before { position: absolute; right: -6rem; bottom: -10rem; width: 32rem; height: 32rem; border: 1px solid rgb(165 136 67 / 16%); border-radius: 50%; content: ''; }
.hero-contenido { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 0.88fr); align-items: center; gap: clamp(2.5rem, 7vw, 6.5rem); width: min(1120px, 100%); margin: 0 auto; }
.hero-copy { max-width: 590px; }
.hero-eyebrow, .seccion-etiqueta { display: flex; align-items: center; gap: 0.55rem; margin: 0 0 1rem; color: var(--color-primary); font-size: 0.76rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.hero-eyebrow span { width: 1.5rem; height: 2px; background: var(--color-brand-gold); }
.hero-titulo { max-width: 13ch; margin: 0; color: var(--color-primary-dark); font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(2.7rem, 5.7vw, 4.65rem); font-weight: 600; letter-spacing: -0.035em; line-height: 1.03; }
.hero-texto { max-width: 54ch; margin: 1.3rem 0 0; color: var(--color-text-muted); font-size: 1.03rem; line-height: 1.75; }
.hero-acciones { flex-wrap: wrap; gap: 0.7rem; margin-top: 1.8rem; }
.boton-principal, .boton-secundario-sitio, .boton-claro { display: inline-flex; align-items: center; justify-content: center; gap: 0.8rem; min-height: 48px; padding: 0.75rem 1.15rem; border: 1px solid transparent; border-radius: 7px; font: inherit; font-size: 0.88rem; font-weight: 700; text-decoration: none; transition: background-color 160ms ease, color 160ms ease, transform 160ms ease; }
.boton-principal { background: var(--color-primary); color: #fff; box-shadow: 0 8px 18px rgb(16 43 70 / 14%); }
.boton-principal:hover { transform: translateY(-1px); background: var(--color-primary-dark); }
.boton-secundario-sitio { border-color: var(--color-border-strong); background: #fff; color: var(--color-primary-dark); }
.boton-secundario-sitio:hover { border-color: var(--color-primary); background: var(--color-primary-tint); }
.hero-nota { margin: 1rem 0 0; color: var(--color-text-muted); font-size: 0.78rem; }
.hero-visual { position: relative; display: grid; min-height: 400px; place-items: center; }
.hero-visual-circulo { position: absolute; border: 1px solid rgb(165 136 67 / 28%); border-radius: 50%; }
.hero-visual-circulo-uno { width: min(100%, 410px); aspect-ratio: 1; }
.hero-visual-circulo-dos { width: min(82%, 340px); aspect-ratio: 1; border-style: dashed; opacity: 0.65; }
.hero-tarjeta { position: relative; z-index: 1; width: min(100%, 430px); padding: 1.4rem; border: 1px solid rgb(255 255 255 / 80%); border-radius: 14px; background: rgb(255 255 255 / 95%); box-shadow: 0 24px 60px rgb(16 43 70 / 14%); }
.hero-tarjeta-encabezado { gap: 0.85rem; padding: 0.1rem 0 1.1rem; border-bottom: 1px solid var(--color-border); }
.hero-emblema { display: grid; width: 42px; height: 42px; place-items: center; border: 1px solid #e4d8b7; border-radius: 50%; background: #faf7ef; color: var(--color-brand-gold-dark); font-family: 'Source Serif 4', Georgia, serif; font-size: 1.2rem; font-weight: 700; }
.hero-tarjeta-encabezado div, .hero-paso > span:nth-child(2) { display: grid; gap: 0.2rem; }
.hero-tarjeta-encabezado strong { color: var(--color-primary-dark); font-size: 0.94rem; }
.hero-tarjeta-encabezado span:not(.hero-emblema) { color: var(--color-text-muted); font-size: 0.75rem; }
.hero-pasos { display: grid; gap: 0.15rem; margin: 0; padding: 0.85rem 0 0; list-style: none; }
.hero-paso { display: grid; grid-template-columns: 36px minmax(0, 1fr) 24px; align-items: center; gap: 0.65rem; padding: 0.8rem 0.15rem; }
.hero-paso-numero { color: var(--color-brand-gold-dark); font-size: 0.74rem; font-weight: 700; }
.hero-paso strong { color: var(--color-primary-dark); font-size: 0.84rem; }
.hero-paso small { color: var(--color-text-muted); font-size: 0.75rem; }
.hero-paso-check, .hero-paso-flecha { display: grid; width: 24px; height: 24px; place-items: center; border-radius: 50%; background: var(--color-success-tint); color: var(--color-success); font-size: 0.77rem; font-weight: 700; }
.hero-paso-flecha { background: var(--color-primary-tint); color: var(--color-primary); }
.hero-tarjeta-enlace { justify-content: space-between; margin-top: 0.4rem; padding-top: 1rem; border-top: 1px solid var(--color-border); color: var(--color-primary); font-size: 0.81rem; font-weight: 700; text-decoration: none; }
.hero-sello { position: absolute; right: 0.3rem; bottom: 0.2rem; color: var(--color-text-muted); font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em; }
.hero-sello span { color: var(--color-brand-gold-dark); }

.seccion { padding: clamp(3.5rem, 7vw, 5.5rem) 1.5rem; }
.seccion-servicios { background: #fff; }
.seccion-cabecera { display: flex; align-items: end; justify-content: space-between; gap: 2rem; width: min(1120px, 100%); margin: 0 auto 2rem; }
.seccion-etiqueta { margin-bottom: 0.65rem; color: var(--color-brand-gold-dark); }
.seccion-titulo { max-width: 24ch; margin: 0; color: var(--color-primary-dark); font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(1.9rem, 3.5vw, 2.7rem); font-weight: 600; letter-spacing: -0.025em; line-height: 1.12; }
.seccion-bajada { max-width: 58ch; margin: 0.75rem 0 0; color: var(--color-text-muted); line-height: 1.65; }
.enlace-texto { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--color-primary); font-size: 0.84rem; font-weight: 700; text-decoration: none; white-space: nowrap; }
.enlace-texto:hover { color: var(--color-primary-dark); text-decoration: underline; text-underline-offset: 3px; }
.rejilla-plataformas { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; width: min(1120px, 100%); margin: 0 auto; }
.tarjeta-plataforma { position: relative; display: flex; min-height: 270px; flex-direction: column; align-items: flex-start; padding: 1.35rem; border: 1px solid var(--color-border); border-radius: 10px; background: #fff; color: inherit; text-decoration: none; transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease; }
.tarjeta-plataforma:hover { transform: translateY(-3px); border-color: #b7c7d5; box-shadow: 0 14px 30px rgb(16 43 70 / 9%); }
.plataforma-indice { position: absolute; top: 1.25rem; right: 1.25rem; color: #9aa9b6; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; }
.plataforma-icono { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 8px; background: var(--color-primary-tint); color: var(--color-primary); font-size: 0.77rem; font-weight: 700; }
.tarjeta-plataforma h3 { margin: 1.25rem 0 0.5rem; color: var(--color-primary-dark); font-size: 1rem; }
.tarjeta-plataforma p { margin: 0 0 1.25rem; color: var(--color-text-muted); font-size: 0.84rem; line-height: 1.6; }
.tarjeta-enlace { display: inline-flex; gap: 0.35rem; align-items: center; margin-top: auto; color: var(--color-primary); font-size: 0.79rem; font-weight: 700; }

.seccion-ruta { background: var(--color-primary-dark); color: #fff; }
.ruta-cabecera, .ruta-pasos, .ruta-accion { width: min(1120px, 100%); margin-right: auto; margin-left: auto; }
.seccion-etiqueta-clara { color: #d5c38f; }
.seccion-titulo-claro { color: #fff; }
.ruta-cabecera > p:last-child { margin: 0.7rem 0 0; color: #d4dfeb; line-height: 1.6; }
.ruta-pasos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem; margin-top: 2.2rem; padding: 0; list-style: none; }
.ruta-pasos li { display: flex; gap: 1rem; min-height: 140px; padding: 1.2rem; border: 1px solid rgb(255 255 255 / 20%); border-radius: 9px; background: rgb(255 255 255 / 5%); }
.ruta-pasos li > span { color: #d5c38f; font-size: 0.78rem; font-weight: 700; }
.ruta-pasos h3 { margin: 0; font-size: 0.96rem; }
.ruta-pasos p { margin: 0.45rem 0 0; color: #d4dfeb; font-size: 0.81rem; line-height: 1.55; }
.ruta-accion { display: flex; align-items: center; gap: 1.1rem; margin-top: 1.4rem; }
.boton-claro { background: #fff; color: var(--color-primary-dark); }
.boton-claro:hover { transform: translateY(-1px); background: #f2f4f6; }
.ruta-accion > a:last-child { color: #fff; font-size: 0.83rem; font-weight: 600; text-decoration-color: #aebdca; text-underline-offset: 4px; }

.seccion-ayuda { display: grid; grid-template-columns: minmax(220px, 0.72fr) minmax(0, 1.28fr); gap: clamp(2rem, 8vw, 7rem); background: #f7f8f9; }
.ayuda-intro { max-width: 340px; }
.ayuda-intro > p:not(.seccion-etiqueta) { margin: 0.85rem 0 1.25rem; color: var(--color-text-muted); line-height: 1.65; }
.acordeon { border-top: 1px solid var(--color-border); }
.acordeon-item { border-bottom: 1px solid var(--color-border); }
.acordeon-item h3 { margin: 0; }
.acordeon-pregunta { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.05rem 0; border: 0; background: transparent; color: var(--color-primary-dark); font: inherit; font-size: 0.9rem; font-weight: 700; text-align: left; cursor: pointer; }
.acordeon-icono { display: grid; width: 26px; height: 26px; flex: 0 0 auto; place-items: center; border: 1px solid var(--color-border); border-radius: 50%; color: var(--color-primary); font-size: 1rem; }
.acordeon-respuesta { max-width: 68ch; padding: 0 2.4rem 1.1rem 0; color: var(--color-text-muted); font-size: 0.87rem; line-height: 1.7; }

.pie { padding: 3rem 1.5rem 1.2rem; background: #0b223a; color: #e5ebf1; }
.pie-interno { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.15fr; gap: 2rem; width: min(1120px, 100%); margin: 0 auto; }
.pie-identidad { gap: 0.65rem; color: #fff; font-size: 0.9rem; letter-spacing: 0.08em; }
.pie-identidad .nav-logo { width: 42px; height: 42px; }
.pie-marca > p { max-width: 33ch; margin: 0.8rem 0; color: #c2cfdb; font-size: 0.81rem; line-height: 1.6; }
.pie-marca > a, .pie-columna a, .pie-columna span { color: #dce5ed; font-size: 0.79rem; line-height: 1.6; text-decoration: none; }
.pie a:hover { color: #fff; text-decoration: underline; text-underline-offset: 3px; }
.pie-columna { display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; }
.pie-columna h2 { margin: 0 0 0.4rem; color: #fff; font-size: 0.82rem; }
.pie-final { display: flex; justify-content: space-between; gap: 1rem; width: min(1120px, 100%); margin: 2.1rem auto 0; padding-top: 1rem; border-top: 1px solid rgb(255 255 255 / 16%); color: #aebdca; font-size: 0.72rem; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }

.ayudante { position: fixed; z-index: 45; bottom: max(1.25rem, env(safe-area-inset-bottom)); left: max(1.25rem, env(safe-area-inset-left)); }
.ayudante-boton { display: grid; width: 66px; height: 66px; place-items: center; border: 3px solid #fff; border-radius: 50%; background: #d5c38f; color: #102b46; box-shadow: 0 5px 22px rgb(8 27 45 / 28%); cursor: pointer; transition: transform 160ms ease, background-color 160ms ease; }
.ayudante-boton:hover { transform: translateY(-2px); background: #e4d7b1; }
.ayudante-boton:focus-visible, .ayudante-panel button:focus-visible, .ayudante-panel a:focus-visible { outline: 3px solid #1b4b73; outline-offset: 3px; }
.ayudante-boton svg, .ayudante-avatar svg { width: 40px; height: 40px; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5; }
.ayudante-panel { position: absolute; bottom: 80px; left: 0; display: flex; width: min(390px, calc(100vw - 2.5rem)); max-height: min(690px, calc(100vh - 8rem)); flex-direction: column; overflow: hidden; border: 1px solid #cbd5df; border-radius: 16px; background: #fff; box-shadow: 0 18px 58px rgb(8 27 45 / 26%); }
.ayudante-cabeza { display: flex; align-items: center; gap: 0.75rem; padding: 0.95rem 1rem; background: #102b46; color: #fff; }
.ayudante-avatar { display: grid; width: 46px; height: 46px; flex: 0 0 auto; place-items: center; border-radius: 50%; background: #d5c38f; color: #102b46; }
.ayudante-avatar svg { width: 32px; height: 32px; }
.ayudante-cabeza > div:nth-child(2) { display: grid; gap: 0.15rem; }
.ayudante-cabeza strong { font-size: 1rem; }
.ayudante-cabeza span { color: #d4dfeb; font-size: 0.78rem; }
.ayudante-cerrar { width: 44px; height: 44px; margin-left: auto; border: 1px solid rgb(255 255 255 / 35%); border-radius: 50%; background: transparent; color: #fff; font-size: 1.6rem; line-height: 1; cursor: pointer; }
.ayudante-contenido { overflow-y: auto; padding: 1.1rem; color: #16242f; font-size: 1rem; line-height: 1.6; }
.ayudante-saludo { margin: 0; padding: 0.85rem 0.95rem; border-radius: 12px 12px 12px 3px; background: #edf3f8; font-size: 1rem; }
.ayudante-pregunta { margin: 1rem 0 0.45rem; color: #102b46; font-size: 1rem; font-weight: 750; }
.ayudante-opciones { display: grid; gap: 0.55rem; }
.ayudante-opciones button, .ayudante-opciones a { display: flex; min-height: 52px; align-items: center; justify-content: flex-start; padding: 0.65rem 0.8rem; border: 1px solid #b8c5d0; border-radius: 9px; background: #fff; color: #102b46; font: inherit; font-size: 0.95rem; font-weight: 700; text-align: left; text-decoration: none; cursor: pointer; }
.ayudante-opciones button:hover, .ayudante-opciones a:hover { border-color: #1b4b73; background: #e3edf6; }
.ayudante-nota { margin: 0.85rem 0 0; color: #566674; font-size: 0.78rem; }
.ayudante-etiqueta { margin: 0 0 0.45rem; color: #816a32; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; }
.ayudante-respuesta { margin: 0 0 0.9rem; font-size: 1rem; line-height: 1.7; }
.ayudante-enlace { display: inline-flex; min-height: 48px; align-items: center; gap: 0.4rem; color: #1b4b73; font-weight: 750; text-underline-offset: 3px; }
.ayudante-volver { display: flex; min-height: 48px; align-items: center; margin-top: 0.75rem; padding: 0.4rem 0; border: 0; background: transparent; color: #1b4b73; font: inherit; font-weight: 750; cursor: pointer; }
.guia-progreso { height: 8px; margin: 0.65rem 0 1rem; overflow: hidden; border-radius: 999px; background: #e3edf6; }
.guia-progreso span { display: block; height: 100%; border-radius: inherit; background: #1b4b73; transition: width 180ms ease; }
.ayudante-paso-titulo { margin: 0 0 0.55rem; color: #102b46; font: 700 1.35rem/1.2 'Source Serif 4', Georgia, serif; }
.ayudante-alerta { margin: 0.8rem 0; padding: 0.75rem; border-left: 4px solid #a58843; border-radius: 6px; background: #faf7ef; color: #443a23; font-size: 0.87rem; line-height: 1.55; }
.ayudante-navegacion { display: flex; justify-content: space-between; gap: 0.7rem; margin-top: 0.8rem; }
.ayudante-navegacion .ayudante-volver { margin: 0; }
.ayudante-siguiente { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.65rem 0.9rem; border: 0; border-radius: 8px; background: #1b4b73; color: #fff; font: inherit; font-weight: 750; text-decoration: none; cursor: pointer; }
.ayudante-siguiente:hover { background: #102b46; }
.ayudante-consulta { display: inline-flex; min-height: 48px; align-items: center; color: #1b4b73; font-weight: 750; text-underline-offset: 3px; }

@media (max-width: 520px) {
  .ayudante { bottom: max(0.85rem, env(safe-area-inset-bottom)); left: max(0.85rem, env(safe-area-inset-left)); }
  .ayudante-boton { width: 60px; height: 60px; }
  .ayudante-panel { bottom: 72px; width: min(390px, calc(100vw - 1.7rem)); max-height: min(680px, calc(100dvh - 7rem)); }
  .ayudante-contenido { padding: 0.9rem; }
}

@media (prefers-reduced-motion: reduce) {
  .ayudante-boton, .guia-progreso span { transition: none; }
}

@media (max-width: 900px) {
  .hero-contenido { grid-template-columns: minmax(0, 1fr) minmax(300px, 0.85fr); gap: 2rem; }
  .hero-visual { min-height: 360px; }
  .rejilla-plataformas { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .seccion-ayuda { gap: 2.5rem; }
  .pie-interno { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .nav-interno { min-height: 72px; padding: 0.55rem 1rem; }
  .nav-logo { width: 48px; height: 48px; }
  .nav-menu-boton { display: grid; gap: 4px; width: 42px; height: 42px; margin-left: auto; padding: 10px; place-content: center; border: 1px solid var(--color-border); border-radius: 7px; background: #fff; }
  .nav-menu-linea { display: block; width: 18px; height: 2px; border-radius: 2px; background: var(--color-primary-dark); }
  .nav-enlaces { position: absolute; top: calc(100% + 1px); right: 0; left: 0; display: none; align-items: stretch; flex-direction: column; gap: 0; padding: 0.5rem 1rem 1rem; border-bottom: 1px solid var(--color-border); background: #fff; box-shadow: 0 14px 24px rgb(16 43 70 / 10%); }
  .nav-enlaces-abierto { display: flex; }
  .nav-enlaces a { padding: 0.8rem 0.5rem; }
  .nav-enlaces .boton-nav { margin-top: 0.25rem; padding: 0.75rem 1rem; text-align: center; }
  .hero { padding: 3.4rem 1.1rem 3rem; }
  .hero-contenido { grid-template-columns: 1fr; gap: 2rem; }
  .hero-titulo { max-width: 12ch; font-size: clamp(2.6rem, 12vw, 4rem); }
  .hero-visual { min-height: 355px; }
  .hero-tarjeta { width: min(100%, 430px); }
  .hero-sello { right: 0.1rem; bottom: -0.15rem; }
  .seccion { padding: 3.5rem 1.1rem; }
  .seccion-cabecera { align-items: flex-start; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
  .ruta-pasos { grid-template-columns: 1fr; gap: 0.65rem; margin-top: 1.6rem; }
  .ruta-pasos li { min-height: auto; }
  .seccion-ayuda { grid-template-columns: 1fr; gap: 1.8rem; }
}
@media (max-width: 480px) {
  .cinta-interna { padding: 0.42rem 1rem; font-size: 0.69rem; }
  .hero-acciones { align-items: stretch; flex-direction: column; }
  .hero-acciones > a { width: 100%; }
  .hero-visual { min-height: 330px; }
  .hero-tarjeta { padding: 1.05rem; }
  .hero-paso { grid-template-columns: 28px minmax(0, 1fr) 22px; gap: 0.5rem; }
  .rejilla-plataformas { grid-template-columns: 1fr; }
  .tarjeta-plataforma { min-height: 225px; }
  .ruta-accion { align-items: flex-start; flex-direction: column; }
  .pie-interno { grid-template-columns: 1fr; gap: 1.6rem; }
  .pie-final { align-items: flex-start; flex-direction: column; gap: 0.4rem; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
</style>

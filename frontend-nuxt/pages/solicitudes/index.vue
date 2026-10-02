<template>
  <div class="sitio-publico">
    <div class="cinta-oficial">
      <div class="cinta-interna">
        <span>Gobierno de Honduras</span>
        <span class="cinta-separador" aria-hidden="true">·</span>
        <span>Seguimiento de solicitudes</span>
      </div>
    </div>

    <header class="barra-servicio">
      <div class="barra-interna">
        <NuxtLink to="/" class="marca-servicio">
          <img class="logo" src="/senprende.jpg" alt="" />
          <div>
            <p class="marca-institucion">Atención institucional</p>
            <p class="marca-nombre">Portal de solicitudes</p>
          </div>
        </NuxtLink>
        <NuxtLink class="enlace-inicio" to="/">Volver al inicio</NuxtLink>
      </div>
    </header>

    <section class="hero-tramite hero-compacto">
      <div class="hero-interno">
        <p class="hero-eyebrow">Información protegida</p>
        <h1>Consulta privada de tu gestión</h1>
        <p class="hero-texto">
          El estado de cada solicitud es información personal. No publicamos listados de casos; solo la persona solicitante puede consultar su trámite después de verificar sus datos.
        </p>
      </div>
    </section>

    <main class="lienzo">
      <section class="tarjeta tarjeta-privacidad" aria-labelledby="titulo-privacidad">
        <div class="privacidad-icono" aria-hidden="true">✓</div>
        <div>
          <p class="busqueda-etiqueta">Acceso individual</p>
          <h2 id="titulo-privacidad">Tus datos, solo para tu consulta</h2>
          <p>El comprobante entrega un código privado. Solo quien tiene ese código puede abrir el estado y continuar la conversación de la solicitud.</p>
          <a class="boton-principal" :href="urlSeguimiento">Ingresar código de gestión <span aria-hidden="true">→</span></a>
          <p class="pista-campo">Guarda el código en un lugar seguro. Esta propuesta sigue en evaluación; usa solo datos ficticios.</p>
          <p class="pista-registro">¿Aún no tienes un número de gestión? <a :href="urlRegistro">Registra tu solicitud aquí</a>.</p>
        </div>
      </section>
      <p class="pie-acciones"><NuxtLink class="enlace-inicio" to="/">Volver al inicio institucional</NuxtLink></p>
    </main>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const urlRegistro = config.public.registroUrl;
const urlSeguimiento = `${urlRegistro.replace(/\/$/, '')}/seguimiento`;
</script>

<style scoped>
.tarjeta-privacidad { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 1.25rem; max-width: 850px; margin: 0 auto; padding: clamp(1.25rem, 4vw, 2.5rem); }
.privacidad-icono { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 50%; background: #e6f2ed; color: #246b51; font-size: 1.4rem; font-weight: 800; }
.tarjeta-privacidad h2 { margin: 0 0 0.6rem; color: #102b46; font: 700 1.5rem/1.2 'Source Serif 4', Georgia, serif; }
.tarjeta-privacidad p:not(.busqueda-etiqueta):not(.pista-campo) { max-width: 55ch; color: #566674; line-height: 1.65; }
.boton-principal { display: inline-flex; gap: 0.6rem; align-items: center; margin-top: 0.75rem; padding: 0.8rem 1rem; border-radius: 8px; background: #1b4b73; color: #fff; font-weight: 700; text-decoration: none; }
.boton-principal:hover { background: #102b46; }
.pista-campo { color: #566674; font-size: 0.8rem; }
.pista-registro { margin-top: 1.25rem; color: #354b5e; }
.pista-registro a { color: #1b4b73; font-weight: 700; }
@media (max-width: 560px) { .tarjeta-privacidad { grid-template-columns: 1fr; } }
</style>

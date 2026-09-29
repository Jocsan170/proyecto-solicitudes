<template>
  <div class="sitio-publico">
    <div class="cinta-oficial">
      <div class="cinta-interna">
        <span>Gobierno de Honduras</span>
        <span class="cinta-separador" aria-hidden="true">·</span>
        <span>Consulta pública de trámites</span>
      </div>
    </div>

    <header class="barra-servicio">
      <div class="barra-interna">
        <NuxtLink to="/" class="marca-servicio">
          <img class="logo" src="/senprende.jpg" alt="Escudo institucional de SENPRENDE" />
          <div>
            <p class="marca-institucion">SENPRENDE</p>
            <p class="marca-nombre">Portal de solicitudes</p>
          </div>
        </NuxtLink>
        <nav class="nav-servicio" aria-label="Navegación del portal">
          <NuxtLink to="/">Inicio</NuxtLink>
          <a :href="urlRegistro">Registrar solicitud</a>
          <a :href="urlSeguimiento">Seguimiento</a>
        </nav>
      </div>
    </header>

    <section class="hero-tramite hero-compacto">
      <div class="hero-interno">
        <p class="hero-eyebrow">Transparencia</p>
        <h1>Estado público de las solicitudes</h1>
        <p class="hero-texto">
          Aquí puedes ver qué trámites siguen en revisión y cuáles ya fueron
          atendidos. El detalle confidencial de cada solicitud no se publica.
        </p>
      </div>
    </section>

    <main class="lienzo">
      <p v-if="cargando" class="mensaje-info">Cargando el tablero de trámites…</p>

      <p v-else-if="errorServicio" class="mensaje-error">
        {{ errorServicio }}
      </p>

      <p v-else-if="listaVacia" class="mensaje-info">
        Todavía no hay solicitudes publicadas para mostrar.
      </p>

      <div v-else class="rejilla-tablero">
        <section class="tarjeta">
          <div class="encabezado-seccion">
            <h2>En trámite</h2>
            <span class="contador">{{ pendientes.length }}</span>
          </div>
          <p class="subtitulo-seccion">Solicitudes recibidas que el equipo institucional todavía está gestionando.</p>

          <p v-if="pendientes.length === 0" class="mensaje-info">
            No hay solicitudes en trámite en este momento.
          </p>
          <ul v-else class="lista">
            <li v-for="s in pendientes" :key="s.id" class="item">
              <div>
                <span class="titulo">{{ s.titulo }}</span>
                <br />
                <span class="estado estado-pendiente">En trámite</span>
              </div>
              <span class="fecha">{{ s.fecha }}</span>
            </li>
          </ul>
        </section>

        <section class="tarjeta">
          <div class="encabezado-seccion">
            <h2>Atendidas</h2>
            <span class="contador">{{ atendidas.length }}</span>
          </div>
          <p class="subtitulo-seccion">Solicitudes que ya fueron resueltas.</p>

          <p v-if="atendidas.length === 0" class="mensaje-info">
            Todavía no hay solicitudes atendidas para mostrar.
          </p>
          <ul v-else class="lista">
            <li v-for="s in atendidas" :key="s.id" class="item">
              <div>
                <span class="titulo">{{ s.titulo }}</span>
                <br />
                <span class="estado estado-atendida">Atendida</span>
              </div>
              <span class="fecha">{{ s.fecha }}</span>
            </li>
          </ul>
        </section>
      </div>

      <p class="pie-acciones">
        <NuxtLink class="enlace-inicio" to="/">Volver al inicio institucional</NuxtLink>
      </p>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useSolicitudesPublicas } from '../../composables/useSolicitudesPublicas';

const urlRegistro = 'http://localhost:4200';
const urlSeguimiento = 'http://localhost:4200/seguimiento';
const { pendientes, atendidas, cargando, errorServicio, listaVacia, cargar } = useSolicitudesPublicas();

onMounted(() => {
  cargar();
});
</script>

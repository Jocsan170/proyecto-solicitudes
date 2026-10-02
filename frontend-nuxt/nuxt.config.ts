export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-01-01',
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      registroUrl: process.env.NUXT_PUBLIC_REGISTRO_URL || 'http://localhost:4200',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
    },
  },
  app: {
    head: {
      title: 'SENPRENDE | Atención a emprendedores y MIPYME',
      meta: [
        {
          name: 'description',
          content: 'Conoce servicios y plataformas para emprendedores y MIPYME. Registra una consulta y consulta el avance de tu solicitud.',
        },
        { name: 'theme-color', content: '#102b46' },
      ],
      link: [
        { rel: 'icon', type: 'image/jpeg', href: '/senprende.jpg' },
      ],
    },
  },
});

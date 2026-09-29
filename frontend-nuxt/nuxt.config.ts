export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-01-01',
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Portal de solicitudes',
      link: [
        { rel: 'icon', type: 'image/jpeg', href: '/senprende.jpg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap',
        },
      ],
    },
  },
});

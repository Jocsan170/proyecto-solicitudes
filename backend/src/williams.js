const DOMINIOS_OFICIALES = ['senprende.hn', 'miempresaenlinea.org', 'comercia.hn'];
const URL_FINANCIAMIENTO = 'https://senprende.hn/vinculacion-financiera';

function requiereAsesor(pregunta) {
  const texto = normalizar(pregunta);
  return /\b(mi solicitud|mi tramite|mi expediente|estado de mi|estado (actual )?de (mi|la) (solicitud|tramite)|como va (mi|la)? ?(solicitud|tramite)|avance de mi|observ\w*|documento (me )?falta|subsanar|reemplazar (el )?documento|revision de mi caso|caso administrativo|hablar con (un )?asesor|necesito un asesor|quiero un asesor|hablar con alguien|aparece como pendiente|en revision)\b/.test(texto);
}

function normalizar(texto) {
  return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function detectarProducto(texto) {
  if (/\b(pan|panaderia|reposteria|pastel|comida|alimento|bebida|dulce|comida tipica)\b/.test(texto)) return 'alimentos';
  if (/\b(ropa|camisa|vestido|calzado|zapato|bolso|moda)\b/.test(texto)) return 'ropa';
  if (/\b(artesania|artesanal|bisuteria|manualidad|barro|madera)\b/.test(texto)) return 'artesania';
  if (/\b(belleza|salon|uñas|unas|cabello|maquillaje|cosmetica)\b/.test(texto)) return 'belleza';
  if (/\b(servicio|servicios|reparacion|reparaciones|consultoria|clases|transporte)\b/.test(texto)) return 'servicios';
  return null;
}

function respuestaVentas(pregunta, historial) {
  const conversaciones = historial
    .filter((mensaje) => mensaje.role === 'user')
    .map((mensaje) => normalizar(mensaje.content))
    .join(' ');
  const contexto = `${conversaciones} ${normalizar(pregunta)}`;
  const producto = detectarProducto(contexto);
  const detalleProducto = {
    alimentos: 'En alimentos, destaca sabor, tamaño o presentación, precio, fecha de elaboración y zona de entrega.',
    ropa: 'En ropa, muestra la prenda puesta y en detalle; indica tallas disponibles, material, precio y cómo entregas.',
    artesania: 'En artesanía, cuenta quién la elabora, qué la hace especial, medidas o materiales, precio y opciones de entrega.',
    belleza: 'En belleza, presenta el resultado o servicio, duración, precio desde, ubicación y cómo reservar.',
    servicios: 'En servicios, explica el problema que resuelves, qué incluye, para quién es, precio o cotización y cómo agendar.',
  }[producto] || 'Elige tu producto o servicio más atractivo y comunica claramente el beneficio, precio, disponibilidad y forma de entrega.';

  return {
    answer: `Sí, trabajemos en mejorar tus ventas con acciones concretas.\n\n1. Empieza por lo que más te conviene vender: anota tus productos, precio y costo, y elige uno que tenga demanda y te deje ganancia.\n2. Publica una oferta clara con una buena foto, el beneficio para el cliente, el precio y cómo comprar. ${detalleProducto}\n3. No esperes solo a que vean la publicación: compártela por WhatsApp y escribe de forma personal a clientes anteriores o posibles compradores, sin enviar mensajes masivos.\n4. Durante una semana apunta cuántas personas preguntan, cuántas compran y qué producto prefieren; así sabrás qué repetir o ajustar.\n\nEjemplo de mensaje: “Hola, [nombre]. Esta semana tengo [producto], ideal para [beneficio]. Cuesta L[precio] y puedo entregarlo en [zona]. ¿Te aparto uno?”. Cambia los espacios por tus datos reales.\n\nSENPRENDE publica asistencia técnica en mercadeo y ventas, y orientación para vincularse con oportunidades de mercado. ¿Qué producto o servicio ofreces y dónde vendes ahora: WhatsApp, redes, local o ferias?`,
    sources: [
      { title: 'Asistencia técnica: mercadeo y ventas', url: 'https://senprende.hn/asistencia-tecnica' },
      { title: 'Acceso a mercados', url: 'https://senprende.hn/acceso-mercados' },
    ],
    needsAdvisor: false,
  };
}

function respuestaSinIA(pregunta, historial = []) {
  const texto = normalizar(pregunta);
  if (/\b(que es senprende|que hace senprende|que hacen.*senprende|senprende.*que hacen)\b/.test(texto)) {
    return {
      answer: 'SENPRENDE es el Servicio Nacional de Emprendimiento y de Pequeños Negocios de Honduras. En su sitio presenta apoyo para emprendedores y MIPYME en asistencia técnica, formalización, vinculación financiera y acceso a mercados.',
      sources: [{ title: 'Servicios de SENPRENDE', url: 'https://senprende.hn/' }],
      needsAdvisor: false,
    };
  }
  if (/\b(asistencia tecnica|ayuda.*negocio|asesoria.*negocio)\b/.test(texto) || (/\bquien me ayuda\b/.test(texto) && !/\bformaliz/.test(texto))) {
    return {
      answer: 'SENPRENDE ofrece asistencia técnica con asesorías y capacitación. La Unidad de Emprendimiento e Innovación apoya a personas con una idea o en etapa temprana; la Unidad de Desarrollo Empresarial acompaña a MIPYME y empresas del Sector Social de la Economía con capacitaciones, asesoría personalizada y diagnósticos.',
      sources: [{ title: 'Asistencia técnica de SENPRENDE', url: 'https://senprende.hn/asistencia-tecnica' }],
      needsAdvisor: false,
    };
  }
  const temaVentas = /\b(mejorar|aumentar|incrementar|subir|impulsar)\b.{0,24}\bventas?\b|\b(como|quiero|necesito|puedo)\b.{0,24}\bvender\b|\b(conseguir|atraer|buscar)\b.{0,18}\bclientes?\b|\b(ventas?|vender|comercializar|marketing|promocion|publicidad)\b/.test(texto);
  const seguimientoVentas = historial.some((mensaje) => mensaje.role === 'user' && /\b(ventas?|vender|clientes|comercializar|marketing)\b/.test(normalizar(mensaje.content)));
  const respuestaCubreMercados = /\b(ferias|ruedas de negocios|exportar|acceso a mercados|mercados nacionales|mercados internacionales)\b/.test(texto);
  if ((temaVentas || (seguimientoVentas && detectarProducto(texto))) && !respuestaCubreMercados) {
    return respuestaVentas(pregunta, historial);
  }
  if (/\b(acceso a mercados|ferias|vender mis productos|mercados nacionales)\b/.test(texto)) {
    return {
      answer: 'SENPRENDE brinda apoyo técnico y vinculación para facilitar el acceso a mercados nacionales e internacionales. En su página menciona oportunidades de ferias comerciales, ruedas de negocios, networking y promoción. Revisa la página oficial para conocer las opciones publicadas.',
      sources: [{ title: 'Acceso a mercados de SENPRENDE', url: 'https://senprende.hn/acceso-mercados' }],
      needsAdvisor: false,
    };
  }
  if (/\b(crecer|crezc\w*|crecimiento|hacer crecer|aumentar ventas|vender mas|mas clientes|desarrollar mi negocio|impulsar mi negocio)\b/.test(texto)) {
    return {
      answer: '¡Claro! Para hacer crecer un negocio, SENPRENDE puede orientarte en varias áreas. Su asistencia técnica ofrece diagnósticos del negocio, asesoría personalizada, capacitación en mercadeo, ventas y finanzas, mejoras de producción y transformación digital. También puede vincularte con ferias, ruedas de negocios, networking y oportunidades de mercado. Para empezar, identifica qué te frena más hoy: ¿conseguir clientes, vender más, producir mejor o manejar las finanzas? Cuéntame un poco de tu negocio y te indico cuál de estas rutas parece más relacionada con lo que necesitas.',
      sources: [
        { title: 'Asistencia técnica y desarrollo empresarial', url: 'https://senprende.hn/asistencia-tecnica' },
        { title: 'Acceso a mercados', url: 'https://senprende.hn/acceso-mercados' },
        { title: 'Servicios de SENPRENDE', url: 'https://senprende.hn/' },
      ],
      needsAdvisor: false,
    };
  }
  if (/\b(mi empresa en linea|crear (mi )?empresa|constituir|formalizar|formalizacion)\b/.test(texto)) {
    return {
      answer: 'Mi Empresa en Línea es la plataforma que SENPRENDE enlaza para apoyar la creación y formalización de negocios en Honduras. La página de Formalización indica que la orientación para negocios mercantiles es simplificada y gratuita; desde allí puedes abrir Mi Empresa en Línea. Para acompañamiento personalizado, SENPRENDE ofrece asistencia técnica y formalización.',
      sources: [
        { title: 'Formalización de SENPRENDE', url: 'https://senprende.hn/formalizacion' },
        { title: 'Mi Empresa en Línea', url: 'https://miempresaenlinea.org/' },
      ],
      needsAdvisor: false,
    };
  }
  if (/\b(comercia|vender mis productos|tienda en linea|marketplace)\b/.test(texto)) {
    return {
      answer: 'Comercia es una plataforma de comercio electrónico para descubrir y vender productos hondureños. Su sitio indica que los emprendedores pueden registrar una tienda sin costo y publicar productos; puedes comenzar en “Registra tu tienda”.',
      sources: [
        { title: 'Comercia HN', url: 'https://comercia.hn/' },
        { title: 'Registrar tienda en Comercia', url: 'https://admin.comercia.hn/' },
      ],
      needsAdvisor: false,
    };
  }
  if (/\b(financiamiento|financiar|credito|prestamo|requisitos? para.*(credito|financiamiento))\b/.test(texto)) {
    return {
      answer: 'SENPRENDE vincula emprendimientos con productos financieros y aliados. Su sitio enumera Crédito MIPYME, Crédito Agrícola, Cadenas Productivas, Crédito Salud y Credi Mujer, entre otros. No publica una lista única de requisitos para todos esos productos: las condiciones dependen del programa y la entidad financiera. Para saber cuáles aplican a tu caso, habla directamente con un asesor.',
      sources: [{ title: 'Vinculación financiera de SENPRENDE', url: URL_FINANCIAMIENTO }],
      needsAdvisor: true,
    };
  }
  if (/\b(descargas|formatos|formularios|documentos oficiales)\b/.test(texto)) {
    return {
      answer: 'El Centro de Descargas de SENPRENDE publica formatos y requisitos, principalmente relacionados con organizaciones del Sector Social de la Economía y personería jurídica. Abre la página y selecciona el trámite correspondiente; para confirmar cuál aplica a tu organización, solicita orientación a un asesor.',
      sources: [{ title: 'Centro de Descargas de SENPRENDE', url: 'https://senprende.hn/descargas' }],
      needsAdvisor: false,
    };
  }
  return {
    answer: 'Con gusto te oriento. SENPRENDE brinda asistencia técnica, apoyo para formalizar negocios, vinculación financiera y acceso a mercados. Cuéntame qué haces y qué necesitas resolver; por ejemplo, conseguir clientes, mejorar ventas, formalizarte, encontrar una plataforma digital o conocer opciones de financiamiento. Te indicaré el servicio oficial más relacionado y, si tu pregunta depende de revisar tu solicitud, te paso con un asesor.',
    sources: [
      { title: 'Servicios y plataformas de SENPRENDE', url: 'https://senprende.hn/' },
      { title: 'Asistencia técnica', url: 'https://senprende.hn/asistencia-tecnica' },
    ],
    needsAdvisor: false,
  };
}

function textoSalida(respuesta) {
  if (typeof respuesta.output_text === 'string') return respuesta.output_text.trim();
  return (respuesta.output || [])
    .filter((item) => item.type === 'message')
    .flatMap((item) => item.content || [])
    .filter((item) => item.type === 'output_text')
    .map((item) => item.text || '')
    .join('\n')
    .trim();
}

function fuentesSalida(respuesta) {
  const fuentes = [];
  for (const elemento of respuesta.output || []) {
    for (const contenido of elemento.content || []) {
      for (const anotacion of contenido.annotations || []) {
        const url = anotacion.url;
        if (anotacion.type !== 'url_citation' || !url) continue;
        try {
          const dominio = new URL(url).hostname;
          if (!DOMINIOS_OFICIALES.some((permitido) => dominio === permitido || dominio.endsWith(`.${permitido}`))) continue;
          if (!fuentes.some((fuente) => fuente.url === url)) fuentes.push({ title: anotacion.title || dominio, url });
        } catch { /* ignora enlaces inválidos */ }
      }
    }
  }
  return fuentes;
}

async function responderWilliams({ pregunta, historial = [] }) {
  if (requiereAsesor(pregunta)) {
    return {
      answer: 'Las consultas sobre el estado, documentos, observaciones o revisión de tu expediente las atiende el personal responsable. ¿Quieres que deje esta conversación para un asesor? Compartiré el número de solicitud y lo que ya me contaste.',
      sources: [],
      needsAdvisor: true,
    };
  }

  if (!process.env.OPENAI_API_KEY) return respuestaSinIA(pregunta, historial);

  const mensajes = historial.slice(-8).map((mensaje) => ({
    role: mensaje.role === 'assistant' ? 'assistant' : 'user',
    content: String(mensaje.content || '').slice(0, 1200),
  }));
  mensajes.push({ role: 'user', content: pregunta });
  const cuerpo = {
    model: process.env.WILLIAMS_MODEL || 'gpt-5.5',
    reasoning: { effort: 'low' },
    tools: [{ type: 'web_search', filters: { allowed_domains: DOMINIOS_OFICIALES } }],
    include: ['web_search_call.action.sources'],
    input: [
      {
        role: 'developer',
        content: 'Eres Williams, el asistente virtual de SENPRENDE Honduras. Tu ámbito exclusivo es SENPRENDE, el emprendimiento y las MIPYME hondureñas, sus servicios y sus plataformas oficiales. Responde en español claro, amable y directo. Usa el historial para entender respuestas breves y no repitas una introducción genérica si ya conoces la necesidad. Cuando pregunten cómo vender o mejorar ventas, entrega de inmediato un plan práctico de 3 a 5 acciones, incluye un ejemplo de mensaje u oferta adaptable y termina con una sola pregunta concreta para personalizar el siguiente paso. Distingue tus consejos generales de los servicios oficiales de SENPRENDE. Para datos institucionales o programas, usa web_search y basa afirmaciones específicas solo en las fuentes oficiales permitidas; incluye enlaces consultados en sources. Puedes explicar asistencia técnica, formalización, vinculación financiera, acceso a mercados, Mi Empresa en Línea y Comercia. Cierra con una acción útil. Si una fuente oficial no confirma requisitos, costos, plazos o pasos exactos, dilo y no inventes. No predigas aprobación de créditos ni decisiones administrativas. Cualquier consulta sobre avance, documentos, observaciones, respuesta del revisor o situación de una solicitud debe transferirse al asesor; no intentes resolver el expediente. Si la pregunta no trata de SENPRENDE o emprendimiento hondureño, explica amablemente que solo puedes ayudar con esos temas. No solicites contraseñas ni datos personales sensibles.'
      },
      ...mensajes,
    ],
  };

  let respuesta;
  try {
    const http = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(45000),
    });
    respuesta = await http.json();
    if (!http.ok) throw new Error(respuesta?.error?.message || `API respondió ${http.status}`);
  } catch (error) {
    console.error('No fue posible consultar el asistente de Williams:', error.message);
    return respuestaSinIA(pregunta, historial);
  }

  const answer = textoSalida(respuesta);
  if (!answer) return respuestaSinIA(pregunta, historial);
  const sources = fuentesSalida(respuesta);
  return {
    answer,
    sources,
    needsAdvisor: /\b(habla|hablar|contacta|contactar|asesor|asesora)\b/i.test(answer) && /\b(requisito|financiamiento|cr[eé]dito|documento|caso)\b/i.test(pregunta),
  };
}

module.exports = { responderWilliams, requiereAsesor };

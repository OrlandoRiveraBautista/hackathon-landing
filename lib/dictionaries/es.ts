import type { Dictionary } from "./types";
import { getEventCopy } from "@/lib/event";

const event = getEventCopy("es");

const dictionary: Dictionary = {
  meta: {
    title: "Build Pa'l Norte — Hackathon de tecnología para jóvenes",
    description:
      "Un hackathon de 24 horas en Matamoros, 25–26 de julio de 2026. Programa, crea y compite — únete a la lista de espera de Build Pa'l Norte.",
  },
  brand: {
    organizedBy: "Organizado por",
    organizerNote:
      "Peseros pone las peseras de Matamoros en el mapa con rastreo en vivo — para pasajeros, choferes y dueños de rutas. Organizan Build Pa'l Norte para invertir en la próxima generación de creadores de la ciudad.",
  },
  nav: {
    about: "ACERCA",
    whyJoin: "VENTAJAS",
    howItWorks: "PROCESO",
    faq: "FAQ",
  },
  hero: {
    tagline: "un hackathon de tecnología de 24h para jóvenes",
    dates: event.heroDates,
    location: "Matamoros, Tamaulipas",
    waitlistLabel: "en la lista de espera",
    registerNow: "REGÍSTRATE AHORA",
  },
  about: {
    label: "LA MISIÓN",
    title: "Programa. Crea. Compite.",
    accentWord: "Compite.",
    subtitle:
      "Un hackathon de 24 horas en Matamoros donde jóvenes convierten ideas locas en prototipos que funcionan.",
    whatIsIt: "¿QUÉ ES?",
    whatIsItBody:
      "Build Pa'l Norte es un hackathon de tecnología lleno de energía en Matamoros, hecho para estudiantes y creadores jóvenes. En 24 horas, los equipos diseñan, programan y lanzan proyectos que resuelven problemas reales — con mentores, talleres y una comunidad que te apoya.",
    whoIsItFor: "¿PARA QUIÉN ES?",
    whoIsItForBody:
      "Ya sea tu primera línea de código o tu décimo hackathon, aquí tienes lugar. Desarrolladores, diseñadores, makers y soñadores — si tienes curiosidad y ganas de construir, apúntate a la lista de espera.",
    stats: [
      { value: "24H", label: "PARA CREAR", sublabel: event.statDateSublabel },
      { value: "0", label: "EN LA LISTA", source: "waitlist" },
      { value: "MATAMOROS", label: event.venueShort, compact: true },
    ],
  },
  highlights: {
    label: "POR QUÉ UNIRTE",
    title: "Más Que un Fin de Semana",
    accentWord: "Semana",
    subtitle:
      "Todo lo que necesitas para pasar de la idea al demo — y pasarla increíble en el camino.",
    featuredCta: "EMPIEZA A CONSTRUIR",
    learnMoreCta: "SABER MÁS",
    items: [
      {
        id: "ship",
        tag: "CONSTRUYE",
        title: "Lanza Algo Real",
        description:
          "De la hoja en blanco al demo en vivo. Apps, hardware, juegos, herramientas — si lo puedes imaginar, lo puedes construir.",
      },
      {
        id: "crew",
        tag: "TU TRIBU",
        title: "Encuentra Tu Equipo",
        description:
          "Ven solo o trae amigos. Te ayudamos a encontrar compañeros que complementen tus habilidades y tu energía.",
      },
      {
        id: "learn",
        tag: "SUBE DE NIVEL",
        title: "Aprende de Expertos",
        description:
          "Mentores de la industria dan talleres de diseño, APIs, pitch y más. Haz preguntas, resuelve bloqueos y sube de nivel.",
      },
      {
        id: "win",
        tag: "DESTACA",
        title: "Presenta y Destaca",
        description:
          "Muestra tu proyecto ante los jueces y la audiencia. Obtén reconocimiento por creatividad, ejecución e impacto — y el derecho a presumir.",
      },
    ],
  },
  howItWorks: {
    label: "EL FLUJO",
    title: "Cómo Funciona",
    accentWord: "Funciona",
    subtitle: "Cuatro pasos de curioso a competidor. Así de simple.",
    steps: [
      {
        step: "01",
        title: "Únete a la Lista de Espera",
        description:
          "Regístrate con tu nombre, correo y número de teléfono. Te avisamos en cuanto abra el registro — el evento es el 25–26 de julio, 10 AM a 10 AM.",
      },
      {
        step: "02",
        title: "Forma Tu Equipo",
        description:
          "Regístrate solo o con hasta 4 compañeros. Hacemos matching de equipos para quien venga sin crew.",
      },
      {
        step: "03",
        title: "Construye a Toda Máquina",
        description:
          "24 horas de hacking, talleres, comida y cafeína. Los mentores recorren el espacio para ayudarte a desbloquearte.",
      },
      {
        step: "04",
        title: "Demo y Celebración",
        description:
          "Presenta tu proyecto ante jueces y público. Los mejores proyectos se reconocen, aplausos garantizados y nuevos amigos hechos.",
      },
    ],
  },
  faq: {
    label: "PREGUNTAS",
    title: "¿Tienes Dudas?",
    accentWord: "Dudas?",
    subtitle: "Tenemos respuestas. ¿Aún con dudas?",
    items: [
      {
        question: "¿Hay límite de edad?",
        answer:
          "No. Build Pa'l Norte está abierto para todos — todas las edades son bienvenidas. Ya seas estudiante, profesional o simplemente tengas curiosidad por la tecnología, puedes unirte.",
      },
      {
        question: "¿Necesito experiencia para unirme?",
        answer:
          "Para nada. Los que es su primera vez son bienvenidos. Lo que importa es la curiosidad y las ganas de aprender. Habrá mentores para ayudarte.",
      },
      {
        question: "¿Es gratis?",
        answer:
          "Sí — la participación es gratuita. Comida, swag y buena vibra incluidos. Solo trae tu laptop, cargador e ideas.",
      },
      {
        question: "¿Puedo participar solo?",
        answer:
          "Claro. Los hackers solitarios son bienvenidos, y te ayudamos a encontrar equipo durante el registro si prefieres colaborar.",
      },
      {
        question: "¿Qué debería construir?",
        answer:
          "¡Lo que sea! Apps web, móviles, hardware, juegos, herramientas de IA, proyectos de impacto social — si lo construyes durante el evento, cuenta.",
      },
      {
        question: "¿Cuándo y dónde es el evento?",
        answer: event.faqWhenWhere,
      },
    ],
  },
  cta: {
    label: "NO TE LO PIERDAS",
    title: "¿Listo para construir pa'l norte?",
    subtitle:
      "25–26 de julio en Matamoros. Deja tu nombre en la lista de espera y te contactamos cuando abra el registro.",
    button: "ÚNETE A LA LISTA",
    urgencyBadge: "LUGARES SE AGOTAN",
    socialProof: "Constructores ya registrados — únete",
    footnote: "Gratis · Sin tarjeta de crédito · Solo trae tus ideas",
  },
  perks: {
    label: "LO QUE INCLUYE",
    title: "Todo Incluido",
    accentWord: "Incluido",
    subtitle:
      "Cero costo. Máximo valor. Llega y nosotros nos encargamos del resto.",
    featuredNote: "INCLUIDO PARA TODOS LOS PARTICIPANTES",
    bottomCallout: "GRATIS · TODO INCLUIDO · SIN COMPROMISOS",
    items: [
      {
        id: "food",
        title: "Comida y Bebidas",
        body: "Combustible para 24 horas. Comidas, snacks y café — todo incluido. Solo trae el apetito.",
      },
      {
        id: "wifi",
        title: "WiFi de Alta Velocidad",
        body: "Tenemos la infraestructura. Tú enfócate en construir, no en problemas de conexión.",
      },
      {
        id: "mentors",
        title: "Mentores Expertos",
        body: "Constructores de la industria recorren el espacio listos para ayudarte con diseño, código o pitch.",
      },
      {
        id: "workshops",
        title: "Talleres en Vivo",
        body: "Sesiones prácticas con herramientas reales — desde APIs hasta pensamiento de producto.",
      },
      {
        id: "teams",
        title: "Formación de Equipos",
        body: "¿Vienes solo? Te conectamos con compañeros que complementen tus habilidades.",
      },
      {
        id: "demo",
        title: "Día de Demos",
        body: "Presenta tu proyecto ante una audiencia. Recibe feedback, reconocimiento y aplausos.",
      },
      {
        id: "community",
        title: "Comunidad",
        body: "Sal con amistades reales, colaboradores y una red que dura más allá del evento.",
      },
      {
        id: "swag",
        title: "Swag",
        body: "Merch exclusivo de Build Pa'l Norte para cada participante. Presume lo que construiste.",
      },
    ],
  },
  ticker: {
    items: [
      "24 HORAS PARA CREAR",
      "25–26 JUL 2026",
      "10 AM – 10 AM",
      "GRATIS",
      "MENTORES EXPERTOS",
      "MATAMOROS 2026",
      "COMIDA INCLUIDA",
      "FORMA TU EQUIPO",
      "DÍA DE DEMOS",
      "TODOS LOS NIVELES",
      "TALLERES EN VIVO",
      "CONSTRUYE ALGO REAL",
      "SWAG PARA TODOS",
      "COMUNIDAD PRIMERO",
    ],
  },
  footer: {
    terms: "TÉRMINOS DE SERVICIO",
    privacy: "POLÍTICA DE PRIVACIDAD",
    contact: "CONTACTO",
    sponsor: "SER PATROCINADOR",
    copyright: "Hecho por jóvenes, para jóvenes.",
    eventHeading: "EVENTO",
    legalHeading: "LEGAL",
    rightsReserved: "Todos los derechos reservados.",
    locationTag: "MATAMOROS · TAMAULIPAS · 2026",
  },
  waitlist: {
    title: "REGISTRO DE PARTICIPANTES",
    subtitle: "Regístrate para participar en Build Pa'l Norte.",
    name: "NOMBRE",
    email: "CORREO",
    phone: "TELÉFONO",
    age: "EDAD",
    sex: "SEXO",
    school: "ESCUELA",
    github: "GITHUB",
    interests: "INTERESES",
    optional: "opcional",
    namePlaceholder: "Tu nombre",
    phonePlaceholder: "+52 868 123 4567",
    agePlaceholder: "18",
    schoolPlaceholder: "Tu escuela o universidad",
    githubPlaceholder: "usuario o URL de perfil",
    interestsPlaceholder: "Web, IA, diseño, hardware…",
    sexOptions: {
      male: "Masculino",
      female: "Femenino",
      other: "Otro",
      preferNotToSay: "Prefiero no decir",
    },
    sexPlaceholder: "Selecciona",
    join: "REGISTRARME",
    joining: "REGISTRANDO...",
    close: "CERRAR",
    successTitle: "¡Registro completado!",
    successDefault: event.waitlistSuccessDetail,
    successAlreadyTitle: "¡Ya estás en la lista!",
    successAlready:
      "Buenas noticias — ya te tenemos registrado para el 25–26 de julio. Te escribiremos en cuanto abra el registro con la sede y los siguientes pasos.",
    errors: {
      invalidName: "Por favor ingresa tu nombre.",
      invalidEmail: "Por favor ingresa un correo válido.",
      invalidPhone: "Por favor ingresa un número de teléfono válido.",
      invalidAge: "Debes tener 18 años o más para registrarte.",
      invalidSex: "Por favor selecciona tu sexo.",
      invalidGithub: "Por favor ingresa un usuario o URL de GitHub válido.",
      firestoreSetup:
        "Firestore aún no está configurado. Crea una base de datos en Firebase Console primero.",
      unavailable:
        "No se pudo conectar con Firestore. Revisa tu conexión e intenta de nuevo.",
      generic: "Algo salió mal. Por favor intenta de nuevo.",
    },
  },
  sponsor: {
    title: "REGISTRO DE PATROCINADORES",
    subtitle:
      "Únete como patrocinador y apoya a jóvenes constructores en Matamoros.",
    name: "NOMBRE",
    email: "CORREO",
    phone: "TELÉFONO",
    company: "EMPRESA",
    sponsorship: "¿QUÉ QUIERES PATROCINAR?",
    problem: "¿QUÉ PROBLEMA QUIERES VER RESUELTO?",
    workshop: "¿QUIERES DAR UN TALLER?",
    namePlaceholder: "Tu nombre",
    phonePlaceholder: "+52 868 123 4567",
    companyPlaceholder: "Empresa u organización",
    sponsorshipPlaceholder:
      "Efectivo, premios, swag, comida, créditos en la nube…",
    problemPlaceholder:
      "¿Qué reto o tema te gustaría que los participantes aborden?",
    workshopOptions: {
      yes: "Sí",
      no: "No",
    },
    workshopPlaceholder: "Selecciona",
    submit: "ENVIAR",
    submitting: "ENVIANDO...",
    close: "CERRAR",
    successTitle: "¡Gracias por tu interés!",
    successDefault:
      "Te contactaremos para hablar de los detalles del patrocinio.",
    successAlreadyTitle: "¡Ya tenemos tu información!",
    successAlready:
      "Parece que ya nos escribiste — estaremos en contacto pronto.",
    errors: {
      invalidName: "Por favor ingresa tu nombre.",
      invalidEmail: "Por favor ingresa un correo válido.",
      invalidPhone: "Por favor ingresa un número de teléfono válido.",
      invalidCompany: "Por favor ingresa el nombre de tu empresa.",
      invalidSponsorship: "Por favor describe qué te gustaría patrocinar.",
      invalidProblem:
        "Por favor describe el problema que quieres ver resuelto.",
      invalidWorkshop: "Por favor indica si quieres dar un taller.",
      firestoreSetup:
        "Firestore aún no está configurado. Crea una base de datos en Firebase Console primero.",
      unavailable:
        "No se pudo conectar con Firestore. Revisa tu conexión e intenta de nuevo.",
      generic: "Algo salió mal. Por favor intenta de nuevo.",
    },
  },
  sponsorsSection: {
    label: "PATROCINADORES",
    title: "Respaldados por los Mejores",
    accentWord: "Mejores",
    subtitle:
      "Build Pa'l Norte existe gracias al apoyo de negocios locales y personas que creen en los jóvenes creadores. Efectivo, comida, talleres, premios — todo suma.",
    cta: "SER PATROCINADOR",
    learnMore: "APRENDER MÁS",
    note: "Paquetes personalizados disponibles",
    perks: [
      { text: "Efectivo, comida o contribuciones en especie bienvenidas" },
      { text: "Da un taller de 60–90 min o una keynote" },
      { text: "Acceso directo a jóvenes talentosos y motivados" },
      { text: "Impacto real en la comunidad tech de Matamoros" },
    ],
  },
  sponsorsPage: {
    metaTitle: "Patrocina Build Pa'l Norte — Apoya a los jóvenes constructores",
    metaDescription:
      "Sé patrocinador de Build Pa'l Norte y apoya a la próxima generación de creadores tecnológicos en Matamoros. Dinero, comida, talleres, premios — todo suma.",
    label: "ÚNETE COMO SOCIO",
    title: "Patrocina el Futuro",
    accentWord: "Futuro",
    subtitle:
      "Ayúdanos a correr un hackathon gratuito y de calidad. Efectivo, comida, premios, créditos en la nube, talleres — cada contribución importa.",
    whyLabel: "POR QUÉ PATROCINAR",
    whyTitle: "Por Qué Importa",
    whySubtitle:
      "Tu apoyo hace que el evento sea gratuito para todos y pone recursos reales en manos de jóvenes creadores.",
    whyItems: [
      {
        title: "Visibilidad de Marca",
        body: "Tu logo en todo el swag, nuestro sitio web, pancartas del escenario y todas las comunicaciones del evento que llegan a cientos de jóvenes creadores.",
      },
      {
        title: "Talento Joven",
        body: "Conoce a desarrolladores, diseñadores y makers motivados antes de que entren al mercado laboral. Reclutamiento en la fuente.",
      },
      {
        title: "Da un Taller",
        body: "Dirige una sesión en vivo, muestra tu producto o plantea un reto a los participantes. Acceso directo y engagement real.",
      },
      {
        title: "Impacto Comunitario",
        body: "Matamoros está construyendo su ecosistema tech desde cero. Tu patrocinio hace posible un evento gratuito y de alta calidad.",
      },
    ],
    contributionsLabel: "CÓMO PUEDES AYUDAR",
    contributionsTitle: "Lo Que Necesitamos",
    contributionsSubtitle:
      "No solo buscamos efectivo. Si puedes cubrir cualquiera de estas cosas, eres patrocinador — escríbenos y lo resolvemos juntos.",
    coveredLabel: "Cubierto por",
    contributions: [
      {
        id: "venue",
        category: "Lugar",
        examples: "Renta de espacio para el evento",
        who: "Universidades, coworks",
      },
      {
        id: "food",
        category: "Comida",
        examples: "Comida completa para todos los participantes",
        who: "Restaurantes, catering",
      },
      {
        id: "dinner",
        category: "Cena",
        examples: "Pizzas (30+), tacos, catering",
        who: "Pizzerías, restaurantes locales",
      },
      {
        id: "night-snacks",
        category: "Snacks nocturnos",
        examples: "Papas, dulces, bebidas energéticas",
        who: "Tiendas, marcas",
      },
      {
        id: "breakfast",
        category: "Desayuno",
        examples: "Café, pan, fruta",
        who: "Cafeterías, panaderías",
      },
      {
        id: "beverages",
        category: "Bebidas",
        examples: "Agua, refrescos",
        who: "Distribuidores, tiendas",
      },
      {
        id: "prizes",
        category: "Premios",
        examples: "Efectivo, gadgets, créditos",
        who: "Empresas industriales, tech",
      },
      {
        id: "branding",
        category: "Branding",
        examples: "Lonas, stickers, impresión",
        who: "Imprentas, agencias",
      },
      {
        id: "tech-av",
        category: "Técnico y AV",
        examples: "Extensiones, internet, bocinas",
        who: "Empresas IT, sedes",
      },
      {
        id: "marketing",
        category: "Marketing",
        examples: "Ads, redes sociales",
        who: "Agencias, organizadores",
      },
      {
        id: "media",
        category: "Medios",
        examples: "Fotografía y video del evento",
        who: "Estudiantes, agencias",
      },
      {
        id: "workshop",
        category: "Taller",
        examples: "Dirige una sesión de 60–90 min",
        who: "Empresas, profesionales",
      },
    ],
    workshopsLabel: "DA UN TALLER",
    workshopsTitle: "Trae un Taller",
    workshopsSubtitle:
      "Aún no tenemos talleres confirmados — ahí es donde entras tú. Patrocina una sesión de 60–90 minutos que ayude a los participantes a construir algo real, no a escuchar una clase.",
    workshopsCallout:
      "Los talleres están abiertos. Si tu empresa tiene expertise que compartir, nos encantaría ponerte frente a los constructores.",
    workshopIdeasLabel: "TEMAS DE EJEMPLO QUE NOS ENCANTARÍA VER",
    workshopExampleTag: "IDEA",
    idealForLabel: "Para:",
    speakersLabel: "Quién podría darlo:",
    workshopsHostCta:
      "¿Quieres dar un taller? Cuéntanos tu idea — lo hacemos realidad.",
    workshops: [
      {
        id: "ai-agents",
        title: "Building with AI Agents",
        theme: "Cómo construir agentes de IA que ejecuten tareas reales",
        topics: [
          "Qué es un agente",
          "MCPs",
          "RAG",
          "Automatización",
          "Casos de uso empresariales",
        ],
        idealFor: "Todos los tracks",
        speakers: "Consultores de IA, fundadores SaaS, profesores de CS",
      },
      {
        id: "mvp",
        title: "From Idea to MVP in 24 Hours",
        theme: "Cómo validar una idea y convertirla en un prototipo funcional",
        topics: [
          "Definir el problema",
          "Alcance realista",
          "Priorización",
          "Cómo ganar un hackathon",
        ],
        idealFor: "Equipos nuevos",
        speakers: "Emprendedores, fundadores de startups, incubadoras",
      },
      {
        id: "nearshoring",
        title: "Nearshoring Opportunities in Northern Mexico",
        theme: "Problemas reales que existen hoy en la industria",
        topics: [
          "Nearshoring",
          "Manufactura",
          "Supply Chain",
          "Oportunidades regionales",
        ],
        idealFor: "Enterprise, Smart Border Cities",
        speakers: "INDEX Nacional, INDEX Matamoros, COPARMEX",
      },
      {
        id: "logistics",
        title: "Logistics & Cross-Border Commerce",
        theme: "Cómo funciona realmente la logística fronteriza",
        topics: [
          "Carta Porte",
          "Aduanas",
          "Transporte",
          "Cruces internacionales",
        ],
        idealFor: "Enterprise",
        speakers: "Agencias aduanales, empresas transportistas, forwarders",
      },
      {
        id: "ux",
        title: "Rapid UI/UX for Hackathons",
        theme: "Diseñar rápido sin perder calidad",
        topics: ["Figma", "Wireframes", "MVP UX"],
        idealFor: "Diseñadores, developers",
        speakers: "Agencias locales, freelancers senior",
      },
      {
        id: "cloud",
        title: "Cloud Deployment in Under One Hour",
        theme: "Cómo desplegar rápido",
        topics: ["VPS", "Docker", "CI/CD básico"],
        idealFor: "Todos",
        speakers: "Empresas de hosting, ingenieros DevOps",
      },
      {
        id: "pitch",
        title: "Pitching Like a Startup",
        theme: "Cómo presentar un proyecto",
        topics: [
          "Storytelling",
          "Demo en vivo",
          "Cómo impresionar a los jueces",
        ],
        idealFor: "Todos",
        speakers: "Emprendedores, inversionistas, aceleradoras",
      },
      {
        id: "security",
        title: "Cybersecurity for Modern Applications",
        theme: "Seguridad básica para aplicaciones",
        topics: ["OWASP", "APIs", "Seguridad de IA"],
        idealFor: "Track de IA, Enterprise",
        speakers: "Ingenieros de seguridad, consultores",
      },
    ],
    keynotesLabel: "IDEAS DE KEYNOTES",
    keynotesSubtitle:
      "Charlas cortas que nos encantaría que un patrocinador o líder de industria dé — aún no confirmadas.",
    keynotes: [
      {
        title: "Por Qué Importa el Nearshoring",
        description:
          "Un líder de la industria explica la oportunidad regional y qué pueden hacer los constructores.",
      },
      {
        title: "Construir Empresas desde la Frontera",
        description:
          "Un fundador exitoso de la región comparte lo que se necesita para construir desde Matamoros.",
      },
      {
        title: "El Futuro de la IA en los Negocios",
        description:
          "Un experto en IA explica hacia dónde va la industria y qué significa para los jóvenes constructores.",
      },
    ],
    ctaLabel: "¿LISTO PARA ASOCIARTE?",
    ctaTitle: "Construyamos Juntos",
    ctaSubtitle:
      "Cuéntanos qué quieres aportar — efectivo, comida, un taller, o algo más. Resolvemos los detalles juntos.",
    ctaButton: "SER PATROCINADOR",
    ctaNote: "Sin compromiso hasta que estés listo · Te contactamos en 48h",
    back: "← VOLVER",
  },
  login: {
    metaTitle: "Inicio de sesión — Build Pa'l Norte",
    metaDescription:
      "Inicia sesión con Google para acceder al portal de miembros de Build Pa'l Norte.",
    eyebrow: "MIEMBROS",
    title: "Inicia sesión",
    subtitle: "Usa tu cuenta de Google para abrir tu panel de miembro.",
    signingIn: "Iniciando sesión...",
    signInWithGoogle: "Iniciar sesión con Google",
    signInFailed: "No se pudo iniciar sesión con Google. Intenta de nuevo.",
    signedInAs: "Sesión iniciada como",
    signOut: "Cerrar sesión",
    signingOut: "Cerrando sesión...",
    signOutFailed: "No se pudo cerrar sesión. Intenta de nuevo.",
    notRegistered:
      "Esta cuenta de Google no está en la lista de espera. Únete primero y luego inicia sesión.",
    backToHome: "Volver al inicio",
  },
  members: {
    metaTitle: "Portal de miembros — Build Pa'l Norte",
    metaDescription:
      "Tu panel de miembro de Build Pa'l Norte para actualizaciones del hackathon e info de equipo.",
    eyebrow: "ACCESO DE MIEMBROS",
    title: "Bienvenido, Builder",
    subtitle:
      "Ya estás dentro. Asignaciones de equipo, horarios y actualizaciones aparecerán aquí conforme se acerque el evento.",
    signOut: "Cerrar sesión",
    signingOut: "Cerrando sesión...",
    signOutFailed: "No se pudo cerrar sesión. Intenta de nuevo.",
    backToHome: "Volver al inicio",
  },
  profile: {
    metaTitle: "Tu perfil — Build Pa'l Norte",
    metaDescription:
      "Consulta tu perfil de participante, datos de registro y estado en Build Pa'l Norte.",
    metaTitleMember: "{name} — Build Pa'l Norte",
    metaDescriptionMember:
      "Consulta el perfil de participante de {name} en Build Pa'l Norte.",
    eyebrow: "TU PERFIL",
    memberEyebrow: "PERFIL DE MIEMBRO",
    subtitle:
      "Este es tu perfil de participante. Actualiza tu GitHub, intereses y habilidades para que otros builders te encuentren. Las asignaciones de equipo y actualizaciones del evento aparecerán aquí conforme se acerque el 25 de julio.",
    statusPending: "REGISTRADO",
    statusContacted: "CONTACTADO",
    memberSince: "Miembro desde",
    signOut: "Cerrar sesión",
    signingOut: "Cerrando sesión...",
    signOutFailed: "No se pudo cerrar sesión. Intenta de nuevo.",
    backToHome: "← Volver al inicio",
    backToDirectory: "← Volver al directorio",
    editProfile: "Editar perfil",
    saveProfile: "Guardar cambios",
    savingProfile: "Guardando...",
    cancelEdit: "Cancelar",
    saveSuccess: "Perfil actualizado.",
    bio: "BIO",
    bioEmpty: "Sin bio todavía.",
    skills: "HABILIDADES",
    skillsEmpty: "Sin habilidades listadas.",
    school: "ESCUELA",
    schoolEmpty: "No especificado",
    interests: "INTERESES",
    interestsEmpty: "Sin intereses listados.",
    openToTeams: "Abierto a equipos",
    openToTeamsHint: "Muestra a otros builders que buscas compañeros de equipo.",
    notOpenToTeams: "No busca equipo",
    email: "CORREO",
    phone: "TELÉFONO",
    showEmail: "Mostrar correo públicamente",
    showEmailHint: "Permite que otros miembros vean tu correo en tu perfil público.",
    showPhone: "Mostrar teléfono públicamente",
    showPhoneHint: "Permite que otros miembros vean tu teléfono en tu perfil público.",
    contactVisibilitySection: "VISIBILIDAD DE CONTACTO",
    viewOnGithub: "Ver en GitHub",
    bioPlaceholder: "Cuéntales a otros qué estás construyendo o qué buscas...",
    skillsPlaceholder: "React, Python, diseño UI, hardware...",
    aboutSection: "ACERCA DE",
    detailsSection: "DETALLES",
    errors: {
      unauthorized: "Inicia sesión para actualizar tu perfil.",
      notFound: "Perfil no encontrado.",
      notRegistered: "Esta cuenta no está registrada para el evento.",
      invalidBody: "Solicitud inválida.",
      invalidGithub: "Ingresa un usuario o URL de GitHub válidos.",
      fieldTooLong: "Uno de los campos es demasiado largo.",
      invalidSkills: "Las habilidades deben ser una lista de etiquetas cortas.",
      generic: "Algo salió mal. Intenta de nuevo.",
      saveFailed: "No se pudo guardar tu perfil. Intenta de nuevo.",
    },
  },
  legal: {
    back: "← VOLVER",
    label: "LEGAL",
    lastUpdated: "5 de junio de 2026",
    terms: {
      metaTitle: "Términos de Servicio — Build Pa'l Norte",
      metaDescription:
        "Términos de servicio para participantes del hackathon Build Pa'l Norte.",
      title: "Términos de Servicio",
      sections: [
        {
          title: "1. Acuerdo",
          blocks: [
            {
              type: "paragraph",
              text: "Al unirte a la lista de espera de Build Pa'l Norte, registrarte al evento o participar en actividades relacionadas, aceptas estos Términos de Servicio. Si no estás de acuerdo, no uses nuestros servicios ni asistas al evento.",
            },
          ],
        },
        {
          title: "2. Elegibilidad",
          blocks: [
            {
              type: "paragraph",
              text: "Build Pa'l Norte está abierto a participantes de todas las edades. Los menores de 18 deben contar con permiso de un padre o tutor legal. Los organizadores se reservan el derecho de negar o revocar la participación por violaciones a estos términos o al código de conducta.",
            },
          ],
        },
        {
          title: "3. Registro y Lista de Espera",
          blocks: [
            {
              type: "paragraph",
              text: "Enviar tu nombre, correo y número de teléfono a la lista de espera no garantiza un lugar en el evento. Los detalles de registro, incluyendo fechas, sede y capacidad, se comunicarán por separado. Aceptas proporcionar información veraz y mantener tus datos de contacto actualizados.",
            },
          ],
        },
        {
          title: "4. Código de Conducta",
          blocks: [
            {
              type: "paragraph",
              text: "Se espera que todos los participantes, mentores, voluntarios y organizadores se traten con respeto. No se tolerará acoso, discriminación, discurso de odio, intimidación ni conducta disruptiva de ningún tipo, y puede resultar en expulsión inmediata del evento.",
            },
            {
              type: "paragraph",
              text: "Estamos comprometidos con un ambiente inclusivo donde todos — sin importar su origen, nivel de experiencia, género o identidad — se sientan bienvenidos a aprender y construir.",
            },
          ],
        },
        {
          title: "5. Propiedad Intelectual",
          blocks: [
            {
              type: "paragraph",
              text: "Conservas la propiedad de cualquier código, diseño y proyecto que crees durante el hackathon. Al participar en sesiones de demo o enviar proyectos a evaluación, otorgas a Build Pa'l Norte una licencia no exclusiva y libre de regalías para mostrar, fotografiar, grabar y compartir tu proyecto con fines promocionales y educativos.",
            },
          ],
        },
        {
          title: "6. Responsabilidad y Asunción de Riesgo",
          blocks: [
            {
              type: "paragraph",
              text: "La participación es bajo tu propio riesgo. Build Pa'l Norte y sus organizadores, patrocinadores y socios no son responsables por lesiones, pérdidas, robos o daños a propiedad personal que puedan ocurrir durante el evento. Eres responsable de tu propio equipo, incluyendo laptops y periféricos.",
            },
          ],
        },
        {
          title: "7. Fotografía y Medios",
          blocks: [
            {
              type: "paragraph",
              text: "El evento puede ser fotografiado y grabado. Al asistir, consientes el uso de tu imagen en fotos, videos y materiales promocionales relacionados con Build Pa'l Norte. Si prefieres no ser fotografiado, avisa a un organizador en el sitio.",
            },
          ],
        },
        {
          title: "8. Cambios y Cancelación",
          blocks: [
            {
              type: "paragraph",
              text: "Nos reservamos el derecho de modificar detalles del evento, horarios, sedes o estos términos en cualquier momento. En caso de cancelación o cambios significativos, haremos esfuerzos razonables por notificar a los participantes registrados al correo proporcionado al registrarse.",
            },
          ],
        },
        {
          title: "9. Contacto",
          blocks: [
            {
              type: "paragraph",
              text: "¿Preguntas sobre estos términos? Escríbenos a {email}.",
            },
          ],
        },
      ],
    },
    privacy: {
      metaTitle: "Política de Privacidad — Build Pa'l Norte",
      metaDescription:
        "Política de privacidad para la lista de espera y el evento Build Pa'l Norte.",
      title: "Política de Privacidad",
      sections: [
        {
          title: "1. Resumen",
          blocks: [
            {
              type: "paragraph",
              text: 'Build Pa\'l Norte ("nosotros") respeta tu privacidad. Esta política explica qué información recopilamos cuando te unes a nuestra lista de espera o participas en el evento, y cómo la usamos.',
            },
          ],
        },
        {
          title: "2. Información que Recopilamos",
          blocks: [
            {
              type: "paragraph",
              text: "Cuando te registras en la lista de espera, recopilamos:",
            },
            {
              type: "list",
              items: [
                "Tu nombre",
                "Tu correo electrónico",
                "Tu número de teléfono",
                "La fecha y hora de tu registro",
              ],
            },
            {
              type: "paragraph",
              text: "También podemos recopilar información adicional durante el registro, como detalles del equipo, preferencias alimentarias o contacto de emergencia, que se informará al momento de recopilarla.",
            },
          ],
        },
        {
          title: "3. Cómo Usamos Tu Información",
          blocks: [
            {
              type: "paragraph",
              text: "Usamos la información que recopilamos para:",
            },
            {
              type: "list",
              items: [
                "Notificarte cuando abra el registro",
                "Enviar actualizaciones del evento, horarios y anuncios importantes",
                "Gestionar tu participación y asignación de equipos",
                "Mejorar futuras ediciones del hackathon",
              ],
            },
            {
              type: "paragraph",
              text: "No venderemos tu información personal a terceros.",
            },
          ],
        },
        {
          title: "4. Almacenamiento de Datos",
          blocks: [
            {
              type: "paragraph",
              text: "Los datos de la lista de espera se almacenan de forma segura usando Firebase/Firestore. Tomamos medidas razonables para proteger tu información, pero ningún método de almacenamiento electrónico es 100% seguro.",
            },
          ],
        },
        {
          title: "5. Retención de Datos",
          blocks: [
            {
              type: "paragraph",
              text: "Conservamos tu información el tiempo necesario para operar el evento y comunicarnos con participantes. Si deseas que eliminemos tus datos de la lista de espera, contáctanos y los borraremos en un plazo razonable.",
            },
          ],
        },
        {
          title: "6. Tus Derechos",
          blocks: [
            {
              type: "paragraph",
              text: "Puedes solicitar acceso, corrección o eliminación de tus datos personales en cualquier momento escribiendo a {email}. Responderemos solicitudes legítimas en un plazo de 30 días.",
            },
          ],
        },
        {
          title: "7. Cookies y Analíticas",
          blocks: [
            {
              type: "paragraph",
              text: "Esta página puede usar analíticas básicas para entender el tráfico y mejorar la experiencia. Cualquier herramienta de analíticas se configurará para minimizar la recopilación de datos personales.",
            },
          ],
        },
        {
          title: "8. Cambios a Esta Política",
          blocks: [
            {
              type: "paragraph",
              text: 'Podemos actualizar esta política de privacidad de vez en cuando. La fecha de "Última actualización" al inicio de esta página reflejará cualquier cambio. El uso continuado de nuestros servicios después de los cambios constituye aceptación de la política actualizada.',
            },
          ],
        },
        {
          title: "9. Contacto",
          blocks: [
            {
              type: "paragraph",
              text: "¿Preguntas sobre privacidad? Escríbenos a {email}.",
            },
          ],
        },
      ],
    },
  },
};

export default dictionary;

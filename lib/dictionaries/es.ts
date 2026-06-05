import type { Dictionary } from "./types";

const dictionary: Dictionary = {
  meta: {
    title: "Build Pa'l Norte — Hackathon de tecnología para jóvenes",
    description:
      "Un hackathon de 24 horas en Matamoros para jóvenes. Programa, crea y compite — únete a la lista de espera de Build Pa'l Norte.",
  },
  nav: {
    about: "ACERCA DE",
    whyJoin: "POR QUÉ UNIRTE",
    howItWorks: "CÓMO FUNCIONA",
    faq: "PREGUNTAS",
  },
  hero: {
    tagline: "un hackathon de tecnología de 24h para jóvenes",
    location: "Matamoros, Tamaulipas",
    waitlistLabel: "en la lista de espera",
    registerNow: "REGÍSTRATE AHORA",
  },
  about: {
    label: "LA MISIÓN",
    title: "Programa. Crea. Compite.",
    subtitle:
      "Un hackathon de 24 horas en Matamoros donde jóvenes convierten ideas locas en prototipos que funcionan.",
    whatIsIt: "¿QUÉ ES?",
    whatIsItBody:
      "Build Pa'l Norte es un hackathon de tecnología lleno de energía en Matamoros, hecho para estudiantes y creadores jóvenes. En 24 horas, los equipos diseñan, programan y lanzan proyectos que resuelven problemas reales — con mentores, talleres y una comunidad que te apoya.",
    whoIsItFor: "¿PARA QUIÉN ES?",
    whoIsItForBody:
      "Ya sea tu primera línea de código o tu décimo hackathon, aquí tienes lugar. Desarrolladores, diseñadores, makers y soñadores — si tienes curiosidad y ganas de construir, apúntate a la lista de espera.",
    stats: [
      { value: "24H", label: "PARA CREAR" },
      { value: "0", label: "EN LA LISTA", source: "waitlist" },
      { value: "MATAMOROS", label: "TAMAULIPAS", compact: true },
    ],
  },
  highlights: {
    label: "POR QUÉ UNIRTE",
    title: "Más Que un Fin de Semana",
    subtitle:
      "Todo lo que necesitas para pasar de la idea al demo — y pasarla increíble en el camino.",
    items: [
      {
        id: "ship",
        title: "Lanza Algo Real",
        description:
          "De la hoja en blanco al demo en vivo. Apps, hardware, juegos, herramientas — si lo puedes imaginar, lo puedes construir.",
      },
      {
        id: "crew",
        title: "Encuentra Tu Equipo",
        description:
          "Ven solo o trae amigos. Te ayudamos a encontrar compañeros que complementen tus habilidades y tu energía.",
      },
      {
        id: "learn",
        title: "Aprende de Expertos",
        description:
          "Mentores de la industria dan talleres de diseño, APIs, pitch y más. Haz preguntas, resuelve bloqueos y sube de nivel.",
      },
      {
        id: "win",
        title: "Gana y Destaca",
        description:
          "Los mejores proyectos se llevan premios, swag y derecho a presumir. Los jueces buscan creatividad, ejecución e impacto.",
      },
    ],
  },
  howItWorks: {
    label: "EL FLUJO",
    title: "Cómo Funciona",
    subtitle: "Cuatro pasos de curioso a competidor. Así de simple.",
    steps: [
      {
        step: "01",
        title: "Únete a la Lista de Espera",
        description:
          "Regístrate con tu nombre y correo. Te avisamos en cuanto abra el registro y compartimos los detalles del evento.",
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
          "Presenta tu proyecto ante jueces y público. Se anuncian ganadores, se entregan premios y se hacen nuevos amigos.",
      },
    ],
  },
  faq: {
    label: "PREGUNTAS",
    title: "¿Tienes Dudas?",
    subtitle:
      "Tenemos respuestas. ¿Aún con dudas? Escríbenos a hello@buildpalnorte.com",
    items: [
      {
        question: "¿Qué edad necesito tener?",
        answer:
          "Build Pa'l Norte está pensado para jóvenes — normalmente de 14 a 25 años. Si estás fuera de ese rango y quieres participar, contáctanos y lo vemos juntos.",
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
        answer:
          "Build Pa'l Norte se lleva a cabo en Matamoros, Tamaulipas — un hackathon de 24 horas. Las fechas exactas se anunciarán pronto. Únete a la lista de espera para ser el primero en saber.",
      },
    ],
  },
  cta: {
    label: "NO TE LO PIERDAS",
    title: "¿Listo para construir pa'l norte?",
    subtitle:
      "Los lugares se van rápido. Deja tu nombre en la lista de espera y te contactamos cuando abran las puertas.",
    button: "ÚNETE A LA LISTA",
  },
  footer: {
    terms: "TÉRMINOS DE SERVICIO",
    privacy: "POLÍTICA DE PRIVACIDAD",
    contact: "CONTACTO",
    copyright: "Hecho por jóvenes, para jóvenes.",
  },
  waitlist: {
    title: "ÚNETE A LA LISTA",
    subtitle: "Sé el primero en saber cuando abra el registro.",
    name: "NOMBRE",
    email: "CORREO",
    namePlaceholder: "Tu nombre",
    join: "UNIRME A LA LISTA",
    joining: "REGISTRANDO...",
    close: "CERRAR",
    successTitle: "¡Estás en la lista!",
    successDefault: "Te contactaremos cuando abra el registro.",
    successAlready: "Ya estás registrado — estaremos en contacto.",
    errors: {
      invalidName: "Por favor ingresa tu nombre.",
      invalidEmail: "Por favor ingresa un correo válido.",
      firestoreSetup:
        "Firestore aún no está configurado. Crea una base de datos en Firebase Console primero.",
      unavailable:
        "No se pudo conectar con Firestore. Revisa tu conexión e intenta de nuevo.",
      generic: "Algo salió mal. Por favor intenta de nuevo.",
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
              text: "Build Pa'l Norte está dirigido a jóvenes, generalmente de 14 a 25 años. Los participantes menores de 18 deben contar con permiso de un padre o tutor legal. Los organizadores se reservan el derecho de verificar elegibilidad y negar o revocar la participación a su discreción.",
            },
          ],
        },
        {
          title: "3. Registro y Lista de Espera",
          blocks: [
            {
              type: "paragraph",
              text: "Enviar tu nombre y correo a la lista de espera no garantiza un lugar en el evento. Los detalles de registro, incluyendo fechas, sede y capacidad, se comunicarán por separado. Aceptas proporcionar información veraz y mantener tus datos de contacto actualizados.",
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

export interface ClassInfo {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  ageRange: string;
  schedule: {
    days: string;
    times: string[];
  };
  pricing: {
    monthly: string;
    inscription: string;
  };
  icon: string;
  color: string;
}

export const classes: ClassInfo[] = [
  {
    slug: 'mma-kids-a',
    name: 'MMA KIDS A',
    shortDescription: 'Programa de artes marciales mixtas para los más pequeños',
    fullDescription: 'Programa diseñado específicamente para introducir a los niños más pequeños al mundo de las artes marciales mixtas. Enfocado en disciplina, coordinación, respeto y diversión a través del ejercicio.',
    ageRange: '4 hasta 8 años de edad',
    schedule: {
      days: 'Lunes / Miércoles / Viernes',
      times: ['16:00 a 17:00 hrs']
    },
    pricing: {
      monthly: '$800',
      inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
    },
    icon: '🥋',
    color: 'bg-blue-600'
  },
  {
    slug: 'box-kids-b',
    name: 'BOX KIDS B',
    shortDescription: 'Boxeo para niños en etapa de crecimiento',
    fullDescription: 'Programa de boxeo mexicano adaptado para niños. Desarrolla coordinación, velocidad, reflejos y disciplina. Los niños aprenden técnicas fundamentales del boxeo en un ambiente seguro y divertido.',
    ageRange: '6 hasta 11 años de edad',
    schedule: {
      days: 'Lunes a Viernes',
      times: ['17:00 a 18:00 hrs']
    },
    pricing: {
      monthly: '$800',
      inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
    },
    icon: '🥊',
    color: 'bg-red-600'
  },
  {
    slug: 'mma-juvenil-a',
    name: 'MMA JUVENIL A',
    shortDescription: 'Artes marciales mixtas para jóvenes principiantes',
    fullDescription: 'Programa de MMA para jóvenes que integra striking, grappling y defensa personal. Enfocado en técnica, condición física y formación de carácter. Los estudiantes aprenden disciplina y respeto mientras desarrollan habilidades de combate.',
    ageRange: '12 hasta 15 años de edad',
    schedule: {
      days: 'Lunes / Miércoles / Viernes',
      times: ['18:00 a 19:00 hrs']
    },
    pricing: {
      monthly: '$800',
      inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
    },
    icon: '🥋',
    color: 'bg-purple-600'
  },
  {
    slug: 'mma-juvenil-b',
    name: 'MMA JUVENIL B',
    shortDescription: 'MMA avanzado para jóvenes competidores',
    fullDescription: 'Programa avanzado de MMA para jóvenes con experiencia. Incluye técnicas avanzadas de striking, wrestling, Brazilian Jiu-Jitsu y preparación para competencias amateur. Entrenamientos intensivos con enfoque en estrategia de combate.',
    ageRange: '15 hasta 17 años de edad',
    schedule: {
      days: 'Lunes / Miércoles / Viernes',
      times: ['19:00 a 20:00 hrs']
    },
    pricing: {
      monthly: '$800',
      inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
    },
    icon: '🥋',
    color: 'bg-indigo-600'
  },
  {
    slug: 'mma-adultos',
    name: 'MMA ADULTOS',
    shortDescription: 'Artes marciales mixtas para adultos de todos los niveles',
    fullDescription: 'Programa completo de MMA para adultos que combina técnicas de boxeo, Muay Thai, wrestling y Brazilian Jiu-Jitsu. Ideal tanto para principiantes como para peleadores avanzados. Incluye acondicionamiento físico intensivo, técnica de striking y grappling, y sparring controlado.',
    ageRange: '18 años de edad en adelante',
    schedule: {
      days: 'Lunes / Miércoles / Viernes',
      times: ['7:00 a 8:00 am', '9:00 a 10:30 am', '20:00 a 21:30 hrs']
    },
    pricing: {
      monthly: '$800',
      inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
    },
    icon: '🥋',
    color: 'bg-red-700'
  },
  {
    slug: 'muay-thai',
    name: 'MUAY THAI',
    shortDescription: 'El arte de las ocho extremidades',
    fullDescription: 'Muay Thai tradicional tailandés, conocido como "el arte de las ocho extremidades". Aprende técnicas de puños, codos, rodillas y patadas. Excelente para defensa personal, acondicionamiento cardiovascular y desarrollo de poder explosivo. Incluye trabajo de pads, clinch y sparring.',
    ageRange: '11 años de edad en adelante',
    schedule: {
      days: 'Martes / Jueves / Sábado',
      times: ['9:00 a 10:30 am (Sábado)', '19:00 a 20:00 hrs (Principiantes)', '20:00 a 21:30 hrs (Todos los niveles)']
    },
    pricing: {
      monthly: '$800',
      inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
    },
    icon: '🦵',
    color: 'bg-yellow-600'
  },
  {
    slug: 'bjj',
    name: 'BJJ (JIU JITSU BRASILEÑO)',
    shortDescription: 'El arte suave del combate en el suelo',
    fullDescription: 'Brazilian Jiu-Jitsu, arte marcial especializado en combate en el suelo y sumisiones. Aprende llaves, estrangulaciones, barridos y control posicional. Ideal para defensa personal ya que permite a personas más pequeñas defenderse de oponentes más grandes usando técnica y apalancamiento.',
    ageRange: '11 años de edad en adelante',
    schedule: {
      days: 'Martes y Jueves',
      times: ['7:00 a 8:30 am', '20:00 a 21:30 hrs']
    },
    pricing: {
      monthly: '$800',
      inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
    },
    icon: '🤼',
    color: 'bg-blue-700'
  },
  {
    slug: 'boxeo-mexicano',
    name: 'BOXEO MEXICANO',
    shortDescription: 'La noble arte de los puños',
    fullDescription: 'Boxeo mexicano tradicional, enfocado en técnica depurada, trabajo de pies, combinaciones rápidas y potencia. Desarrolla coordinación mano-ojo, velocidad, reflejos y acondicionamiento cardiovascular superior. Incluye trabajo de sombra, saco, pads y sparring técnico.',
    ageRange: '10 años de edad en adelante',
    schedule: {
      days: 'Lunes a Viernes',
      times: ['7:00 a 11:00 am', '18:00 a 22:00 hrs']
    },
    pricing: {
      monthly: '$800',
      inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
    },
    icon: '🥊',
    color: 'bg-green-600'
  },
  {
    slug: 'crossfit',
    name: 'CROSSFIT',
    shortDescription: 'Acondicionamiento funcional de alta intensidad',
    fullDescription: 'Programa de acondicionamiento físico funcional que combina levantamiento olímpico, gimnasia y ejercicios metabólicos. Diseñado para mejorar fuerza, resistencia, flexibilidad, velocidad y coordinación. Ideal como complemento para peleadores o para personas que buscan estar en forma física superior.',
    ageRange: '11 años de edad en adelante',
    schedule: {
      days: 'Lunes a Sábado',
      times: ['17:00 hrs', '18:00 hrs', '19:00 hrs', '20:00 hrs', '21:00 hrs']
    },
    pricing: {
      monthly: '$800',
      inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
    },
    icon: '💪',
    color: 'bg-orange-600'
  }
];
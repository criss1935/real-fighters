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
  imageUrl: string;
}

export const classes: ClassInfo[] = [
  {
    slug: 'mma-kids-a',
    name: 'MMA KIDS A',
    shortDescription: 'Artes marciales mixtas formativas para los más pequeños',
    fullDescription: 'Las artes marciales mixtas para niños combinan movimientos básicos de distintas disciplinas como boxeo, lucha y jiu jitsu. El enfoque es formativo y lúdico, desarrollando coordinación, equilibrio, fuerza básica y disciplina mediante juegos y ejercicios controlados, siempre en un entorno seguro y divertido.',
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
    color: 'bg-blue-600',
    imageUrl: 'https://t4.ftcdn.net/jpg/03/30/83/73/360_F_330837380_teXdp7be7qbhLYqrQbxXlA4QYkvqKAE4.jpg'
  },
  {
    slug: 'box-kids-b',
    name: 'BOX KIDS B',
    shortDescription: 'Boxeo enfocado en coordinación y disciplina',
    fullDescription: 'El boxeo es un arte marcial basado en el uso técnico de los puños, el movimiento de pies y la defensa. En niños y jóvenes, el entrenamiento se enfoca en coordinación, reflejos, disciplina y condición física, evitando el contacto agresivo. Se trabajan golpes básicos, desplazamientos, esquivas y control corporal, promoviendo seguridad, autocontrol y respeto.',
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
    color: 'bg-red-600',
    imageUrl: 'https://media.istockphoto.com/id/896799182/photo/little-boy-training-boxing-with-punching-bag.jpg?s=612x612&w=0&k=20&c=WwXJwtZ1gPlF-0D5mOCxS7uhvD1Yitdibyvy0RK1qTM='
  },
  {
    slug: 'mma-juvenil-a',
    name: 'MMA JUVENIL A',
    shortDescription: 'Fundamentos estructurados de artes marciales mixtas',
    fullDescription: 'El MMA juvenil introduce a los jóvenes en las artes marciales mixtas de forma estructurada. Se enseñan fundamentos de golpeo, derribos y control en el suelo, priorizando técnica, acondicionamiento físico y disciplina, sin exponerlos a riesgos innecesarios.',
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
    color: 'bg-purple-600',
    imageUrl: 'https://img.freepik.com/free-photo/male-fighter-action-leg-kicking_613910-11746.jpg?semt=ais_hybrid&w=740&q=80'
  },
  {
    slug: 'mma-juvenil-b',
    name: 'MMA JUVENIL B',
    shortDescription: 'Entrenamiento técnico y competitivo avanzado',
    fullDescription: 'Entrenamiento de MMA con enfoque más técnico y competitivo. Se profundiza en estrategia, combinaciones, lucha y grappling, mejorando resistencia, fuerza mental y preparación deportiva, siempre bajo supervisión y control.',
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
    color: 'bg-indigo-600',
    imageUrl: 'https://images8.alphacoders.com/746/thumb-1920-746423.jpg'
  },
  {
    slug: 'mma-adultos',
    name: 'MMA ADULTOS',
    shortDescription: 'Sistema completo de combate mixto',
    fullDescription: 'Las artes marciales mixtas integran distintas disciplinas de combate en un solo sistema. El entrenamiento para adultos combina boxeo, patadas, lucha y jiu jitsu, enfocándose en condición física, técnica, defensa personal y, para quien lo desea, preparación competitiva.',
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
    color: 'bg-red-700',
    imageUrl: 'https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1448248356.jpg?c=original&q=h_447,c_fill'
  },
  {
    slug: 'muay-thai',
    name: 'MUAY THAI',
    shortDescription: 'El arte de las ocho extremidades',
    fullDescription: 'Conocido como el arte de las ocho extremidades, el Muay Thai utiliza puños, codos, rodillas y piernas. El entrenamiento se enfoca en potencia, resistencia, técnica y fortaleza mental, desarrollando un cuerpo fuerte y disciplinado, ideal tanto para defensa personal como para competencia.',
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
    color: 'bg-yellow-600',
    imageUrl: 'https://images.unsplash.com/photo-1729673517080-44353fa68fe0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bXVheSUyMHRoYWl8ZW58MHx8MHx8fDA%3D  '
  },
  {
    slug: 'bjj',
    name: 'BJJ (JIU JITSU BRASILEÑO)',
    shortDescription: 'El arte del combate en el suelo',
    fullDescription: 'Arte marcial especializado en el combate en el suelo, basado en palancas, control y sumisiones. Permite que una persona de menor tamaño pueda defenderse y controlar a un oponente más grande, desarrollando técnica, estrategia, paciencia y control emocional.',
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
    color: 'bg-blue-700',
    imageUrl: 'https://media.istockphoto.com/id/1134128200/photo/brazilain-jiu-jitsu-bjj-fighters-in-training-sparing-open-x-guard.jpg?b=1&s=612x612&w=0&k=20&c=PEN8pGo2W2a5CsmXRTuBgoLN00J9oV98fJkqtcKZvno='
  },
  {
    slug: 'boxeo-mexicano',
    name: 'BOXEO MEXICANO',
    shortDescription: 'La noble arte de los puños',
    fullDescription: 'El boxeo es un arte marcial basado en el uso técnico de los puños, el movimiento de pies y la defensa. El entrenamiento se enfoca en coordinación, reflejos, disciplina y condición física. Se trabajan golpes básicos, desplazamientos, esquivas y control corporal, promoviendo seguridad, autocontrol y respeto.',
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
    color: 'bg-green-600',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOxsncZkqAz1M1KW_Kk9CoLjoer3Po2ah6Mw&s'
  },
  {
    slug: 'crossfit',
    name: 'CROSSFIT',
    shortDescription: 'Entrenamiento funcional de alta intensidad',
    fullDescription: 'Sistema de entrenamiento funcional de alta intensidad. Mejora fuerza, resistencia, movilidad y acondicionamiento general, siendo un excelente complemento para las artes marciales y la preparación física integral.',
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
    color: 'bg-orange-600',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvLz6zpVSIJCa0nNsWpciGKDA63m7mJDyjvA&s'
  }
];
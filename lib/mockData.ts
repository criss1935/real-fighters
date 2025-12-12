

export interface Fighter {
  id: number;
  name: string;
  nickname: string | null;
  height_cm: number;
  weight_kg: number;
  reach_cm: number;
  stance: string;
  division: string;
  gym: string;
  photo_url: string;
  is_active: boolean;
  record: {
    wins: number;
    losses: number;
    draws: number;
    no_contest: number;
  };
}

export interface Event {
  id: number;
  name: string;
  org: string;
  event_date: string;
  location: string;
}

export interface Fight {
  id: number;
  event_id: number;
  event_name: string;
  event_date: string;
  opponent: string;
  opponent_id: number;
  result: 'win' | 'loss' | 'draw' | 'nc';
  method: string;
  round: number;
  time: string;
}

export const mockFighters: Fighter[] = [
  {
    id: 1,
    name: "Carlos Méndez",
    nickname: "El Rayo",
    height_cm: 178,
    weight_kg: 70,
    reach_cm: 180,
    stance: "Orthodox",
    division: "Welterweight",
    gym: "Team Alpha",
    photo_url: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=400&fit=crop",
    is_active: true,
    record: { wins: 8, losses: 2, draws: 0, no_contest: 0 }
  },
  {
    id: 2,
    name: "Ana Torres",
    nickname: "La Tigresa",
    height_cm: 165,
    weight_kg: 57,
    reach_cm: 168,
    stance: "Southpaw",
    division: "Flyweight",
    gym: "Fight Academy",
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    is_active: true,
    record: { wins: 12, losses: 1, draws: 1, no_contest: 0 }
  },
  {
    id: 3,
    name: "Diego Ramírez",
    nickname: "The Bull",
    height_cm: 183,
    weight_kg: 84,
    reach_cm: 188,
    stance: "Orthodox",
    division: "Middleweight",
    gym: "Team Alpha",
    photo_url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
    is_active: true,
    record: { wins: 15, losses: 5, draws: 0, no_contest: 1 }
  },
  {
    id: 4,
    name: "Sofía Vargas",
    nickname: "Iron Fist",
    height_cm: 170,
    weight_kg: 61,
    reach_cm: 172,
    stance: "Orthodox",
    division: "Bantamweight",
    gym: "Warriors Gym",
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    is_active: true,
    record: { wins: 6, losses: 3, draws: 0, no_contest: 0 }
  },
  {
    id: 5,
    name: "Miguel Ángel Soto",
    nickname: "El Pantera",
    height_cm: 175,
    weight_kg: 77,
    reach_cm: 178,
    stance: "Southpaw",
    division: "Lightweight",
    gym: "Fight Academy",
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    is_active: true,
    record: { wins: 10, losses: 2, draws: 1, no_contest: 0 }
  },
  {
    id: 6,
    name: "Laura Gómez",
    nickname: null,
    height_cm: 168,
    weight_kg: 52,
    reach_cm: 165,
    stance: "Orthodox",
    division: "Strawweight",
    gym: "Warriors Gym",
    photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    is_active: false,
    record: { wins: 4, losses: 2, draws: 0, no_contest: 0 }
  }
];

export const mockEvents: Event[] = [
  {
    id: 1,
    name: "Noche de Campeones 15",
    org: "Fight Night México",
    event_date: "2024-12-15",
    location: "Arena Ciudad de México"
  },
  {
    id: 2,
    name: "Guerreros del Ring 8",
    org: "Warriors Championship",
    event_date: "2024-11-20",
    location: "Estadio Azteca"
  },
  {
    id: 3,
    name: "Combate Total 22",
    org: "MMA Nacional",
    event_date: "2024-10-05",
    location: "Palacio de los Deportes"
  },
  {
    id: 4,
    name: "Academia Showdown 3",
    org: "Academia Real Fighters",
    event_date: "2024-09-10",
    location: "Gimnasio Team Alpha"
  }
];

export const mockFights: { [fighterId: number]: Fight[] } = {
  1: [
    {
      id: 1,
      event_id: 1,
      event_name: "Noche de Campeones 15",
      event_date: "2024-12-15",
      opponent: "Roberto Silva",
      opponent_id: 99,
      result: "win",
      method: "TKO (Punches)",
      round: 2,
      time: "3:45"
    },
    {
      id: 2,
      event_id: 2,
      event_name: "Guerreros del Ring 8",
      event_date: "2024-11-20",
      opponent: "Juan Pérez",
      opponent_id: 98,
      result: "win",
      method: "Submission (RNC)",
      round: 1,
      time: "4:20"
    },
    {
      id: 3,
      event_id: 3,
      event_name: "Combate Total 22",
      event_date: "2024-10-05",
      opponent: "Luis Hernández",
      opponent_id: 97,
      result: "loss",
      method: "Decision (Unanimous)",
      round: 3,
      time: "5:00"
    }
  ],
  2: [
    {
      id: 4,
      event_id: 1,
      event_name: "Noche de Campeones 15",
      event_date: "2024-12-15",
      opponent: "María López",
      opponent_id: 96,
      result: "win",
      method: "Submission (Armbar)",
      round: 2,
      time: "2:15"
    }
  ]
};

export const mockEventFights = [
  {
    id: 1,
    fighter1: "Carlos Méndez",
    fighter1_id: 1,
    fighter2: "Roberto Silva",
    fighter2_id: 99,
    result: "Carlos Méndez",
    method: "TKO (Punches)",
    round: 2,
    time: "3:45"
  },
  {
    id: 2,
    fighter1: "Ana Torres",
    fighter1_id: 2,
    fighter2: "María López",
    fighter2_id: 96,
    result: "Ana Torres",
    method: "Submission (Armbar)",
    round: 2,
    time: "2:15"
  },
  {
    id: 3,
    fighter1: "Diego Ramírez",
    fighter1_id: 3,
    fighter2: "Pedro Morales",
    fighter2_id: 95,
    result: "Draw",
    method: "Decision (Split)",
    round: 3,
    time: "5:00"
  }
];
export type SkillStatus = 'practicing' | 'exploring' | 'dormant';

export interface Skill {
  id: string;
  name: string;
  group: string;
  level: 1 | 2 | 3 | 4 | 5;
  status: SkillStatus;
  note: string;
  evidence?: string;
}

export const skills: Skill[] = [
  { id: 'systems', name: 'systems thinking', group: 'engineering', level: 5, status: 'practicing', note: 'seeing boundaries, feedback loops and failure modes', evidence: 'distributed systems · infrastructure' },
  { id: 'cpp', name: 'C++', group: 'engineering', level: 4, status: 'practicing', note: 'language design, memory and performance', evidence: 'libstdc++ · GCC' },
  { id: 'writing', name: 'writing', group: 'craft', level: 2, status: 'practicing', note: 'making implicit thinking explicit' },
  { id: 'prototyping', name: 'prototyping', group: 'craft', level: 4, status: 'practicing', note: 'learning through small, real artifacts', evidence: 'hardware · games · tools' },
  { id: 'photography', name: 'photography', group: 'life', level: 2, status: 'exploring', note: 'attention, light and memory' },
  { id: 'reflection', name: 'reflection', group: 'life', level: 3, status: 'practicing', note: 'building a durable relationship with experience' },
];

export const skillGroups = ['engineering', 'craft', 'life'] as const;

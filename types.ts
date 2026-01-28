
export enum ObstacleStatus {
  NOT_STARTED = 'NOT_STARTED',
  CLEARED = 'CLEARED',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED'
}

export interface Obstacle {
  id: string;
  name: string;
  maxPoints: number;
}

export interface PenaltyType {
  id: string;
  name: string;
  points: number;
}

export interface Team {
  id: string;
  name: string;
  number: string;
  school: string;
}

export interface RaceSession {
  id: string;
  teamId: string;
  timestamp: number;
  startTime?: number;
  endTime?: number;
  duration?: number;
  timeouts: number;
  obstacles: Record<string, ObstacleStatus>;
  penalties: string[]; // List of penalty IDs
  teamPhoto?: string;
  robotPhoto?: string;
  notes?: string;
  isCompleted: boolean;
  finalScore: number;
}

export interface ScoringConfig {
  obstacles: Obstacle[];
  penalties: PenaltyType[];
  timeoutDeduction: number;
  pointsPerSecond?: number;
  basePoints: number;
}

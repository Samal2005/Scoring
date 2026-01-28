
import { ScoringConfig } from './types';

export const DEFAULT_CONFIG: ScoringConfig = {
  basePoints: 1000,
  timeoutDeduction: 50,
  obstacles: [
    { id: 'obs1', name: 'The Slalom', maxPoints: 100 },
    { id: 'obs2', name: 'Ramp Climb', maxPoints: 150 },
    { id: 'obs3', name: 'Precision Gap', maxPoints: 100 },
    { id: 'obs4', name: 'Heavy Lift', maxPoints: 200 },
    { id: 'obs5', name: 'Autonomous Zone', maxPoints: 300 }
  ],
  penalties: [
    { id: 'p1', name: 'Manual Reset', points: 100 },
    { id: 'p2', name: 'Boundary Violation', points: 50 },
    { id: 'p3', name: 'Safety Warning', points: 200 }
  ]
};

export const INITIAL_TEAMS = [
  { id: 'team-1', number: '101', name: 'CyberKnights', school: 'Tech Academy' },
  { id: 'team-2', number: '202', name: 'RoboRaptors', school: 'Lincoln High' },
  { id: 'team-3', number: '303', name: 'GearGrinders', school: 'Central Middle' }
];

export type FitnessGoal =
  | 'Weight Loss'
  | 'Muscle Gain'
  | 'General Wellness'
  | 'Endurance & Stamina'
  | 'Strength & Power';

export type WorkoutIntensity = 'Low' | 'Medium' | 'High';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type EquipmentOption =
  | 'No equipment (Bodyweight only)'
  | 'Dumbbells'
  | 'Home gym (Resistance bands, dumbbells, bench)'
  | 'Full commercial gym';

export interface User {
  id: string; // Unique User ID, used later for feedback lookup
  name: string;
  age: number;
  weight: number; // in kg
  goal: string;
  intensity: WorkoutIntensity;
  experience_level: ExperienceLevel;
  equipment: string;
  session_time: string; // e.g. "20 mins", "30 mins", "45 mins", "60 mins"
  createdAt?: string;
}

export interface PlanFeedback {
  feedback: string;
  timestamp: string;
}

export interface Plan {
  user_id: string;
  original_plan: string;
  updated_plan?: string | null;
  nutrition_tip: string;
  updatedAt: string;
  feedbackHistory?: PlanFeedback[];
}

export type ActivePage = 'home' | 'result' | 'admin';

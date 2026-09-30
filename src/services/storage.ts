import { User, Plan } from '../types/fitness.ts';

const USERS_STORAGE_KEY = 'fitbuddy_users_v1';
const PLANS_STORAGE_KEY = 'fitbuddy_plans_v1';

// Seed data to give college examiners & students an immediate populated view on first launch
const INITIAL_USERS: User[] = [
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    age: 22,
    weight: 74,
    goal: 'Muscle Gain',
    intensity: 'High',
    experience_level: 'Intermediate',
    equipment: 'Full commercial gym',
    session_time: '45 mins',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'user-sarah',
    name: 'Sarah Chen',
    age: 26,
    weight: 62,
    goal: 'Weight Loss',
    intensity: 'Medium',
    experience_level: 'Beginner',
    equipment: 'Dumbbells',
    session_time: '30 mins',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'user-marcus',
    name: 'Marcus Johnson',
    age: 21,
    weight: 80,
    goal: 'Endurance & Stamina',
    intensity: 'High',
    experience_level: 'Advanced',
    equipment: 'No equipment (Bodyweight only)',
    session_time: '60 mins',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const INITIAL_PLANS: Plan[] = [
  {
    user_id: 'user-alex',
    original_plan: `Day 1: Upper Body Hypertrophy
Warm-up: 5-10 mins shoulder mobility and dynamic arm swings.
Main Workout:
- Barbell Bench Press: 4 sets x 8-10 reps (90s rest)
- Bent-Over Barbell Rows: 4 sets x 8-10 reps (90s rest)
- Dumbbell Overhead Press: 3 sets x 10-12 reps (60s rest)
- Cable Lat Pulldowns: 3 sets x 10-12 reps (60s rest)
- Incline Dumbbell Bicep Curls: 3 sets x 12 reps (45s rest)
- Tricep Rope Pushdowns: 3 sets x 12 reps (45s rest)
Cooldown: 5 mins light chest and lat doorway stretches.

Day 2: Lower Body Power
Warm-up: 5-10 mins leg swings, hip circles, bodyweight squats.
Main Workout:
- Barbell Back Squats: 4 sets x 6-8 reps (2 mins rest)
- Romanian Deadlifts: 4 sets x 8-10 reps (90s rest)
- Walking Dumbbell Lunges: 3 sets x 12 reps per leg (60s rest)
- Standing Calf Raises: 4 sets x 15 reps (45s rest)
Cooldown: 5 mins hamstring, quad, and hip flexor static stretching.

Day 3: Active Recovery & Mobility
Warm-up: 5 mins easy walking.
Main Workout: 30 mins yoga flow, thoracic spine rotations, foam rolling.
Cooldown: 5 mins deep diaphragmatic breathing.

Day 4: Push Focus (Chest, Shoulders, Triceps)
Warm-up: 5-10 mins band pull-aparts and push-ups.
Main Workout:
- Incline Dumbbell Press: 4 sets x 8-10 reps (90s rest)
- Cable Chest Flyes: 3 sets x 12-15 reps (60s rest)
- Arnold Press: 3 sets x 10 reps (60s rest)
- Overhead Tricep Extension: 3 sets x 12 reps (45s rest)
Cooldown: 5 mins tricep and pec stretches.

Day 5: Pull Focus (Back, Rear Delts, Biceps)
Warm-up: 5-10 mins cat-cow stretches and band face-pulls.
Main Workout:
- Pull-ups or Lat Pulldowns: 4 sets x 8 reps (90s rest)
- Seated Cable Rows: 4 sets x 10 reps (90s rest)
- Face Pulls: 3 sets x 15 reps (45s rest)
- Hammer Curls: 3 sets x 12 reps (45s rest)
Cooldown: 5 mins upper back and bicep stretches.

Day 6: Legs & Core
Warm-up: 5-10 mins glute bridges and world's greatest stretch.
Main Workout:
- Leg Press: 4 sets x 10-12 reps (90s rest)
- Hamstring Curls: 3 sets x 12 reps (60s rest)
- Hanging Knee Raises: 3 sets x 15 reps (45s rest)
- Cable Woodchoppers: 3 sets x 12 reps each side (45s rest)
Cooldown: 5 mins lower back and glute stretches.

Day 7: Complete Rest & Regeneration
Warm-up: None required.
Main Workout: Full rest day. Optional gentle 20-min nature stroll.
Cooldown: Mindful hydration and muscle recovery.

Important Notes:
1. Progressive Overload: Add 1-2 kg or 1 rep each week once target range is reached.
2. Form: Prioritize strict technique over heavy loads to protect joints.
3. Hydration: Drink at least 3 liters of water daily, especially around training sessions.`,
    updated_plan: `Day 1: Upper Body Hypertrophy (Revised with extra arm volume)
Warm-up: 5-10 mins shoulder mobility and dynamic arm swings.
Main Workout:
- Barbell Bench Press: 4 sets x 8-10 reps (90s rest)
- Bent-Over Barbell Rows: 4 sets x 8-10 reps (90s rest)
- Dumbbell Overhead Press: 3 sets x 10 reps (60s rest)
- Cable Lat Pulldowns: 3 sets x 10-12 reps (60s rest)
- Incline Dumbbell Bicep Curls: 4 sets x 12 reps (SUPERSET with dips, 45s rest)
- Parallel Bar Dips / Tricep Pushdowns: 4 sets x 12 reps (45s rest)
Cooldown: 5 mins light chest, lat, and arm stretches.

Day 2: Lower Body Power
Warm-up: 5-10 mins leg swings, hip circles, bodyweight squats.
Main Workout:
- Barbell Back Squats: 4 sets x 6-8 reps (2 mins rest)
- Romanian Deadlifts: 4 sets x 8-10 reps (90s rest)
- Walking Dumbbell Lunges: 3 sets x 12 reps per leg (60s rest)
- Standing Calf Raises: 4 sets x 15 reps (45s rest)
Cooldown: 5 mins hamstring, quad, and hip flexor static stretching.

Day 3: Active Recovery & Mobility
Warm-up: 5 mins easy walking.
Main Workout: 30 mins mobility work, foam rolling, and light core activation.
Cooldown: 5 mins deep diaphragmatic breathing.

Day 4: Push Focus (Chest, Shoulders, Triceps)
Warm-up: 5-10 mins band pull-aparts and push-ups.
Main Workout:
- Incline Dumbbell Press: 4 sets x 8-10 reps (90s rest)
- Cable Chest Flyes: 3 sets x 12-15 reps (60s rest)
- Arnold Press: 3 sets x 10 reps (60s rest)
- Skull Crushers: 4 sets x 10-12 reps (45s rest)
Cooldown: 5 mins tricep and pec stretches.

Day 5: Pull Focus (Back, Rear Delts, Biceps)
Warm-up: 5-10 mins cat-cow stretches and band face-pulls.
Main Workout:
- Pull-ups or Lat Pulldowns: 4 sets x 8 reps (90s rest)
- Seated Cable Rows: 4 sets x 10 reps (90s rest)
- Barbell Preacher Curls: 4 sets x 10 reps (45s rest)
- Face Pulls: 3 sets x 15 reps (45s rest)
Cooldown: 5 mins upper back and bicep stretches.

Day 6: Legs & Core
Warm-up: 5-10 mins glute bridges.
Main Workout:
- Leg Press: 4 sets x 10-12 reps (90s rest)
- Hamstring Curls: 3 sets x 12 reps (60s rest)
- Hanging Knee Raises: 3 sets x 15 reps (45s rest)
Cooldown: 5 mins glute and lower back stretches.

Day 7: Complete Rest & Regeneration
Full rest day.

Important Notes:
1. Progressive Overload: Aim to increase weights incrementally while maintaining perfect tempo.
2. Form: Keep elbows tucked at 45 degrees on presses and avoid swinging on curls.
3. Hydration: Maintain consistent water and electrolyte intake throughout the day.`,
    nutrition_tip: `Aim for 1.8g to 2.0g of protein per kg of body weight (approx. 135-150g daily for your 74kg frame), distributed across 3-4 meals to maximize muscle protein synthesis.`,
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    feedbackHistory: [
      {
        feedback: 'Please add more focus on arms (biceps and triceps) on upper body days.',
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
    ],
  },
  {
    user_id: 'user-sarah',
    original_plan: `Day 1: Full Body HIIT & Dumbbell Circuit
Warm-up: 5-10 mins jumping jacks, arm circles, high knees.
Main Workout:
- Dumbbell Goblet Squats: 3 sets x 12 reps (45s rest)
- Dumbbell Floor Press: 3 sets x 12 reps (45s rest)
- Dumbbell Bent-Over Rows: 3 sets x 12 reps (45s rest)
- Mountain Climbers: 3 sets x 30 seconds (30s rest)
Cooldown: 5 mins full body yoga cooldown.

Day 2: Low-Impact Cardio & Core
Warm-up: 5 mins brisk walk in place.
Main Workout:
- Shadow Boxing: 3 rounds x 2 mins (60s rest)
- Glute Bridges: 3 sets x 15 reps (30s rest)
- Dead Bugs: 3 sets x 12 reps per side (30s rest)
- Plank: 3 sets x 30-45 seconds (45s rest)
Cooldown: 5 mins child's pose and cobra stretch.

Day 3: Active Rest
Warm-up: 5 mins gentle neck and shoulder circles.
Main Workout: 30 mins brisk outdoor walking.
Cooldown: 5 mins hamstring and calf stretching.

Day 4: Lower Body Tone & Conditioning
Warm-up: 5 mins bodyweight squats and hip openers.
Main Workout:
- Dumbbell Romanian Deadlifts: 3 sets x 12 reps (45s rest)
- Static Lunges: 3 sets x 10 reps each leg (45s rest)
- Bodyweight Calf Raises: 3 sets x 20 reps (30s rest)
- Russian Twists: 3 sets x 20 reps total (30s rest)
Cooldown: 5 mins quad and hip stretches.

Day 5: Upper Body Sculpt & Cardio Intervals
Warm-up: 5 mins shoulder rolls and jumping jacks.
Main Workout:
- Dumbbell Overhead Press: 3 sets x 10 reps (45s rest)
- Dumbbell Bicep Curl to Press: 3 sets x 10 reps (45s rest)
- Tricep Kickbacks: 3 sets x 12 reps (30s rest)
- High Knees: 3 sets x 30 seconds (45s rest)
Cooldown: 5 mins upper body stretch.

Day 6: Core & Flexibility Circuit
Warm-up: 5 mins cat-cow and bird-dog.
Main Workout:
- Bird-Dogs: 3 sets x 12 reps per side (30s rest)
- Side Plank: 3 sets x 20s each side (30s rest)
- Bicycle Crunches: 3 sets x 15 reps per side (30s rest)
Cooldown: 5 mins deep stretching.

Day 7: Full Rest
Rest, restore, and replenish.

Important Notes:
1. Progressive Overload: Add 1-2 reps per set as fitness builds.
2. Proper Form: Focus on steady breathing and core engagement.
3. Hydration: Drink a glass of water first thing every morning and sip during workouts.`,
    updated_plan: null,
    nutrition_tip: `Keep meals rich in fiber and lean protein to stay full longer while maintaining a modest 300-500 calorie deficit.`,
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

/**
 * Initializes localStorage with sample data if empty
 */
function ensureStorageInitialized(): void {
  if (typeof window === 'undefined') return;

  try {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    }

    const existingPlans = localStorage.getItem(PLANS_STORAGE_KEY);
    if (!existingPlans) {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(INITIAL_PLANS));
    }
  } catch (e) {
    console.warn('LocalStorage error while initializing seed data:', e);
  }
}

/**
 * Save a user to localStorage.
 * If a User ID already exists, update that user instead of duplicating.
 */
export function saveUser(user: User): void {
  ensureStorageInitialized();
  try {
    const users = getAllUsers();
    const existingIndex = users.findIndex((u) => u.id.trim().toLowerCase() === user.id.trim().toLowerCase());

    const cleanUser: User = {
      ...user,
      id: user.id.trim(),
      createdAt: user.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      users[existingIndex] = {
        ...cleanUser,
        createdAt: users[existingIndex].createdAt || cleanUser.createdAt,
      };
    } else {
      users.unshift(cleanUser);
    }

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save user in storage:', e);
  }
}

/**
 * Get a user by ID
 */
export function getUser(userId: string): User | null {
  ensureStorageInitialized();
  try {
    const users = getAllUsers();
    const cleanId = userId.trim().toLowerCase();
    const user = users.find((u) => u.id.trim().toLowerCase() === cleanId);
    return user || null;
  } catch (e) {
    console.error('Failed to get user:', e);
    return null;
  }
}

/**
 * Get all users
 */
export function getAllUsers(): User[] {
  ensureStorageInitialized();
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as User[];
  } catch (e) {
    console.error('Failed to parse users:', e);
    return [];
  }
}

/**
 * Delete a user and their associated plan
 */
export function deleteUser(userId: string): void {
  ensureStorageInitialized();
  try {
    const cleanId = userId.trim().toLowerCase();
    const users = getAllUsers().filter((u) => u.id.trim().toLowerCase() !== cleanId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const plans = getAllPlans().filter((p) => p.user_id.trim().toLowerCase() !== cleanId);
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to delete user:', e);
  }
}

/**
 * Save a new plan
 */
export function savePlan(plan: Plan): void {
  ensureStorageInitialized();
  try {
    const plans = getAllPlans();
    const cleanUserId = plan.user_id.trim();
    const index = plans.findIndex((p) => p.user_id.trim().toLowerCase() === cleanUserId.toLowerCase());

    const cleanPlan: Plan = {
      ...plan,
      user_id: cleanUserId,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      plans[index] = cleanPlan;
    } else {
      plans.unshift(cleanPlan);
    }

    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save plan:', e);
  }
}

/**
 * Update an existing plan with revised content from user feedback
 * Stores updated_plan separately so both versions are preserved!
 */
export function updatePlan(
  userId: string,
  updatedPlan: string,
  newNutritionTip?: string,
  feedbackText?: string
): Plan | null {
  ensureStorageInitialized();
  try {
    const plans = getAllPlans();
    const cleanUserId = userId.trim().toLowerCase();
    const index = plans.findIndex((p) => p.user_id.trim().toLowerCase() === cleanUserId);

    if (index === -1) {
      return null;
    }

    const current = plans[index];
    const history = current.feedbackHistory || [];
    if (feedbackText) {
      history.push({
        feedback: feedbackText,
        timestamp: new Date().toISOString(),
      });
    }

    const revised: Plan = {
      ...current,
      updated_plan: updatedPlan,
      nutrition_tip: newNutritionTip || current.nutrition_tip,
      updatedAt: new Date().toISOString(),
      feedbackHistory: history,
    };

    plans[index] = revised;
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    return revised;
  } catch (e) {
    console.error('Failed to update plan:', e);
    return null;
  }
}

/**
 * Get plan for a user
 */
export function getPlan(userId: string): Plan | null {
  ensureStorageInitialized();
  try {
    const plans = getAllPlans();
    const cleanUserId = userId.trim().toLowerCase();
    const found = plans.find((p) => p.user_id.trim().toLowerCase() === cleanUserId);
    return found || null;
  } catch (e) {
    console.error('Failed to get plan:', e);
    return null;
  }
}

/**
 * Get the original plan for a user ID
 */
export function getOriginalPlan(userId: string): string | null {
  const plan = getPlan(userId);
  return plan ? plan.original_plan : null;
}

/**
 * Get all plans
 */
export function getAllPlans(): Plan[] {
  ensureStorageInitialized();
  try {
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Plan[];
  } catch (e) {
    console.error('Failed to parse plans:', e);
    return [];
  }
}

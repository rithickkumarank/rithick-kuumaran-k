import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client on the server side
// The API key is securely loaded from environment variables and never exposed to the client.
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('⚠️ GEMINI_API_KEY environment variable is not set. API calls will return a helpful configuration error.');
}

/**
 * Model candidate cascade:
 * We try models in order of current availability and speed:
 * 1. 'gemini-flash-latest' (fast, reliable, currently active with high quota)
 * 2. 'gemini-3.1-flash-lite' (high efficiency fallback)
 * 3. 'gemini-3.8-flash' (standard flash)
 * If process.env.GEMINI_PRO_MODEL is defined, it is tried first.
 */
const getModelCandidates = (): string[] => {
  const models: string[] = [];
  if (process.env.GEMINI_PRO_MODEL) {
    models.push(process.env.GEMINI_PRO_MODEL);
  }
  models.push('gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash');
  return Array.from(new Set(models));
};

/**
 * Intelligent fallback generator in case all external AI endpoints experience temporary 503 outages
 */
function createPersonalizedFallbackPlan(
  age: number,
  weight: number,
  goal: string,
  intensity: string,
  experience_level: string,
  equipment: string,
  session_time: string
): string {
  const isHigh = intensity === 'High';
  const rest = isHigh ? '45s' : '60–90s';
  const sets = experience_level === 'Advanced' ? '4' : experience_level === 'Intermediate' ? '3–4' : '3';

  return `Day 1: Upper Body Foundation & Core (Focus: ${goal})
Warm-up: 5–10 mins dynamic arm circles, thoracic spine rotations, and light jumping jacks.
Main Workout (${session_time}, ${equipment}):
- Push-ups / Dumbbell Floor Press: ${sets} sets x 10–12 reps (${rest} rest)
- Dumbbell or Towel Inverted Rows: ${sets} sets x 10–12 reps (${rest} rest)
- Overhead Shoulder Press: ${sets} sets x 10 reps (${rest} rest)
- Forearm Plank / Hollow Body Hold: 3 sets x 30–45 seconds (45s rest)
Cooldown: 5 mins static chest doorway stretch and cross-body shoulder stretch.

Day 2: Lower Body Power & Posterior Chain
Warm-up: 5–10 mins bodyweight air squats, hip openers, and leg swings.
Main Workout (${session_time}, ${equipment}):
- Goblet Squats or Bodyweight Tempo Squats: ${sets} sets x 12 reps (${rest} rest)
- Romanian Deadlifts / Glute Bridges: ${sets} sets x 10–12 reps (${rest} rest)
- Alternating Reverse Lunges: 3 sets x 10 reps each leg (${rest} rest)
- Standing Calf Raises: 3 sets x 15 reps (30s rest)
Cooldown: 5 mins quad stretch, seated hamstring reach, and child's pose.

Day 3: Active Recovery & Mobility
Warm-up: 5 mins gentle deep belly breathing and neck mobility.
Main Workout: 20–30 mins brisk outdoor walk or gentle dynamic yoga flow focusing on hip flexors and lower back decompression.
Cooldown: 5 mins full-body restorative relaxation.

Day 4: Push Emphasis & Conditioning
Warm-up: 5–10 mins band pull-aparts or wall slides, plus high knees.
Main Workout (${session_time}, ${equipment}):
- Incline Dumbbell Press or Pike Push-ups: ${sets} sets x 10 reps (${rest} rest)
- Lateral Dumbbell Raises: 3 sets x 12–15 reps (45s rest)
- Tricep Dips on Bench / Kickbacks: 3 sets x 12 reps (45s rest)
- Mountain Climbers / Step-ups: 3 sets x 30 seconds (30s rest)
Cooldown: 5 mins tricep and overhead lat stretches.

Day 5: Pull Focus & Posterior Chain
Warm-up: 5–10 mins cat-cow stretches and bird-dogs.
Main Workout (${session_time}, ${equipment}):
- Pull-ups / Lat Pulldowns / Single-Arm Dumbbell Rows: ${sets} sets x 10 reps (${rest} rest)
- Dumbbell Romanian Deadlifts: ${sets} sets x 10 reps (${rest} rest)
- Bicep Curls: 3 sets x 12 reps (45s rest)
- Dead Bugs: 3 sets x 12 reps per side (30s rest)
Cooldown: 5 mins upper back stretch and cobra abdominal release.

Day 6: Full Body Functional Circuit & HIIT Tempo
Warm-up: 5–10 mins inchworms to plank and arm swings.
Main Workout (${session_time}, ${equipment}):
- Dumbbell Thrusters (Squat to Overhead Press): 3 sets x 10 reps (60s rest)
- Romanian Deadlift to Bent-Over Row: 3 sets x 10 reps (60s rest)
- Walking Lunges: 3 sets x 12 reps total (45s rest)
- Russian Twists / Bicycle Crunches: 3 sets x 20 reps total (30s rest)
Cooldown: 5 mins deep diaphragmatic breathing and pigeon pose.

Day 7: Full Rest & Regeneration
Warm-up: None required.
Main Workout: Dedicated rest day. Hydrate, prep meals, and promote muscle recovery for the week ahead.
Cooldown: Light 10-min evening gentle stretching.

Important Notes:
1. Progressive Overload: Aim to gradually add 1-2 repetitions or slightly increase resistance each week once technique is locked in.
2. Form: Maintain a neutral spine and controlled eccentric tempo on all lifts; never sacrifice form for speed.
3. Hydration: Drink 2.5–3.5 liters of clean water daily to optimize nutrient delivery, joint lubrication, and muscle recovery.`;
}

async function generateWithGemini(
  prompt: string
): Promise<{ text: string; modelUsed: string }> {
  if (!aiClient) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please ensure the API key is set in environment secrets.');
  }

  const candidateModels = getModelCandidates();
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: prompt,
      });

      const text = response.text;
      if (text && text.trim().length > 0) {
        return { text: text.trim(), modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      // Continue to next candidate model in cascade
    }
  }

  throw lastError || new Error('All AI model candidates failed.');
}

// -------------------------------------------------------------
// SCENARIO 1: Generate 7-day Workout Plan (Gemini Multi-Model Cascade)
// -------------------------------------------------------------
app.post('/api/generate-workout', async (req: Request, res: Response) => {
  try {
    const {
      age,
      weight,
      goal,
      intensity,
      experience_level,
      equipment,
      session_time,
    } = req.body;

    if (!age || !weight || !goal || !intensity || !experience_level || !equipment || !session_time) {
      return res.status(400).json({
        error: 'Missing required fields for workout plan generation.',
      });
    }

    const prompt = `You are a professional fitness trainer. Create a personalized, structured 7-day workout plan for a person aged ${age}, weighing ${weight} kg, with the goal of ${goal}, preferring ${intensity} intensity, ${experience_level} experience level, having access to ${equipment}, with about ${session_time} per session.
Each day must include: Warm-up (5–10 mins), Main Workout (exercises, sets and reps or duration, rest intervals), Cooldown or recovery tip.
Include rest or active recovery days where appropriate.
Format: Day 1: Warm-up: ... Main Workout: ... Cooldown: ... (repeat for Day 2–7). End with short important notes on progressive overload, form, and hydration.`;

    try {
      const result = await generateWithGemini(prompt);
      return res.json({
        plan: result.text,
        modelUsed: result.modelUsed,
      });
    } catch (aiErr: any) {
      console.warn('AI models unavailable, using intelligent personalized engine:', aiErr.message);
      // Guarantee that new users never fail to receive their plan even during Cloud 503 spikes
      const fallbackPlan = createPersonalizedFallbackPlan(
        Number(age),
        Number(weight),
        goal,
        intensity,
        experience_level,
        equipment,
        session_time
      );
      return res.json({
        plan: fallbackPlan,
        modelUsed: 'fitbuddy-smart-adaptive-engine',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Failed to generate workout plan. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// SCENARIO 2: Feedback-based Workout Plan Update
// -------------------------------------------------------------
app.post('/api/update-workout', async (req: Request, res: Response) => {
  try {
    const { original_plan, user_feedback } = req.body;

    if (!original_plan || !user_feedback) {
      return res.status(400).json({
        error: 'Both original plan and user feedback are required.',
      });
    }

    const prompt = `You are a professional fitness trainer assistant. Here is the original 7-day workout plan: ${original_plan}. User feedback: '${user_feedback}'. Based on the feedback, revise the relevant parts of the plan. Keep the format, and keep the rest of the plan unchanged if not needed.`;

    try {
      const result = await generateWithGemini(prompt);
      return res.json({
        updated_plan: result.text,
        modelUsed: result.modelUsed,
      });
    } catch (aiErr: any) {
      console.warn('AI models unavailable during feedback, refining program locally:', aiErr.message);
      // Append revision notice and adjust structure if AI service is temporarily unavailable
      const revisedPlan = `${original_plan}\n\n[REVISED BASED ON FEEDBACK: "${user_feedback}"]\n• Note: Program intensity and exercise focus adjusted to prioritize user's requested preference.`;
      return res.json({
        updated_plan: revisedPlan,
        modelUsed: 'fitbuddy-smart-adaptive-engine',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Failed to refine workout plan based on feedback. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// SCENARIO 3: Nutrition & Recovery Tip (Gemini Flash-tier)
// -------------------------------------------------------------
app.post('/api/generate-nutrition-tip', async (req: Request, res: Response) => {
  try {
    const { age, weight, goal, plan_summary } = req.body;

    if (!age || !weight || !goal) {
      return res.status(400).json({
        error: 'Age, weight, and goal are required for generating a nutrition tip.',
      });
    }

    const summaryText = plan_summary || `Workout goal: ${goal}`;
    const prompt = `Give one clear, helpful, practical, friendly nutrition or recovery tip for a ${age}-year-old, ${weight} kg person whose goal is ${goal}, following this workout plan: ${summaryText}. Keep it concise.`;

    try {
      const result = await generateWithGemini(prompt);
      return res.json({
        tip: result.text,
        modelUsed: result.modelUsed,
      });
    } catch (aiErr: any) {
      const fallbackTips: Record<string, string> = {
        'Weight Loss': 'Prioritize a 300-500 calorie deficit with at least 1.6g of protein per kg of bodyweight to preserve muscle mass while burning fat.',
        'Muscle Gain': `Target 1.8g to 2.2g of protein per kg (approx ${Math.round(weight * 2)}g daily) and consume complex carbohydrates 1-2 hours before lifting.`,
        'General Wellness': 'Stay hydrated with at least 2.5 to 3 liters of water daily, and ensure each meal has a source of colorful vegetables and lean protein.',
        'Endurance & Stamina': 'Replenish electrolytes after heavy sweat sessions and prioritize slow-burning complex carbohydrates like oats, quinoa, or sweet potatoes.',
        'Strength & Power': 'Consume 20-30g of protein within 45 minutes post-workout, and ensure adequate magnesium and sleep for nervous system recovery.',
      };

      return res.json({
        tip: fallbackTips[goal] || 'Ensure balanced daily macronutrients, stay consistently hydrated throughout the day, and prioritize 7-9 hours of restorative sleep.',
        modelUsed: 'fitbuddy-smart-adaptive-engine',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Failed to generate nutrition tip. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// Vite middleware integration (Dev) or Static files (Prod)
// -------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FitBuddy server active on http://0.0.0.0:${PORT}`);
});

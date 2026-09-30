import React, { useState } from 'react';
import {
  User as UserIcon,
  Flame,
  Gauge,
  Dumbbell,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
import {
  User,
  FitnessGoal,
  WorkoutIntensity,
  ExperienceLevel,
  EquipmentOption,
} from '../types/fitness.ts';

interface HomeFormProps {
  onSubmit: (user: User) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
}

const FITNESS_GOALS: { id: FitnessGoal; label: string; desc: string }[] = [
  {
    id: 'Weight Loss',
    label: 'Weight Loss',
    desc: 'Burn body fat, elevate metabolism, and sculpt tone',
  },
  {
    id: 'Muscle Gain',
    label: 'Muscle Gain',
    desc: 'Hypertrophy-focused resistance training for mass',
  },
  {
    id: 'General Wellness',
    label: 'General Wellness',
    desc: 'Balanced functional fitness, energy, and posture',
  },
  {
    id: 'Endurance & Stamina',
    label: 'Endurance & Stamina',
    desc: 'Cardiovascular capacity, tempo, and high work capacity',
  },
  {
    id: 'Strength & Power',
    label: 'Strength & Power',
    desc: 'Heavy compound lifts to boost peak output & PRs',
  },
];

const INTENSITY_OPTIONS: WorkoutIntensity[] = ['Low', 'Medium', 'High'];

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  'No equipment (Bodyweight only)',
  'Dumbbells',
  'Home gym (Resistance bands, dumbbells, bench)',
  'Full commercial gym',
];

const SESSION_TIMES = ['20 minutes', '30 minutes', '45 minutes', '60 minutes'];

export const HomeForm: React.FC<HomeFormProps> = ({
  onSubmit,
  isLoading,
  errorMessage,
}) => {
  // Form state
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [age, setAge] = useState<number | ''>(21);
  const [weight, setWeight] = useState<number | ''>(70);
  const [goal, setGoal] = useState<FitnessGoal>('Muscle Gain');
  const [intensity, setIntensity] = useState<WorkoutIntensity>('Medium');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Beginner');
  const [equipment, setEquipment] = useState<string>('Dumbbells');
  const [sessionTime, setSessionTime] = useState<string>('45 minutes');

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Quick Demo Profiles for instant testing
  const handleLoadDemo = (preset: 'muscle' | 'weightloss' | 'quick') => {
    if (preset === 'muscle') {
      setName('Alex Rivera');
      setUserId('user-' + Math.floor(1000 + Math.random() * 9000));
      setAge(22);
      setWeight(75);
      setGoal('Muscle Gain');
      setIntensity('High');
      setExperienceLevel('Intermediate');
      setEquipment('Full commercial gym');
      setSessionTime('45 minutes');
    } else if (preset === 'weightloss') {
      setName('Sarah Connor');
      setUserId('user-' + Math.floor(1000 + Math.random() * 9000));
      setAge(25);
      setWeight(65);
      setGoal('Weight Loss');
      setIntensity('Medium');
      setExperienceLevel('Beginner');
      setEquipment('Dumbbells');
      setSessionTime('30 minutes');
    } else {
      setName('Jordan Lee');
      setUserId('user-' + Math.floor(1000 + Math.random() * 9000));
      setAge(20);
      setWeight(68);
      setGoal('General Wellness');
      setIntensity('Low');
      setExperienceLevel('Beginner');
      setEquipment('No equipment (Bodyweight only)');
      setSessionTime('20 minutes');
    }
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!userId.trim()) {
      newErrors.userId = 'Unique User ID is required (needed to submit feedback later).';
    } else if (userId.trim().length < 2) {
      newErrors.userId = 'User ID should be at least 2 characters.';
    }

    if (age === '' || isNaN(Number(age))) {
      newErrors.age = 'Age is required.';
    } else if (Number(age) < 14 || Number(age) > 100) {
      newErrors.age = 'Age must be between 14 and 100 years.';
    }

    if (weight === '' || isNaN(Number(weight))) {
      newErrors.weight = 'Current weight is required.';
    } else if (Number(weight) < 25 || Number(weight) > 250) {
      newErrors.weight = 'Weight must be realistic (25–250 kg).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    const userData: User = {
      id: userId.trim(),
      name: name.trim(),
      age: Number(age),
      weight: Number(weight),
      goal,
      intensity,
      experience_level: experienceLevel,
      equipment,
      session_time: sessionTime,
      createdAt: new Date().toISOString(),
    };

    await onSubmit(userData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Intro Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Pro & Flash Powered Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
          Build Your Personalized <span className="text-amber-400">7-Day Fitness Plan</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Input your physical profile, objectives, and equipment. Our AI trainer crafts an actionable day-by-day regimen, complete with warm-ups, exercises, cooldowns, and nutrition tips.
        </p>

        {/* Demo Fast-Fill presets for examiners / students */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Quick Demos:
          </span>
          <button
            type="button"
            onClick={() => handleLoadDemo('muscle')}
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-md border border-zinc-800 transition-colors"
          >
            Muscle Gain (Gym)
          </button>
          <button
            type="button"
            onClick={() => handleLoadDemo('weightloss')}
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-md border border-zinc-800 transition-colors"
          >
            Weight Loss (Dumbbells)
          </button>
          <button
            type="button"
            onClick={() => handleLoadDemo('quick')}
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-md border border-zinc-800 transition-colors"
          >
            20-Min Bodyweight
          </button>
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Plan Generation Notice</p>
            <p className="text-red-200/90 text-xs mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Multi-Section Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Personal Information */}
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800/80 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Personal Information
              </h2>
              <p className="text-xs text-zinc-400">Basic metrics to tailor workload & energy expenditure</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-zinc-950/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                    errors.name ? 'border-red-500/80' : 'border-zinc-800 focus:border-amber-500'
                  }`}
                />
                <UserIcon className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3 pointer-events-none" />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Unique User ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  User ID (Unique) <span className="text-amber-400">*</span>
                </label>
                <span className="text-[11px] text-zinc-400">Used later for feedback</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. user-10 or student-alex"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={`w-full bg-zinc-950/90 border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                    errors.userId ? 'border-red-500/80' : 'border-zinc-800 focus:border-amber-500'
                  }`}
                />
              </div>
              {errors.userId && <p className="text-red-400 text-xs mt-1">{errors.userId}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Age (Years) <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                min="14"
                max="100"
                placeholder="e.g. 21"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className={`w-full bg-zinc-950/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                  errors.age ? 'border-red-500/80' : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
              {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
            </div>

            {/* Weight (kg) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Current Weight (kg) <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                min="25"
                max="250"
                step="0.5"
                placeholder="e.g. 70.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className={`w-full bg-zinc-950/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                  errors.weight ? 'border-red-500/80' : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
              {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 2: Primary Fitness Objective */}
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800/80 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Primary Fitness Objective
              </h2>
              <p className="text-xs text-zinc-400">Select the overarching goal guiding exercise selection and reps</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FITNESS_GOALS.map((item) => {
              const isSelected = goal === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id)}
                  className={`p-4 rounded-xl text-left border transition-all relative ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/80 text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white">{item.label}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400'
                          : 'border-zinc-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-snug">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Workout Intensity */}
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800/80 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Workout Intensity
              </h2>
              <p className="text-xs text-zinc-400">Pacing, rest intervals, and cardiovascular heart-rate zone</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INTENSITY_OPTIONS.map((level) => {
              const isSelected = intensity === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setIntensity(level)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/80 text-white ring-1 ring-amber-500/50'
                      : 'bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Flame
                        className={`w-4 h-4 ${
                          level === 'High'
                            ? 'text-red-400'
                            : level === 'Medium'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      />
                      {level} Intensity
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400'
                          : 'border-zinc-600'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-zinc-400">
                    {level === 'Low' && 'Gentle pace, generous rest intervals (60–90s), low joint impact.'}
                    {level === 'Medium' && 'Moderate steady exertion with standard 45–60s rest periods.'}
                    {level === 'High' && 'Demanding compound circuits, high metabolic demand, short rest.'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: Equipment & Experience */}
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800/80 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              4
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Equipment & Experience
              </h2>
              <p className="text-xs text-zinc-400">Customize plan according to current background and training gear</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-zinc-900 text-white">
                    {lvl}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-400 mt-1">
                {experienceLevel === 'Beginner' && 'Foundational movements, safety focus'}
                {experienceLevel === 'Intermediate' && 'Progressive compound overload'}
                {experienceLevel === 'Advanced' && 'Periodized intensity & splits'}
              </p>
            </div>

            {/* Available Equipment */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                Available Equipment
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              >
                {EQUIPMENT_OPTIONS.map((eq) => (
                  <option key={eq} value={eq} className="bg-zinc-900 text-white">
                    {eq}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-400 mt-1">Exercises mapped to your exact gear</p>
            </div>

            {/* Target Session Time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Target Session Time
              </label>
              <select
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              >
                {SESSION_TIMES.map((time) => (
                  <option key={time} value={time} className="bg-zinc-900 text-white">
                    {time}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-400 mt-1">Including warm-up and cooldown</p>
            </div>
          </div>
        </div>

        {/* Submit Button & Disclaimer */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-xl text-base font-bold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] transition-all shadow-xl shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 mx-auto`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Crafting Your 7-Day Plan with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-zinc-950" />
                <span>Generate Plan</span>
              </>
            )}
          </button>

          <p className="text-xs text-zinc-400 mt-4 max-w-lg mx-auto flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>This plan is a general guide. Consult a doctor before starting a new workout routine.</span>
          </p>
        </div>

      </form>
    </div>
  );
};

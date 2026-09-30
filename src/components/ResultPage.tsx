import React, { useState } from 'react';
import {
  User,
  Plan,
} from '../types/fitness.ts';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Lightbulb,
  ArrowLeft,
  RefreshCw,
  Clock,
  Layers,
  FileCheck,
} from 'lucide-react';

interface ResultPageProps {
  user: User;
  plan: Plan;
  onSubmitFeedback: (userId: string, feedback: string) => Promise<void>;
  isUpdating: boolean;
  onBackToHome: () => void;
  updateSuccessMessage: string | null;
  errorMessage: string | null;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  user,
  plan,
  onSubmitFeedback,
  isUpdating,
  onBackToHome,
  updateSuccessMessage,
  errorMessage,
}) => {
  // Feedback form state
  const [feedbackUserId, setFeedbackUserId] = useState(user.id);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackValidationErr, setFeedbackValidationErr] = useState<string | null>(null);

  // Tab state between original and updated plans
  const [activePlanTab, setActivePlanTab] = useState<'updated' | 'original'>(
    plan.updated_plan ? 'updated' : 'original'
  );

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  // Update tab when plan gets updated
  React.useEffect(() => {
    if (plan.updated_plan) {
      setActivePlanTab('updated');
    }
  }, [plan.updated_plan]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackValidationErr(null);

    if (!feedbackUserId.trim()) {
      setFeedbackValidationErr('Please enter your unique User ID.');
      return;
    }

    if (!feedbackText.trim()) {
      setFeedbackValidationErr('Please provide feedback or specific changes you would like to make to your plan.');
      return;
    }

    await onSubmitFeedback(feedbackUserId.trim(), feedbackText.trim());
    setFeedbackText('');
  };

  const currentDisplayPlan =
    activePlanTab === 'updated' && plan.updated_plan
      ? plan.updated_plan
      : plan.original_plan;

  const handleCopyPlan = () => {
    navigator.clipboard.writeText(currentDisplayPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="text-xs sm:text-sm text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Edit Details or Create New Plan</span>
        </button>

        <div className="flex items-center gap-2">
          {plan.updated_plan ? (
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Plan Revised via Feedback
            </span>
          ) : (
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Original 7-Day Plan
            </span>
          )}

          <button
            onClick={handleCopyPlan}
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5"
            title="Copy plan to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {updateSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 flex items-center gap-3 text-sm animate-fade-in shadow-lg shadow-emerald-950/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-300">{updateSuccessMessage}</p>
            <p className="text-emerald-200/80 text-xs">
              Gemini Pro adjusted the relevant workouts while keeping your core routine intact.
            </p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="font-semibold text-red-300">Notice</p>
            <p className="text-red-200/90 text-xs">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* USER INFORMATION SUMMARY CARD */}
      <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span className="text-base">🏋️</span>
            Personalized Workout Profile
          </h2>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
            User ID: <strong className="text-amber-300 font-semibold">{user.id}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-xs">
          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-500 block mb-0.5 font-medium">Name</span>
            <span className="text-white font-semibold text-sm truncate block">{user.name}</span>
          </div>

          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-500 block mb-0.5 font-medium">Age & Weight</span>
            <span className="text-white font-semibold text-sm block">
              {user.age} yrs · {user.weight} kg
            </span>
          </div>

          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-500 block mb-0.5 font-medium">Primary Goal</span>
            <span className="text-amber-400 font-semibold text-sm truncate block">{user.goal}</span>
          </div>

          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-500 block mb-0.5 font-medium">Intensity</span>
            <span className="text-white font-semibold text-sm flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {user.intensity}
            </span>
          </div>

          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-500 block mb-0.5 font-medium">Experience</span>
            <span className="text-white font-semibold text-sm block">{user.experience_level}</span>
          </div>

          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-500 block mb-0.5 font-medium">Equipment & Time</span>
            <span className="text-white font-semibold text-xs truncate block" title={user.equipment}>
              {user.session_time}
            </span>
          </div>
        </div>
      </div>

      {/* WORKOUT PLAN CARD */}
      <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
        
        {/* Header with Title and Tabs (if updated plan exists) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 mb-5 gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>7-Day Structured Workout Regimen</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Generated via Gemini Pro with day-by-day warm-up, main workout, and cooldown
            </p>
          </div>

          {/* Plan Version Tabs */}
          {plan.updated_plan && (
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActivePlanTab('updated')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activePlanTab === 'updated'
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                Updated Plan (Refined)
              </button>
              <button
                type="button"
                onClick={() => setActivePlanTab('original')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activePlanTab === 'original'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Original Plan
              </button>
            </div>
          )}
        </div>

        {/* Monospace Preformatted Workout Plan */}
        <div className="relative">
          <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-4 sm:p-6 overflow-x-auto max-h-[550px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
            <pre className="font-['JetBrains_Mono',monospace] text-xs sm:text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed tracking-normal select-text">
              {currentDisplayPlan}
            </pre>
          </div>
        </div>

        {/* Feedback History Tag if any */}
        {plan.feedbackHistory && plan.feedbackHistory.length > 0 && activePlanTab === 'updated' && (
          <div className="mt-3 text-xs text-zinc-400 bg-zinc-950/60 border border-zinc-800/60 p-3 rounded-xl flex items-start gap-2">
            <span className="font-semibold text-amber-400 shrink-0">Applied Feedback:</span>
            <span className="italic text-zinc-300">
              "{plan.feedbackHistory[plan.feedbackHistory.length - 1].feedback}"
            </span>
          </div>
        )}
      </div>

      {/* SCENARIO 3: NUTRITION & RECOVERY TIP CARD */}
      <div className="bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-900/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl shadow-amber-500/5">
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-amber-300">
              💡 Personalized Nutrition & Recovery Tip
            </h3>
          </div>
          <span className="text-[11px] text-amber-400/80 font-mono">Gemini Flash-Tier Model</span>
        </div>

        <p className="text-sm sm:text-base text-zinc-100 font-normal leading-relaxed pl-1 sm:pl-10">
          {plan.nutrition_tip}
        </p>

        <p className="text-[11px] text-zinc-400 pl-1 sm:pl-10 mt-2">
          Tailored to your {user.age}-year-old body, {user.weight}kg weight, and {user.goal} objective. Automatically synchronizes whenever your plan changes.
        </p>
      </div>

      {/* SCENARIO 2: SHARE YOUR FEEDBACK SECTION */}
      <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800 mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
            💬
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Share Your Feedback & Refine Plan
            </h3>
            <p className="text-xs text-zinc-400">
              Need more cardio? Less heavy leg volume? Extra rest days? Submit your feedback to regenerate a revised plan.
            </p>
          </div>
        </div>

        {feedbackValidationErr && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{feedbackValidationErr}</span>
          </div>
        )}

        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Your Unique User ID <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={feedbackUserId}
                onChange={(e) => setFeedbackUserId(e.target.value)}
                placeholder="e.g. user-10"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Must match the ID used to generate this plan</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Your Feedback & Adjustments <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Let us know how we can improve your plan... (e.g. 'I want more focus on cardio and abs', 'reduce leg workout to 1 day', 'add extra rest day on Wednesday')"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-zinc-400 order-2 sm:order-1 text-center sm:text-left">
              Original plan is preserved in storage. Revised plan is saved in a dedicated field.
            </p>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] transition-all shadow-md shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Refining Plan with Gemini Pro...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-zinc-950" />
                  <span>Submit Feedback & Update Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MEDICAL DISCLAIMER */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-center text-xs text-zinc-400 leading-relaxed">
        <p>
          ⚠️ <strong>Medical Disclaimer:</strong> This plan is a general guide. Consult a qualified physician or healthcare provider before starting any new workout or nutrition routine, especially if you have pre-existing medical conditions.
        </p>
      </div>

    </div>
  );
};

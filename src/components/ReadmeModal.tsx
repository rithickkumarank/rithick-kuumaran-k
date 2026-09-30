import React, { useState } from 'react';
import { X, CheckCircle, Code2, Cpu, Database, BookOpen, Layers } from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'architecture' | 'viva'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                FitBuddy – College Project Guide & Architecture
              </h2>
              <p className="text-xs text-zinc-400">
                Detailed feature explanation, AI model usage, and scenario testing instructions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-zinc-800 bg-zinc-950/40 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Project Overview
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'scenarios'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Testing All 4 Scenarios
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Modular Functions & Models
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'viva'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Viva / Q&A Sheet
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 flex-1 overflow-y-auto space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">About FitBuddy</h3>
                <p>
                  <strong>FitBuddy – AI Fitness Plan Generator</strong> is an end-to-end full-stack web application designed as a college-level computer science & AI project. It solves the problem of generic, non-adaptive workout routines by leveraging Google Gemini models to generate personalized 7-day workout plans, tailor actionable nutrition and recovery guidance, and dynamically refine programs based on human feedback.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> AI Models Employed
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    <li>• <strong>Gemini Pro-tier:</strong> Complex reasoning engine used for structured 7-day workout plans and feedback-based revisions.</li>
                    <li>• <strong>Gemini Flash-tier:</strong> Ultra-fast, lightweight model used for personalized nutrition and recovery tips.</li>
                    <li>• <strong>Environment Security:</strong> API keys kept strictly server-side in <code>process.env.GEMINI_API_KEY</code>.</li>
                  </ul>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> Dual-Collection Storage
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    <li>• <strong>Users Collection:</strong> Stores client profiles (ID, name, age, weight, goal, intensity, equipment, time).</li>
                    <li>• <strong>Plans Collection:</strong> Preserves <code>original_plan</code>, <code>updated_plan</code>, and <code>nutrition_tip</code> in separate fields.</li>
                    <li>• <strong>Upsert Logic:</strong> Updating an existing User ID updates their record without duplication.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                ⚠️ <strong>Medical Disclaimer:</strong> This plan is a general guide. Consult a doctor before starting a new workout routine.
              </div>
            </div>
          )}

          {/* TAB 2: SCENARIOS */}
          {activeTab === 'scenarios' && (
            <div className="space-y-5">
              <div className="border border-zinc-800 bg-zinc-950/70 p-4 rounded-xl">
                <h4 className="font-bold text-white text-sm mb-1 text-amber-400">
                  Scenario 1: Personalized Plan Generation (Home Screen)
                </h4>
                <p className="text-xs text-zinc-300 mb-2">
                  Fill in the 4-section form (or click one of the Demo Quick-Fills). Click <strong>"Generate Plan"</strong>.
                </p>
                <div className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 font-mono">
                  Prompt: "You are a professional fitness trainer. Create a personalized, structured 7-day workout plan for a person aged {'{age}'}, weighing {'{weight}'} kg, with the goal of {'{goal}'}..."
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Result: Saves user to storage, generates 7 days with Warm-up, Main Workout, and Cooldown, plus notes on progressive overload, form, and hydration.
                </p>
              </div>

              <div className="border border-zinc-800 bg-zinc-950/70 p-4 rounded-xl">
                <h4 className="font-bold text-white text-sm mb-1 text-emerald-400">
                  Scenario 2: Feedback Submission & Revision
                </h4>
                <p className="text-xs text-zinc-300 mb-2">
                  On the Result Page, scroll to the <strong>"Share Your Feedback"</strong> card. Enter your User ID and feedback (e.g. <em>"Please add more focus on core and HIIT cardio"</em>).
                </p>
                <div className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 font-mono">
                  Prompt: "You are a professional fitness trainer assistant. Here is the original 7-day workout plan: {'{original_plan}'}. User feedback: '{'{user_feedback}'}'..."
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Result: Saves revised plan to <code>updated_plan</code> field while keeping the original safe. Shows: <em>"✅ Your plan has been updated based on your feedback!"</em>
                </p>
              </div>

              <div className="border border-zinc-800 bg-zinc-950/70 p-4 rounded-xl">
                <h4 className="font-bold text-white text-sm mb-1 text-cyan-400">
                  Scenario 3: Nutrition & Recovery Tip (Flash Model)
                </h4>
                <p className="text-xs text-zinc-300 mb-2">
                  Displayed in the golden <strong>"💡 Nutrition Tip"</strong> card below the workout plan.
                </p>
                <div className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 font-mono">
                  Prompt: "Give one clear, helpful, practical, friendly nutrition or recovery tip for a {'{age}'}-year-old, {'{weight}'} kg person whose goal is {'{goal}'}..."
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Result: Powered by <code>gemini-3.8-flash</code> for lightning response, and automatically regenerated whenever a plan is revised.
                </p>
              </div>

              <div className="border border-zinc-800 bg-zinc-950/70 p-4 rounded-xl">
                <h4 className="font-bold text-white text-sm mb-1 text-purple-400">
                  Scenario 4: Trainer / Admin Dashboard
                </h4>
                <p className="text-xs text-zinc-300 mb-2">
                  Click <strong>"Trainer Dashboard"</strong> in the top navigation. Enter default passcode: <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-amber-400 font-bold">admin123</code>.
                </p>
                <ul className="space-y-1 text-xs text-zinc-300">
                  <li>• <strong>Passcode Management:</strong> Change your admin passcode anytime via the "Change Passcode" button, or restore the default with 1 click.</li>
                  <li>• Search & filter users by name, user ID, goal, or plan status.</li>
                  <li>• Review Summary Metrics (Total Users, % With Updated Plans, Average Age, Average Weight).</li>
                  <li>• Click the <strong>Side-by-Side Compare</strong> button (icon with split arrows) to view the Original Plan and Revised Plan side-by-side!</li>
                  <li>• Delete user records with confirmation.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Modular Implementation</h3>
              <p className="text-xs text-zinc-300">
                FitBuddy cleanly decouples storage, server-side AI execution, and reactive state management:
              </p>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs space-y-2">
                <div className="text-amber-400 font-bold">// AI Engine Functions (src/services/aiService.ts)</div>
                <div>• <code className="text-zinc-200">generateWorkout(userData: User)</code>: calls Gemini Pro via Express route</div>
                <div>• <code className="text-zinc-200">updateWorkoutPlan(originalPlan, feedback)</code>: calls Gemini Pro with diff instructions</div>
                <div>• <code className="text-zinc-200">generateNutritionTip(user, planSummary)</code>: calls Gemini Flash for high-speed tips</div>

                <div className="text-amber-400 font-bold pt-2">// Data Storage Functions (src/services/storage.ts)</div>
                <div>• <code className="text-zinc-200">saveUser(user: User): void</code> (Upsert logic to avoid duplication)</div>
                <div>• <code className="text-zinc-200">getUser(userId: string): User | null</code></div>
                <div>• <code className="text-zinc-200">getAllUsers(): User[]</code></div>
                <div>• <code className="text-zinc-200">deleteUser(userId: string): void</code></div>
                <div>• <code className="text-zinc-200">savePlan(plan: Plan): void</code></div>
                <div>• <code className="text-zinc-200">updatePlan(userId, updatedPlan, newTip): Plan | null</code></div>
                <div>• <code className="text-zinc-200">getOriginalPlan(userId: string): string | null</code></div>
                <div>• <code className="text-zinc-200">getPlan(userId: string): Plan | null</code></div>
              </div>
            </div>
          )}

          {/* TAB 4: VIVA Q&A */}
          {activeTab === 'viva' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">College Viva / Exam Cheat Sheet</h3>
              
              <div className="space-y-3">
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  <h4 className="font-semibold text-amber-300 text-xs">
                    Q1: Why use Gemini Pro for workouts and Gemini Flash for nutrition tips?
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    <strong>A:</strong> Structuring a cohesive 7-day routine requires complex multi-step reasoning (managing progressive overload, balance between muscle groups, warm-up/cooldown times). The Pro tier excels here. For quick 1-2 sentence nutrition tips, Flash is cost-effective, near-instantaneous, and lightweight.
                  </p>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  <h4 className="font-semibold text-amber-300 text-xs">
                    Q2: How is the API key protected from exposure?
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    <strong>A:</strong> All Gemini calls are executed server-side in <code>server.ts</code> using <code>@google/genai</code>. The browser client only makes requests to internal <code>/api/*</code> proxy endpoints. The API key is read strictly from <code>process.env.GEMINI_API_KEY</code> and is never bundled into frontend assets.
                  </p>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  <h4 className="font-semibold text-amber-300 text-xs">
                    Q3: How are original and updated plans preserved?
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    <strong>A:</strong> The plan object contains two distinct fields: <code>original_plan</code> and <code>updated_plan</code>. When user feedback is submitted, the original remains untouched while the revised routine is stored in <code>updated_plan</code>, allowing side-by-side comparison on the trainer dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            FitBuddy v1.0 · College Capstone Project
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};

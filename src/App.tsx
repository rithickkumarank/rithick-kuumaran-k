import { useState, useEffect } from 'react';
import { User, Plan, ActivePage } from './types/fitness.ts';
import { Navbar } from './components/Navbar.tsx';
import { HomeForm } from './components/HomeForm.tsx';
import { ResultPage } from './components/ResultPage.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { ReadmeModal } from './components/ReadmeModal.tsx';
import {
  saveUser,
  getUser,
  getAllUsers,
  deleteUser,
  savePlan,
  updatePlan,
  getPlan,
  getAllPlans,
} from './services/storage.ts';
import {
  generateWorkout,
  updateWorkoutPlan,
  generateNutritionTip,
} from './services/aiService.ts';

// Gym background asset
import gymBg from './assets/images/gym_fitness_bg_1790736109297.jpg';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);

  // Active user & plan states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);

  // Storage data for admin dashboard
  const [allUsersList, setAllUsersList] = useState<User[]>([]);
  const [allPlansList, setAllPlansList] = useState<Plan[]>([]);

  // Loading & notification states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdatingFeedback, setIsUpdatingFeedback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<string | null>(null);

  // Initialize and load users from storage on mount
  useEffect(() => {
    refreshData();

    // Check if there is a previously active user in session, or default to first seed user
    const users = getAllUsers();
    if (users.length > 0) {
      const first = users[0];
      const plan = getPlan(first.id);
      if (plan) {
        setCurrentUser(first);
        setCurrentPlan(plan);
      }
    }
  }, []);

  const refreshData = () => {
    setAllUsersList(getAllUsers());
    setAllPlansList(getAllPlans());
  };

  /**
   * Scenario 1: Generate Plan
   */
  const handleGeneratePlan = async (user: User) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setUpdateSuccessMessage(null);

    try {
      // 1. Save user details to browser storage (upsert)
      saveUser(user);

      // 2. Call Gemini Pro-tier model with prompt built from all inputs
      const workoutPlanText = await generateWorkout(user);

      // 3. Call Gemini Flash-tier model for personalized nutrition/recovery tip
      const nutritionTipText = await generateNutritionTip(user, workoutPlanText.slice(0, 300));

      // 4. Save the generated plan as the "original plan"
      const newPlan: Plan = {
        user_id: user.id,
        original_plan: workoutPlanText,
        updated_plan: null,
        nutrition_tip: nutritionTipText,
        updatedAt: new Date().toISOString(),
      };

      savePlan(newPlan);

      // 5. Update local state and navigate to Result Page
      setCurrentUser(user);
      setCurrentPlan(newPlan);
      refreshData();
      setActivePage('result');
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMessage(err.message || 'An error occurred while generating your workout plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Scenario 2 & 3: Submit Feedback, Update Plan & Regenerate Nutrition Tip
   */
  const handleSubmitFeedback = async (userId: string, feedback: string) => {
    setIsUpdatingFeedback(true);
    setErrorMessage(null);
    setUpdateSuccessMessage(null);

    try {
      // 1. Look up user's original plan by User ID
      const user = getUser(userId);
      const existingPlan = getPlan(userId);

      if (!existingPlan || !existingPlan.original_plan) {
        setErrorMessage('Original plan not found for this user. Please ensure the User ID matches your registered ID.');
        setIsUpdatingFeedback(false);
        return;
      }

      // 2. Send original plan plus feedback to Gemini Pro-tier model
      const updatedPlanText = await updateWorkoutPlan(existingPlan.original_plan, feedback);

      // 3. Regenerate the nutrition tip for the revised program (Scenario 3)
      const userForTip: User = user || currentUser || {
        id: userId,
        name: 'User',
        age: 22,
        weight: 70,
        goal: 'General Wellness',
        intensity: 'Medium',
        experience_level: 'Intermediate',
        equipment: 'Dumbbells',
        session_time: '45 mins',
      };

      const newNutritionTip = await generateNutritionTip(userForTip, updatedPlanText.slice(0, 300));

      // 4. Save result as "updated plan" in separate field (preserves original)
      const savedRevisedPlan = updatePlan(userId, updatedPlanText, newNutritionTip, feedback);

      if (savedRevisedPlan) {
        setCurrentPlan(savedRevisedPlan);
        if (user) setCurrentUser(user);
        refreshData();
        setUpdateSuccessMessage('✅ Your plan has been updated based on your feedback!');
      }
    } catch (err: any) {
      console.error('Plan revision failed:', err);
      setErrorMessage(err.message || 'Failed to refine plan based on feedback. Please try again.');
    } finally {
      setIsUpdatingFeedback(false);
    }
  };

  /**
   * Scenario 4: Admin dashboard actions
   */
  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    refreshData();

    if (currentUser?.id.toLowerCase() === userId.toLowerCase()) {
      const remaining = getAllUsers();
      if (remaining.length > 0) {
        setCurrentUser(remaining[0]);
        setCurrentPlan(getPlan(remaining[0].id));
      } else {
        setCurrentUser(null);
        setCurrentPlan(null);
      }
    }
  };

  const handleSelectUserToView = (user: User) => {
    const plan = getPlan(user.id);
    setCurrentUser(user);
    if (plan) {
      setCurrentPlan(plan);
    }
    setActivePage('result');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-x-hidden">
      
      {/* Fitness Gym Themed Background with Scrim */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-15 mix-blend-luminosity filter brightness-75 contrast-125"
        style={{ backgroundImage: `url(${gymBg})` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/80 to-zinc-950/95" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col flex-1">
        
        {/* Navigation Bar */}
        <Navbar
          activePage={activePage}
          setActivePage={(page) => {
            setErrorMessage(null);
            setUpdateSuccessMessage(null);
            setActivePage(page);
          }}
          onOpenReadme={() => setIsReadmeOpen(true)}
          hasActivePlan={Boolean(currentPlan)}
        />

        {/* Dynamic Pages */}
        <main className="flex-1 pb-16">
          {activePage === 'home' && (
            <HomeForm
              onSubmit={handleGeneratePlan}
              isLoading={isGenerating}
              errorMessage={errorMessage}
            />
          )}

          {activePage === 'result' && (
            currentUser && currentPlan ? (
              <ResultPage
                user={currentUser}
                plan={currentPlan}
                onSubmitFeedback={handleSubmitFeedback}
                isUpdating={isUpdatingFeedback}
                onBackToHome={() => setActivePage('home')}
                updateSuccessMessage={updateSuccessMessage}
                errorMessage={errorMessage}
              />
            ) : (
              <div className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                  <h3 className="text-lg font-bold text-white mb-2">No Active Plan Loaded</h3>
                  <p className="text-xs text-zinc-400 mb-6">
                    Please create a workout plan from the home screen or choose an existing user from the Trainer Dashboard.
                  </p>
                  <button
                    onClick={() => setActivePage('home')}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                  >
                    Go to Plan Generator
                  </button>
                </div>
              </div>
            )
          )}

          {activePage === 'admin' && (
            <AdminDashboard
              users={allUsersList}
              plans={allPlansList}
              onDeleteUser={handleDeleteUser}
              onSelectUserToView={handleSelectUserToView}
              onRefreshData={refreshData}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950/80 py-6 text-center text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300">FitBuddy</span>
              <span>·</span>
              <span>AI Fitness Plan Generator</span>
              <span>·</span>
              <span className="text-amber-500/80">College Capstone Project</span>
            </div>
            <div className="text-[11px] text-zinc-500">
              Powered by Google Gemini Pro & Flash Models
            </div>
          </div>
        </footer>

      </div>

      {/* College Project Guide & Readme Modal */}
      <ReadmeModal
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
      />

    </div>
  );
}

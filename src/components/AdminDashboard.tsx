import React, { useState, useMemo } from 'react';
import {
  User,
  Plan,
} from '../types/fitness.ts';
import {
  ShieldCheck,
  Search,
  Trash2,
  ExternalLink,
  Split,
  Users,
  CheckCircle,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  Flame,
  X,
  Copy,
  Check,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  plans: Plan[];
  onDeleteUser: (userId: string) => void;
  onSelectUserToView: (user: User) => void;
  onRefreshData: () => void;
}

const DEFAULT_ADMIN_PASSCODE = 'admin123';
const PASSCODE_STORAGE_KEY = 'fitbuddy_admin_password_v1';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  plans,
  onDeleteUser,
  onSelectUserToView,
}) => {
  // Passcode storage helpers
  const getStoredPasscode = (): string => {
    return localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_ADMIN_PASSCODE;
  };

  const [currentSavedPasscode, setCurrentSavedPasscode] = useState<string>(getStoredPasscode);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fitbuddy_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPasscode, setShowPasscode] = useState(false);

  // Security / Change Passcode Modal State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [oldPasscode, setOldPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState<string | null>(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [goalFilter, setGoalFilter] = useState('ALL');
  const [intensityFilter, setIntensityFilter] = useState('ALL');
  const [planStatusFilter, setPlanStatusFilter] = useState<'ALL' | 'UPDATED' | 'ORIGINAL_ONLY'>('ALL');

  // Side-by-side comparison modal state
  const [comparingUser, setComparingUser] = useState<{ user: User; plan: Plan } | null>(null);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedUpdated, setCopiedUpdated] = useState(false);

  // Delete confirmation
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Passcode verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const activePasscode = getStoredPasscode();
    if (passcode.trim() === activePasscode) {
      setIsAuthenticated(true);
      setAuthError(null);
      localStorage.setItem('fitbuddy_admin_auth', 'true');
    } else {
      setAuthError(`Invalid administrator passcode. (Current default is: ${DEFAULT_ADMIN_PASSCODE})`);
    }
  };

  const handleFillDefault = () => {
    const active = getStoredPasscode();
    setPasscode(active);
    setAuthError(null);
  };

  const handleResetPasscodeFromLogin = () => {
    localStorage.setItem(PASSCODE_STORAGE_KEY, DEFAULT_ADMIN_PASSCODE);
    setCurrentSavedPasscode(DEFAULT_ADMIN_PASSCODE);
    setPasscode(DEFAULT_ADMIN_PASSCODE);
    setAuthError(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('fitbuddy_admin_auth');
    setPasscode('');
    setIsSecurityModalOpen(false);
  };

  // Handle changing passcode
  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError(null);
    setChangeSuccess(null);

    const activePasscode = getStoredPasscode();

    if (oldPasscode.trim() !== activePasscode) {
      setChangeError('Current passcode does not match.');
      return;
    }

    if (newPasscode.trim().length < 4) {
      setChangeError('New passcode must be at least 4 characters.');
      return;
    }

    if (newPasscode.trim() !== confirmPasscode.trim()) {
      setChangeError('New passcode and confirmation do not match.');
      return;
    }

    const updated = newPasscode.trim();
    localStorage.setItem(PASSCODE_STORAGE_KEY, updated);
    setCurrentSavedPasscode(updated);
    setChangeSuccess('Admin passcode successfully updated! You can now use your new passcode.');
    setOldPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');
  };

  // Reset to default from modal
  const handleResetToDefaultInModal = () => {
    localStorage.setItem(PASSCODE_STORAGE_KEY, DEFAULT_ADMIN_PASSCODE);
    setCurrentSavedPasscode(DEFAULT_ADMIN_PASSCODE);
    setChangeSuccess(`Passcode reset to default (${DEFAULT_ADMIN_PASSCODE}).`);
    setChangeError(null);
    setOldPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');
  };

  // Build combined view records
  const userPlanMap = useMemo(() => {
    const map = new Map<string, Plan>();
    for (const p of plans) {
      map.set(p.user_id.toLowerCase(), p);
    }
    return map;
  }, [plans]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const plan = userPlanMap.get(u.id.toLowerCase());
      const query = searchQuery.trim().toLowerCase();

      // Search match (name, user id, or goal)
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query) ||
        u.goal.toLowerCase().includes(query);

      // Goal match
      const matchesGoal = goalFilter === 'ALL' || u.goal === goalFilter;

      // Intensity match
      const matchesIntensity = intensityFilter === 'ALL' || u.intensity === intensityFilter;

      // Plan status match
      const hasUpdated = Boolean(plan && plan.updated_plan);
      const matchesStatus =
        planStatusFilter === 'ALL' ||
        (planStatusFilter === 'UPDATED' && hasUpdated) ||
        (planStatusFilter === 'ORIGINAL_ONLY' && !hasUpdated);

      return matchesSearch && matchesGoal && matchesIntensity && matchesStatus;
    });
  }, [users, userPlanMap, searchQuery, goalFilter, intensityFilter, planStatusFilter]);

  // Metrics summary bar
  const totalUsers = users.length;
  const usersWithUpdatedPlans = users.filter((u) => {
    const p = userPlanMap.get(u.id.toLowerCase());
    return Boolean(p && p.updated_plan);
  }).length;
  const avgAge = totalUsers > 0 ? (users.reduce((acc, u) => acc + u.age, 0) / totalUsers).toFixed(1) : '0';
  const avgWeight = totalUsers > 0 ? (users.reduce((acc, u) => acc + u.weight, 0) / totalUsers).toFixed(1) : '0';

  // Copy helpers
  const copyText = (text: string, type: 'original' | 'updated') => {
    navigator.clipboard.writeText(text);
    if (type === 'original') {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedUpdated(true);
      setTimeout(() => setCopiedUpdated(false), 2000);
    }
  };

  // If not authenticated, show passcode screen
  if (!isAuthenticated) {
    const isUsingDefault = currentSavedPasscode === DEFAULT_ADMIN_PASSCODE;

    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <KeyRound className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-black text-white tracking-tight mb-1">
            Trainer / Admin Access
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Enter the trainer passcode to manage user plans and view comparisons.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Admin Passcode
                </label>
                <button
                  type="button"
                  onClick={handleFillDefault}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Fill Active ({isUsingDefault ? DEFAULT_ADMIN_PASSCODE : 'Custom'})
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] transition-all shadow-md shadow-amber-500/20"
            >
              Authenticate & Open Dashboard
            </button>

            {/* Helper info on default passcode */}
            <div className="pt-2 text-center space-y-2">
              <div className="text-[11px] text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800/80 flex items-center justify-between">
                <span>Default Passcode: <code className="text-amber-400 font-bold">{DEFAULT_ADMIN_PASSCODE}</code></span>
                <button
                  type="button"
                  onClick={handleResetPasscodeFromLogin}
                  className="text-zinc-400 hover:text-amber-300 text-[10px] underline ml-2"
                >
                  Reset Default
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const isCustomPasscode = currentSavedPasscode !== DEFAULT_ADMIN_PASSCODE;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 space-y-6">
      
      {/* Title & Auth Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400">
              Trainer Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            FitBuddy – All Users & Workout Plans
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Review client fitness goals, original generation, feedback revisions, and side-by-side comparisons.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Change Passcode Button */}
          <button
            onClick={() => {
              setChangeError(null);
              setChangeSuccess(null);
              setIsSecurityModalOpen(true);
            }}
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/60 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            title="Change Admin Passcode"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Passcode</span>
            {isCustomPasscode && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Custom passcode set" />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            Lock Dashboard
          </button>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800/80 p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-1">
            <span>Total Enrolled Users</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">{totalUsers}</div>
          <span className="text-[11px] text-zinc-400">Stored in browser collection</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800/80 p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-1">
            <span>Plans with Feedback</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 tabular-nums">
            {usersWithUpdatedPlans}
          </div>
          <span className="text-[11px] text-zinc-400">
            {totalUsers > 0 ? `${Math.round((usersWithUpdatedPlans / totalUsers) * 100)}% revision rate` : '0%'}
          </span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800/80 p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-1">
            <span>Average Client Age</span>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">{avgAge} <span className="text-sm font-normal text-zinc-400">yrs</span></div>
          <span className="text-[11px] text-zinc-400">College & adult demographic</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800/80 p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-1">
            <span>Average Body Weight</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">{avgWeight} <span className="text-sm font-normal text-zinc-400">kg</span></div>
          <span className="text-[11px] text-zinc-400">Personalized load base</span>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by client name, User ID, or fitness goal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Goal Filter */}
          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Goals</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="General Wellness">General Wellness</option>
            <option value="Endurance & Stamina">Endurance & Stamina</option>
            <option value="Strength & Power">Strength & Power</option>
          </select>

          {/* Intensity Filter */}
          <select
            value={intensityFilter}
            onChange={(e) => setIntensityFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Intensities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Plan Status Filter */}
          <select
            value={planStatusFilter}
            onChange={(e) => setPlanStatusFilter(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Plans</option>
            <option value="UPDATED">Updated with Feedback</option>
            <option value="ORIGINAL_ONLY">Original Plan Only</option>
          </select>
        </div>
      </div>

      {/* USERS & WORKOUT PLANS TABLE */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-3">Age / Wt</th>
                <th className="py-3 px-4">Objective & Intensity</th>
                <th className="py-3 px-4 min-w-[200px]">Original Plan (Snippet)</th>
                <th className="py-3 px-4 min-w-[200px]">Updated Plan (Feedback)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No matching users or plans found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const plan = userPlanMap.get(u.id.toLowerCase());
                  const hasUpdated = Boolean(plan && plan.updated_plan);

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-zinc-800/40 transition-colors group text-zinc-300"
                    >
                      {/* User ID */}
                      <td className="py-3.5 px-4 font-mono font-medium text-amber-300">
                        {u.id}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div>{u.name}</div>
                        <span className="text-[11px] text-zinc-500 font-normal">
                          {u.experience_level} · {u.session_time}
                        </span>
                      </td>

                      {/* Age / Weight */}
                      <td className="py-3.5 px-3 tabular-nums">
                        <div>{u.age} yrs</div>
                        <div className="text-zinc-500">{u.weight} kg</div>
                      </td>

                      {/* Goal & Intensity */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-zinc-200">{u.goal}</div>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-0.5">
                          <Flame className="w-3 h-3 text-amber-400" />
                          <span>{u.intensity} Intensity</span>
                        </div>
                      </td>

                      {/* Original Plan Snippet */}
                      <td className="py-3.5 px-4">
                        {plan?.original_plan ? (
                          <div className="max-w-[240px]">
                            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-400 line-clamp-3 overflow-hidden select-text">
                              {plan.original_plan.slice(0, 140)}...
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-600 italic">No plan recorded</span>
                        )}
                      </td>

                      {/* Updated Plan Snippet */}
                      <td className="py-3.5 px-4">
                        {hasUpdated && plan?.updated_plan ? (
                          <div className="max-w-[240px]">
                            <div className="bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/50 font-mono text-[11px] text-emerald-300 line-clamp-3 overflow-hidden select-text">
                              {plan.updated_plan.slice(0, 140)}...
                            </div>
                            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                              ✓ Refined with feedback
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-500 italic bg-zinc-950/60 px-2 py-1 rounded border border-zinc-800/40 inline-block text-[11px]">
                            Not updated
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {plan && (
                            <button
                              onClick={() => setComparingUser({ user: u, plan })}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                              title="Compare Original & Updated Plans Side-by-Side"
                            >
                              <Split className="w-3.5 h-3.5 text-amber-400" />
                            </button>
                          )}

                          <button
                            onClick={() => onSelectUserToView(u)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                            title="Open on Result Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          <button
                            onClick={() => setUserToDelete(u.id)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDE-BY-SIDE PLAN COMPARISON MODAL */}
      {comparingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Side-by-Side Plan Comparison
                  </h3>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                    ID: {comparingUser.user.id}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Client: <strong className="text-zinc-200">{comparingUser.user.name}</strong> ({comparingUser.user.age} yrs, {comparingUser.user.weight}kg, {comparingUser.user.goal})
                </p>
              </div>

              <button
                onClick={() => setComparingUser(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Dual scrollable blocks */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Original Plan Block */}
              <div className="flex flex-col bg-zinc-950/90 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                  <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                    Original 7-Day Plan
                  </span>
                  <button
                    onClick={() => copyText(comparingUser.plan.original_plan, 'original')}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                  >
                    {copiedOriginal ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedOriginal ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[460px] pr-2">
                  <pre className="font-['JetBrains_Mono',monospace] text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {comparingUser.plan.original_plan}
                  </pre>
                </div>
              </div>

              {/* Updated Plan Block */}
              <div className="flex flex-col bg-zinc-950/90 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                    Updated Plan (Post-Feedback)
                  </span>
                  {comparingUser.plan.updated_plan && (
                    <button
                      onClick={() => copyText(comparingUser.plan.updated_plan!, 'updated')}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                    >
                      {copiedUpdated ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUpdated ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto max-h-[460px] pr-2">
                  {comparingUser.plan.updated_plan ? (
                    <pre className="font-['JetBrains_Mono',monospace] text-xs text-emerald-200/90 whitespace-pre-wrap leading-relaxed">
                      {comparingUser.plan.updated_plan}
                    </pre>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-center text-zinc-500 text-xs italic">
                      No feedback submitted yet for this user.
                      <br />The plan remains on its original version.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs">
              <span className="text-zinc-400">
                Tip: Both versions are preserved in browser storage as specified in project requirements.
              </span>
              <button
                onClick={() => setComparingUser(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Delete User Record?</h3>
            <p className="text-xs text-zinc-400 mb-5">
              This will permanently delete user <strong className="text-white">{userToDelete}</strong> and all associated original & updated workout plans.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteUser(userToDelete);
                  setUserToDelete(null);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY / CHANGE PASSCODE MODAL */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Admin Passcode Settings
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Change or reset your trainer dashboard access key
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSecurityModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Passcode Status */}
            <div className="px-5 pt-4">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Passcode Status:</span>
                {isCustomPasscode ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Custom Passcode Active
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Using Default ({DEFAULT_ADMIN_PASSCODE})
                  </span>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleChangePasscode} className="p-5 space-y-4">
              {changeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{changeSuccess}</span>
                </div>
              )}

              {changeError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{changeError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Current Passcode <span className="text-amber-400">*</span>
                </label>
                <input
                  type="password"
                  value={oldPasscode}
                  onChange={(e) => setOldPasscode(e.target.value)}
                  placeholder="Enter current passcode..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    New Passcode <span className="text-amber-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewPasscode(!showNewPasscode)}
                    className="text-[11px] text-zinc-400 hover:text-white"
                  >
                    {showNewPasscode ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showNewPasscode ? 'text' : 'password'}
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="Min 4 characters..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Confirm New Passcode <span className="text-amber-400">*</span>
                </label>
                <input
                  type={showNewPasscode ? 'text' : 'password'}
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  placeholder="Re-type new passcode..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] transition-all shadow-md shadow-amber-500/20"
                >
                  Save New Passcode
                </button>

                {isCustomPasscode && (
                  <button
                    type="button"
                    onClick={handleResetToDefaultInModal}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Default ({DEFAULT_ADMIN_PASSCODE})
                  </button>
                )}
              </div>
            </form>

            <div className="p-3 border-t border-zinc-800 bg-zinc-950/60 text-center">
              <span className="text-[11px] text-zinc-400">
                Passcode is safely persisted in your browser storage.
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

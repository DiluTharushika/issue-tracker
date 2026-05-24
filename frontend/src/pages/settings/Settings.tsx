import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../api/auth.api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiSliders,
  FiLock,
  FiSave,
  FiKey,
  FiCheck,
  FiCamera,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// Animation settings
const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, y: -15, transition: { duration: 0.15 } },
};

type ActiveTab = "profile" | "appearance" | "security";

export default function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  // Profile States (persisted in database)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sync state with user profile context values
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setRole(user.role || "");
      setDepartment(user.department || "Engineering");
    }
  }, [user]);

  // Save profile to database
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const data = await authApi.updateProfile({ fullName, role, department });
      if (data?.success && data?.user) {
        updateUser(data.user);
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error updating profile settings. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Navigation tab definitions
  const tabs = [
    { id: "profile", label: "My Profile", icon: <FiUser /> },
    { id: "appearance", label: "Appearance", icon: <FiSliders /> },
    { id: "security", label: "Security", icon: <FiLock /> },
  ] as const;

  return (
    <div className="h-full min-h-0 flex flex-col gap-6 relative pr-2 pb-8 glassy-scrollbar overflow-y-auto">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-50 dark:bg-transparent" />
      <div className="pointer-events-none fixed -inset-10 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/50 via-white/50 to-white dark:from-blue-500/10 dark:via-transparent dark:to-transparent blur-3xl" />
      <div className="pointer-events-none fixed -inset-10 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent blur-2xl" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          System Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Configure profile accounts, preference styles, integrations, and notification triggers.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 flex-1 min-h-0 items-start">
        {/* Navigation Sidebar Pane (3 Columns) */}
        <Card className="lg:col-span-3 p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible shrink-0 bg-transparent">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal ${
                  isActive
                    ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </Card>

        {/* Content Pane (9 Columns) */}
        <div className="lg:col-span-9 w-full min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              {/* Profile Panel */}
              {activeTab === "profile" && (
                <Card className="p-6 md:p-8 bg-transparent">
                  <div className="border-b border-blue-200/50 dark:border-slate-700/50 pb-5 mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Details</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Update your account specifics and business classification details.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Photo upload placeholder */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 pb-2">
                      <div className="relative group cursor-pointer">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 to-violet-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white dark:border-slate-800 shadow-md">
                          {fullName.charAt(0)}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm">
                          <FiCamera />
                        </div>
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="font-bold text-slate-800 dark:text-slate-100">{fullName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{role}</div>
                        <button type="button" className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                          Upload Custom Avatar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase font-semibold">
                          Email Address (Non-editable)
                        </label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl border border-blue-200/70 dark:border-white/10 bg-slate-100 dark:bg-slate-900/50 text-sm text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed opacity-70"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase">
                          Role Title
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase">
                          Department
                        </label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Product Design">Product Design</option>
                          <option value="Management">Management</option>
                          <option value="Quality Assurance">Quality Assurance</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-blue-200/50 dark:border-slate-700/50">
                      <Button type="submit" disabled={isSavingProfile} className="px-6 py-2 flex items-center gap-2">
                        <FiSave />
                        {isSavingProfile ? "Saving..." : "Save Changes"}
                      </Button>

                      {showSavedToast && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
                        >
                          <FiCheck /> Profile updated and cached.
                        </motion.span>
                      )}
                    </div>
                  </form>
                </Card>
              )}

              {/* Appearance Panel */}
              {activeTab === "appearance" && (
                <Card className="p-6 md:p-8 bg-transparent">
                  <div className="border-b border-blue-200/50 dark:border-slate-700/50 pb-5 mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appearance & Theme</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Customize application layouts, dark settings, and accent highlight colors.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Theme selector cards */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3 uppercase">
                        Theme Mode
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Light theme card */}
                        <div
                          onClick={() => theme === "dark" && toggleTheme()}
                          className={`relative overflow-hidden p-4 rounded-xl border border-blue-200/70 dark:border-slate-700/50 bg-white dark:bg-slate-900 cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-between ${
                            theme === "light"
                              ? "ring-2 ring-blue-600 border-transparent shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                              : "opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-9 w-9 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center text-lg">
                              <FiSun />
                            </span>
                            <div>
                              <div className="text-sm font-bold text-slate-800">Light Mode</div>
                              <div className="text-[10px] text-slate-500">Soft layouts for bright desks</div>
                            </div>
                          </div>
                          {theme === "light" && (
                            <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                              <FiCheck />
                            </span>
                          )}
                        </div>

                        {/* Dark theme card */}
                        <div
                          onClick={() => theme === "light" && toggleTheme()}
                          className={`relative overflow-hidden p-4 rounded-xl border border-blue-200/70 dark:border-slate-700/50 bg-white dark:bg-slate-900 cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-between ${
                            theme === "dark"
                              ? "ring-2 ring-blue-600 border-transparent shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                              : "opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-9 w-9 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center text-lg">
                              <FiMoon />
                            </span>
                            <div>
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Dark Mode</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">Eye care for low-light contexts</div>
                            </div>
                          </div>
                          {theme === "dark" && (
                            <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                              <FiCheck />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Security Panel */}
              {activeTab === "security" && (
                <Card className="p-6 md:p-8 bg-transparent">
                  <div className="border-b border-blue-200/50 dark:border-slate-700/50 pb-5 mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Manage account credentials and configure system integration tokens.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Password modification form */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                        <FiKey className="text-blue-500" />
                        Modify Account Password
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                          />
                        </div>
                        <div>
                          <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                          />
                        </div>
                        <div>
                          <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                          />
                        </div>
                      </div>
                      <div className="mt-3.5 flex justify-end">
                        <Button type="button" className="px-5 py-2 text-xs">
                          Update Credentials
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
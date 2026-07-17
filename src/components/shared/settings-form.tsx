"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Save,
  Loader2,
  Check,
  User,
  Phone,
  Clock,
  Globe,
  Bell,
  Lock,
  Smartphone,
  Shield,
  Trash2,
  LogOut,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";
import { Badge } from "@/components/shared/badge";
import { NativeTextarea } from "@/components/shared/native";
import { TIMEZONES } from "@/lib/constants";
import {
  updateUserProfileAction,
  updateUserPreferencesAction,
  updateNotificationSettingsAction,
  changePasswordAction,
  getUserSessionsAction,
  getUserLoginHistoryAction,
  logoutDeviceAction,
  logoutOtherDevicesAction,
  deactivateAccountAction,
  deleteAccountAction,
} from "@/server/actions/user-profile";
import { analyzePasswordStrength } from "@/lib/auth/security-checks";

interface SettingsFormProps {
  initialData: {
    user: {
      id: string;
      email: string;
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      avatar: string | null;
      isVerified: boolean;
      status: string;
      createdAt: Date;
    };
    profile: {
      phone: string | null;
      bio: string | null;
    };
    preferences: {
      theme: string;
      language: string;
      timezone: string;
    };
    notifications: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      pushNotifications: boolean;
    };
    security: {
      loginLockoutDuration: number;
      passwordExpiryDays: number;
    };
  };
}

export function PersonalSettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const [activeTab, setActiveTab] = React.useState<"profile" | "preferences" | "notifications" | "security" | "danger">("profile");
  
  // Loading states
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPrefs, setSavingPrefs] = React.useState(false);
  const [savingNotify, setSavingNotify] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);
  const [loadingSessions, setLoadingSessions] = React.useState(false);

  // Success messages
  const [profileSuccess, setProfileSuccess] = React.useState(false);
  const [prefsSuccess, setPrefsSuccess] = React.useState(false);
  const [notifySuccess, setNotifySuccess] = React.useState(false);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  // Errors
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // 1. Profile state
  const [firstName, setFirstName] = React.useState(initialData.user.firstName || "");
  const [lastName, setLastName] = React.useState(initialData.user.lastName || "");
  const [phone, setPhone] = React.useState(initialData.profile.phone || "");
  const [bio, setBio] = React.useState(initialData.profile.bio || "");
  const [avatar, setAvatar] = React.useState(initialData.user.avatar || "");

  // 2. Preferences state
  const [themeVal, setThemeVal] = React.useState(initialData.preferences.theme || "system");
  const [languageVal, setLanguageVal] = React.useState(initialData.preferences.language || "en");
  const [timezoneVal, setTimezoneVal] = React.useState(initialData.preferences.timezone || "UTC");

  // 3. Notifications state
  const [emailNotify, setEmailNotify] = React.useState(initialData.notifications.emailNotifications);
  const [smsNotify, setSmsNotify] = React.useState(initialData.notifications.smsNotifications);
  const [pushNotify, setPushNotify] = React.useState(initialData.notifications.pushNotifications);

  // 4. Security state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [logoutOtherDevices, setLogoutOtherDevices] = React.useState(false);
  const [sessionsList, setSessionsList] = React.useState<any[]>([]);

  // 5. Danger confirm modals
  const [showDeactivateConfirm, setShowDeactivateConfirm] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Real-time password strength analyzer
  const strength = React.useMemo(() => {
    return analyzePasswordStrength(newPassword, initialData.user.email, firstName, lastName);
  }, [newPassword, initialData.user.email, firstName, lastName]);

  // Load user sessions when switching to Security Tab
  const loadSessions = React.useCallback(async () => {
    setLoadingSessions(true);
    try {
      const res = await getUserSessionsAction();
      if (res.success && res.sessions) {
        setSessionsList(res.sessions);
      }
    } catch (e) {
      // Ignore errors
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === "security") {
      loadSessions();
    }
  }, [activeTab, loadSessions]);

  // Submit Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);
    setErrorMsg(null);

    try {
      const result = await updateUserProfileAction({
        firstName,
        lastName,
        phone,
        bio,
        avatar: avatar || null,
      });

      if (result.success) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
        router.refresh();
      } else {
        setErrorMsg(result.error || "Failed to update profile details");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePrefs = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrefs(true);
    setPrefsSuccess(false);
    setErrorMsg(null);

    try {
      const result = await updateUserPreferencesAction({
        theme: themeVal,
        language: languageVal,
        timezone: timezoneVal,
      });

      if (result.success) {
        setTheme(themeVal);
        setPrefsSuccess(true);
        setTimeout(() => setPrefsSuccess(false), 3000);
        router.refresh();
      } else {
        setErrorMsg(result.error || "Failed to update preferences");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotify(true);
    setNotifySuccess(false);
    setErrorMsg(null);

    try {
      const result = await updateNotificationSettingsAction({
        emailNotifications: emailNotify,
        smsNotifications: smsNotify,
        pushNotifications: pushNotify,
      });

      if (result.success) {
        setNotifySuccess(true);
        setTimeout(() => setNotifySuccess(false), 3000);
      } else {
        setErrorMsg(result.error || "Failed to update notifications");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setSavingNotify(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (strength.score < 4) {
      setErrorMsg("Please select a stronger password");
      return;
    }

    setSavingPassword(true);
    setPasswordSuccess(false);
    setErrorMsg(null);

    try {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        logoutOtherDevices,
      });

      if (result.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setLogoutOtherDevices(false);
        setTimeout(() => setPasswordSuccess(false), 3000);
        if (logoutOtherDevices) {
          loadSessions();
        }
      } else {
        setErrorMsg(result.error || "Failed to change password");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const result = await logoutDeviceAction(sessionId);
      if (result.success) {
        loadSessions();
      } else {
        alert(result.error || "Failed to revoke session");
      }
    } catch (e) {
      alert("An unexpected error occurred");
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    if (!confirm("Are you sure you want to terminate all other device sessions?")) return;
    try {
      const result = await logoutOtherDevicesAction();
      if (result.success) {
        loadSessions();
      } else {
        alert(result.error || "Failed to revoke sessions");
      }
    } catch (e) {
      alert("An unexpected error occurred");
    }
  };

  const handleDeactivate = async () => {
    try {
      const result = await deactivateAccountAction();
      if (result.success) {
        router.push("/sign-in");
      } else {
        alert(result.error || "Failed to deactivate account");
      }
    } catch (e) {
      alert("An unexpected error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteAccountAction();
      if (result.success) {
        router.push("/sign-in");
      } else {
        alert(result.error || "Failed to delete account");
      }
    } catch (e) {
      alert("An unexpected error occurred");
    }
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return "bg-rose-500";
    if (score === 2) return "bg-amber-500";
    if (score === 3) return "bg-yellow-400";
    if (score === 4) return "bg-emerald-500/80";
    return "bg-emerald-500";
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Devices", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full">
      {/* Sidebar Nav */}
      <div className="flex md:flex-col flex-wrap gap-1.5 w-full md:w-60 shrink-0 bg-[#0d0c18]/45 border border-white/5 p-3 rounded-2xl backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setErrorMsg(null);
              }}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-left transition-all duration-300 w-full active:scale-[0.99] ${
                activeTab === tab.id
                  ? "bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Display */}
      <div className="flex-1 w-full bg-[#0d0c18]/30 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative min-h-[400px]">
        {errorMsg && (
          <div role="alert" className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-200 p-4 radius-xl text-caption animate-fade-in mb-6">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── TAB 1: USER PROFILE ── */}
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold text-white">Personal Profile</h2>
              <p className="text-xs text-slate-400">Configure your personal name, phone numbers, and profile bio.</p>
            </div>

            {/* Avatar input */}
            <div className="space-y-1.5">
              <Label htmlFor="avatar-url">Avatar Photo URL</Label>
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center overflow-hidden shrink-0 text-violet-400 font-bold uppercase">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    `${firstName.charAt(0)}${lastName.charAt(0)}`
                  )}
                </div>
                <Input
                  id="avatar-url"
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1"
                />
              </div>
            </div>

            {/* First and Last names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-firstName">First Name</Label>
                <Input
                  id="profile-firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-lastName">Last Name</Label>
                <Input
                  id="profile-lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-phone" className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-500" /> Phone Number
              </Label>
              <Input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Bio text */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-bio">Profile Biography</Label>
              <NativeTextarea
                id="profile-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief profile description..."
                className="w-full min-h-[100px] bg-slate-950/40 border border-slate-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 radius-xl px-4 py-3 text-body-sm text-white placeholder-slate-600 outline-none transition-all duration-300"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                {profileSuccess && (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold animate-fade-in">
                    <Check className="h-4 w-4" /> Profile updated successfully!
                  </div>
                )}
              </div>
              <Button type="submit" disabled={savingProfile} className="bg-violet-600 hover:bg-violet-500 flex items-center gap-2 px-6">
                {savingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* ── TAB 2: USER PREFERENCES ── */}
        {activeTab === "preferences" && (
          <form onSubmit={handleUpdatePrefs} className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold text-white">System Preferences</h2>
              <p className="text-xs text-slate-400">Configure language, themes, and dashboard timezones.</p>
            </div>

            {/* Theme Select */}
            <div className="space-y-1.5">
              <Label htmlFor="theme-select">Visual Interface Theme</Label>
              <Select value={themeVal} onValueChange={setThemeVal}>
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Select interface theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Theme</SelectItem>
                  <SelectItem value="dark">Dark Theme</SelectItem>
                  <SelectItem value="system">Follow System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Select */}
            <div className="space-y-1.5">
              <Label htmlFor="language-select">Interface Language</Label>
              <Select value={languageVal} onValueChange={setLanguageVal}>
                <SelectTrigger id="language-select">
                  <SelectValue placeholder="Select display language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="es">Español (ES)</SelectItem>
                  <SelectItem value="fr">Français (FR)</SelectItem>
                  <SelectItem value="de">Deutsch (DE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timezone Select */}
            <div className="space-y-1.5">
              <Label htmlFor="timezone-select" className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-500" /> Default Timezone
              </Label>
              <Select value={timezoneVal} onValueChange={setTimezoneVal}>
                <SelectTrigger id="timezone-select">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                {prefsSuccess && (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold animate-fade-in">
                    <Check className="h-4 w-4" /> Preferences updated successfully!
                  </div>
                )}
              </div>
              <Button type="submit" disabled={savingPrefs} className="bg-violet-600 hover:bg-violet-500 flex items-center gap-2 px-6">
                {savingPrefs ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Preferences
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* ── TAB 3: NOTIFICATIONS ── */}
        {activeTab === "notifications" && (
          <form onSubmit={handleUpdateNotifications} className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold text-white">Notifications</h2>
              <p className="text-xs text-slate-400">Configure email, SMS, and push notification alerts.</p>
            </div>

            {/* Notification Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-slate-950/20 border border-slate-900/60 p-4 rounded-xl">
                <input
                  id="notify-email"
                  type="checkbox"
                  checked={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="h-4 w-4 mt-1 rounded border-slate-800 bg-slate-950/40 text-violet-600 focus:ring-violet-500 focus:ring-offset-slate-950"
                />
                <div>
                  <label htmlFor="notify-email" className="text-sm font-semibold text-white select-none cursor-pointer">
                    Email Notifications
                  </label>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5">
                    Receive account alerts, call logs, weekly dashboard summary reports, and client billing reminders.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/20 border border-slate-900/60 p-4 rounded-xl">
                <input
                  id="notify-sms"
                  type="checkbox"
                  checked={smsNotify}
                  onChange={(e) => setSmsNotify(e.target.checked)}
                  className="h-4 w-4 mt-1 rounded border-slate-800 bg-slate-950/40 text-violet-600 focus:ring-violet-500 focus:ring-offset-slate-950"
                />
                <div>
                  <label htmlFor="notify-sms" className="text-sm font-semibold text-white select-none cursor-pointer">
                    SMS SMS Notifications
                  </label>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5">
                    Get text notifications on your phone for urgent client appointment escalations or critical system failures.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/20 border border-slate-900/60 p-4 rounded-xl">
                <input
                  id="notify-push"
                  type="checkbox"
                  checked={pushNotify}
                  onChange={(e) => setPushNotify(e.target.checked)}
                  className="h-4 w-4 mt-1 rounded border-slate-800 bg-slate-950/40 text-violet-600 focus:ring-violet-500 focus:ring-offset-slate-950"
                />
                <div>
                  <label htmlFor="notify-push" className="text-sm font-semibold text-white select-none cursor-pointer">
                    Browser Push Toggles
                  </label>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5">
                    Receive real-time push prompts in your browser when the receptionist AI is actively answering a call.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                {notifySuccess && (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold animate-fade-in">
                    <Check className="h-4 w-4" /> Notification settings updated!
                  </div>
                )}
              </div>
              <Button type="submit" disabled={savingNotify} className="bg-violet-600 hover:bg-violet-500 flex items-center gap-2 px-6">
                {savingNotify ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Alerts
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* ── TAB 4: SECURITY & DEVICES ── */}
        {activeTab === "security" && (
          <div className="space-y-8">
            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold text-white">Credentials & Security</h2>
                <p className="text-xs text-slate-400">Change your login password and restrict active session limits.</p>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-4 radius-xl text-caption animate-fade-in">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  <span>Password changed successfully! Previous sessions rotated.</span>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-1.5">
                <Label htmlFor="current-pw">Current Password</Label>
                <Input
                  id="current-pw"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <Label htmlFor="new-pw">New Password</Label>
                <div className="relative">
                  <input
                    id="new-pw"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/40 border border-slate-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 radius-xl pl-4 pr-10 py-3 text-body-sm text-white placeholder-slate-600 outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength meter */}
                {newPassword.length > 0 && (
                  <div className="space-y-2 mt-2 p-3 bg-slate-950/20 border border-slate-900 radius-lg animate-fade-in text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-slate-400">Password Strength</span>
                      <span className="text-violet-400">{strength.label}</span>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-1.5 h-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level} 
                          className={`h-full radius-full transition-all duration-300 ${
                            level <= strength.score ? getStrengthColor(strength.score) : "bg-slate-800"
                          }`} 
                        />
                      ))}
                    </div>

                    <div className="space-y-1 pt-1 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        {newPassword.length >= 12 ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        )}
                        <span>12+ characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        )}
                        <span>Uppercase & lowercase letters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/[0-9]/.test(newPassword) && /[!@#$%^&*()_+\-=\[\]\{\};':",.\/<>?]/.test(newPassword) ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        )}
                        <span>Number & symbol</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm-new-pw">Confirm New Password</Label>
                <Input
                  id="confirm-new-pw"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={confirmPassword && newPassword !== confirmPassword ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10" : ""}
                />
              </div>

              {/* Invalidate Checkbox */}
              <div className="flex items-center gap-2 py-1">
                <input
                  id="invalidate-sessions"
                  type="checkbox"
                  checked={logoutOtherDevices}
                  onChange={(e) => setLogoutOtherDevices(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-800 bg-slate-950/40 text-violet-600 focus:ring-violet-500 focus:ring-offset-slate-950"
                />
                <label htmlFor="invalidate-sessions" className="text-caption text-slate-400 font-medium select-none cursor-pointer">
                  Log out of all other devices on password update
                </label>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={savingPassword || strength.score < 4 || newPassword !== confirmPassword} 
                  className="bg-violet-600 hover:bg-violet-500 flex items-center gap-2"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" /> Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Active device sessions list */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Active Device Sessions</h3>
                  <p className="text-[11px] text-slate-400">These devices are currently logged in with your account credentials.</p>
                </div>
                {sessionsList.length > 1 && (
                  <Button 
                    onClick={handleRevokeAllOtherSessions}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 border border-rose-500/20 text-xs px-3"
                  >
                    Logout All Other Devices
                  </Button>
                )}
              </div>

              {loadingSessions ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 text-slate-500 animate-spin" />
                </div>
              ) : (
                <div className="divide-y divide-white/5 border border-white/5 rounded-xl overflow-hidden bg-slate-950/10">
                  {sessionsList.map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-4 hover:bg-white/[0.01] transition-colors">
                      <div className="flex gap-3.5 items-start">
                        <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400 shrink-0">
                          <Smartphone className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">
                              {session.userAgent ? (
                                session.userAgent.includes("Chrome") ? "Google Chrome" :
                                session.userAgent.includes("Safari") ? "Apple Safari" :
                                session.userAgent.includes("Firefox") ? "Mozilla Firefox" : "Web browser"
                              ) : "Unknown Device"}
                            </span>
                            {session.isCurrent && (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">
                                Current Session
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                            IP Address: <strong>{session.ipAddress || "Unknown"}</strong> • Created: {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          aria-label="Terminate session"
                          className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-500/15 transition-all duration-300"
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 5: DANGER ZONE ── */}
        {activeTab === "danger" && (
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold text-rose-400">Danger Zone</h2>
              <p className="text-xs text-slate-400">Perform destructive actions like deactivating or deleting your profile.</p>
            </div>

            <div className="space-y-4">
              {/* Deactivate account card */}
              <div className="p-5 border border-amber-500/10 bg-amber-500/[0.02] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-amber-200">Deactivate Account</h3>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5">
                    Deactivating suspends your account. You can reactivate your account at any time by logging in again.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowDeactivateConfirm(true)}
                  className="bg-amber-600/10 hover:bg-amber-600/20 text-amber-200 border border-amber-500/20 text-xs px-4"
                >
                  Deactivate Profile
                </Button>
              </div>

              {/* Delete account card */}
              <div className="p-5 border border-rose-500/15 bg-rose-500/[0.01] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-rose-200">Delete Account (Soft Delete)</h3>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5">
                    Soft deleting schedules your account for permanent removal. Your business templates remain isolated.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-4 flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Account
                </Button>
              </div>
            </div>

            {/* Deactivation Modal Dialog */}
            {showDeactivateConfirm && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#0b0a15] border border-white/5 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-scale-in text-left">
                  <div className="flex items-center gap-3 text-amber-400 mb-3">
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                    <h3 className="text-base font-bold text-white">Deactivate your Account?</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    This will log you out of all devices and suspend access to your business. You can reactivate by signing in again with your credentials.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button 
                      onClick={() => setShowDeactivateConfirm(false)}
                      className="bg-white/5 hover:bg-white/10 text-white text-xs px-4"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleDeactivate}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-4"
                    >
                      Confirm Deactivation
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Deletion Modal Dialog */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#0b0a15] border border-white/5 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-scale-in text-left">
                  <div className="flex items-center gap-3 text-rose-400 mb-3">
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                    <h3 className="text-base font-bold text-white">Delete your Account?</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Are you absolutely sure? This soft deletes your profile. Logins will be disabled and administrator restoration overrides will be required to recover.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-white/5 hover:bg-white/10 text-white text-xs px-4"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleDelete}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-4"
                    >
                      Confirm Deletion
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

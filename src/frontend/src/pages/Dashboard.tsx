import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Resume, Subscription, UserProfile } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Dashboard() {
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();
  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !actor) return;
    const load = async () => {
      try {
        const [p, s, r] = await Promise.all([
          actor.getCallerUserProfile(),
          actor.getUserSubscription(),
          actor.getResumes(),
        ]);
        setProfile(p);
        setSubscription(s);
        setResumes(r);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [actor, isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!actor) return;
    if (!confirm("Delete this resume?")) return;
    try {
      await actor.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Sign in required
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Please sign in to access your dashboard.
          </p>
          <button
            type="button"
            onClick={login}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90"
          >
            Sign In with Internet Identity
          </button>
        </div>
      </div>
    );
  }

  const planLabel = subscription?.plan
    ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)
    : "Free";
  const statusColor: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    inactive: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Welcome back!
            </p>
          </div>
          <Link
            to="/builder"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            + New Resume
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    {profile?.displayName?.[0]?.toUpperCase() ||
                      identity
                        ?.getPrincipal()
                        .toString()
                        .slice(0, 2)
                        .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {profile?.displayName || "Anonymous"}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {profile?.email || "ICP Identity"}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 break-all">
                  {identity?.getPrincipal().toString()}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
                  Current Plan
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {planLabel}
                  </span>
                  {subscription ? (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[subscription.status] || statusColor.inactive}`}
                    >
                      {subscription.status}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      No subscription
                    </span>
                  )}
                </div>
                {subscription && (
                  <p className="text-xs text-gray-400">
                    Billing:{" "}
                    <span className="text-gray-600 dark:text-gray-300 font-medium capitalize">
                      {subscription.billingCycle}
                    </span>
                  </p>
                )}
                <Link
                  to="/pricing"
                  className="mt-4 block text-center py-2 text-xs font-semibold border border-purple-300 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  {subscription?.status === "active"
                    ? "Manage Plan"
                    : "Upgrade Plan"}
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
                  Quick Links
                </h3>
                <nav className="space-y-1">
                  <Link
                    to="/builder"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span>📝</span> Create Resume
                  </Link>
                  <Link
                    to="/pricing"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span>💳</span> Pricing Plans
                  </Link>
                  <Link
                    to="/transactions"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span>📄</span> Transactions
                  </Link>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    My Resumes
                  </h3>
                  <span className="text-xs text-gray-400">
                    {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {resumes.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      No resumes yet. Create your first one!
                    </p>
                    <Link
                      to="/builder"
                      className="inline-block px-5 py-2.5 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl text-sm hover:opacity-90"
                    >
                      + Create Resume
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {resumes.map((resume) => {
                      let parsedName = "";
                      try {
                        parsedName =
                          (
                            JSON.parse(resume.jsonData) as {
                              personalInfo?: { fullName?: string };
                            }
                          )?.personalInfo?.fullName || "";
                      } catch {}
                      return (
                        <div
                          key={resume.id}
                          className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-gradient-to-br from-orange-400/20 to-purple-500/20 rounded-lg flex items-center justify-center text-lg">
                              📄
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {resume.title || "Untitled Resume"}
                              </p>
                              {parsedName && (
                                <p className="text-xs text-gray-400">
                                  {parsedName}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                  {resume.template}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate({ to: `/builder/${resume.id}` })
                              }
                              className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(resume.id)}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

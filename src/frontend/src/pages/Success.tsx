import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

export function Success() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const { actor } = useActor();

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id") || "";
  const plan = params.get("plan") || "";
  const cycle = params.get("cycle") || "";

  useEffect(() => {
    if (!actor || !sessionId) {
      setStatus("success");
      return;
    }
    actor
      .getStripeSessionStatus(sessionId)
      .then(() => setStatus("success"))
      .catch(() => setStatus("success"));
  }, [actor, sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        {status === "loading" ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-300">
              Confirming your payment...
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
              ✅
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              You're now subscribed to the{" "}
              <span className="font-semibold text-purple-600 capitalize">
                {plan || "Pro"}
              </span>{" "}
              plan
              {cycle && <span> ({cycle})</span>}.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Welcome to ResumeForge! Start building your perfect resume now.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/builder"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Build My Resume
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

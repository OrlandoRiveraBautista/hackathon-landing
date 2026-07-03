"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { GoogleIcon } from "@/components/GoogleIcon";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const nextPath = searchParams.get("next") ?? "/admin";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get("error") === "unauthorized"
      ? "This account is not authorized to access the admin panel."
      : "",
  );

  async function signInWithGoogle() {
    setError("");
    setLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: nextPath,
      });
    } catch {
      setError("Google sign in failed. Try again.");
      setLoading(false);
    }
  }

  async function signOut() {
    setError("");
    setLoading(true);

    try {
      await authClient.signOut();
      window.location.href = "/admin/login";
    } catch {
      setError("Sign out failed. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 p-8">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-2 text-sm text-white/60">
          Sign in with Google using an owner or admin account.
        </p>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#747775] bg-white px-4 py-2.5 text-sm font-medium text-[#1f1f1f] shadow-sm transition-all hover:border-[#5f6368] hover:bg-[#f1f3f4] hover:shadow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-[#747775] disabled:hover:bg-white disabled:hover:shadow-sm disabled:active:scale-100"
        >
          <GoogleIcon />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        {session?.user && (
          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-white/50">
              Signed in as {session.user.email}
            </p>
            <button
              type="button"
              onClick={signOut}
              disabled={loading}
              className="mt-3 cursor-pointer text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing out..." : "Sign out"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

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

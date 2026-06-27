"use client";

import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { SEX_OPTIONS } from "@/lib/waitlist";

type ProfilePageClientProps = {
  profile: Dictionary["profile"];
  locale: Locale;
};

const inputClassName =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/25";

export function ProfilePage({ profile, locale }: ProfilePageClientProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [school, setSchool] = useState("");
  const [github, setGithub] = useState("");
  const [interests, setInterests] = useState("");

  return (
    <>
      <SiteNav onRegisterClick={() => {}} />
      <main className="mt-24 min-h-screen bg-[#050505] px-6 py-10 text-white md:mt-28">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#090909]/95 p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
          <p className="text-sm uppercase tracking-[0.35em] text-[#aaff00]/80">
            {profile.title}
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
            {profile.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/70">{profile.subtitle}</p>

          <section className="mt-10 grid gap-8 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/10">
              <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                {profile.usernameLabel}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">john_doe</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/10">
              <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                {profile.emailLabel}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">john@example.com</p>
            </div>
          </section>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/10">
            <p className="text-sm uppercase tracking-[0.25em] text-white/50">
              {profile.bioLabel}
            </p>
            <p className="mt-3 text-base leading-7 text-white/75">{profile.bioText}</p>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-white/50">{locale.toUpperCase()}</p>
            <button
              type="button"
              className="rounded-full bg-[#aaff00] px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black transition hover:opacity-90"
            >
              {profile.editButton}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

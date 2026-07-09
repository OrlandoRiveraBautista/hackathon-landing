"use client";

import { useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { montserrat, outfit } from "@/lib/theme";

const MAX_SKILLS = 20;

type SkillsTagInputProps = {
  label: string;
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  hint?: string;
};

function normalizeSkill(raw: string) {
  return raw.trim().replace(/,+$/, "").trim();
}

function addSkill(skills: string[], raw: string) {
  const skill = normalizeSkill(raw);
  if (!skill || skills.length >= MAX_SKILLS) {
    return skills;
  }

  const exists = skills.some(
    (existing) => existing.toLowerCase() === skill.toLowerCase(),
  );
  if (exists) {
    return skills;
  }

  return [...skills, skill];
}

export function SkillsTagInput({
  label,
  skills,
  onChange,
  placeholder,
  hint,
}: SkillsTagInputProps) {
  const [draft, setDraft] = useState("");
  const atLimit = skills.length >= MAX_SKILLS;

  function commitDraft(raw: string) {
    const next = addSkill(skills, raw);
    if (next !== skills) {
      onChange(next);
    }
    setDraft("");
  }

  function removeSkill(skill: string) {
    onChange(skills.filter((item) => item !== skill));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft(draft);
      return;
    }

    if (event.key === "Backspace" && draft === "" && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text");
    if (!pasted.includes(",")) {
      return;
    }

    event.preventDefault();
    let next = skills;
    for (const part of pasted.split(",")) {
      const updated = addSkill(next, part);
      if (updated === next) {
        continue;
      }
      next = updated;
    }
    onChange(next);
    setDraft("");
  }

  return (
    <div className="group relative">
      <label
        className="block rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 transition-all duration-200 focus-within:border-[#aaff00]/30 focus-within:bg-[#aaff00]/[0.02] focus-within:shadow-[0_0_0_3px_rgba(170,255,0,0.06)]"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <span
          className="mb-2 block text-[9px] font-black tracking-[0.26em] text-white/30"
          style={{ fontFamily: montserrat }}
        >
          {label}
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] py-1.5 pl-3 pr-2 text-[11px] font-semibold text-white/55"
              style={{ fontFamily: outfit }}
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="cursor-pointer rounded-md px-1 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => {
              if (draft.trim()) {
                commitDraft(draft);
              }
            }}
            placeholder={atLimit ? undefined : placeholder}
            disabled={atLimit}
            className="min-w-[8rem] flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20 disabled:cursor-not-allowed"
            style={{ fontFamily: outfit }}
          />
        </div>
      </label>
      {hint && (
        <p className="mt-1.5 px-1 text-[11px] text-white/25" style={{ fontFamily: outfit }}>
          {hint}
        </p>
      )}
    </div>
  );
}

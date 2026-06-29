"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { useWaitlistCount } from "@/components/WaitlistCountProvider";
import { SEX_OPTIONS } from "@/lib/waitlist";
import ClickSpark from "./reactbits/ClickSpark";
import StarBorder from "./reactbits/StarBorder";
import "./WaitlistModal.css";

type WaitlistModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const EASE = "power3.out";
const HERO_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const montserrat = "var(--font-montserrat), Montserrat, sans-serif";
const outfit = "var(--font-outfit), Outfit, sans-serif";

const inputClassName =
  "waitlist-input w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/25";

export function WaitlistModal({ open, onClose, onSuccess }: WaitlistModalProps) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { waitlist } = dictionary;
  const { refresh } = useWaitlistCount();

  const [shouldRender, setShouldRender] = useState(open);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [school, setSchool] = useState("");
  const [github, setGithub] = useState("");
  const [interests, setInterests] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(waitlist.successDefault);
  const [successTitle, setSuccessTitle] = useState(waitlist.successTitle);

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const successContentRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
    setAge("");
    setSex("");
    setSchool("");
    setGithub("");
    setInterests("");
    setStatus("idle");
    setErrorMessage("");
    setSuccessMessage(waitlist.successDefault);
    setSuccessTitle(waitlist.successTitle);
  }, [waitlist.successDefault, waitlist.successTitle]);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setShouldRender(true);
  }

  const animateIn = useCallback(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const formContent = formContentRef.current;
    const successContent = successContentRef.current;
    if (!panel || !backdrop) return;

    gsap.killTweensOf([backdrop, panel, formContent, successContent]);

    if (formContent) formContent.style.display = "block";
    if (successContent) successContent.style.display = "none";
    gsap.set(formContent, { opacity: 1, y: 0 });
    gsap.set(successContent, { opacity: 0, scale: 1 });

    const fields = formContent?.querySelectorAll(".waitlist-field");
    const lines = formContent?.querySelectorAll(".waitlist-line");

    gsap.set(backdrop, { opacity: 0 });
    gsap.set(panel, { opacity: 0, y: 28, scale: 0.96 });
    if (fields?.length) gsap.set(fields, { opacity: 0, y: 14 });
    if (lines?.length) gsap.set(lines, { scaleX: 0 });

    const tl = gsap.timeline({ defaults: { ease: EASE } });

    tl.to(backdrop, { opacity: 1, duration: 0.45 })
      .to(
        panel,
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: HERO_EASE },
        "-=0.2",
      )
      .to(lines ?? [], { scaleX: 1, duration: 0.55, stagger: 0.08 }, "-=0.5")
      .to(
        fields ?? [],
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.09, ease: HERO_EASE },
        "-=0.45",
      );
  }, []);

  const animateOut = useCallback(
    (onComplete: () => void) => {
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      if (!panel || !backdrop) {
        onComplete();
        return;
      }

      gsap.killTweensOf([backdrop, panel]);

      gsap
        .timeline({ defaults: { ease: "power2.in" }, onComplete })
        .to(panel, { opacity: 0, y: 18, scale: 0.97, duration: 0.38 })
        .to(backdrop, { opacity: 0, duration: 0.28 }, "-=0.18");
    },
    [],
  );

  const requestClose = useCallback(() => {
    if (isClosingRef.current || !open) return;
    isClosingRef.current = true;
    animateOut(() => {
      isClosingRef.current = false;
      onClose();
    });
  }, [animateOut, onClose, open]);

  useEffect(() => {
    if (!shouldRender) return;

    if (open) {
      requestAnimationFrame(() => animateIn());
    } else if (!isClosingRef.current) {
      isClosingRef.current = true;
      animateOut(() => {
        isClosingRef.current = false;
        resetForm();
        setShouldRender(false);
      });
    }
  }, [open, shouldRender, animateIn, animateOut, resetForm]);

  useEffect(() => {
    if (!shouldRender) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [shouldRender, requestClose]);

  useEffect(() => {
    if (status !== "success") return;

    const formContent = formContentRef.current;
    const successContent = successContentRef.current;
    if (!formContent || !successContent) return;

    const successItems = successContent.querySelectorAll(".waitlist-success-item");

    gsap
      .timeline({ defaults: { ease: HERO_EASE } })
      .to(formContent, { opacity: 0, y: -12, duration: 0.35, ease: "power2.in" })
      .set(successContent, { display: "block" })
      .fromTo(
        successContent,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.5 },
      )
      .fromTo(
        successItems,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.25",
      );
  }, [status]);

  if (!shouldRender) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          age,
          sex,
          school,
          github,
          interests,
          locale,
        }),
      });

      const result = (await response.json()) as {
        alreadyRegistered?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? waitlist.errors.generic);
      }

      setSuccessTitle(
        result.alreadyRegistered
          ? waitlist.successAlreadyTitle
          : waitlist.successTitle,
      );
      setSuccessMessage(
        result.alreadyRegistered
          ? waitlist.successAlready
          : waitlist.successDefault,
      );
      setStatus("success");
      void refresh();
      onSuccess?.();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : waitlist.errors.generic,
      );
    }
  }

  function fieldLabel(label: string, optional = false) {
    return (
      <span
        className="mb-2 block text-xs tracking-[0.3em] text-white/45"
        style={{ fontFamily: outfit }}
      >
        {label}
        {optional && (
          <span className="ml-2 tracking-[0.15em] text-white/25">
            ({waitlist.optional})
          </span>
        )}
      </span>
    );
  }

  return (
    <div
      ref={backdropRef}
      className="waitlist-backdrop fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/80 px-4 py-4 backdrop-blur-md sm:items-center sm:py-8"
      onClick={requestClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="waitlist-panel relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#aaff00]/25 bg-[#050505] p-6 shadow-[0_0_80px_rgba(170,255,0,0.1)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-title"
      >
        <div className="waitlist-panel-glow" aria-hidden="true" />

        <button
          type="button"
          onClick={requestClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center text-lg text-white/40 transition-all duration-300 hover:rotate-90 hover:text-[#aaff00] sm:right-4 sm:top-4"
          aria-label="Close"
        >
          ✕
        </button>

        <div ref={successContentRef} className="text-center" style={{ display: "none" }}>
          <div className="waitlist-success-item mb-5 flex justify-center">
            <svg
              width="36"
              height="36"
              viewBox="-12 -12 24 24"
              className="waitlist-success-star text-[#aaff00]"
              aria-hidden="true"
            >
              <path
                d="M0,-12 L1.5,-1.5 L12,0 L1.5,1.5 L0,12 L-1.5,1.5 L-12,0 L-1.5,-1.5 Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <p
            id="waitlist-title"
            className="waitlist-success-item text-2xl font-black text-white"
            style={{ fontFamily: montserrat }}
          >
            {successTitle}
          </p>
          <p
            className="waitlist-success-item mt-3 text-white/70"
            style={{ fontFamily: outfit }}
          >
            {successMessage}
          </p>
          <button
            type="button"
            onClick={requestClose}
            className="waitlist-success-item mt-8 text-sm tracking-[0.25em] text-[#aaff00] transition-opacity hover:opacity-80"
            style={{ fontFamily: outfit }}
          >
            {waitlist.close}
          </button>
        </div>

        <div ref={formContentRef}>
          <div className="waitlist-field flex items-center gap-4">
            <div className="waitlist-line h-px flex-1 bg-[#aaff00]/70" />
            <h2
              id="waitlist-title"
              className="shrink-0 text-xl font-black tracking-wide text-white"
              style={{ fontFamily: montserrat }}
            >
              {waitlist.title}
            </h2>
            <div className="waitlist-line h-px flex-1 bg-[#aaff00]/70" />
          </div>

          <p
            className="waitlist-field mt-4 text-center text-sm tracking-wide text-white/55"
            style={{ fontFamily: outfit }}
          >
            {waitlist.subtitle}
          </p>

          <form className="mt-8 max-h-[60vh] space-y-5 overflow-y-auto pr-1" onSubmit={handleSubmit}>
            <label className="waitlist-field block">
              {fieldLabel(waitlist.name)}
              <input
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                autoComplete="name"
                className={inputClassName}
                placeholder={waitlist.namePlaceholder}
                style={{ fontFamily: outfit }}
              />
            </label>

            <label className="waitlist-field block">
              {fieldLabel(waitlist.email)}
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className={inputClassName}
                placeholder="you@example.com"
                style={{ fontFamily: outfit }}
              />
            </label>

            <label className="waitlist-field block">
              {fieldLabel(waitlist.phone)}
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                autoComplete="tel"
                inputMode="tel"
                className={inputClassName}
                placeholder={waitlist.phonePlaceholder}
                style={{ fontFamily: outfit }}
              />
            </label>

            <div className="waitlist-field grid gap-5 sm:grid-cols-2">
              <label className="block">
                {fieldLabel(waitlist.age)}
                <input
                  type="number"
                  name="age"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  required
                  min={18}
                  max={120}
                  inputMode="numeric"
                  className={inputClassName}
                  placeholder={waitlist.agePlaceholder}
                  style={{ fontFamily: outfit }}
                />
              </label>

              <label className="block">
                {fieldLabel(waitlist.sex)}
                <select
                  name="sex"
                  value={sex}
                  onChange={(event) => setSex(event.target.value)}
                  required
                  className={`${inputClassName} cursor-pointer`}
                  style={{ fontFamily: outfit }}
                >
                  <option value="" disabled>
                    {waitlist.sexPlaceholder}
                  </option>
                  {SEX_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {waitlist.sexOptions[option]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="waitlist-field block">
              {fieldLabel(waitlist.school, true)}
              <input
                type="text"
                name="school"
                value={school}
                onChange={(event) => setSchool(event.target.value)}
                autoComplete="organization"
                className={inputClassName}
                placeholder={waitlist.schoolPlaceholder}
                style={{ fontFamily: outfit }}
              />
            </label>

            <label className="waitlist-field block">
              {fieldLabel(waitlist.github, true)}
              <input
                type="text"
                name="github"
                value={github}
                onChange={(event) => setGithub(event.target.value)}
                autoComplete="off"
                className={inputClassName}
                placeholder={waitlist.githubPlaceholder}
                style={{ fontFamily: outfit }}
              />
            </label>

            <label className="waitlist-field block">
              {fieldLabel(waitlist.interests, true)}
              <textarea
                name="interests"
                value={interests}
                onChange={(event) => setInterests(event.target.value)}
                rows={2}
                className={`${inputClassName} resize-y`}
                placeholder={waitlist.interestsPlaceholder}
                style={{ fontFamily: outfit }}
              />
            </label>

            {status === "error" && errorMessage && (
              <p
                className="waitlist-error text-sm text-red-400"
                style={{ fontFamily: outfit }}
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <div className="waitlist-field pt-1">
              <ClickSpark
                sparkColor="#aaff00"
                sparkCount={8}
                sparkRadius={22}
                extraScale={1.3}
              >
                <StarBorder
                  as="button"
                  type="submit"
                  disabled={status === "submitting"}
                  color="#aaff00"
                  speed="5s"
                  thickness={1}
                  className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ fontFamily: montserrat }}
                >
                  {status === "submitting" ? waitlist.joining : waitlist.join}
                </StarBorder>
              </ClickSpark>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

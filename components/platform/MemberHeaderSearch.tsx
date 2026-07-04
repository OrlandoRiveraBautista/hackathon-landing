"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { MemberAvatar, SearchIcon, XIcon } from "@/components/platform";
import {
  memberProfilePath,
  membersDirectoryPath,
  type Locale,
} from "@/lib/i18n";
import type { PublicMemberProfile } from "@/lib/members/types";
import { montserrat, outfit } from "@/lib/theme";

type PreviewResponse = {
  members: PublicMemberProfile[];
  total: number;
};

function isMembersDirectoryPath(pathname: string, locale: Locale) {
  return pathname === membersDirectoryPath(locale);
}

export function MemberHeaderSearch() {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const labels = dictionary.members.directory;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const urlQuery = searchParams.get("q") ?? "";
  const openToTeams = searchParams.get("openToTeams") === "true";
  const onDirectoryPage = isMembersDirectoryPath(pathname, locale);

  const [query, setQuery] = useState(urlQuery);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<PreviewResponse | null>(null);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleShortcut(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLInputElement &&
          target.id !== "member-header-search")
      ) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setPreview(null);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          q: trimmed,
          limit: "5",
        });
        const response = await fetch(`/api/members?${params.toString()}`, {
          signal: controller.signal,
          headers: { "x-locale": locale },
        });

        if (!response.ok) {
          throw new Error("search_failed");
        }

        const data = (await response.json()) as PreviewResponse;
        setPreview(data);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }
        setPreview(null);
        setError(labels.searchFailed);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [labels.searchFailed, locale, query]);

  useEffect(() => {
    if (!onDirectoryPage) {
      return;
    }

    const trimmed = query.trim();
    if (trimmed === urlQuery.trim()) {
      return;
    }

    const timeout = window.setTimeout(() => {
      router.replace(
        membersDirectoryPath(locale, { q: trimmed, openToTeams }),
        { scroll: false },
      );
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [locale, onDirectoryPage, openToTeams, query, router, urlQuery]);

  function navigateToDirectory(nextQuery?: string) {
    setOpen(false);
    router.push(
      membersDirectoryPath(locale, {
        q: nextQuery ?? query,
        openToTeams: onDirectoryPage ? openToTeams : false,
      }),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateToDirectory();
  }

  function clearSearch() {
    setQuery("");
    setPreview(null);
    setOpen(false);
    inputRef.current?.focus();

    if (onDirectoryPage) {
      router.replace(membersDirectoryPath(locale, { openToTeams }));
    }
  }

  const trimmedQuery = query.trim();
  const showDropdown =
    open &&
    (loading ||
      error ||
      preview !== null ||
      trimmedQuery.length >= 2 ||
      (trimmedQuery.length === 0 && onDirectoryPage));

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1 lg:max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="member-header-search" className="sr-only">
          {labels.searchAriaLabel}
        </label>

        <div
          className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
            open
              ? "border-[#aaff00]/25 bg-[#aaff00]/[0.04] shadow-[0_0_0_4px_rgba(170,255,0,0.06),0_8px_32px_rgba(0,0,0,0.35)]"
              : "border-white/[0.08] bg-white/[0.035] hover:border-white/[0.12]"
          }`}
          style={{ backdropFilter: "blur(12px)" }}
        >
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            ref={inputRef}
            id="member-header-search"
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={labels.searchPlaceholder}
            autoComplete="off"
            role="combobox"
            aria-expanded={showDropdown ? true : false}
            aria-controls={listboxId}
            className="h-11 w-full bg-transparent py-2.5 pl-10 pr-24 text-sm text-white outline-none placeholder:text-white/25"
            style={{ fontFamily: outfit }}
          />

          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={labels.clearSearch}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/35 transition-all hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/70"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            )}
            <kbd
              className="hidden rounded-md border border-white/[0.08] bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-white/25 sm:inline"
              style={{ fontFamily: outfit }}
            >
              ⌘K
            </kbd>
          </div>
        </div>
      </form>

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="platform-dropdown-in absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808]/96 shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
          style={{
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04) inset, 0 20px 60px rgba(0,0,0,0.65)",
          }}
        >
          {trimmedQuery.length < 2 && !loading && (
            <div className="px-4 py-4">
              <p
                className="text-[11px] font-black tracking-[0.18em] text-white/25"
                style={{ fontFamily: montserrat }}
              >
                {labels.searchHint.toUpperCase()}
              </p>
              <p
                className="mt-2 text-sm text-white/40"
                style={{ fontFamily: outfit }}
              >
                {labels.searchHint}
              </p>
            </div>
          )}

          {loading && trimmedQuery.length >= 2 && (
            <div className="space-y-0 divide-y divide-white/[0.05] px-1 py-1">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex items-center gap-3 px-3 py-3">
                  <div className="platform-skeleton h-9 w-9 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="platform-skeleton h-3.5 w-32 rounded-md" />
                    <div className="platform-skeleton h-3 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="px-4 py-4 text-sm text-red-400" style={{ fontFamily: outfit }}>
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            preview &&
            preview.members.length === 0 &&
            trimmedQuery.length >= 2 && (
              <div className="px-4 py-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/20">
                  <SearchIcon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-white/55" style={{ fontFamily: outfit }}>
                  {labels.noResults}
                </p>
                <p className="mt-1 text-[11px] text-white/30" style={{ fontFamily: outfit }}>
                  {labels.noResultsHint}
                </p>
              </div>
            )}

          {!loading && !error && preview && preview.members.length > 0 && (
            <ul className="divide-y divide-white/[0.05] py-1">
              {preview.members.map((member) => (
                <li key={member.userId}>
                  <Link
                    href={memberProfilePath(locale, member.userId)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                  >
                    <MemberAvatar name={member.name} imageUrl={member.imageUrl} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-black text-white/90"
                        style={{ fontFamily: montserrat }}
                      >
                        {member.name}
                      </p>
                      <p
                        className="truncate text-[11px] text-white/35"
                        style={{ fontFamily: outfit }}
                      >
                        {member.school ||
                          member.skills.slice(0, 2).join(" · ") ||
                          member.interests ||
                          "—"}
                      </p>
                    </div>
                    {member.openToTeams && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#aaff00] shadow-[0_0_8px_rgba(170,255,0,0.8)]" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && trimmedQuery.length >= 2 && (
            <button
              type="button"
              onClick={() => navigateToDirectory()}
              className="flex w-full items-center justify-between border-t border-white/[0.06] px-4 py-3.5 text-left transition-colors hover:bg-[#aaff00]/[0.04]"
            >
              <span
                className="text-sm font-semibold text-[#aaff00]/85"
                style={{ fontFamily: outfit }}
              >
                {labels.viewAllResults}
              </span>
              {preview && (
                <span
                  className="rounded-full border border-[#aaff00]/20 bg-[#aaff00]/10 px-2 py-0.5 text-[10px] font-black text-[#aaff00]"
                  style={{ fontFamily: montserrat }}
                >
                  {preview.total}
                </span>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

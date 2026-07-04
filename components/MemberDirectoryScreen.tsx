"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DirectoryFilterBar } from "@/components/directory/DirectoryFilterBar";
import { DirectoryHero } from "@/components/directory/DirectoryHero";
import { MemberDirectoryCard } from "@/components/directory/MemberDirectoryCard";
import { MemberDirectorySkeletonGrid } from "@/components/directory/MemberDirectorySkeleton";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import {
  LogOutIcon,
  MemberAppShell,
  PlatformButton,
  PlatformPageFooter,
  SearchIcon,
} from "@/components/platform";
import { authClient } from "@/lib/auth/client";
import {
  localizedPath,
  memberHomePath,
  membersDirectoryPath,
  parseMembersDirectorySearch,
} from "@/lib/i18n";
import type { PublicMemberProfile } from "@/lib/members/types";
import { montserrat, outfit } from "@/lib/theme";

type MemberDirectoryScreenProps = {
  initialMembers: PublicMemberProfile[];
  initialTotal: number;
  initialTotalPages: number;
  initialQuery: string;
  initialOpenToTeams: boolean;
};

type DirectoryResponse = {
  members: PublicMemberProfile[];
  total: number;
  page: number;
  totalPages: number;
};

function normalizeQuery(value: string) {
  return value.trim();
}

export function MemberDirectoryScreen({
  initialMembers,
  initialTotal,
  initialTotalPages,
  initialQuery,
  initialOpenToTeams,
}: MemberDirectoryScreenProps) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const router = useRouter();
  const { members, profile } = dictionary;
  const labels = members.directory;
  const searchParams = useSearchParams();
  const { q: query, openToTeams } = parseMembersDirectorySearch({
    q: searchParams.get("q") ?? undefined,
    openToTeams: searchParams.get("openToTeams") ?? undefined,
  });

  const [results, setResults] = useState(initialMembers);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState("");
  const [signOutError, setSignOutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const normalizedQuery = normalizeQuery(query);
  const normalizedInitialQuery = normalizeQuery(initialQuery);
  const isPending =
    normalizedQuery !== normalizedInitialQuery ||
    openToTeams !== initialOpenToTeams;

  useEffect(() => {
    setResults(initialMembers);
    setTotal(initialTotal);
    setTotalPages(initialTotalPages);
    setPage(1);
    setLoadMoreError("");
  }, [initialMembers, initialOpenToTeams, initialQuery, initialTotal, initialTotalPages]);

  const statSuffix = total === 1 ? labels.statSuffixOne : labels.statSuffix;
  const showingCountLabel = labels.showingCount
    .replace("{shown}", String(results.length))
    .replace("{total}", String(total));

  function updateDirectorySearch(next: { q?: string; openToTeams?: boolean }) {
    router.replace(
      membersDirectoryPath(locale, {
        q: next.q ?? query,
        openToTeams: next.openToTeams ?? openToTeams,
      }),
      { scroll: false },
    );
  }

  async function loadMore() {
    if (loadingMore || page >= totalPages) {
      return;
    }

    setLoadingMore(true);
    setLoadMoreError("");

    try {
      const params = new URLSearchParams();
      if (normalizedQuery) {
        params.set("q", normalizedQuery);
      }
      if (openToTeams) {
        params.set("openToTeams", "true");
      }
      params.set("page", String(page + 1));

      const response = await fetch(`/api/members?${params.toString()}`, {
        headers: { "x-locale": locale },
      });

      if (!response.ok) {
        throw new Error("load_more_failed");
      }

      const data = (await response.json()) as DirectoryResponse;
      setResults((current) => {
        const seen = new Set(current.map((member) => member.userId));
        const nextMembers = data.members.filter((member) => !seen.has(member.userId));
        return [...current, ...nextMembers];
      });
      setPage(data.page);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setLoadMoreError(labels.searchFailed);
    } finally {
      setLoadingMore(false);
    }
  }

  async function signOut() {
    setSignOutError("");
    setSigningOut(true);
    try {
      await authClient.signOut();
      window.location.href = localizedPath(locale, "/login");
    } catch {
      setSignOutError(members.signOutFailed);
      setSigningOut(false);
    }
  }

  return (
    <MemberAppShell
      locale={locale}
      eyebrow={members.eyebrow}
      maxWidth="6xl"
      headerActions={
        <PlatformButton
          onClick={signOut}
          disabled={signingOut}
          variant="ghost"
          icon={<LogOutIcon className="h-3.5 w-3.5" />}
        >
          {signingOut ? members.signingOut : members.signOut}
        </PlatformButton>
      }
    >
      <DirectoryHero
        sectionLabel={labels.sectionLabel}
        title={labels.title}
        subtitle={labels.subtitle}
        statValue={String(total)}
        statSuffix={statSuffix}
        isLoadingCount={isPending}
        loadingLabel={labels.loading}
        query={query}
        showingResultsFor={labels.showingResultsFor}
        searchHint={labels.searchHint}
      />

      <DirectoryFilterBar
        sectionLabel={labels.sectionLabel}
        countLabel={isPending ? labels.loading : showingCountLabel}
        loading={isPending}
        loadingLabel={labels.loading}
        filterAllLabel={labels.filterAll}
        filterOpenTeamsLabel={labels.filterOpenTeams}
        activeFilter={openToTeams ? "open" : "all"}
        onChange={(filter) => {
          updateDirectorySearch({ openToTeams: filter === "open" });
        }}
      />

      {isPending ? (
        <MemberDirectorySkeletonGrid count={6} />
      ) : results.length === 0 ? (
        <div
          className="auth-item-in-3 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.018] px-6 py-14 text-center"
          style={{
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset",
          }}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white/20">
            <SearchIcon className="h-6 w-6" />
          </div>
          <p
            className="text-lg font-black text-white/75"
            style={{ fontFamily: montserrat }}
          >
            {labels.noResults}
          </p>
          <p
            className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/35"
            style={{ fontFamily: outfit }}
          >
            {labels.noResultsHint}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((member, index) => (
              <div
                key={member.userId}
                className={`auth-item-in-${Math.min(index + 2, 6)}`}
              >
                <MemberDirectoryCard
                  member={member}
                  locale={locale}
                  labels={{
                    openToTeams: profile.openToTeams,
                    notOpenToTeams: profile.notOpenToTeams,
                    viewProfile: labels.viewProfile,
                  }}
                />
              </div>
            ))}
          </div>

          {page < totalPages && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <PlatformButton
                onClick={loadMore}
                disabled={loadingMore}
                variant="ghost"
              >
                {loadingMore ? labels.loading : labels.loadMore}
              </PlatformButton>
              {loadMoreError && (
                <p className="text-sm text-red-400" style={{ fontFamily: outfit }}>
                  {loadMoreError}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {signOutError && (
        <p className="mt-4 text-sm text-red-400" style={{ fontFamily: outfit }}>
          {signOutError}
        </p>
      )}

      <PlatformPageFooter
        locale={locale}
        backLabel={members.backToHome}
        backHref={memberHomePath(locale)}
      />
    </MemberAppShell>
  );
}

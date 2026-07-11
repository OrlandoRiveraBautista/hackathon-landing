"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NotificationInviteList } from "@/components/notifications/NotificationInviteList";
import { useTeamInvites } from "@/components/notifications/useTeamInvites";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { memberNotificationsPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

export function NotificationBell() {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { notifications: n } = dictionary;
  const ariaLabel = dictionary.members.platformFooter.notifications;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const {
    invites,
    count,
    busyId,
    action,
    banner,
    error,
    respond,
    refreshCount,
    loadInvites,
  } = useTeamInvites(n.errors);

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, 30000);
    return () => clearInterval(interval);
  }, [refreshCount]);

  useEffect(() => {
    if (!open) return;

    loadInvites();

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, loadInvites]);

  async function handleRespond(inviteId: string, type: "accept" | "decline") {
    await respond(inviteId, type, {
      accepted: n.acceptedBanner,
      declined: n.declinedBanner,
    });
    refreshCount();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/45 transition-all duration-200 hover:border-[#aaff00]/25 hover:bg-[#aaff00]/10 hover:text-[#aaff00]"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4.5 w-4.5"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {count > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#aaff00] px-1 text-[9px] font-black text-[#050505]"
            style={{ fontFamily: montserrat }}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/95 shadow-[0_20px_60px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
          style={{
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
          }}
          role="dialog"
          aria-label={n.panelTitle}
        >
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p
              className="text-[10px] font-black tracking-[0.22em] text-white/35"
              style={{ fontFamily: montserrat }}
            >
              {n.panelTitle}
            </p>
          </div>

          <div className="max-h-[min(24rem,60vh)] overflow-y-auto">
            <NotificationInviteList
              invites={invites}
              locale={locale}
              compact
              busyId={busyId}
              action={action}
              banner={banner}
              error={error}
              labels={{
                inviteMessage: n.inviteMessage,
                accept: n.accept,
                decline: n.decline,
                accepting: n.accepting,
                declining: n.declining,
                emptyTitle: n.emptyTitle,
                emptySubtitle: n.emptySubtitle,
              }}
              onRespond={handleRespond}
            />
          </div>

          <div className="border-t border-white/[0.06] p-3">
            <Link
              href={memberNotificationsPath(locale)}
              onClick={() => setOpen(false)}
              className="block rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-center text-xs font-semibold text-white/55 transition-colors hover:border-[#aaff00]/25 hover:bg-[#aaff00]/10 hover:text-[#aaff00]"
              style={{ fontFamily: outfit }}
            >
              {n.viewAll}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useDictionary } from "@/components/LocaleProvider";
import { montserrat, outfit } from "@/lib/theme";

type ScheduleDay = {
  dayLabel: string;
  rows: Array<{ time: string; activity: string }>;
};

function ScheduleDayTable({
  day,
  tableTime,
  tableActivity,
}: {
  day: ScheduleDay;
  tableTime: string;
  tableActivity: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30">
      <p
        className="border-b border-white/10 px-5 py-3 text-[10px] font-black tracking-[0.24em] text-[#aaff00]/90 uppercase"
        style={{ fontFamily: montserrat }}
      >
        {day.dayLabel}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] font-black tracking-[0.2em] text-white/35 uppercase">
              <th
                className="w-[28%] px-5 py-3 text-left sm:w-[22%]"
                style={{ fontFamily: montserrat }}
              >
                {tableTime}
              </th>
              <th className="px-5 py-3 text-left" style={{ fontFamily: montserrat }}>
                {tableActivity}
              </th>
            </tr>
          </thead>
          <tbody>
            {day.rows.map((row) => (
              <tr
                key={`${day.dayLabel}-${row.time}-${row.activity}`}
                className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
              >
                <td
                  className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold tracking-wide text-[#aaff00]/80 tabular-nums sm:text-sm"
                  style={{ fontFamily: outfit }}
                >
                  {row.time}
                </td>
                <td
                  className="px-5 py-3.5 text-sm text-white/85"
                  style={{ fontFamily: outfit }}
                >
                  {row.activity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OnsiteSchedule() {
  const { onsiteSelection } = useDictionary();
  const { schedule } = onsiteSelection;

  return (
    <div className="space-y-4 px-5 py-5 sm:space-y-5 sm:px-6 sm:py-6">
      <ScheduleDayTable
        day={schedule.saturday}
        tableTime={schedule.tableTime}
        tableActivity={schedule.tableActivity}
      />
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-[#aaff00]/60 bg-[#aaff00]/[0.12] px-5 py-5 shadow-[0_0_40px_rgba(170,255,0,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-[#aaff00]/30 sm:px-6 sm:py-6"
        role="note"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(135deg, rgba(170,255,0,0.15) 0%, transparent 45%, rgba(170,255,0,0.12) 100%)",
          }}
        />
        <p
          className="relative text-[10px] font-black tracking-[0.32em] text-[#aaff00] uppercase"
          style={{ fontFamily: montserrat }}
        >
          {schedule.buildingExitLabel}
        </p>
        <p
          className="relative mt-2.5 text-base font-bold leading-snug text-white sm:text-lg"
          style={{ fontFamily: outfit }}
        >
          {schedule.buildingExitNote}
        </p>
      </div>
      <ScheduleDayTable
        day={schedule.sunday}
        tableTime={schedule.tableTime}
        tableActivity={schedule.tableActivity}
      />
    </div>
  );
}

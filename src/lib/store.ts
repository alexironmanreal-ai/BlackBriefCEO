import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Briefing, Dossier } from "./types";
import { EMPTY_DOSSIER } from "./types";
import { SAMPLE_DOSSIER, stampSampleBriefing } from "./sample-data";
import { todayKey, uid } from "./utils";

interface BriefState {
  hydrated: boolean;
  dossier: Dossier | null;
  briefings: Record<string, Briefing>;
  activeDate: string;
  generating: boolean;
  generateError: string | null;
  setHydrated: (value: boolean) => void;
  setDossier: (dossier: Dossier) => void;
  loadSample: () => void;
  startBlank: () => void;
  resetAll: () => void;
  setActiveDate: (date: string) => void;
  saveBriefing: (briefing: Briefing) => void;
  setGenerating: (value: boolean) => void;
  setGenerateError: (value: string | null) => void;
  todayBriefing: () => Briefing | undefined;
  activeBriefing: () => Briefing | undefined;
  archiveList: () => Briefing[];
}

export const useBriefStore = create<BriefState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      dossier: null,
      briefings: {},
      activeDate: todayKey(),
      generating: false,
      generateError: null,
      setHydrated: (value) => set({ hydrated: value }),
      setDossier: (dossier) => {
        set({ dossier });
        // Fire-and-forget DB mirror when signed in (best effort).
        void import("@/lib/company-memory")
          .then(({ saveCompanyDossier }) =>
            saveCompanyDossier({ data: { dossier } }),
          )
          .catch(() => {});
      },
      loadSample: () => {
        const date = todayKey();
        const briefing = stampSampleBriefing(date);
        set({
          dossier: SAMPLE_DOSSIER,
          briefings: { ...get().briefings, [date]: briefing },
          activeDate: date,
          generateError: null,
        });
      },
      startBlank: () =>
        set({
          dossier: { ...EMPTY_DOSSIER, executives: [{ name: "", role: "CEO" }] },
          activeDate: todayKey(),
        }),
      resetAll: () =>
        set({
          dossier: null,
          briefings: {},
          activeDate: todayKey(),
          generateError: null,
        }),
      setActiveDate: (date) => set({ activeDate: date }),
      saveBriefing: (briefing) => {
        set({
          briefings: { ...get().briefings, [briefing.date]: briefing },
          activeDate: briefing.date,
        });
        void import("@/lib/company-memory")
          .then(({ saveCompanyBriefing }) =>
            saveCompanyBriefing({
              data: { briefing: briefing as unknown as Record<string, unknown> },
            }),
          )
          .catch(() => {});
      },
      setGenerating: (value) => set({ generating: value }),
      setGenerateError: (value) => set({ generateError: value }),
      todayBriefing: () => get().briefings[todayKey()],
      activeBriefing: () => get().briefings[get().activeDate],
      archiveList: () =>
        Object.values(get().briefings).sort((a, b) => b.date.localeCompare(a.date)),
    }),
    {
      name: "blackbrief-ceo",
      skipHydration: true,
      partialize: (state) => ({
        dossier: state.dossier,
        briefings: state.briefings,
        activeDate: state.activeDate,
      }),
    },
  ),
);

export function newLiveBriefingId(): string {
  return `brief-${uid()}`;
}

import { create } from "zustand";

interface MatchedDriver {
  id: string;
  name: string;
  gender: "male" | "female";
  rating: number;
  estimatedArrival: string;
  accepted: boolean;
}

interface MatchingState {
  isMatched: boolean;
  matchedDriver: MatchedDriver | null;
  setMatchedDriver: (driver: MatchedDriver) => void;
  acceptDriver: () => void;
  rejectDriver: () => void;
  resetMatch: () => void;
}

export const useMatchingStore = create<MatchingState>((set) => ({
  isMatched: false,
  matchedDriver: null,

  setMatchedDriver: (driver) =>
    set({
      isMatched: true,
      matchedDriver: { ...driver, accepted: false },
    }),

  acceptDriver: () =>
    set((state) => ({
      matchedDriver: state.matchedDriver
        ? { ...state.matchedDriver, accepted: true }
        : null,
    })),

  rejectDriver: () =>
    set({
      isMatched: false,
      matchedDriver: null,
    }),

  resetMatch: () =>
    set({
      isMatched: false,
      matchedDriver: null,
    }),
}));

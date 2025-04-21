import { create } from "zustand";

// 기사 정보 인터페이스
export interface DriverInfo {
  id: string;
  name: string;
  gender: "male" | "female";
  rating: number;
  estimatedArrival: string;
  accepted: boolean;
}

// 매칭 스토어 상태 인터페이스
interface MatchingState {
  isMatched: boolean;
  matchedDriver: DriverInfo | null;
  setIsMatched: (isMatched: boolean) => void;
  setMatchedDriver: (driver: DriverInfo | null) => void;
  resetMatching: () => void; // 매칭 초기화 함수 추가
}

// 매칭 스토어 생성
export const useMatchingStore = create<MatchingState>((set) => ({
  isMatched: false,
  matchedDriver: null,
  setIsMatched: (isMatched) => set({ isMatched }),
  setMatchedDriver: (driver) =>
    set({ matchedDriver: driver, isMatched: !!driver }),
  resetMatching: () => set({ isMatched: false, matchedDriver: null }), // 매칭 상태 초기화
}));

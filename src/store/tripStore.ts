import { create } from "zustand";
import { TripRequest } from "../types";

interface TripState {
  destination: string;
  setDestination: (destination: string) => void;
  destinationCoords: { lat: number; lng: number } | null;
  setDestinationCoords: (coords: { lat: number; lng: number }) => void;
  femaleDriverOnly: boolean;
  toggleFemaleDriverOnly: () => void;
  protectionMode: boolean;
  toggleProtectionMode: () => void;
  isLoading: boolean;
  requestTrip: (request: TripRequest) => Promise<boolean>;
}

// 간단한 트립 스토어 구현
export const useTripStore = create<TripState>((set) => ({
  // 목적지
  destination: "",
  setDestination: (destination) => set({ destination }),

  // 목적지 좌표
  destinationCoords: null,
  setDestinationCoords: (coords) => set({ destinationCoords: coords }),

  // 여성 기사 전용 매칭 옵션
  femaleDriverOnly: true,
  toggleFemaleDriverOnly: () =>
    set((state) => ({ femaleDriverOnly: !state.femaleDriverOnly })),

  // 보호 모드 옵션
  protectionMode: true,
  toggleProtectionMode: () =>
    set((state) => ({ protectionMode: !state.protectionMode })),

  // 로딩 상태
  isLoading: false,

  // 운행 요청 함수
  requestTrip: async (request) => {
    set({ isLoading: true });

    // 실제 API 호출 대신 타임아웃으로 시뮬레이션
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("운행 요청:", request);
        set({ isLoading: false });
        resolve(true);
      }, 1000);
    });
  },
}));

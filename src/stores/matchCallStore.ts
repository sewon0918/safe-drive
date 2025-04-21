import { create } from "zustand";
import { CallRequest } from "../activities/driver/components/CallListItem";
import { TripStatus } from "../types/trip";

// 좌표 타입 정의
export interface Coordinate {
  lat: number;
  lng: number;
}

// 콜 요청 타입 확장
export interface CallRequestWithCoords extends CallRequest {
  originCoords: Coordinate;
  destinationCoords: Coordinate;
}

interface MatchCallState {
  // callStore에서 가져온 상태들
  calls: CallRequestWithCoords[];
  loading: boolean;

  // 기존 matchCallStore 상태들
  matchedCallId: string | null;
  tripStatus: TripStatus;

  // callStore에서 가져온 함수들
  setCalls: (calls: CallRequestWithCoords[]) => void;
  getCallById: (id: string) => CallRequestWithCoords | undefined;
  fetchCalls: () => Promise<void>;
  acceptCall: (id: string) => void;
  rejectCall: (id: string) => void;
  completeCall: (id: string) => void;

  // 기존 matchCallStore 함수들
  setTripStatus: (status: TripStatus) => void;
  resetMatch: () => void;
  hasMatchedCall: () => boolean;
}

export const useMatchCallStore = create<MatchCallState>((set, get) => ({
  // callStore에서 가져온 초기 상태
  calls: [],
  loading: false,

  // 기존 matchCallStore 초기 상태
  matchedCallId: null,
  tripStatus: "pending",

  // callStore에서 가져온 함수들
  setCalls: (calls) => set({ calls }),

  getCallById: (id) => {
    return get().calls.find((call) => call.id === id);
  },

  fetchCalls: async () => {
    set({ loading: true });

    // API 호출 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 모의 데이터 - 좌표 정보 포함
    const mockCalls: CallRequestWithCoords[] = [
      {
        id: "call-001",
        passengerName: "김승객",
        passengerGender: "male",
        passengerRating: 4.8,
        origin: "강남역 2번 출구",
        destination: "역삼동 르네상스호텔",
        estimatedFare: "₩15,000",
        distance: "3.5km",
        requestTime: "방금 전",
        originCoords: {
          lat: 37.5001,
          lng: 127.0271,
        },
        destinationCoords: {
          lat: 37.5068,
          lng: 127.0407,
        },
      },
      {
        id: "call-002",
        passengerName: "이여성",
        passengerGender: "female",
        passengerRating: 4.5,
        origin: "신논현역",
        destination: "양재역",
        estimatedFare: "₩18,000",
        distance: "5.2km",
        requestTime: "1분 전",
        originCoords: {
          lat: 37.5044,
          lng: 127.0253,
        },
        destinationCoords: {
          lat: 37.4841,
          lng: 127.0344,
        },
      },
      {
        id: "call-003",
        passengerName: "박고객",
        passengerGender: "male",
        passengerRating: 4.2,
        origin: "삼성역 1번 출구",
        destination: "코엑스몰",
        estimatedFare: "₩10,000",
        distance: "1.8km",
        requestTime: "2분 전",
        originCoords: {
          lat: 37.5089,
          lng: 127.0635,
        },
        destinationCoords: {
          lat: 37.5118,
          lng: 127.0592,
        },
      },
      {
        id: "call-004",
        passengerName: "정승객",
        passengerGender: "female",
        passengerRating: 4.9,
        origin: "압구정로데오역",
        destination: "청담동",
        estimatedFare: "₩14,000",
        distance: "3.2km",
        requestTime: "3분 전",
        originCoords: {
          lat: 37.5274,
          lng: 127.0388,
        },
        destinationCoords: {
          lat: 37.5222,
          lng: 127.0518,
        },
      },
    ];

    set({ calls: mockCalls, loading: false });
  },

  // 콜 수락 함수 통합 - 이제 매칭도 함께 처리
  acceptCall: (id) => {
    set((state) => ({
      ...state,
      matchedCallId: id,
      tripStatus: "heading", // 콜 수락 시 자동으로 heading 상태로 변경
    }));
  },

  rejectCall: (id) => {
    set((state) => ({
      ...state,
      calls: state.calls.filter((call) => call.id !== id),
    }));
  },
  completeCall: (id) => {
    set((state) => ({
      ...state,
      calls: state.calls.filter((call) => call.id !== id),
      matchedCallId: null,
      tripStatus: "pending",
    }));
  },

  setTripStatus: (status) => {
    set({ tripStatus: status });
  },

  resetMatch: () => {
    set({
      matchedCallId: null,
      tripStatus: "pending",
    });
  },

  hasMatchedCall: () => {
    return get().matchedCallId !== null;
  },
}));

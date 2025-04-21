// 위치 정보 타입
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

// 운행 상태 타입
export type TripStatus =
  | "requested" // 요청됨
  | "matched" // 매칭됨
  | "arrived" // 기사 도착
  | "ongoing" // 운행중
  | "completed" // 완료됨
  | "canceled"; // 취소됨

// 운행 정보 타입
export interface TripRequest {
  destination: Location;
  femaleDriverOnly: boolean;
  protectionModeEnabled: boolean;
}

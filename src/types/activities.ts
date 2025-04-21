// Stackflow 활동에 필요한 타입 정의
export interface ActivityComponentProps<TParams = {}> {
  params: TParams;
}

// 각 액티비티별 파라미터 타입 정의
export interface CallDriverParams {}

export interface WaitingDriverParams {
  destination: string;
  destinationLat: number;
  destinationLng: number;
  originLat: number;
  originLng: number;
  femaleDriverOnly: boolean;
  protectionModeEnabled: boolean;
}

export interface MatchedDriverParams {
  tripId: string;
  driverName: string;
  driverRating: number;
  estimatedArrival: string;
}

export interface TripOngoingParams {
  tripId: string;
}

export interface TripCompleteParams {
  tripId: string;
  fare: number;
}

// 추가 필요한 파라미터 타입
export interface DriverInfoParams {
  driverId: string;
  driverName: string;
  driverRating: number;
  driverGender: "male" | "female";
  estimatedArrival: string;
}

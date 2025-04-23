import { DriverInfo } from "../store/matchingStore";

// 기사 매칭 API 호출 함수
export const matchDriver = async (
  femaleDriverOnly: boolean,
  protectionMode: boolean
): Promise<DriverInfo> => {
  // API 호출 시뮬레이션 (지연 시간 추가)
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 성별 조건에 따른 기사 매칭
  const mockDriver: DriverInfo = {
    id: "driver-123",
    name: femaleDriverOnly ? "김여성" : "홍길동",
    gender: femaleDriverOnly ? "female" : "male",
    rating: 4.8,
    femaleRating: femaleDriverOnly ? 4.7 : undefined,
    estimatedArrival: "5분 후",
    accepted: false, // 초기에는 수락되지 않은 상태
  };

  // 5% 확률로 에러 발생 (테스트용)
  if (Math.random() < 0.05) {
    throw new Error("기사 매칭 중 문제가 발생했습니다. 다시 시도해주세요.");
  }

  return mockDriver;
};

// 기사 매칭 수락 API 호출 함수
export const acceptDriver = async (driverId: string): Promise<DriverInfo> => {
  // API 호출 시뮬레이션 (지연 시간 추가)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 기사 수락 로직
  return {
    id: driverId,
    name: "김여성",
    gender: "female",
    rating: 4.8,
    femaleRating: 4.7,
    estimatedArrival: "5분 후",
    accepted: true, // 수락된 상태로 변경
  };
};

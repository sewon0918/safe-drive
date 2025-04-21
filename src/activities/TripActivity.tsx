import React, { useEffect, useState } from "react";
import { useFlow } from "../stackflow";
import Map from "../components/common/Map";
import {
  ActivityComponentProps,
  WaitingDriverParams,
} from "../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useMatchingStore } from "../store/matchingStore";
import {
  MatchingComponent,
  MatchedPendingComponent,
  WaitingComponent,
  OngoingComponent,
} from "./trip/components";

// 여행 상태 타입 정의
type TripStatus = "matching" | "matchedPending" | "waiting" | "ongoing";

// 여행(매칭→대기→운행) 화면 구현
export const TripActivity: React.FC<
  ActivityComponentProps<WaitingDriverParams>
> = ({ params }) => {
  const { push, pop } = useFlow();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTripCountdown, setStartTripCountdown] = useState<number | null>(
    null
  );

  // 여행 상태 관리 (매칭 중 → 매칭됨(확인전) → 대기 중 → 운행 중)
  const [tripStatus, setTripStatus] = useState<TripStatus>("matching");

  // 매칭 스토어에서 상태 가져오기
  const { isMatched, matchedDriver, setMatchedDriver } = useMatchingStore();

  // 기사 매칭 + 수락 완료 여부 (매칭 완료 상태는 isMatched && accepted가 모두 true일 때)
  const isMatchingCompleted = isMatched && matchedDriver?.accepted;

  // 출발지와 목적지 좌표 - 지도 표시에 사용 (유효성 검사 추가)
  const originCoords = {
    lat: typeof params.originLat === "number" ? params.originLat : 37.5665,
    lng: typeof params.originLng === "number" ? params.originLng : 126.978,
  };

  const destinationCoords = {
    lat:
      typeof params.destinationLat === "number"
        ? params.destinationLat
        : 37.5012,
    lng:
      typeof params.destinationLng === "number"
        ? params.destinationLng
        : 127.0396,
  };

  // 대기 시간 계산을 위한 타이머 & 3초 후 기사 매칭
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // 매칭되지 않았고, 매칭된 기사가 없을 때만 매칭 진행
    if (!isMatched && !matchedDriver && tripStatus === "matching") {
      // 3초 후 기사 정보 화면으로 이동
      const matchTimer = setTimeout(() => {
        const mockDriver = {
          id: "driver-123",
          name: "김여성",
          gender: "female" as "male" | "female",
          rating: 4.8,
          estimatedArrival: "5분 후",
          accepted: false, // 초기에는 accepted가 false
        };

        // 매칭 스토어에 기사 정보 저장 (아직 수락되지 않은 상태)
        setMatchedDriver(mockDriver);

        // 매칭됨(확인전) 상태로 변경
        setTripStatus("matchedPending");
        push("DriverInfo", {
          driverId: mockDriver.id,
          driverName: mockDriver.name,
          driverRating: mockDriver.rating,
          driverGender: mockDriver.gender,
          estimatedArrival: mockDriver.estimatedArrival,
        });
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(matchTimer);
      };
    }

    return () => {
      clearInterval(timer);
    };
  }, [isMatched, matchedDriver, tripStatus, setMatchedDriver]);

  // 매칭 수락 상태 변경 감지 및 카운트다운 시작
  useEffect(() => {
    if (
      isMatchingCompleted &&
      tripStatus !== "waiting" &&
      tripStatus !== "ongoing"
    ) {
      // 매칭 완료 - 대기 상태로 전환
      setTripStatus("waiting");
      // 5초 후 운행 시작 카운트다운 시작
      setStartTripCountdown(5);
    }
  }, [isMatchingCompleted, tripStatus]);

  // 카운트다운 처리
  useEffect(() => {
    if (startTripCountdown === null) return;

    if (startTripCountdown <= 0) {
      // 카운트다운 종료 - 운행 상태로 전환
      setTripStatus("ongoing");
      return;
    }

    // 1초마다 카운트다운 감소
    const timer = setTimeout(() => {
      setStartTripCountdown((prev) => (prev ?? 0) - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [startTripCountdown]);

  // 기사님 정보 상세 보기
  const handleViewDriverDetails = () => {
    if (matchedDriver) {
      push("DriverInfo", {
        driverId: matchedDriver.id,
        driverName: matchedDriver.name,
        driverRating: matchedDriver.rating,
        driverGender: matchedDriver.gender,
        estimatedArrival: matchedDriver.estimatedArrival,
      });
    }
  };

  // 두 지점 사이의 거리 계산 (Haversine 공식)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // 지구 반경 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 킬로미터 단위 거리

    return distance;
  };

  // 거리를 기반으로 대략적인 소요 시간 계산 (운전 평균 속도 50km/h 가정)
  const calculateDuration = (distanceInKm: number) => {
    const averageSpeedKmPerHour = 50;
    const durationHours = distanceInKm / averageSpeedKmPerHour;
    const durationMinutes = Math.ceil(durationHours * 60);

    return durationMinutes;
  };

  // 두 지점 사이의 거리 계산 (km)
  const distance = calculateDistance(
    originCoords.lat,
    originCoords.lng,
    destinationCoords.lat,
    destinationCoords.lng
  );

  // 예상 소요 시간 (분)
  const duration = calculateDuration(distance);

  // 화면에 표시할 거리 포맷팅
  const formattedDistance =
    distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // 꽉 찬 별
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`star-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // 반쪽 별
    if (hasHalfStar) {
      stars.push(
        <svg
          key="star-half"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // 빈 별
    for (let i = 0; i < 5 - fullStars - (hasHalfStar ? 1 : 0); i++) {
      stars.push(
        <svg
          key={`star-empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  // 비상 연락처 처리
  const handleEmergencyContact = () => {
    alert("비상 연락처로 연결합니다.");
    // 실제 구현에서는 연락처 목록이나 직접 통화 기능 추가
  };

  // 긴급 상황 신고 처리
  const handleEmergencyReport = () => {
    alert("긴급 상황 신고가 접수되었습니다. 빠른 조치를 취하겠습니다.");
    // 실제 구현에서는 긴급 신고 API 호출
  };

  // 탭 제목 설정
  const getTripStatusTitle = (): string => {
    switch (tripStatus) {
      case "matching":
        return "기사님 매칭 중";
      case "matchedPending":
        return "기사님 매칭 완료";
      case "waiting":
        return "기사님 도착 대기 중";
      case "ongoing":
        return "운행 중";
      default:
        return "여행 진행 중";
    }
  };

  return (
    <AppScreen appBar={{ title: getTripStatusTitle() }}>
      <div className="flex flex-col h-full">
        {/* 지도 영역 */}
        <div className="relative h-3/5">
          <Map
            initialCenter={originCoords}
            markers={[
              {
                position: originCoords,
                title: "출발지",
                icon: "origin",
              },
              {
                position: destinationCoords,
                title: "목적지",
                icon: "destination",
              },
              ...(matchedDriver && tripStatus !== "matching"
                ? [
                    {
                      position: {
                        lat: originCoords.lat - 0.003,
                        lng: originCoords.lng - 0.002,
                      },
                      title: `${matchedDriver.name} 기사님`,
                      icon: "driver",
                    },
                  ]
                : []),
            ]}
            path={{
              origin: originCoords,
              destination: destinationCoords,
            }}
          />
        </div>

        {/* 상태별 정보 영역 */}
        <div className="h-2/5 bg-white rounded-t-3xl shadow-lg px-4 py-6">
          {tripStatus === "matching" && (
            <MatchingComponent
              elapsedTime={elapsedTime}
              destination={params.destination}
              femaleDriverOnly={params.femaleDriverOnly}
              protectionModeEnabled={params.protectionModeEnabled}
              onCancel={pop}
            />
          )}

          {tripStatus === "matchedPending" && matchedDriver && (
            <MatchedPendingComponent
              onViewDriverDetails={handleViewDriverDetails}
            />
          )}

          {tripStatus === "waiting" && matchedDriver && (
            <WaitingComponent
              driver={matchedDriver}
              countdown={startTripCountdown}
              onViewDriverDetails={handleViewDriverDetails}
              renderStars={renderStars}
            />
          )}

          {tripStatus === "ongoing" && matchedDriver && (
            <OngoingComponent
              driver={matchedDriver}
              distance={formattedDistance}
              duration={duration}
              estimatedFare="₩15,000"
              renderStars={renderStars}
              onEmergencyContact={handleEmergencyContact}
              onEmergencyReport={handleEmergencyReport}
            />
          )}
        </div>
      </div>
    </AppScreen>
  );
};

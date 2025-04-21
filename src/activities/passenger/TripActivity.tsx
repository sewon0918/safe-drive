import React, { useEffect, useState } from "react";
import { useFlow } from "../../stackflow";
import Map from "../../components/common/Map";
import {
  ActivityComponentProps,
  WaitingDriverParams,
} from "../../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useMatchingStore } from "../../store/matchingStore";
import {
  MatchingComponent,
  MatchedPendingComponent,
  WaitingComponent,
  OngoingComponent,
} from "./trip/components";
import useRouteAnimation from "../../hooks/useRouteAnimation";

// 여행 상태 타입 정의
type TripStatus = "matching" | "matchedPending" | "waiting" | "ongoing";

// 여행(매칭→대기→운행) 화면 구현
export const TripActivity: React.FC<
  ActivityComponentProps<WaitingDriverParams>
> = ({ params }) => {
  const { push, pop } = useFlow();

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

  // 기사 초기 위치 계산 (출발지에서 약간 떨어진 위치)
  const calculateInitialDriverPosition = () => {
    // 출발지로부터 약 500m 떨어진 위치 계산 (대략적인 계산)
    const offset = 0.005; // 약 500m에 해당하는 위도/경도 오프셋
    return {
      lat: originCoords.lat - offset,
      lng: originCoords.lng - offset * 1.2, // 약간 대각선 방향으로
    };
  };
  // 기존 startTripCountdown 삭제하고 기사 위치 상태로 대체
  const [initialDriverPosition] = useState<{
    lat: number;
    lng: number;
  }>(calculateInitialDriverPosition());

  // 대신 커스텀 훅을 사용해 애니메이션 구현
  const {
    currentPosition: driverPosition,
    startAnimation: startDriverAnimation,
  } = useRouteAnimation({
    startCoords: initialDriverPosition,
    endCoords: originCoords,
    durationInSeconds: 5, // 10초 동안 애니메이션
    onComplete: () => {
      // 애니메이션 완료 시(기사님 도착 시) 운행 중 상태로 변경
      setTripStatus("ongoing");
    },
  });

  // 대기 시간 계산을 위한 타이머 & 3초 후 기사 매칭
  useEffect(() => {
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
      }, 3000);

      return () => clearTimeout(matchTimer);
    }
  }, [isMatched, matchedDriver, tripStatus, setMatchedDriver, push]);

  // 매칭 완료 시 대기 상태로 변경 및 기사 위치 애니메이션 시작
  useEffect(() => {
    if (isMatchingCompleted && tripStatus === "matchedPending") {
      // 대기 상태로 변경
      setTripStatus("waiting");

      // 즉시 실행하지 않고 상태 업데이트가 완료된 후에 실행
      const timer = setTimeout(() => {
        startDriverAnimation();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isMatchingCompleted, tripStatus]); // startDriverAnimation 의존성 제거

  // 운행 완료 타이머 관리를 위한 상태
  useEffect(() => {
    if (tripStatus === "ongoing") {
      setTimeout(() => {
        // 운행 완료 화면으로 이동
        push("TripCompleted", {
          driverId: matchedDriver?.id || "",
          driverName: matchedDriver?.name || "",
          driverGender: matchedDriver?.gender || "male",
          driverRating: matchedDriver?.rating || 4.5,
          tripDistance: formattedDistance,
          tripDuration: duration,
          tripFare: "₩15,000",
          pickup: params.origin || "출발지",
          dropoff: params.destination || "목적지",
        });
      }, 10000); // 10초 후 실행
    }
  }, [tripStatus]);

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
        return "기사님 매칭 대기 중";
      case "waiting":
        return "기사님 도착 대기 중";
      case "ongoing":
        return "운행 중";
      default:
        return "여행 진행 중";
    }
  };

  useEffect(() => {
    // 매칭 상태가 변경될 때 tripStatus 업데이트
    if (!isMatched || !matchedDriver) {
      setTripStatus("matching");
    } else if (isMatched && matchedDriver && !matchedDriver.accepted) {
      setTripStatus("matchedPending");
    }
  }, [isMatched, matchedDriver]);

  // 지도에 표시할 마커들 계산
  const mapMarkers = [
    {
      position: originCoords,
      title: "출발지",
    },
    {
      position: destinationCoords,
      title: "목적지",
    },
    // 기사 위치 마커 (대기 중이거나 운행 중일 때만 표시)
    ...(driverPosition && (tripStatus === "waiting" || tripStatus === "ongoing")
      ? [
          {
            position: driverPosition,
            title: `${matchedDriver?.name || ""} 기사님`,
          },
        ]
      : []),
  ];

  return (
    <AppScreen appBar={{ title: getTripStatusTitle() }}>
      <div className="flex flex-col h-full bg-gray-100">
        {/* 지도 영역 */}
        <div className="h-3/5 relative">
          <Map
            initialCenter={originCoords}
            markers={mapMarkers}
            zoom={3}
            path={{
              origin: originCoords,
              destination: destinationCoords,
            }}
            key="trip-map"
          />
        </div>

        {/* 상태별 정보 영역 */}
        <div className="h-2/5 bg-white rounded-t-3xl shadow-lg overflow-hidden p-4">
          {tripStatus === "matching" && (
            <MatchingComponent
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
              onViewDriverDetails={handleViewDriverDetails}
              // 카운트다운 제거하고 도착 상태 메시지 표시
              arrivalMessage="기사님이 출발지로 이동 중입니다..."
            />
          )}

          {tripStatus === "ongoing" && matchedDriver && (
            <OngoingComponent
              driver={matchedDriver}
              distance={formattedDistance}
              duration={duration}
              estimatedFare="₩15,000"
              onEmergencyReport={handleEmergencyReport}
              originCoords={originCoords}
              destinationCoords={destinationCoords}
            />
          )}
        </div>
      </div>
    </AppScreen>
  );
};

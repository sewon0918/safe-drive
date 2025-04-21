import React, { useEffect, useState } from "react";
import { useFlow } from "../stackflow";
import Map from "../components/common/Map";
import {
  ActivityComponentProps,
  WaitingDriverParams,
} from "../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import DriverMatchCard from "../components/passenger/DriverMatchCard";

// 대기 화면 구현
export const WaitingDriverActivity: React.FC<
  ActivityComponentProps<WaitingDriverParams>
> = ({ params }) => {
  const { push, pop } = useFlow();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDriverMatch, setShowDriverMatch] = useState(false);

  // 매칭된 기사님 정보
  const [matchedDriver, setMatchedDriver] = useState({
    name: "김여성",
    gender: "female" as "male" | "female",
    rating: 4.8,
    estimatedArrival: "5분 후",
  });

  // string을 boolean으로 변환
  const femaleDriverOnly = params.femaleDriverOnly;
  const protectionModeEnabled = params.protectionModeEnabled;

  // 출발지와 목적지 좌표 - 지도 표시에 사용
  const originCoords = { lat: params.originLat, lng: params.originLng };
  const destinationCoords = {
    lat: params.destinationLat,
    lng: params.destinationLng,
  };

  // 대기 시간 계산을 위한 타이머 & 5초 후 기사 매칭 표시
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // 5초 후 매칭 카드 표시
    const matchTimer = setTimeout(() => {
      setShowDriverMatch(true);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimer);
    };
  }, []);

  // 매칭 수락 처리
  const handleAcceptMatch = () => {
    console.log("매칭 수락");
    setShowDriverMatch(false);
    // 여기서 실제로는 다음 화면으로 이동하거나 상태를 변경해야 함
    alert("기사님과 매칭되었습니다. 곧 도착 예정입니다.");
  };

  // 매칭 거절 처리
  const handleDeclineMatch = () => {
    console.log("매칭 거절");
    setShowDriverMatch(false);
    // 다시 매칭 대기 상태로 돌아감
    alert("매칭이 거절되었습니다. 다시 매칭을 시도합니다.");
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

  // 거리 및 소요시간 계산
  const distance = calculateDistance(
    params.originLat,
    params.originLng,
    params.destinationLat,
    params.destinationLng
  );

  const formattedDistance =
    distance < 1
      ? `${(distance * 1000).toFixed(0)}m`
      : `${distance.toFixed(1)}km`;

  const duration = calculateDuration(distance);

  return (
    <AppScreen appBar={{ title: "매칭중" }}>
      <div className="flex flex-col h-full bg-gray-100">
        {/* 지도 영역 */}
        <div className="relative h-3/5">
          <Map
            initialCenter={originCoords}
            markers={[
              { position: originCoords, title: "출발지" },
              { position: destinationCoords, title: "도착지" },
            ]}
            showRoute={true}
            zoom={3}
            className="h-full w-full"
            fitBounds={true}
          />

          {/* 출발지와 도착지 사이 거리 정보 오버레이 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-md text-sm">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-500 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              약 {formattedDistance} • 예상 소요시간 {duration}분
            </div>
          </div>
        </div>

        {/* 대기 정보 영역 */}
        <div className="h-2/5 bg-white rounded-t-3xl shadow-lg px-4 py-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <svg
                className="animate-spin h-10 w-10 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              기사님을 찾고 있어요
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {femaleDriverOnly ? "여성 기사님만 매칭 중입니다." : ""}
            </p>
            <div className="text-gray-400 text-sm">
              대기 시간: {elapsedTime}초
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">목적지:</span> {params.destination}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">보호 모드:</span>{" "}
              {protectionModeEnabled ? "활성화" : "비활성화"}
            </p>

            <button
              className="w-full py-4 bg-red-500 text-white font-medium rounded-lg"
              onClick={() => pop()}
            >
              호출 취소하기
            </button>
          </div>
        </div>

        {/* 기사 매칭 카드 */}
        {showDriverMatch && (
          <DriverMatchCard
            driverName={matchedDriver.name}
            driverGender={matchedDriver.gender}
            driverRating={matchedDriver.rating}
            estimatedArrival={matchedDriver.estimatedArrival}
            onAccept={handleAcceptMatch}
            onDecline={handleDeclineMatch}
          />
        )}
      </div>
    </AppScreen>
  );
};

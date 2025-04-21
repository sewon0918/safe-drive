import React from "react";
import { useFlow } from "../../stackflow";
import { ActivityComponentProps } from "../../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import Map from "../../components/common/Map";
import PassengerProfileCard from "./components/PassengerProfileCard";
import { useMatchCallStore } from "../../stores/matchCallStore";

// 간소화된 파라미터 타입 - ID만 필요
export interface DriverTripParams {
  callId: string;
}

export const DriverTripActivity: React.FC<
  ActivityComponentProps<DriverTripParams>
> = ({ params }) => {
  const { push, pop } = useFlow();
  const { getCallById, acceptCall, rejectCall, tripStatus, setTripStatus } =
    useMatchCallStore();

  // ID로 콜 정보 조회
  const callInfo = getCallById(params.callId);

  // 콜 정보가 없으면 로딩 표시
  if (!callInfo) {
    return (
      <AppScreen appBar={{ title: "로딩 중..." }}>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </AppScreen>
    );
  }

  // 승객 정보 상세 보기
  const handleViewPassengerInfo = () => {
    push("PassengerInfo", {
      passengerId: params.callId,
      passengerName: callInfo.passengerName,
      passengerGender: callInfo.passengerGender,
      passengerRating: callInfo.passengerRating,
      callId: params.callId,
    });
  };

  // 콜 거절
  const handleRejectCall = () => {
    // Zustand 스토어에 콜 거절 알림
    rejectCall(params.callId);
    pop();
  };

  // 콜 수락
  const handleAcceptCall = () => {
    // Zustand 스토어에 콜 수락 알림
    acceptCall(params.callId);
  };

  // 운행 시작
  const handleStartTrip = () => {
    setTripStatus("inProgress");
  };

  // 운행 완료
  const handleCompleteTrip = () => {
    setTripStatus("completed");
    // 잠시 후 완료 화면으로 이동
    push("DriverTripCompleted", {
      callId: params.callId,
      fare: callInfo.estimatedFare,
    });
  };

  // 출발지와 목적지 좌표 - 스토어에서 가져옴
  const originCoords = {
    lat: callInfo.originCoords.lat,
    lng: callInfo.originCoords.lng,
  };

  const destinationCoords = {
    lat: callInfo.destinationCoords.lat,
    lng: callInfo.destinationCoords.lng,
  };

  // 지도에 표시할 마커
  const mapMarkers = [
    {
      position: originCoords,
      title: "승객 위치",
    },
    {
      position: destinationCoords,
      title: "목적지",
    },
  ];
  console.log("mapMarkers", mapMarkers);
  // 상태에 따른 메시지 표시 수정
  const getStatusMessage = () => {
    switch (tripStatus) {
      case "pending":
        return "콜 요청을 확인하세요";
      case "heading":
        return "승객 픽업 위치로 이동 중입니다.";
      case "inProgress":
        return "운행 중입니다.";
      case "completed":
        return "운행이 완료되었습니다.";
      default:
        return "";
    }
  };

  // 상태에 따른 버튼 렌더링 수정
  const renderActionButton = () => {
    switch (tripStatus) {
      case "pending":
        return (
          <div className="flex space-x-3">
            <button
              onClick={handleRejectCall}
              className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg"
            >
              콜 거절
            </button>
            <button
              onClick={handleAcceptCall}
              className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-lg"
            >
              콜 수락
            </button>
          </div>
        );
      case "heading":
        // 헤딩 상태일 때 바로 운행 시작 버튼 표시
        return (
          <button
            onClick={handleStartTrip}
            className="w-full py-4 bg-blue-500 text-white font-medium rounded-lg"
          >
            운행 시작하기
          </button>
        );
      case "inProgress":
        return (
          <button
            onClick={handleCompleteTrip}
            className="w-full py-4 bg-red-500 text-white font-medium rounded-lg"
          >
            운행 완료하기
          </button>
        );
      default:
        return null;
    }
  };

  // 상태에 따른 앱바 타이틀 및 뒤로가기 버튼 설정
  const getAppBarConfig = () => {
    if (tripStatus === "pending") {
      return {
        title: "콜 상세 정보",
      };
    } else {
      return {
        title: "운행 정보",
      };
    }
  };

  return (
    <AppScreen appBar={getAppBarConfig()}>
      <div className="flex flex-col h-full">
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
          />
          <div className="absolute top-3 left-3 right-3 bg-white p-3 rounded-lg shadow-md">
            <p className="font-medium text-center">{getStatusMessage()}</p>
          </div>
        </div>

        {/* 승객 정보 및 액션 영역 */}
        <div className="h-2/5 bg-white flex flex-col p-4">
          <PassengerProfileCard
            name={callInfo.passengerName}
            gender={callInfo.passengerGender}
            rating={callInfo.passengerRating}
            onViewDetails={handleViewPassengerInfo}
          />

          <div className="flex-1 py-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500">출발</div>
                  <div>{callInfo.origin}</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500">도착</div>
                  <div>{callInfo.destination}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <div>
                <span className="font-medium">{callInfo.estimatedFare}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-500">{callInfo.distance}</span>
              </div>
              {callInfo.requestTime && tripStatus === "pending" && (
                <div className="text-gray-500">{callInfo.requestTime}</div>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-auto">{renderActionButton()}</div>
        </div>
      </div>
    </AppScreen>
  );
};

export default DriverTripActivity;

import React from "react";
import Button from "../../../../components/common/Button";
import DriverProfileCard from "../../../../components/common/DriverProfileCard";

interface DriverInfo {
  id: string;
  name: string;
  gender: "male" | "female";
  rating: number;
}

interface OngoingComponentProps {
  driver: DriverInfo;
  distance: string;
  duration: number;
  estimatedFare: string;
  onEmergencyReport: () => void;
  originCoords: { lat: number; lng: number };
  destinationCoords: { lat: number; lng: number };
}

const OngoingComponent: React.FC<OngoingComponentProps> = ({
  driver,
  distance,
  duration,
  estimatedFare,
  onEmergencyReport,
  originCoords,
  destinationCoords,
}) => {
  const handleShareLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // 전체 URL 생성 (window.location.origin 포함)
          const baseUrl = window.location.origin;
          const shareUrl =
            `${baseUrl}/share-location?` +
            `originLat=${originCoords.lat}&originLng=${originCoords.lng}` +
            `&destinationLat=${destinationCoords.lat}&destinationLng=${destinationCoords.lng}` +
            `&currentLat=${latitude}&currentLng=${longitude}` +
            `&driverName=${encodeURIComponent(driver.name)}` +
            `&estimatedTime=${duration}` +
            `&estimatedFare=${encodeURIComponent(estimatedFare)}`;

          // 공유할 기본 내용 구성
          const title = "대리운전 이동 중입니다";
          const text = `${driver.name} 기사님과 함께 이동 중입니다.\n예상 소요 시간: ${duration}분`;

          if (navigator.share) {
            await navigator.share({
              title,
              text,
              url: shareUrl,
            });
          } else {
            const fullShareText = `${title}\n${text}\n\n실시간 위치 확인: ${shareUrl}`;
            await navigator.clipboard.writeText(fullShareText);
            alert("위치 공유 링크가 클립보드에 복사되었습니다.");
          }
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
          alert("위치 정보를 가져오는데 실패했습니다.");
        }
      );
    } catch (error) {
      console.error("공유하는데 실패했습니다:", error);
      alert("공유하는데 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 운행 시작 알림 */}

      {/* 중요 기능 버튼 영역 - 상단에 배치 */}
      <div className="flex gap-4 mb-3">
        <Button
          variant="primary"
          size="md"
          className="flex-1 "
          onClick={handleShareLocation}
        >
          위치 공유
        </Button>
        <Button
          variant="danger"
          size="md"
          className="flex-1"
          onClick={onEmergencyReport}
        >
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm">긴급 신고</span>
          </div>
        </Button>
      </div>

      {/* 이동 정보 */}
      <div className="bg-white p-3 rounded-lg  mb-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500">예상 도착 시간</div>
            <div className="font-bold text-lg">{duration}분 후</div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500">이동 거리</div>
            <div className="font-bold text-lg">{distance}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500">예상 요금</div>
            <div className="font-bold text-lg">{estimatedFare}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500">도착 예정</div>
            <div className="font-bold text-lg">
              {new Date(Date.now() + duration * 60 * 1000).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 기사 정보 카드 사용 */}
      <DriverProfileCard
        name={driver.name}
        gender={driver.gender}
        rating={driver.rating}
        showDetailsButton
      />
    </div>
  );
};

export default OngoingComponent;

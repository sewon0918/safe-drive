import React from "react";
import DriverProfileCard from "../../../components/common/DriverProfileCard";

interface DriverInfo {
  id: string;
  name: string;
  gender: "male" | "female";
  rating: number;
  estimatedArrival: string;
}

interface WaitingComponentProps {
  driver: DriverInfo;
  onViewDriverDetails: () => void;
  renderStars: (rating: number) => React.ReactElement[];
  arrivalMessage?: string;
}

export const WaitingComponent: React.FC<WaitingComponentProps> = ({
  driver,
  onViewDriverDetails,
  arrivalMessage = "기사님이 곧 도착합니다...",
}) => {
  // 기사 정보에 추가할 정보
  const additionalInfo = (
    <p className="text-sm text-gray-600">
      <span className="font-semibold">예상 도착 시간:</span>{" "}
      {driver.estimatedArrival}
    </p>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">기사님을 기다리는 중</h2>
        <p className="text-gray-500 mt-1">{arrivalMessage}</p>
      </div>

      {/* 기사 프로필 카드 - 상세 보기 버튼 포함 */}
      <DriverProfileCard
        name={driver.name}
        gender={driver.gender}
        rating={driver.rating}
        additionalInfo={additionalInfo}
        showDetailsButton={true}
        onViewDetails={onViewDriverDetails}
      />

      {/* 안내 메시지 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h3 className="text-blue-800 font-medium mb-1">이용 안내</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 기사님이 곧 도착합니다. 탑승 준비를 해주세요.</li>
          <li>• 위치를 확인하고 안전한 곳에서 기다려주세요.</li>
          <li>• 승차 후 문제가 있으면 '긴급 신고' 기능을 이용해주세요.</li>
        </ul>
      </div>
    </div>
  );
};

export default WaitingComponent;

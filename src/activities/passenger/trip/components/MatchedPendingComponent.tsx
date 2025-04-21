import React from "react";
import Button from "../../../../components/common/Button";
import { useMatchingStore } from "../../../../store/matchingStore";
import DriverProfileCard from "../../../../components/common/DriverProfileCard";

interface MatchedPendingComponentProps {
  onViewDriverDetails: () => void;
}

const MatchedPendingComponent: React.FC<MatchedPendingComponentProps> = ({
  onViewDriverDetails,
}) => {
  const { matchedDriver, setMatchedDriver, resetMatching } = useMatchingStore();
  // 매칭 수락 함수
  const handleAccept = () => {
    if (matchedDriver) {
      // 매칭 수락 상태로 업데이트
      setMatchedDriver({
        ...matchedDriver,
        accepted: true,
      });
    }
  };

  // 매칭 거절 함수
  const handleReject = () => {
    // 매칭 상태 초기화
    resetMatching();
  };
  return (
    <div className="w-full h-full flex flex-col ">
      <div className="w-full flex-1 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          기사님과 매칭되었습니다
        </h2>
        <DriverProfileCard
          name={matchedDriver?.name || ""}
          gender={matchedDriver?.gender || "male"}
          rating={matchedDriver?.rating || 0}
          imageSize="md"
          showDetailsButton
          onViewDetails={onViewDriverDetails}
        />
      </div>

      {/* 액션 버튼 */}
      <div className="w-full ">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 "
            onClick={handleReject}
          >
            거절하기
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleAccept}
          >
            수락하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchedPendingComponent;

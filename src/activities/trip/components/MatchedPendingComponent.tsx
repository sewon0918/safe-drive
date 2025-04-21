import React from "react";
import Button from "../../../components/common/Button";

interface MatchedPendingComponentProps {
  onViewDriverDetails: () => void;
}

const MatchedPendingComponent: React.FC<MatchedPendingComponentProps> = ({
  onViewDriverDetails,
}) => {
  return (
    <div className="flex flex-col items-center">
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
      <p className="text-gray-500 text-sm mb-6">
        기사님의 정보를 확인하고 수락 또는 거절해주세요
      </p>

      <div className="w-full mt-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onViewDriverDetails}
        >
          매칭된 기사님 보기
        </Button>
      </div>
    </div>
  );
};

export default MatchedPendingComponent;

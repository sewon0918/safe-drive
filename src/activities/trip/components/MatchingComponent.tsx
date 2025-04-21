import React from "react";
import Button from "../../../components/common/Button";

interface MatchingComponentProps {
  elapsedTime: number;
  destination: string;
  femaleDriverOnly?: boolean;
  protectionModeEnabled?: boolean;
  onCancel: () => void;
}

const MatchingComponent: React.FC<MatchingComponentProps> = ({
  elapsedTime,
  destination,
  femaleDriverOnly,
  protectionModeEnabled,
  onCancel,
}) => {
  return (
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
      <div className="text-gray-400 text-sm">대기 시간: {elapsedTime}초</div>

      <div className="mt-8 w-full">
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">목적지:</span> {destination}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">보호 모드:</span>{" "}
          {protectionModeEnabled ? "활성화" : "비활성화"}
        </p>

        <Button variant="danger" size="lg" fullWidth onClick={onCancel}>
          호출 취소하기
        </Button>
      </div>
    </div>
  );
};

export default MatchingComponent;

import React from "react";
import StarsDisplay from "./StarsDisplay";

interface DriverProfileCardProps {
  name: string;
  gender: "male" | "female";
  rating: number;
  femaleRating?: number;
  additionalInfo?: React.ReactNode;
  imageSize?: "sm" | "md" | "lg";
  showDetailsButton?: boolean;
  onViewDetails?: () => void;
}

/**
 * 기사님 프로필 정보를 표시하는 재사용 가능한 카드 컴포넌트
 */
const DriverProfileCard: React.FC<DriverProfileCardProps> = ({
  name,
  gender,
  rating,
  femaleRating,
  additionalInfo,
  imageSize = "md",
  showDetailsButton = false,
  onViewDetails,
}) => {
  // 이미지 크기에 따른 스타일 클래스
  const imageSizeClass = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="w-full bg-white p-3 rounded-lg">
      <div className="flex items-center">
        <div
          className={`rounded-full overflow-hidden bg-gray-100 mr-3 flex-shrink-0 ${imageSizeClass[imageSize]}
          flex items-center justify-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="font-medium text-lg">{name} 기사님</h3>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {gender === "female" ? "여성" : "남성"}
              </span>
            </div>

            {/* 상세 정보 버튼 (이름 옆에 배치) */}

            {showDetailsButton && onViewDetails && (
              <button
                onClick={onViewDetails}
                className="text-blue-500 text-sm hover:underline"
              >
                상세정보
              </button>
            )}
          </div>
          <div className="flex items-center mt-1">
            <StarsDisplay rating={rating} showText={true} />
          </div>
          {femaleRating && (
            <div className="flex items-center mt-1">
              <StarsDisplay rating={femaleRating} showText={true} />
            </div>
          )}
          {additionalInfo && (
            <div className="mt-1 text-sm text-gray-600">{additionalInfo}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverProfileCard;

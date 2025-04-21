import React from "react";
import Button from "./Button";

interface DriverProfileCardProps {
  name: string;
  gender: "male" | "female";
  rating: number;
  renderStars?: (rating: number) => React.ReactElement[];
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
  renderStars,
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

  // 기본 별점 렌더링 함수
  const defaultRenderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return stars;
  };

  const starsRenderer = renderStars || defaultRenderStars;

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div
          className={`rounded-full overflow-hidden bg-gray-100 mr-3 flex-shrink-0 ${imageSizeClass[imageSize]}`}
        >
          <img
            src={
              gender === "female"
                ? "/assets/female-driver.png"
                : "/assets/male-driver.png"
            }
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRINGA0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==";
            }}
          />
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
                className="text-blue-500 text-xs underline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                상세 정보
              </button>
            )}
          </div>
          <div className="flex items-center mt-1">
            <div className="flex">{starsRenderer(rating)}</div>
            <span className="text-xs text-gray-500 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
          {additionalInfo && (
            <div className="mt-1 text-sm text-gray-600">{additionalInfo}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverProfileCard;

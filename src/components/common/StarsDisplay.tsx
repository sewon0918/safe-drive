import React from "react";

interface StarsDisplayProps {
  /** 별점 값 (1-5) */
  rating: number;
  /** 별의 크기 (기본값: sm) */
  size?: "xs" | "sm" | "md";
  /** 간격 크기 (기본값: 1) */
  spacing?: number;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 별점 텍스트 표시 여부 */
  showText?: boolean;
}

/**
 * 별점 표시 전용 컴포넌트 (읽기 전용)
 */
const StarsDisplay: React.FC<StarsDisplayProps> = ({
  rating,
  size = "sm",
  spacing = 1,
  className = "",
  showText = false,
}) => {
  // 별 크기에 따른 클래스
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
  };

  return (
    <div className="flex items-center">
      <div
        className={`flex ${className}`}
        style={{ gap: `${spacing * 0.25}rem` }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${sizeClasses[size]} ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        ))}
      </div>
      {showText && (
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarsDisplay;

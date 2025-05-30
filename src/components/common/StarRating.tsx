import React from "react";

interface StarRatingProps {
  /** 현재 별점 값 (1-5) */
  rating: number;
  /** 별점 변경 핸들러 (읽기 전용이 아닐 때만 필요) */
  onRating?: (rating: number) => void;
  /** 별의 크기 (기본값: md) */
  size?: "sm" | "md" | "lg";
  /** 읽기 전용 모드 여부 (기본값: false) */
  readOnly?: boolean;
  /** 간격 크기 (기본값: 4) */
  spacing?: number;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 별점 평가 컴포넌트
 */
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRating,
  size = "md",
  readOnly = false,
  spacing = 4,
  className = "",
}) => {
  // 별 크기에 따른 클래스
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  // 별점 클릭 핸들러
  const handleRating = (value: number) => {
    if (!readOnly && onRating) {
      onRating(value);
    }
  };

  return (
    <div
      className={`flex ${className}`}
      style={{ gap: `${spacing * 0.25}rem` }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          className={`${
            readOnly ? "cursor-default" : "cursor-pointer"
          } focus:outline-none`}
          disabled={readOnly}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClasses[size]} ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            } ${!readOnly && "hover:scale-110 transition-transform"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default StarRating;

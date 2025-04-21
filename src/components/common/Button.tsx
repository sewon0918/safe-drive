import React from "react";

// 버튼 타입 정의
type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "text";
type ButtonSize = "sm" | "md" | "lg";

// 버튼 프롭스 정의
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  rounded?: boolean;
  className?: string;
  isLoading?: boolean;
}

/**
 * 재사용 가능한 버튼 컴포넌트
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  rounded = true,
  className = "",
  isLoading = false,
  ...props
}) => {
  // 기본 스타일
  const baseStyle = "font-medium transition-colors";

  // 크기별 스타일
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // 종류별 스타일
  const variantStyles = {
    primary: "border-0 bg-black  text-white",
    secondary: "border-0 bg-gray-200  text-gray-800",
    danger: "border-0 bg-red-500  text-white",
    outline: "border border-1 border-gray-300 text-black",
    text: "border-0 bg-transparent text-blue-500 ",
  };

  // 너비 스타일
  const widthStyle = fullWidth ? "w-full" : "";

  // 테두리 스타일
  const roundedStyle = rounded ? "rounded-lg" : "";

  // 비활성화 스타일
  const disabledStyle =
    props.disabled || isLoading
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";

  // 모든 스타일 조합
  const buttonStyle = `${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${roundedStyle} ${disabledStyle} ${className}
  hover:opacity-[0.8]`;

  return (
    <button
      className={buttonStyle}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

import React from "react";

interface ServiceOptionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 서비스 옵션을 선택할 수 있는 재사용 가능한 카드 컴포넌트
 */
const ServiceOptionCard: React.FC<ServiceOptionCardProps> = ({
  title,
  description,
  icon,
  selected = false,
  onChange,
  disabled = false,
  className = "",
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!selected);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-3 transition-all cursor-pointer 
        ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-200"}
        ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        {icon && <div className="mr-3 text-blue-500">{icon}</div>}
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="ml-2">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${
                selected
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300 bg-white"
              }`}
          >
            {selected && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceOptionCard;

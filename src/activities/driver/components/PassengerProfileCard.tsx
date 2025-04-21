import React from "react";
import StarsDisplay from "../../../components/common/StarsDisplay";

interface PassengerProfileCardProps {
  name: string;
  gender: "male" | "female";
  rating: number;
  onViewDetails?: () => void;
}

const PassengerProfileCard: React.FC<PassengerProfileCardProps> = ({
  name,
  gender,
  rating,
  onViewDetails,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3 ${
              gender === "female" ? "bg-pink-500" : "bg-blue-500"
            }`}
          >
            {name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold mr-2">{name}</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  gender === "female"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {gender === "female" ? "여성" : "남성"}
              </span>
            </div>
            <div className="flex items-center mt-1">
              <StarsDisplay rating={rating} showText={true} />
            </div>
          </div>
        </div>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-blue-500 text-sm hover:underline"
          >
            상세정보
          </button>
        )}
      </div>
    </div>
  );
};

export default PassengerProfileCard;

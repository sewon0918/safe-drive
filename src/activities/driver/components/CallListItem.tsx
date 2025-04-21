import React from "react";
import StarsDisplay from "../../../components/common/StarsDisplay";

// 콜 정보 타입 정의
export interface CallRequest {
  id: string;
  passengerName: string;
  passengerGender: "male" | "female";
  passengerRating: number;
  origin: string;
  destination: string;
  estimatedFare: string;
  distance: string;
  requestTime: string;
}

interface CallListItemProps {
  call: CallRequest;
  onClick?: () => void;
}

const CallListItem: React.FC<CallListItemProps> = ({ call, onClick }) => {
  return (
    <div className="bg-white rounded-lg  p-4 cursor-pointer " onClick={onClick}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
              call.passengerGender === "female" ? "bg-pink-500" : "bg-blue-500"
            }`}
          >
            {call.passengerName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-medium mr-2">{call.passengerName}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  call.passengerGender === "female"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {call.passengerGender === "female" ? "여성" : "남성"}
              </span>
            </div>
            <div className="flex items-center mt-1">
              <StarsDisplay
                rating={call.passengerRating}
                size="xs"
                spacing={0.5}
              />
              <span className="text-xs text-gray-500 ml-1">
                ({call.passengerRating.toFixed(1)})
              </span>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">{call.requestTime}</div>
      </div>

      <div className="pl-13 space-y-1">
        <div className="flex items-start">
          <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center mt-0.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          </div>
          <div className="ml-1 text-sm">{call.origin}</div>
        </div>
        <div className="flex items-start">
          <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center mt-0.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          </div>
          <div className="ml-1 text-sm">{call.destination}</div>
        </div>
      </div>

      <div className="mt-2 pl-13 flex justify-between text-sm">
        <div className="font-medium text-blue-600">{call.estimatedFare}</div>
        <div className="text-gray-500">{call.distance}</div>
      </div>
    </div>
  );
};

export default CallListItem;

import React, { useEffect, useState } from "react";
import { useTripStore } from "../../../../store/tripStore";
import { useFlow } from "../../../../stackflow";
import Button from "../../../../components/common/Button";
import ServiceOptionCard from "./ServiceOptionCard";

interface CallFormProps {
  onSubmit: () => void;
  isLoading?: boolean;
}
export interface ServiceOption {
  id: string;
  label: string;
  name: string;
  description: string;
  price: string;
  onClick: () => void;
}

const CallForm: React.FC<CallFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    destination,
    setFemaleDriverOnly,
    protectionMode,
    toggleProtectionMode,
  } = useTripStore();
  const { push } = useFlow();

  const [selectedOption, setSelectedOption] = useState<
    "standard" | "vip" | "best"
  >("standard");

  // 서비스 옵션별 가격
  const prices = {
    vip: "2.5만원",
    best: "2.4만원",
    standard: "2만원",
  };

  const serviceOptions: ServiceOption[] = [
    {
      id: "vip",
      label: "VIP",
      name: "VIP 서비스",
      description: "여성 기사님과 함께하는 안전한 운행",
      price: prices.vip,
      onClick: () => setSelectedOption("vip"),
    },
    {
      id: "standard",
      label: "착한",
      name: "착한요금",
      description: "합리적인 가격의 안전 운행",
      price: prices.standard,
      onClick: () => setSelectedOption("standard"),
    },
  ];

  useEffect(() => {
    setFemaleDriverOnly(selectedOption === "vip");
  }, [selectedOption]);

  const isFormValid = !!destination; // Implement form validation logic

  return (
    <div className="w-full flex flex-col h-full px-4 ">
      {/* 스크롤 가능한 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-auto pb-4">
        {/* 위치 헤더 */}
        <div className="mb-2 flex flex-col">
          <div className="flex items-center py-3 border-b border-gray-200">
            <div className="font-bold text-black text-lg">출발</div>
            <div className="ml-4 text-black">현위치</div>
            <button className="ml-auto text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* 도착 입력 폼 */}
          <div className="flex items-center py-3 border-b border-gray-200">
            <div className="font-bold text-black text-lg">도착</div>
            <div className="flex-1 ml-4">
              <div
                className="w-full text-gray-700 cursor-pointer text-left"
                onClick={() =>
                  push("SearchAddress", { searchType: "destination" })
                }
              >
                {destination ? destination : "목적지 입력"}
              </div>
            </div>
          </div>
        </div>

        {/* 서비스 옵션 */}
        <div className="bg-gray-50 rounded-xl p-1">
          {serviceOptions.map((each) => (
            <ServiceOptionCard
              {...each}
              selected={selectedOption === each.id}
            />
          ))}
        </div>

        {/* 부가 옵션 영역 */}
        <div className="mt-3 mb-3 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">보호 모드 활성화</h3>
              <p className="text-xs text-gray-500">위치 공유 활성화</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={protectionMode}
                onChange={toggleProtectionMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 하단 고정 영역 - 마진 조정 */}
      <div className="py-4 bg-white mt-auto mb-4">
        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={!isFormValid}
          onClick={onSubmit}
          isLoading={isLoading}
        >
          호출하기
        </Button>
      </div>
    </div>
  );
};

export default CallForm;

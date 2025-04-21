import React, { useState } from "react";
import { useTripStore } from "../../store/tripStore";
import { useFlow } from "../../stackflow";
import Button from "../common/Button";

interface CallFormProps {
  onSubmit: () => void;
  isLoading?: boolean;
}

const CallForm: React.FC<CallFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    destination,
    setDestination,
    femaleDriverOnly,
    toggleFemaleDriverOnly,
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const isFormValid = true; // Implement form validation logic

  return (
    <div className="w-full flex flex-col h-full px-4 ">
      {/* 스크롤 가능한 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-auto pb-4">
        {/* 위치 헤더 */}
        <div className="mb-2 flex flex-col">
          <div className="flex items-center py-3 border-b border-gray-200">
            <div className="font-bold text-black text-lg">출발</div>
            <div className="ml-4 text-black">현위치: 신동아아파트 16동</div>
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
                className="w-full text-gray-700 cursor-pointer"
                onClick={() =>
                  push("SearchAddress", { searchType: "destination" })
                }
              >
                {destination ? destination : "집: 신동아아파트 16동"}
              </div>
            </div>
          </div>
        </div>

        {/* 서비스 옵션 */}
        <div className="bg-gray-50 rounded-xl p-1">
          <div
            className={`p-4 rounded-xl flex items-center mb-2 ${
              selectedOption === "vip"
                ? "bg-blue-50 border border-blue-100"
                : "bg-white"
            }`}
            onClick={() => setSelectedOption("vip")}
          >
            <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3">
              <span className="text-white text-xs">VIP</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">VIP 서비스</h3>
              <p className="text-xs text-gray-500">
                최상급 서비스와 안전한 운행
              </p>
            </div>
            <div className="text-lg font-bold">{prices.vip}</div>
          </div>

          <div
            className={`p-4 rounded-xl flex items-center mb-2 ${
              selectedOption === "best"
                ? "bg-blue-50 border border-blue-100"
                : "bg-white"
            }`}
            onClick={() => setSelectedOption("best")}
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3 relative">
              <span className="text-white text-xs">빠른</span>
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-1 rounded">
                BEST
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">빠른배정</h3>
              <p className="text-xs text-gray-500">
                가장 빠르게 배정해드립니다
              </p>
            </div>
            <div className="text-lg font-bold">{prices.best}</div>
          </div>

          <div
            className={`p-4 rounded-xl flex items-center ${
              selectedOption === "standard"
                ? "bg-blue-50 border border-blue-100"
                : "bg-white"
            }`}
            onClick={() => setSelectedOption("standard")}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
              <span className="text-white text-xs">착한</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-500">착한요금</h3>
              <p className="text-xs text-gray-500">합리적인 가격의 안전 운행</p>
            </div>
            <div className="text-lg font-bold">{prices.standard}</div>
          </div>
        </div>

        {/* 부가 옵션 영역 */}
        <div className="mt-3 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-gray-800">여성 기사님만 매칭</h3>
              <p className="text-xs text-gray-500">
                안전한 귀가를 위한 여성 기사님 전용 매칭
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={femaleDriverOnly}
                onChange={toggleFemaleDriverOnly}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">보호 모드 활성화</h3>
              <p className="text-xs text-gray-500">
                위치 추적 및 음성 녹음 자동 진행
              </p>
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-gray-600 text-sm">결제수단 선택</span>
            <span className="ml-2 text-sm text-gray-600">카드</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">포인트 0P</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="mt-8">
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
    </div>
  );
};

export default CallForm;

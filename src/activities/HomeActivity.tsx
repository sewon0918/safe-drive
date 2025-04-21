import React from "react";
import { useFlow } from "../stackflow";
import { ActivityComponentProps } from "../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import Button from "../components/common/Button";

export const HomeActivity: React.FC<ActivityComponentProps> = () => {
  const { push } = useFlow();

  const handlePassengerStart = () => {
    push("CallDriver", {});
  };

  const handleDriverStart = () => {
    push("DriverHome", {});
  };

  return (
    <AppScreen>
      <div className="flex flex-col h-full justify-center items-center  px-6">
        {/* 로고 및 앱 소개 */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 text-blue-500"
            >
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
              <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
              <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            여성 안심 <br />
            대리운전
          </h1>
          <p className="text-gray-600">안전하고 편리한 대리운전 서비스</p>
        </div>

        {/* 역할 선택 버튼 */}
        <div className="w-full max-w-md space-y-4">
          <Button fullWidth size="lg" onClick={handlePassengerStart}>
            승객으로 시작하기
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="outline"
            onClick={handleDriverStart}
          >
            기사님으로 시작하기
          </Button>
        </div>

        {/* 하단 소개 */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>안전한 드라이빙 경험을 약속드립니다</p>
        </div>
      </div>
    </AppScreen>
  );
};

export default HomeActivity;

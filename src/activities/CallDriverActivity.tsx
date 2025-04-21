import React, { useState, useRef, useEffect } from "react";
import { useFlow } from "../stackflow";
import Map from "../components/common/Map";
import CallForm from "../components/passenger/CallForm";
import { useTripStore } from "../store/tripStore";
import { ActivityComponentProps } from "../types/activities";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useGeolocation } from "../hooks/useGeolocation";

export const CallDriverActivity: React.FC<ActivityComponentProps> = () => {
  // 높이 관련 상태 - 기본 높이를 조정
  const [formHeight, setFormHeight] = useState(400); // 300px에서 400px로 증가
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    destination,
    femaleDriverOnly,
    protectionMode,
    requestTrip,
    destinationCoords,
  } = useTripStore();
  const { push } = useFlow();
  const [isLoading, setIsLoading] = useState(false);

  // 현재 위치 가져오기
  const { coordinates, isLoading: geolocationLoading } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000, // 타임아웃 증가
    maximumAge: 30000, // 캐시된 위치 정보 허용 시간 증가
  });
  console.log("coordinates", coordinates);
  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const minHeight = 380; // 최소 높이 증가 (하단 버튼 영역 고려)
  const maxHeight = window.innerHeight * 0.9; // 최대 높이 (화면의 90%)

  // 기본 좌표값 (서울 중심)
  const DEFAULT_COORDS = { lat: 37.5665, lng: 126.978 };

  const handleCallDriver = () => {
    setIsLoading(true);

    // 출발지/목적지 좌표 유효성 검사
    const validOriginCoords = coordinates || DEFAULT_COORDS;
    const validDestCoords = destinationCoords || {
      lat: 37.5012,
      lng: 127.0396,
    };

    setIsLoading(false);

    // 대기 화면으로 이동 (WaitingDriver를 Trip으로 변경)
    push("Trip", {
      destination: destination || "목적지 미설정",
      destinationLat: validDestCoords.lat,
      destinationLng: validDestCoords.lng,
      originLat: validOriginCoords.lat,
      originLng: validOriginCoords.lng,
      femaleDriverOnly: femaleDriverOnly,
      protectionModeEnabled: protectionMode,
    });
  };

  // 드래그 시작 핸들러
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); // 기본 동작 방지
    setIsDragging(true);

    // 터치 이벤트와 마우스 이벤트 구분
    if ("touches" in e) {
      setStartY(e.touches[0].clientY);
    } else {
      setStartY(e.clientY);
    }

    setStartHeight(formHeight);
  };

  // 드래그 중 핸들러 개선
  const handleDrag = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault(); // 기본 동작 방지

    let clientY;
    if ("touches" in e && e.touches.length > 0) {
      clientY = e.touches[0].clientY;
    } else if ("clientY" in e) {
      clientY = e.clientY;
    } else {
      return; // 유효한 이벤트가 아니면 무시
    }

    const deltaY = startY - clientY; // 양수: 위로 드래그, 음수: 아래로 드래그

    // 새 높이 계산 - 최소/최대 제한 적용
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, startHeight + deltaY)
    );

    console.log(
      `Drag: startY=${startY}, clientY=${clientY}, deltaY=${deltaY}, newHeight=${newHeight}`
    );

    // 높이 업데이트
    setFormHeight(newHeight);

    // 화면 절반 이상 차지하면 expanded 상태로 설정
    setIsExpanded(newHeight > window.innerHeight * 0.5);
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault(); // 기본 동작 방지
    setIsDragging(false);

    // 드래그 종료 시 스냅 효과
    if (formHeight > window.innerHeight * 0.7) {
      // 최대 높이로 확장
      setFormHeight(maxHeight);
      setIsExpanded(true);
    } else if (formHeight < window.innerHeight * 0.4) {
      // 임계값 조정
      // 최소 높이로 축소
      setFormHeight(minHeight);
      setIsExpanded(false);
    } else {
      // 중간 상태는 현재 높이로 유지
      setIsExpanded(formHeight > window.innerHeight * 0.5);
    }
  };

  // 이벤트 리스너 등록
  useEffect(() => {
    const handleDragMove = (e: TouchEvent | MouseEvent) => handleDrag(e);
    const handleDragFinish = (e: TouchEvent | MouseEvent) => handleDragEnd(e);

    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove, {
        passive: false,
      });
      document.addEventListener("touchmove", handleDragMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleDragFinish, {
        passive: false,
      });
      document.addEventListener("touchend", handleDragFinish, {
        passive: false,
      });
    }

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("mouseup", handleDragFinish);
      document.removeEventListener("touchend", handleDragFinish);
    };
  }, [isDragging, startY, startHeight]);

  // 지도 높이 계산 (전체 화면 높이 - 폼 높이)
  const mapHeight = `calc(100vh - ${formHeight}px)`;

  return (
    <AppScreen appBar={{ title: "대리운전 호출" }}>
      <div className="flex flex-col h-full bg-gray-100">
        {/* 지도 섹션 */}
        <div
          style={{ height: mapHeight }}
          className="relative transition-all duration-300 ease-in-out"
        >
          {/* 항상 Map 컴포넌트 렌더링 (isLoading 조건 제거) */}
          <Map initialCenter={coordinates} zoom={3} className="h-full w-full" />
        </div>

        {/* 호출 폼 섹션 - 높이를 픽셀 단위로 제어 */}
        <div
          ref={containerRef}
          style={{ height: `${formHeight}px` }}
          className="bg-white rounded-t-3xl shadow-lg transition-all duration-300 ease-in-out flex flex-col overflow-hidden"
        >
          {/* 드래그 핸들러 - 고정된 헤더 */}
          <div
            className="flex justify-center items-center h-6 cursor-grab active:cursor-grabbing py-3"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            style={{ touchAction: "none" }}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* 폼 내용은 스크롤 가능하게 */}
          <CallForm onSubmit={handleCallDriver} isLoading={isLoading} />
        </div>
      </div>
    </AppScreen>
  );
};

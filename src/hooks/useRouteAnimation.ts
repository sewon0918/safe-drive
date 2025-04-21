import { useState, useEffect, useRef, useCallback } from "react";

interface Coords {
  lat: number;
  lng: number;
}

interface UseRouteAnimationOptions {
  startCoords: Coords;
  endCoords: Coords;
  durationInSeconds: number;
  onComplete?: () => void;
  easing?: (t: number) => number; // 이징 함수 (선택 사항)
}

// 기본 이징 함수를 훅 밖으로 분리
const defaultEasing = (t: number) => t * (2 - t);

/**
 * 두 좌표 사이의 경로 애니메이션을 처리하는 커스텀 훅
 */
const useRouteAnimation = ({
  startCoords,
  endCoords,
  durationInSeconds,
  onComplete,
  easing = defaultEasing, // 기본값으로 외부 함수 사용
}: UseRouteAnimationOptions) => {
  const [currentPosition, setCurrentPosition] = useState<Coords>(startCoords);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);

  // 메모리에 좌표 저장 (참조 비교 방지)
  const startCoordsRef = useRef(startCoords);
  const endCoordsRef = useRef(endCoords);

  // 좌표가 변경되면 참조 업데이트
  useEffect(() => {
    startCoordsRef.current = startCoords;
    endCoordsRef.current = endCoords;
  }, [startCoords, endCoords]);

  // onComplete 참조 업데이트
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 애니메이션 중지 함수를 메모이제이션
  const stopAnimation = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  // 애니메이션 초기화 함수를 메모이제이션
  const resetAnimation = useCallback(() => {
    stopAnimation();
    setCurrentPosition(startCoords);
    setProgress(0);
    setIsCompleted(false);
    startTimeRef.current = null;
  }, [stopAnimation, startCoords]);

  // 애니메이션 시작 함수를 메모이제이션
  const startAnimation = useCallback(() => {
    resetAnimation();
    setIsAnimating(true);

    const startTime = Date.now();
    startTimeRef.current = startTime;
    const totalDuration = durationInSeconds * 1000;

    // 1초마다 위치 업데이트
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / totalDuration, 1);
      const easedProgress = easing(rawProgress);

      setProgress(rawProgress);

      // ref에서 좌표 가져오기
      const startLat = startCoordsRef.current.lat;
      const startLng = startCoordsRef.current.lng;
      const endLat = endCoordsRef.current.lat;
      const endLng = endCoordsRef.current.lng;

      // 선형 보간으로 현재 위치 계산
      const newLat = startLat + (endLat - startLat) * easedProgress;
      const newLng = startLng + (endLng - startLng) * easedProgress;

      setCurrentPosition({ lat: newLat, lng: newLng });

      // 애니메이션 완료 체크
      if (rawProgress >= 1) {
        stopAnimation();
        setIsCompleted(true);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, 100);
  }, [durationInSeconds, easing, resetAnimation, stopAnimation]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  // 입력값 변경 시 애니메이션 리셋
  useEffect(() => {
    resetAnimation();
  }, [durationInSeconds, resetAnimation]);

  return {
    currentPosition,
    progress,
    isAnimating,
    isCompleted,
    startAnimation,
    stopAnimation,
    resetAnimation,
  };
};

export default useRouteAnimation;

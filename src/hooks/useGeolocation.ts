import { useState, useEffect } from "react";

interface GeolocationState {
  coordinates: {
    lat: number;
    lng: number;
  };
  isLoading: boolean;
  error: string | null;
}

// 기본 위치 (서울시청)
const defaultPosition = {
  lat: 37.5665,
  lng: 126.978,
};

export const useGeolocation = (options?: PositionOptions) => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: defaultPosition, // 기본값을 미리 설정
    isLoading: true,
    error: null,
  });

  // 위치 정보를 한 번만 요청하는 함수
  const getPosition = () => {
    if (!("geolocation" in navigator)) {
      setState({
        coordinates: defaultPosition,
        isLoading: false,
        error: "Geolocation이 지원되지 않는 브라우저입니다.",
      });
      return;
    }

    // 성공 핸들러
    const onSuccess = (position: GeolocationPosition) => {
      console.log("position", position);
      setState({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        isLoading: false,
        error: null,
      });
    };

    // 오류 핸들러
    const onError = (error: GeolocationPositionError) => {
      console.error("Geolocation 오류:", error.message);
      setState({
        coordinates: defaultPosition, // 에러 발생 시 기본 위치 사용
        isLoading: false,
        error: error.message,
      });
    };

    // getCurrentPosition 사용 (watchPosition 대신)
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  };

  // 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    getPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열로 의존성 지정 - 마운트 시 한 번만 실행

  return state;
};

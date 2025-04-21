import { useState, useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
    kakaoMapLoaded: boolean;
  }
}

export const useKakaoLoader = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(
    window.kakao && window.kakao.maps ? true : false
  );

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
      return;
    }

    // API가 로드되지 않은 경우 로드 시작
    if (window.kakao && !window.kakao.maps) {
      window.kakao.maps.load(() => {
        console.log("카카오맵 API 로드 완료");
        setIsLoaded(true);
      });
    } else {
      // script 태그가 없는 경우, 로딩을 직접 처리
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=b100d89badf717a70ae474f5ec17c171&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          console.log("카카오맵 API 로드 완료");
          setIsLoaded(true);
        });
      };
      document.head.appendChild(script);
    }
  }, []);

  return isLoaded;
};

interface Window {
  kakao: {
    maps: {
      LatLng: new (lat: number, lng: number) => any;
      LatLngBounds: new () => {
        extend: (latlng: any) => void;
      };
      services: {
        Geocoder: new () => {
          addressSearch: (
            address: string,
            callback: (
              result: Array<{
                address: string;
                address_name: string;
                address_type: string;
                road_address: string;
                x: string; // 경도
                y: string; // 위도
                // ... 기타 속성들
              }>,
              status: any
            ) => void
          ) => void;
        };
        Status: {
          OK: string;
          ZERO_RESULT: string;
          ERROR: string;
        };
      };
      Map: any;
    };
  };
}

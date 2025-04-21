declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => any;
        LatLngBounds: new () => {
          extend: (latlng: any) => void;
        };
        Map: new (container: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        Polyline: new (options: any) => any;
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: any[], status: any) => void
            ) => void;
          };
          Status: { OK: string };
        };
      };
    };
  }
}

export {};

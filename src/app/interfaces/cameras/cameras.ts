export interface Cameras {
  id: number;
  is_available: boolean;
  responses: CameraResponse[];
}

export interface CameraResponse {
  id: number;
  url: string;
}

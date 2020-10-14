import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Cameras, CameraResponse } from '../../interfaces/cameras/cameras';

export const RANDOM_NUMBER = (min: number, max: number): number => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

@Injectable({
  providedIn: 'root',
})
export class RandomDataService {
  public fetchCameras = (): Observable<Cameras[]> => this.getRundomCameras();

  constructor() {}

  public getRundomCameras(): Observable<Cameras[]> {
    return of(this.generateCustomData());
  }

  private generateCustomData(): Cameras[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: RANDOM_NUMBER(1, 300),
      responses: this.generateResponses(),
      is_available: Math.abs(i % 2) === 1 ? true : false,
    }));
  }

  private generateResponses(): CameraResponse[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: RANDOM_NUMBER(1, 300),
      url: `https://picsum.photos/100?random=${RANDOM_NUMBER(1, 30)}`,
    }));
  }
}

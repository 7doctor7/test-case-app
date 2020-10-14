import { Injectable } from '@angular/core';

import { ApiService } from '../api/api.service';
import { Observable, BehaviorSubject, interval } from 'rxjs';

import { Cameras } from '../../interfaces/cameras/cameras';
import { RANDOM_NUMBER } from '../random-data/random-data.service';

export * from '../../interfaces/cameras/cameras';

const CAMERAS_URL = 'fetchCameras';

@Injectable({
  providedIn: 'root',
})
export class CamerasService {
  private cameraSubj$ = new BehaviorSubject<number>(1);
  private imageChange$ = interval(RANDOM_NUMBER(2000, 5000));

  constructor(private api: ApiService) {}

  public getCameras(): Observable<Cameras[]> {
    return this.api.apiCall('RANDOM_GET', CAMERAS_URL);
  }

  public get cameraRespIndex$(): Observable<number> {
    return this.cameraSubj$.asObservable();
  }

  public randomizeCamera(camera: Cameras): void {
    this.imageChange$.subscribe(() => {
      const index = Math.floor(Math.random() * camera.responses.length);
      this.cameraSubj$.next(index);
    });
  }
}

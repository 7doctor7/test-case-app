import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable, fromEvent } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { CamerasService, Cameras } from '../../services/cameras/cameras.service';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.page.html',
  styleUrls: ['./cameras.page.scss'],
})
export class CamerasPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('update') private updBtn: ElementRef;

  public pageTitle = '';
  public cameras$: Observable<Cameras[]>;

  private translation$: Subscription;

  constructor(public camerasService: CamerasService, private translateService: TranslateService) {}

  ngOnInit() {
    this.translateService.get('PAGE_TITLES.cameras').subscribe(res => (this.pageTitle = res));
    this.translation$ = this.translateService.onLangChange.subscribe(
      (res: { lang: string; translations: any }) => (this.pageTitle = res.translations.PAGE_TITLES.cameras)
    );

    this.camerasService.getCameras();
  }

  ngAfterViewInit() {
    this.fetchCameras();
  }

  ngOnDestroy() {
    this.translation$.unsubscribe();
  }

  private fetchCameras(): void {
    const click$ = fromEvent(this.updBtn.nativeElement, 'click');
    this.cameras$ = click$.pipe(
      startWith(0),
      switchMap(() =>
        this.camerasService.getCameras().pipe(
          map(cams => {
            this.camerasService.randomizeCamera(cams[0]);
            return cams;
          })
        )
      )
    );
  }
}

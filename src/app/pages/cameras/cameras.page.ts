import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.page.html',
  styleUrls: ['./cameras.page.scss'],
})
export class CamerasPage implements OnInit, OnDestroy {
  public pageTitle = '';

  private translation$: Subscription;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.translateService.get('PAGE_TITLES.cameras').subscribe(res => (this.pageTitle = res));
    this.translation$ = this.translateService.onLangChange.subscribe(
      (res: { lang: string; translations: any }) => (this.pageTitle = res.translations.PAGE_TITLES.cameras)
    );
  }

  ngOnDestroy() {
    this.translation$.unsubscribe();
  }
}

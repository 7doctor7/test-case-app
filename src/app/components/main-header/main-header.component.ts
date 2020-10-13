import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../services/user/user.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  @Input() showBackBtn = false;
  @Input() pageTitle = '';

  public isLogin = false;
  public selectedLanguage: string;
  public languages: { id: string; title: string }[] = [];

  private user$: Subscription;

  constructor(private appLocation: Location, private user: UserService, private translateService: TranslateService) {}

  ngOnInit() {
    this.selectedLanguage = environment.defaultLocale;

    this.translateService.get(environment.locales.map(x => `LANGUAGES.${x.toUpperCase()}`)).subscribe(translations => {
      // init dropdown list with TRANSLATED list of languages from config
      this.languages = environment.locales.map(x => {
        return {
          id: x,
          title: translations[`LANGUAGES.${x.toUpperCase()}`],
        };
      });
    });

    this.user$ = this.user.login$.subscribe(data => (this.isLogin = data.is_login));
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

  public async goBack() {
    this.appLocation.back();
  }

  changeLocale() {
    this.translateService.use(this.selectedLanguage);
  }
}

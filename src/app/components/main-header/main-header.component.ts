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
  private langs$: Subscription;

  constructor(private appLocation: Location, private user: UserService, private translateService: TranslateService) {}

  ngOnInit() {
    const saved = localStorage.lang;
    const { defaultLocale, locales } = environment;

    this.selectedLanguage = saved && saved.length ? saved : defaultLocale;
    this.langs$ = this.translateService.get(locales.map(x => `LANGUAGES.${x.toUpperCase()}`)).subscribe(translations => {
      this.languages = locales.map(x => ({
        id: x,
        title: translations[`LANGUAGES.${x.toUpperCase()}`],
      }));
    });

    this.user$ = this.user.login$.subscribe(data => (this.isLogin = data.is_login));
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
    this.langs$.unsubscribe();
  }

  public goBack(): void {
    this.appLocation.back();
  }

  public changeLocale(id: string): void {
    const selected = this.languages.find(lang => lang.id === id).id;
    this.selectedLanguage = selected;
    localStorage.setItem('lang', selected);
    this.translateService.use(selected);
    this.translateService.use(this.selectedLanguage);
  }
}

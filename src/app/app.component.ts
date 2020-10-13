import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UserService, UserData } from './services/user/user.service';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Cameras',
      url: '/cameras',
      icon: 'mail',
    },
    {
      title: 'Reporting',
      url: '/reporting',
      icon: 'paper-plane',
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'heart',
    },
  ];
  public userData: UserData;
  public isLogin = false;

  private user$: Subscription;

  constructor(private userService: UserService, private menu: MenuController, private translateService: TranslateService) {}

  ngOnInit() {
    const saved = localStorage.lang;
    const { defaultLocale, locales } = environment;
    const lang = saved && saved.length ? saved : defaultLocale;

    this.userService.checkLogin();
    this.translateService.addLangs([...locales]);
    this.translateService.use(lang);

    this.user$ = this.userService.login$.subscribe(data => {
      const { is_login, user } = data;
      this.userData = { ...user };
      this.isLogin = is_login;
    });

    const path = window.location.pathname;
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

  public logOut(): void {
    this.menu.close();
    this.userService.doLogout();
  }
}

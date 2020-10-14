import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiService } from '../api/api.service';
import { UtilsService } from '../utils/utils.service';
import { UserData } from '../../interfaces/user/user';

export * from '../../interfaces/user/user';

const LOGIN_URL = '/login.json';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loginDataSource = new BehaviorSubject<{ token: string; user: UserData; is_login: boolean }>({
    token: '',
    user: null,
    is_login: false,
  });

  public login$ = this.loginDataSource.asObservable().pipe(map(data => ({ ...data })));

  constructor(private api: ApiService, private router: Router, private utils: UtilsService) {}

  public async doLogin({ email = '', password = '' }): Promise<void> {
    await this.utils.presentLoading({});

    try {
      const login: { token: string; user: UserData } = await this.api
        .apiCall('GET', `${LOGIN_URL}`, { email, password })
        .toPromise();

      localStorage.setItem('token', login.token);
      localStorage.setItem('user', JSON.stringify(login.user));
      this.loginDataSource.next({ ...login, is_login: true });
    } catch (err) {
      console.error('Login ERROR: ', err);
    }
  }

  public doLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.checkLogin();
    this.router.navigateByUrl('/login');
  }

  public checkLogin(): void {
    const token = localStorage.token;
    const data = localStorage.user;
    const check = token && token.length > 0 ? true : false;
    const user = data && data.length ? { ...JSON.parse(data) } : null;

    this.loginDataSource.next({
      is_login: check,
      token: token && token.length ? token : '',
      user,
    });
  }
}

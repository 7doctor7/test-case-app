import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.prod';
import { UtilsService } from '../utils/utils.service';

const API_URL = environment.api_url;
const DEFAULT_ALERT_SUB = 'Server ERROR!';

let reqTypeForHandler = '';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private requests = {
    GET: (params: { url: string }): Observable<{} | []> => {
      const { url } = params;

      return this.http.get<any>(url).pipe(map(res => res));
    },
    POST: (params: { url: string; opts: { headers: HttpHeaders }; body: any }): Observable<{} | []> => {
      const { url, opts, body } = params;

      return this.http.post<any>(url, body, opts);
    },
    PUT: (params: { url: string; opts: { headers: HttpHeaders }; body: any }): Observable<{} | []> => {
      const { url, opts, body } = params;

      return this.http.put<any>(url, body, opts);
    },
    DELETE: (params: { url: string }): Observable<{} | []> => {
      const { url } = params;

      return this.http.delete<any>(url);
    },
  };

  constructor(private http: HttpClient, private utils: UtilsService, private router: Router) {}

  public apiCall(reqType: string, endpoint: string, payload?: {}): Observable<any> {
    const body = payload ? { ...payload } : null;
    const opts = { headers: this.checkHTTPOptions() };
    const url = `${API_URL}${endpoint}`;
    const reqData = { url, opts, body };

    reqTypeForHandler = reqType;

    return this.requests[reqType]({ ...reqData }).pipe(tap(resp => resp));
  }

  public checkHTTPOptions(): HttpHeaders {
    const token = localStorage.getItem('token');
    const defaultHeaders: { [name: string]: string | string[] } = {
      Accept: '*/*',
    };

    if (token && token.length) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    return new HttpHeaders(defaultHeaders);
  }

  public errorHandler(err: HttpErrorResponse | any): void {
    if (!err.status) {
      this.utils.presentAlert({ header: 'Unrecognise ERROR!', message: JSON.stringify(err) });
      throw { ...err };
    }

    let navigate = '';
    const { status, error } = err;
    const type = reqTypeForHandler.length ? reqTypeForHandler : 'NaN';
    const alertData: { header?: string; subHeader?: string; message: string } = { message: '' };
    const recognizeStatus = (statusNumber: number): boolean => {
      switch (statusNumber) {
        case 200:
          this.utils.presentToast({ message: `${err.body.error.message}`, position: 'top', color: 'danger' });
          return false;
        case 404:
          alertData.subHeader = 'Server returns Not found. 400';
          navigate = '/';
          break;
        case 401:
          alertData.subHeader = 'Login ERROR!';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate = '/login';
          break;
        case 422:
          alertData.subHeader = `${DEFAULT_ALERT_SUB}`;
          break;
        case 500:
          alertData.subHeader = `${DEFAULT_ALERT_SUB} - 500`;
          break;
        default:
          alertData.subHeader = `${DEFAULT_ALERT_SUB} - Unrecognized status`;
          navigate = '/';
      }

      return true;
    };

    console.error(`API ${type}-request to '${err.url}' ERROR: \n Status: ${status} \n error: \n`, error);

    if (!recognizeStatus(status)) {
      throw { ...err.body };
    }

    if (error && error.errors) {
      const { errors } = error;

      Object.values(errors).map(str => {
        alertData.message += `<p>${str}</p>`;
      });
    }

    if (error && error.length) {
      alertData.message += `<p>${error}</p>`;
    }

    if (error && error.message && error.message.length) {
      alertData.message += `<p>${error.message}</p>`;
    }

    this.utils.presentAlert({ ...alertData });

    if (navigate.length) {
      this.router.navigate([`${navigate}`], { replaceUrl: true });
    }

    throw { error };
  }
}

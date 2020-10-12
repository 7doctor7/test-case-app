import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from '../api/api.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService {
  private counter = 0;

  constructor(private api: ApiService, private utils: UtilsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.counter === 0) {
      this.utils.presentLoading({});
    }

    let request: HttpRequest<any>;
    const token = localStorage.getItem('token');

    this.counter++;

    const headers = this.api.checkHTTPOptions();

    if (token && token.length) {
      request = req.clone({ headers, withCredentials: true });
    } else {
      request = req.clone({ headers });
    }

    return next.handle(request).pipe(
      tap(
        data => {
          if (data instanceof HttpResponse) {
            setTimeout(() => {
              this.counter--;
              this.checkLoading(this.counter);
            }, 1000);

            return data;
          }
        },
        (err: HttpErrorResponse) => {
          setTimeout(() => {
            this.counter--;
            this.checkLoading(this.counter);
          }, 1000);

          return this.api.errorHandler({ ...err });
        }
      )
    );
  }

  private async checkLoading(count: number) {
    if (count <= 0) {
      this.counter = 0;
      await this.utils.dismissLoading();
    }
  }
}

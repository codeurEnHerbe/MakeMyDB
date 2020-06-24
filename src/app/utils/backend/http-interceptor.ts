import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


export const InterceptorSkip = 'X-Skip-Interceptor';
@Injectable()
export class BackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = 'http://yamikamisama.fr:8080';
    if (req.headers && req.headers.has(InterceptorSkip)) {
      const headers = req.headers.delete(InterceptorSkip);
      return next.handle(req.clone({ url: url + req.url, headers }));
    }
    req = req.clone({
      url: url + req.url,
      withCredentials: sessionStorage.getItem("isUserConnected") == 'true'
    });
    return next.handle(req);
  }
}


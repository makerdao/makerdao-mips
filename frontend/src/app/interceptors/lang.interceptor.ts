import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LangService } from '../services/lang/lang.service';

@Injectable()
export class LangInterceptor implements HttpInterceptor {
  constructor(private langService: LangService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    if (request.headers.get('ignore-lang') === 'true') {
      return next.handle(request.clone({
        headers: request.headers.delete('ignore-lang')
      }))
    }

    if (!request?.url?.includes('lang=')) {
      const modifiedRequest = request.clone({
        params: request.params.append('lang', this.langService.lang),
      });

      return next.handle(modifiedRequest);
    }

    return next.handle(request);
  }
}

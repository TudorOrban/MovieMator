import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, switchMap, take } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!request.url.includes("/api/v1/")) {
            return next.handle(request);
        }

        return this.authService.accessToken$.pipe(
            take(1),
            switchMap(token => {
                let authRequest = request;

                if (token) {
                    authRequest = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else {
                    console.warn("AuthInterceptor: No access token available for API request:", request.url);
                }

                return next.handle(authRequest);
            })
        );
    }
}

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/service/auth.interceptor';


export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes),
        provideHttpClient(), 
        provideHttpClient(
            withInterceptorsFromDi(),
            // withFetch(),
            ), 
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ]
};

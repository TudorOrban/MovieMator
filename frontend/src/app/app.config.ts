import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/service/auth.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes),
        provideHttpClient(withFetch()), 
        provideHttpClient(
            withInterceptorsFromDi(),
        ), 
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        [provideCharts(withDefaultRegisterables())]
    ]
};

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  LOCALE_ID
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

import { routes } from './app.routes';
import { authTokenInterceptor } from '@features/auth/interceptors/auth-token.interceptor';

// Register Polish locale
registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'pl' }
  ]
};

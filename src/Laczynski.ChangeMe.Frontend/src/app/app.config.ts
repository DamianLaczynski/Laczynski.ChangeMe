import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

import { routes } from './app.routes';

// Register Polish locale
registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'pl' },
  ],
};

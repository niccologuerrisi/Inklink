import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    //registra il servizio HttpClient di Angular a livello globale dell'applicazione,
    // rendendolo disponibile per l'injection in qualsiasi Service creiamo;
    // withInterceptors aggiunge l'interceptor che allega il token JWT
    provideNoopAnimations()
    // Angular Material richiede un provider di animazioni per funzionare;
    // usiamo la versione "noop" (senza libreria @angular/animations, ormai
    // deprecata) dato che nel design di Inklink le transizioni sono gestite
    // direttamente via CSS nei singoli componenti.
  ]
};

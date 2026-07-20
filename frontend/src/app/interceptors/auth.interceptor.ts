import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Intercetta ogni richiesta HTTP in uscita e, se esiste un token salvato,
// aggiunge automaticamente l'header "Authorization: Bearer <token>".
// Così non dobbiamo ripetere questa logica in ogni singolo Service.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};

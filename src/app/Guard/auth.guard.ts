import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // 1. Inyectamos el Router para poder mandar al usuario al login si falla
  const router = inject(Router);

  // 2. Buscamos el token en la caja fuerte (SessionStorage)
  const token = sessionStorage.getItem('authToken');

  // 3. Verificamos
  if (token) {
    // ✅ Si hay token, lo dejamos pasar
    return true;
  } else {
    // ⛔ Si NO hay token, lo mandamos al login
    router.navigate(['/login']);
    return false;
  }
};
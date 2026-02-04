import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  
  // 1. Buscamos el token en la caja fuerte
  const token = sessionStorage.getItem('authToken');

  // 2. Si hay token, clonamos la petición y le inyectamos el token
  if (token) {
    const reqConToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Mandamos la petición clonada (con el token pegado)
    return next(reqConToken);
  }

  // 3. Si no hay token, mandamos la petición original (sin nada)
  return next(req);
};
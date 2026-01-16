# 💊 Farmacia Subsidio - Sistema de Gestión Fullstack

Este proyecto es una solución integral para la gestión de subsidios farmacéuticos, diseñada para conectar a los beneficiarios de salud con los medicamentos que necesitan.

El sistema permite a los usuarios consultar un catálogo, solicitar subsidios y recibir un voucher digital con QR, mientras que los administradores cuentan con un panel de control para aprobar solicitudes y gestionar el inventario.

## 🚀 Características Principales

### 👤 Para el Usuario (Cliente)
- **Catálogo Interactivo:** Búsqueda en tiempo real de medicamentos disponibles y filtrado inteligente.
- **Solicitud de Subsidios:** Flujo sencillo para pedir descuentos en medicamentos.
- **Voucher Digital (Ticket):** Al aprobarse o solicitarse, se genera un **Ticket Digital** con:
  - Cálculo automático del descuento (ej. 60% OFF).
  - Código QR generado dinámicamente para validación en farmacia.
  - Temporizador visual de validez.
- **Dashboard Personal:** Visualización de historial y estado de solicitudes (Pendiente, Aprobada, Rechazada).

### 🛡️ Para el Administrador
- **Gestión de Solicitudes:** Aprobar o rechazar subsidios pendientes con un clic.
- **Control de Inventario (CRUD):** Agregar y eliminar medicamentos del sistema.
- **Buscadores Avanzados:** Filtrado de usuarios y medicamentos por nombre o ID.
- **Interfaz Moderna:** Diseño limpio con estilos Glassmorphism y feedback visual inmediato.

## 🛠️ Tecnologías Utilizadas

### Backend (API)
- **C# .NET Core:** Arquitectura robusta y escalable.
- **Entity Framework Core:** Manejo de base de datos y relaciones.
- **Swagger:** Documentación automática de endpoints.
- **Patrón Repository/Service:** Lógica de negocio desacoplada y limpia.

### Frontend (Cliente)
- **Angular (Latest):** Uso de **Standalone Components** y arquitectura modular.
- **TypeScript:** Tipado estricto para mayor seguridad en el código.
- **RxJS:** Manejo reactivo de datos (ForkJoin para cargas simultáneas).
- **CSS3 Moderno:** Flexbox, Grid, Animaciones y diseño responsivo.

## 📸 Capturas de Pantalla

*(Aquí puedes subir las imágenes que me mostraste: el Dashboard, el Modal del Ticket con QR, y el Login)*

## 💿 Instalación y Ejecución

**1. Clonar el repositorio**
```bash
git clone [https://github.com/TU_USUARIO/Farmacia-Subsidio-Fullstack.git](https://github.com/TU_USUARIO/Farmacia-Subsidio-Fullstack.git)
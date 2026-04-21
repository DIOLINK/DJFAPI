# 🛡️ Reporte DevSecOps: Manejo de Autenticación y Sesión JWT en SPA React+Vite con Google OAuth2

**Fecha:** 2026-04-16 · **Versión:** v1

---

## 1. Diagnóstico Actual

### Store Zustand (`/spa-client/src/store/authStore.ts`)
- **No persiste datos** (ni en sessionStorage, ni en localStorage, ni cookies).
- Solo guarda en RAM: el estado de usuario y JWT propio se pierde al cerrar, recargar o abrir nueva pestaña.
- **No guarda nunca** el id_token de Google ni ningún refresh_token: solo el app JWT y los datos mínimos de usuario.
- No hay almacenamiento potencialmente vulnerable a XSS persistente.

### Hooks de manejo (`/spa-client/src/hooks/useAuth.ts`)
- `loginGoogle`: pide y almacena únicamente el app JWT; limpia datos en caso de error.
- `logout`: borra datos internos del store.
- No hay lógica de limpieza especial al cerrar/eliminar pestaña (innecesario; pierde todo por defecto).

### Consecuencias
- **Seguridad**: Excelente. Sin exposición en storage persistente, superficie de ataque ultra-reducida.
- **Usabilidad**: El usuario debe autenticarse de nuevo cada vez que recarga, cierra o abre la SPA (no hay "recuerdo" de sesión).

---

## 2. Estado del Arte & Recomendaciones 2026

### Perspectiva internacional (según npm, GitHub zustand, Google, comunidades SecOps):
- **Persistencia recomendada para UX aceptable**: sessionStorage, nunca localStorage/cookies.
- **No persistir jamás**: id_token Google ni refresh tokens; solo el JWT propio generado por backend.
- **logout/clear**: debe limpiar sessionStorage y estado del store.
- **sessionStorage**: da persistencia solo en la ventana actual; elimina tokens al cerrar navegador/pestaña (defensa contra "token replay" inter-pestaña o fuga post-logout).
- **Protección de rutas SPA**: todo acceso protegido debe verificarse contra existencia/validez del JWT (incluso restaurado desde sessionStorage).
- **Extra**: Si el usuario pide “recuérdame”, considerar localStorage solo si hay consentimiento explícito y advertencia de riesgo.

---

## 3. Propuesta para Mejorar la Seguridad y UX

1. **Middleware de persistencia zustand** con sessionStorage:
   - El estado auth (JWT y datos usuario) vivirá mientras la ventana está abierta, se recupera tras reload, y se limpia al cerrar la pestaña.
   - Previene ataques derivados de XSS persistente en localStorage; minimiza riesgo residual a lo estrictamente temporal.

2. **Logout robusto**:
   - Función debe limpiar tanto el estado RAM como sessionStorage.
   - Opción: Limpieza mediante `window.onunload` para mayor garantía.

3. **Manejo de tokens Google**:
   - El id_token Google nunca debe guardarse en ningún storage cliente.
   - Se valida ÚNICAMENTE en el backend, que responde con el JWT propio.
   - El JWT backend debe tener expiración breve, ser rotado si corresponde, y en el backend todas rutas deben requerir JWT.

---

## 4. Conclusión y Próximos Pasos

- **Situación actual** = máxima seguridad, UX mínima.
- **Mejor práctica DevSecOps 2026** = sessionStorage (persistencia temporal en SPA), jamás localStorage/cookie para tokens sensibles.
- **Riesgos mitigados** = XSS persistente, token replay, exposición post-logout accidental, refresh hijacking.

**Solicitamos decisión del área DevSecOps:**
- ¿Desean mantener máxima seguridad (sesión solo RAM, sin persistencia) sacrificando usabilidad?
- ¿O avanzar a la práctica recomendada (persistir solo en sessionStorage), maximizando balance seguridad/usabilidad?

**Implementación lista para configuración/ajuste inmediato según directriz recibida.**

---

# Tu Voz Cuenta 2.0

Proyecto para desplegar en GitHub + Vercel con PostgreSQL en Neon.

## Incluye
- Página responsive y formulario de historias.
- Las historias se guardan como `pendiente`; no se publican automáticamente.
- Sección pública que solo muestra historias aprobadas.
- Panel privado en `/admin.html` para aprobar o rechazar casos.
- API serverless en `api/` y sesión de administración con cookie HttpOnly.

## Instalación
1. Crea un repositorio NUEVO en GitHub, por ejemplo `tu-voz-cuenta-2`.
2. Sube todo el contenido del ZIP conservando exactamente las carpetas.
3. Importa ese repositorio en Vercel y despliega.
4. En Vercel → Settings → Environment Variables configura `DATABASE_URL` (cadena de conexión Neon) y `ADMIN_PASSWORD` (contraseña larga, única y difícil de adivinar). No publiques estos secretos.
5. Ejecuta `schema.sql` en el SQL Editor de Neon. Si ya tienes la tabla `casos` con estas mismas columnas, no hace falta volver a crearla.
6. Espera a que el despliegue termine con estado `Ready`.
7. Comprueba `https://TU-DOMINIO/api/casos`; debería responder `{"casos":[]}` si no hay casos publicados.
8. Entra en `https://TU-DOMINIO/admin.html` para revisar envíos.

## Antes de abrirlo al público
La opción “anónimo” solo evita mostrar el nombre del autor; no garantiza anonimato técnico ni elimina identificadores incluidos en el texto. Completa la política de privacidad con los datos del responsable, base jurídica, conservación y procedimiento de derechos. Añade protección contra spam y revisa las obligaciones legales aplicables antes de recoger denuncias reales. Los relatos son testimonios enviados por usuarios, no hechos verificados automáticamente.

# Desplegar en Netlify — Guía paso a paso

## 1. Probar en local

```bash
npm install
npm run dev      # abre http://localhost:5173
```

Comprueba: que carga la portada, el mapa interactivo (necesita conexión), los 7 idiomas, y que `http://localhost:5173/data/events.json` responde.

> El service worker (PWA) está **desactivado en `dev`** a propósito, para no interferir. Se activa en `build`/`preview`.

## 2. Compilar

```bash
npm run build    # genera la carpeta dist/
npm run preview  # sirve dist/ en local para revisarlo como en producción (incluida la PWA)
```

## 3. Publicar en Netlify

**Opción A — desde GitHub (recomendada, con despliegues automáticos):**
1. Sube el proyecto a un repositorio de GitHub.
2. En Netlify: *Add new site → Import an existing project →* elige el repositorio.
3. No hace falta configurar nada: el `netlify.toml` ya fija `build = "npm run build"` y `publish = "dist"`.
4. *Deploy.* Cada `git push` redepliega.

**Opción B — arrastrar y soltar:** ejecuta `npm run build` y arrastra la carpeta `dist/` a Netlify Drop. (Sin despliegue automático ni CMS cómodo; úsala solo para una demo.)

## 4. Activar el CMS (`/admin`) — autenticación

> Netlify Identity está **descatalogado**. El camino vigente y más simple en Netlify es **GitHub como backend + Netlify como proveedor OAuth** (sin servidor propio).

1. **GitHub → OAuth App**: *Settings → Developer settings → OAuth Apps → New OAuth App.*
   - *Homepage URL*: la URL de tu sitio Netlify.
   - *Authorization callback URL*: `https://api.netlify.com/auth/done`
   - Genera un *Client Secret*. Apunta *Client ID* y *Client Secret*.
2. **Netlify → proveedor OAuth**: *Site configuration → Access & security → OAuth → Install provider → GitHub*, y pega el *Client ID* y *Client Secret* del paso 1.
3. **`public/admin/config.yml`**: pon tu repositorio real en `repo:` (formato `organizacion/repositorio`) y la rama. No necesitas `base_url` ni servidor propio.
4. Abre `https://tu-sitio/admin/`, inicia sesión con GitHub y edita. Cada guardado hace *commit* al repositorio y Netlify redepliega.

> La persona editora necesita acceso de escritura al repositorio en GitHub. Si prefieres no usar Netlify para la auth, la alternativa es desplegar el *Sveltia CMS Authenticator* en un Cloudflare Worker y añadir `base_url` en el `config.yml` (más pasos).

## 5. Dominio y comprobaciones finales

- Conecta el dominio definitivo en *Domain management* (recomendado un dominio propio en la raíz, para que `/data` y `/admin` funcionen sin subrutas).
- Verifica en producción:
  - `https://tu-dominio/` carga la app;
  - `https://tu-dominio/data/events.json` y `/data/restaurants.json` responden (el CMS y la app los leen);
  - `https://tu-dominio/admin/` muestra el panel y permite iniciar sesión;
  - en móvil, el navegador ofrece **«Añadir a pantalla de inicio»** (PWA).

## Notas

- **Mapa offline**: las teselas del mapa y Leaflet se cargan desde Internet dentro de un iframe aislado; **no** se cachean para uso sin conexión. La lista de puntos sí funciona offline una vez visitada. Es intencionado y seguro.
- **Iconos PWA**: se incluyen `icon-192.png`, `icon-512.png` y `icon-maskable-512.png` generados a partir de `icon.svg`. Puedes sustituirlos por arte definitivo manteniendo los mismos nombres.
- **Accesibilidad**: antes de comunicar la app como oficial, completa y publica la *declaración de accesibilidad* (documento aparte) y enlázala desde la pantalla «Accessibilitat» rellenando `A11Y_DECLARATION_URL` en `src/App.jsx`.
- **Subruta (p. ej. GitHub Pages)**: si algún día NO se despliega en la raíz del dominio, hay que cambiar `base` en `vite.config.js` **y** `CMS_DATA_BASE` en `src/App.jsx`. En Netlify con dominio propio no hace falta.

# 🚀 Guía de Configuración del Servidor MCP DevOps

Este documento explica paso a paso **dónde y cómo obtener cada token y credencial** necesarios para configurar el Servidor MCP para **GitHub**, **Vercel** y **PythonAnywhere**.

---

## 📋 Lista de Variables de Entorno Necesarias

```json
{
  "GITHUB_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "GITHUB_OWNER": "godkiun",
  "GITHUB_REPO": "MODELO-PREDICTIVO-DE-INTERRUPCIONES-ELECTRICAS-EN-LAZARO-CARDENAS",
  "VERCEL_TOKEN": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "VERCEL_PROJECT_ID": "prj_xxxxxxxxxxxxxxxxxxxxxxxx",
  "VERCEL_TEAM_ID": "",
  "PYTHONANYWHERE_TOKEN": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "PYTHONANYWHERE_USERNAME": "tu_usuario",
  "PYTHONANYWHERE_DOMAIN": "tu_usuario.pythonanywhere.com"
}
```

---

## 1. 🐙 GitHub (`GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`)

### A. Obtener `GITHUB_TOKEN`
1. Inicia sesión en [GitHub](https://github.com).
2. Haz clic en tu foto de perfil (esquina superior derecha) y selecciona **Settings** (Configuración).
3. En el menú de la izquierda, desplázate hasta el final y selecciona **Developer settings**.
4. Selecciona **Personal access tokens** -> **Tokens (classic)**.
5. Haz clic en **Generate new token** -> **Generate new token (classic)**.
6. Dale una nota descriptiva (ej. `MCP DevOps Token`).
7. Marca las siguientes casillas (Scopes):
   - `repo` (Acceso completo a repositorios privados/públicos).
   - `workflow` (Para disparar flujos de GitHub Actions).
8. Haz clic en **Generate token** en el fondo de la página.
9. **¡Copia el token generado de inmediato!** (Comienza con `ghp_` o `github_pat_`).

### B. Obtener `GITHUB_OWNER` y `GITHUB_REPO`
- **`GITHUB_OWNER`**: Tu nombre de usuario en GitHub (ej. `godkiun`).
- **`GITHUB_REPO`**: El nombre exacto del repositorio (ej. `MODELO-PREDICTIVO-DE-INTERRUPCIONES-ELECTRICAS-EN-LAZARO-CARDENAS`).

---

## 2. ▲ Vercel (`VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`)

### A. Obtener `VERCEL_TOKEN`
1. Inicia sesión en el [Vercel Dashboard](https://vercel.com/dashboard).
2. Haz clic en tu avatar/foto de perfil (arriba a la derecha) y selecciona **Account Settings**.
3. En el menú lateral izquierdo, haz clic en **Tokens**.
4. Haz clic en **Create Token**.
5. Asigna un nombre (ej. `MCP Server Token`), elige el alcance (**Full Access** o tu proyecto) y la expiración.
6. Haz clic en **Create** y copia el token generado.

### B. Obtener `VERCEL_PROJECT_ID`
1. En el Dashboard de Vercel, entra a tu proyecto (el frontend de Next.js).
2. Ve a la pestaña **Settings** (Configuración del proyecto) en el menú superior del proyecto.
3. En la sección **General**, desplázate hacia abajo hasta encontrar **Project ID**.
4. Copia el valor (empieza por `prj_...`).

### C. Obtener `VERCEL_TEAM_ID` *(Opcional)*
- Si tu proyecto pertenece a un **Equipo (Team)** en Vercel:
  1. Ve a **Team Settings** -> **General**.
  2. Copia el **Team ID** (empieza por `team_...`).
- Si tu proyecto está en tu **cuenta personal de Vercel**, deja esta variable vacía: `""`.

---

## 3. 🐍 PythonAnywhere (`PYTHONANYWHERE_TOKEN`, `PYTHONANYWHERE_USERNAME`, `PYTHONANYWHERE_DOMAIN`)

### A. Obtener `PYTHONANYWHERE_TOKEN`
1. Inicia sesión en [PythonAnywhere](https://www.pythonanywhere.com).
2. Haz clic en el enlace **Account** (esquina superior derecha).
3. Selecciona la pestaña **API Token**.
4. Haz clic en **Create a new API token**.
5. Copia la cadena alfanumérica generada.

### B. Obtener `PYTHONANYWHERE_USERNAME` y `PYTHONANYWHERE_DOMAIN`
- **`PYTHONANYWHERE_USERNAME`**: Tu nombre de usuario con el que inicias sesión en PythonAnywhere.
- **`PYTHONANYWHERE_DOMAIN`**: El dominio de tu Web App indicado en la pestaña **Web** de PythonAnywhere (por ejemplo: `tu_usuario.pythonanywhere.com` o tu dominio personalizado configurado).

---

## 4. 📝 Cómo registrar el servidor MCP en tu Cliente de IA

Abre o crea el archivo de configuración `mcp_config.json` (o `claude_desktop_config.json` según tu entorno) y pega la siguiente estructura reemplazando tus datos:

```json
{
  "mcpServers": {
    "devops-manager": {
      "command": "node",
      "args": [
        "C:/Users/52753/Desktop/MODELO PREDICTIVO DE INTERRUPCIONES ELECTRICAS EN LAZARO CARDENAS/mcp-devops-server/dist/index.js"
      ],
      "env": {
        "GITHUB_TOKEN": "ghp_TU_TOKEN_DE_GITHUB",
        "GITHUB_OWNER": "godkiun",
        "GITHUB_REPO": "MODELO-PREDICTIVO-DE-INTERRUPCIONES-ELECTRICAS-EN-LAZARO-CARDENAS",

        "VERCEL_TOKEN": "TU_TOKEN_DE_VERCEL",
        "VERCEL_PROJECT_ID": "prj_TU_PROJECT_ID",
        "VERCEL_TEAM_ID": "",

        "PYTHONANYWHERE_TOKEN": "TU_TOKEN_DE_PYTHONANYWHERE",
        "PYTHONANYWHERE_USERNAME": "TU_USUARIO_PYTHONANYWHERE",
        "PYTHONANYWHERE_DOMAIN": "TU_USUARIO.pythonanywhere.com"
      }
    }
  }
}
```

---

## 🔄 Reiniciar el Cliente de IA
Una vez guardado tu `mcp_config.json`, **reinicia tu entorno/cliente de IA** para que cargue las herramientas expuestas por `devops-manager`.

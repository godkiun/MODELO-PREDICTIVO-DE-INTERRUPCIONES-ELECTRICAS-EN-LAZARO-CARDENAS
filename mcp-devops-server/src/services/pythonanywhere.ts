export async function reloadPythonAnywhereWebApp() {
  const token = process.env.PYTHONANYWHERE_TOKEN;
  const username = process.env.PYTHONANYWHERE_USERNAME;
  const domain = process.env.PYTHONANYWHERE_DOMAIN;

  if (!token || !username || !domain) {
    throw new Error("Faltan variables de entorno para PythonAnywhere (PYTHONANYWHERE_TOKEN, PYTHONANYWHERE_USERNAME, PYTHONANYWHERE_DOMAIN).");
  }

  const url = `https://www.pythonanywhere.com/api/v0/user/${username}/webapps/${domain}/reload/`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al recargar PythonAnywhere (${res.status}): ${text}`);
  }

  return { success: true, message: `Aplicación web '${domain}' recargada exitosamente en PythonAnywhere.` };
}

export async function getPythonAnywhereAppInfo() {
  const token = process.env.PYTHONANYWHERE_TOKEN;
  const username = process.env.PYTHONANYWHERE_USERNAME;
  const domain = process.env.PYTHONANYWHERE_DOMAIN;

  if (!token || !username || !domain) {
    throw new Error("Faltan variables de entorno para PythonAnywhere (PYTHONANYWHERE_TOKEN, PYTHONANYWHERE_USERNAME, PYTHONANYWHERE_DOMAIN).");
  }

  const url = `https://www.pythonanywhere.com/api/v0/user/${username}/webapps/${domain}/`;

  const res = await fetch(url, {
    headers: { 'Authorization': `Token ${token}` }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error en la API de PythonAnywhere (${res.status}): ${text}`);
  }
  return await res.json();
}

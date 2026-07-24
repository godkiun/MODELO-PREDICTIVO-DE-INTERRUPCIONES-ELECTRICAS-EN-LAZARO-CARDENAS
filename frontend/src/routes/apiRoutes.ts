export const API_BASE_URL = 'https://ronadev.pythonanywhere.com';

export const API_ROUTES = {
  PREDICCION_ACTUAL: `${API_BASE_URL}/api/prediccion_actual`,
  REPORTAR_APAGON: `${API_BASE_URL}/api/reportar_apagon`,
  ADMIN_VERIFICAR_TOKEN: `${API_BASE_URL}/api/admin/verificar-token`,
  ADMIN_PENDIENTES: `${API_BASE_URL}/api/admin/pendientes`,
  ADMIN_APROBAR: `${API_BASE_URL}/api/admin/aprobar`,
} as const;

export const APP_ROUTES = {
  HOME: '/',
} as const;

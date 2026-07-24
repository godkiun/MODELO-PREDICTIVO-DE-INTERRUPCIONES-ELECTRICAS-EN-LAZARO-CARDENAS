const CACHE_KEY = 'cache_apagones_lc';

export function guardarEnCache<T>(data: T): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error guardando en localStorage:', err);
  }
}

export function obtenerDeCache<T>(): T | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error('Error leyendo de localStorage:', err);
    return null;
  }
}

import sqlite3
import urllib.parse
from datetime import datetime
import feedparser

# ==========================================
# 1. Configuración de la Búsqueda
# ==========================================
# Buscamos términos clave específicos para el puerto
query = '"Lázaro Cárdenas" AND ("apagón" OR "sin luz" OR "falla eléctrica" OR "CFE")'
url_codificada = urllib.parse.quote(query)
# Construimos la URL de Google News para México en español
RSS_URL = f"https://news.google.com/rss/search?q={url_codificada}&hl=es-419&gl=MX&ceid=MX:es-419"

# ==========================================
# 2. Inicialización de Base de Datos SQLite
# ==========================================
def inicializar_db():
    import os
    dir_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_db = os.path.join(dir_actual, "apagones_lc.db")
    conexion = sqlite3.connect(ruta_db)
    cursor = conexion.cursor()
    
    # Creamos una tabla nueva exclusiva para nuestra variable objetivo (los apagones)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reportes_apagones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha_reporte DATETIME,
            titulo_noticia TEXT,
            fuente TEXT,
            enlace TEXT
        )
    ''')
    conexion.commit()
    return conexion

# ==========================================
# 3. Extracción de Noticias (Scraping)
# ==========================================
def extraer_noticias(conexion):
    print("Buscando reportes de apagones recientes...")
    
    # Extraemos el feed RSS de Google News
    feed = feedparser.parse(RSS_URL)
    
    if not feed.entries:
        print("La red está estable. No se encontraron reportes recientes.")
        return

    cursor = conexion.cursor()
    nuevos_reportes = 0

    for entrada in feed.entries:
        titulo = entrada.title
        enlace = entrada.link
        # Si la noticia trae el nombre del periódico/portal, lo guardamos
        fuente = entrada.source.title if 'source' in entrada else "Desconocida"
        
        # Google entrega la fecha en un formato raro, lo limpiamos para SQLite
        try:
            fecha_dt = datetime.strptime(entrada.published, "%a, %d %b %Y %H:%M:%S %Z")
            fecha_str = fecha_dt.strftime("%Y-%m-%d %H:%M:%S")
        except:
            # Si falla, usamos la hora en la que encontramos el reporte
            fecha_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Regla vital: Evitar duplicados. Buscamos si ese enlace ya está en la base de datos
        cursor.execute("SELECT id FROM reportes_apagones WHERE enlace = ?", (enlace,))
        if cursor.fetchone() is None:
            # Si no existe, lo insertamos
            cursor.execute('''
                INSERT INTO reportes_apagones (fecha_reporte, titulo_noticia, fuente, enlace)
                VALUES (?, ?, ?, ?)
            ''', (fecha_str, titulo, fuente, enlace))
            nuevos_reportes += 1
            print(f"[ALERTA GUARDADA] {fecha_str} | Fuente: {fuente} | {titulo}")

    conexion.commit()
    print(f"Búsqueda finalizada. Se agregaron {nuevos_reportes} registros nuevos.")

# ==========================================
# Ejecución Principal
# ==========================================
if __name__ == "__main__":
    conexion_db = inicializar_db()
    extraer_noticias(conexion_db)
    conexion_db.close()
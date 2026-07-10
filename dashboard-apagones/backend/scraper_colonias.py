import sqlite3
import urllib.parse
from datetime import datetime
import feedparser
import re
import sys
from bs4 import BeautifulSoup

# Asegurar codificación UTF-8 en la consola
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# ==========================================
# 1. Configuración del "ADN" Espacial
# ==========================================
# Lista de colonias y zonas clave del municipio. 
# Puedes agregar todas las que necesites mapear.
COLONIAS_LC = [
    "11 de julio", "centro", "las guacamayas", "la mira", "playa azul",
    "fideicomiso", "campamento", "pie de casa", "las truchas", 
    "primer sector", "segundo sector", "tercer sector", "lotes y servicios",
    "corregidora", "la orillita", "buenos aires"
]

# Búsqueda general para atraer cualquier reporte de la ciudad
query = '"Lázaro Cárdenas" AND ("apagón" OR "sin luz" OR "falla eléctrica" OR "transformador" OR "CFE")'
url_codificada = urllib.parse.quote(query)
RSS_URL = f"https://news.google.com/rss/search?q={url_codificada}&hl=es-419&gl=MX&ceid=MX:es-419"

# ==========================================
# 2. Inicialización de Base de Datos
# ==========================================
def inicializar_db_espacial():
    conexion = sqlite3.connect("apagones_lc.db")
    cursor = conexion.cursor()
    
    # Esta tabla es mucho más específica, incluye la columna 'colonia'
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reportes_por_zona (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha_reporte DATETIME,
            colonia TEXT,
            texto_reporte TEXT,
            fuente TEXT,
            enlace TEXT
        )
    ''')
    conexion.commit()
    return conexion

# ==========================================
# 3. Limpieza y Detección de Zonas (NLP Básico)
# ==========================================
def limpiar_html(texto_bruto):
    # Quitamos etiquetas HTML basura que vengan en el RSS
    soup = BeautifulSoup(texto_bruto, "html.parser")
    return soup.get_text()

def detectar_colonia(texto):
    texto_limpio = texto.lower()
    colonias_detectadas = []
    
    # Buscamos coincidencias exactas de las colonias en el texto del reporte
    for colonia in COLONIAS_LC:
        # Usamos expresiones regulares para buscar la palabra completa
        if re.search(r'\b' + re.escape(colonia) + r'\b', texto_limpio):
            colonias_detectadas.append(colonia)
            
    return colonias_detectadas

# ==========================================
# 4. Extracción y Clasificación
# ==========================================
def extraer_reportes_zonales(conexion):
    print("Iniciando barrido hiperlocal de reportes...")
    feed = feedparser.parse(RSS_URL)
    
    if not feed.entries:
        print("No hay alertas activas en la red.")
        return

    cursor = conexion.cursor()
    registros_nuevos = 0

    for entrada in feed.entries:
        titulo = entrada.title
        descripcion = limpiar_html(entrada.description if 'description' in entrada else "")
        enlace = entrada.link
        fuente = entrada.source.title if 'source' in entrada else "Desconocida"
        
        # Combinamos título y descripción para tener más contexto
        texto_completo = f"{titulo} {descripcion}"
        
        # Intentamos estandarizar la fecha
        try:
            fecha_dt = datetime.strptime(entrada.published, "%a, %d %b %Y %H:%M:%S %Z")
            fecha_str = fecha_dt.strftime("%Y-%m-%d %H:%M:%S")
        except:
            fecha_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Pasamos el texto por nuestro detector de colonias
        zonas_afectadas = detectar_colonia(texto_completo)
        
        # Si encontró una o más colonias, guardamos un registro por cada una
        if zonas_afectadas:
            for zona in zonas_afectadas:
                # Evitar duplicados exactos para la misma colonia y enlace
                cursor.execute("SELECT id FROM reportes_por_zona WHERE enlace = ? AND colonia = ?", (enlace, zona))
                if cursor.fetchone() is None:
                    cursor.execute('''
                        INSERT INTO reportes_por_zona (fecha_reporte, colonia, texto_reporte, fuente, enlace)
                        VALUES (?, ?, ?, ?, ?)
                    ''', (fecha_str, zona.title(), titulo, fuente, enlace))
                    registros_nuevos += 1
                    print(f"📍 [ZONA AFECTADA DETECTADA] Colonia: {zona.title()} | {fecha_str}")

    conexion.commit()
    print(f"Barrido completado. Se mapearon {registros_nuevos} incidencias por zona.")

# ==========================================
# Ejecución Principal
# ==========================================
if __name__ == "__main__":
    conexion_db = inicializar_db_espacial()
    extraer_reportes_zonales(conexion_db)
    conexion_db.close()
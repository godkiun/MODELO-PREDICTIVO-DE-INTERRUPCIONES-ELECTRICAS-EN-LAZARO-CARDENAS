import os
import sqlite3

DIRECTORIO_BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_db_connection(db_name: str = 'reportes_apagones.db') -> sqlite3.Connection:
    ruta_db = os.path.join(DIRECTORIO_BASE, db_name)
    conn = sqlite3.connect(ruta_db)
    return conn

def init_db():
    conn = get_db_connection('reportes_apagones.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reportes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            colonia TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            estado TEXT DEFAULT 'pendiente',
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

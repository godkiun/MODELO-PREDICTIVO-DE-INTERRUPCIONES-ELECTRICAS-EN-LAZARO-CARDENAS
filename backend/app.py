import os
import sys
from flask import Flask
from flask_cors import CORS
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

# Asegurar que el directorio de backend esté en sys.path para importaciones de Clean Architecture
DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))
if DIRECTORIO_ACTUAL not in sys.path:
    sys.path.insert(0, DIRECTORIO_ACTUAL)

from infrastructure.persistence.database import init_db
from presentation.controllers.prediccion_controller import prediccion_bp
from presentation.controllers.reportes_controller import reportes_bp
from presentation.controllers.cron_controller import cron_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔒 CONFIGURACIÓN DE RATE LIMITING (Protección contra DoS y abuso de API)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "60 per hour"],
    storage_uri="memory://"
)

# 🚀 CONFIGURACIÓN DE CACHÉ
cache = Cache(config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 900})
cache.init_app(app)

# Inicializar esquema de SQLite
init_db()

# Registrar Blueprints / Controladores de Clean Architecture
app.register_blueprint(prediccion_bp)
app.register_blueprint(reportes_bp)
app.register_blueprint(cron_bp)

if __name__ == '__main__':
    print("Iniciando Servidor API de Backend con Rate Limiting y Protección Activa en el puerto 5000...")
    app.run(debug=True, port=5000)
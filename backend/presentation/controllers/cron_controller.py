import os
import subprocess
from flask import Blueprint, jsonify, request

cron_bp = Blueprint('cron', __name__)
DIRECTORIO_ACTUAL = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@cron_bp.route('/api/ejecutar-scraper', methods=['GET'])
def ejecutar_scraper():
    token = request.args.get('token')
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')
    
    if token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403
    
    try:
        ruta_scraper = os.path.join(DIRECTORIO_ACTUAL, 'scripts', 'scraper_colonias.py')
        subprocess.Popen(["python3", ruta_scraper])
        return jsonify({"estatus": "exito", "mensaje": "Barrido de noticias iniciado correctamente."})
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": str(e)}), 500

@cron_bp.route('/api/reentrenar-ia', methods=['GET'])
def reentrenar_ia():
    token = request.args.get('token')
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')

    if token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403
    try:
        ruta_dataset = os.path.join(DIRECTORIO_ACTUAL, 'scripts', 'crear_dataset.py')
        ruta_modelo = os.path.join(DIRECTORIO_ACTUAL, 'scripts', 'entrenar_modelo_zonal.py')
        comando = f"python3 {ruta_dataset} && python3 {ruta_modelo}"
        subprocess.Popen(comando, shell=True)
        return jsonify({"estatus": "exito", "mensaje": "Generación de dataset y reentrenamiento iniciados."})
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": str(e)}), 500

from flask import Blueprint, jsonify
from core.usecases.obtener_prediccion_actual_usecase import ObtenerPrediccionActualUseCase

prediccion_bp = Blueprint('prediccion', __name__)

@prediccion_bp.route('/api/prediccion_actual', methods=['GET'])
def obtener_prediccion_actual():
    usecase = ObtenerPrediccionActualUseCase()
    try:
        resultado = usecase.execute()
        return jsonify({
            "estatus": resultado.estatus,
            "fecha_consulta": resultado.fecha_consulta,
            "datos_ambientales": {
                "temperatura_celsius": resultado.datos_ambientales.temperatura_celsius,
                "humedad_relativa": resultado.datos_ambientales.humedad_relativa,
                "velocidad_viento_kmh": resultado.datos_ambientales.velocidad_viento_kmh,
                "codigo_clima_wmo": resultado.datos_ambientales.codigo_clima_wmo
            },
            "factores_tiempo": resultado.factores_tiempo,
            "probabilidad_apagon_porcentaje": resultado.probabilidad_apagon_porcentaje,
            "riesgo_por_colonia": resultado.riesgo_por_colonia
        })
    except ValueError as ve:
        return jsonify({
            "estatus": "error",
            "mensaje": str(ve)
        }), 500
    except Exception as e:
        return jsonify({
            "estatus": "error",
            "mensaje": f"Falla en el procesamiento: {str(e)}"
        }), 500

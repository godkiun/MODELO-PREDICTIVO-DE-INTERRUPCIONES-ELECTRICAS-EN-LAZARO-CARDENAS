import pandas as pd
from datetime import datetime
from zoneinfo import ZoneInfo
from core.domain.models.clima import DatosAmbientales
from core.domain.models.prediccion import ResultadoPrediccion
from infrastructure.external.open_meteo_client import OpenMeteoClient
from infrastructure.ml.model_loader import ModelLoader

ZONA_LOCAL = ZoneInfo("America/Mexico_City")

COLONIAS = [
    "11 de julio", "centro", "las guacamayas", "la mira", "playa azul",
    "fideicomiso", "campamento", "pie de casa", "las truchas",
    "primer sector", "segundo sector", "tercer sector", "lotes y servicios",
    "corregidora", "la orillita", "buenos aires"
]

class ObtenerPrediccionActualUseCase:
    def execute(self) -> ResultadoPrediccion:
        modelo_zonal, columnas_zonal = ModelLoader.obtener_modelo_zonal()
        if modelo_zonal is None or columnas_zonal is None:
            raise ValueError("El modelo predictivo zonal no está disponible.")

        datos_actuales = OpenMeteoClient.obtener_clima_actual()

        fecha_actual = datetime.now(ZONA_LOCAL)
        hora_del_dia = fecha_actual.hour
        dia_semana = fecha_actual.weekday()

        filas_prediccion = []
        for col in COLONIAS:
            fila = {
                'temperatura': datos_actuales["temperature_2m"],
                'sensacion_termica': datos_actuales["apparent_temperature"],
                'humedad': datos_actuales["relative_humidity_2m"],
                'velocidad_viento': datos_actuales["wind_speed_10m"],
                'codigo_clima': datos_actuales["weather_code"],
                'hora_del_dia': hora_del_dia,
                'dia_semana': dia_semana
            }

            for c_col in columnas_zonal:
                if c_col.startswith('colonia_'):
                    col_nombre = c_col.replace('colonia_', '')
                    fila[c_col] = 1 if col_nombre == col else 0

            filas_prediccion.append(fila)

        df_zonal = pd.DataFrame(filas_prediccion, columns=columnas_zonal)
        probabilidades_zonales = modelo_zonal.predict_proba(df_zonal)[:, 1]

        riesgo_por_colonia = {}
        suma_riesgos = 0
        for idx, col in enumerate(COLONIAS):
            nombre_amigable = col.title()
            if col == "fideicomiso":
                nombre_amigable = "Fideicomiso (cerca del ITLAC)"

            riesgo_individual = round(float(probabilidades_zonales[idx]) * 100, 2)
            riesgo_por_colonia[nombre_amigable] = riesgo_individual
            suma_riesgos += riesgo_individual

        probabilidad_apagon = round(suma_riesgos / len(COLONIAS), 2)

        return ResultadoPrediccion(
            estatus="exito",
            fecha_consulta=fecha_actual.strftime("%Y-%m-%d %H:%M:%S"),
            datos_ambientales=DatosAmbientales(
                temperatura_celsius=datos_actuales["temperature_2m"],
                humedad_relativa=datos_actuales["relative_humidity_2m"],
                velocidad_viento_kmh=datos_actuales["wind_speed_10m"],
                codigo_clima_wmo=datos_actuales["weather_code"]
            ),
            factores_tiempo={
                "hora_militar": hora_del_dia,
                "dia_semana_index": dia_semana
            },
            probabilidad_apagon_porcentaje=probabilidad_apagon,
            riesgo_por_colonia=riesgo_por_colonia
        )

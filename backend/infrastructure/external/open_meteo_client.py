import requests

LAT = "17.9586"
LON = "-102.2035"
URL_CLIMA = f"https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto"

class OpenMeteoClient:
    @staticmethod
    def obtener_clima_actual() -> dict:
        respuesta = requests.get(URL_CLIMA)
        if respuesta.status_code != 200:
            raise Exception("No se pudo obtener información de la API de clima (Open-Meteo).")
        return respuesta.json()["current"]

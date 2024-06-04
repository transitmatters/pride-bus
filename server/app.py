from zoneinfo import ZoneInfo
import json
import os
from chalice import Chalice, CORSConfig, ConvertToMiddleware, Response
from datadog_lambda.wrapper import datadog_lambda_wrapper
import requests

EASTERN_TIME = ZoneInfo("US/Eastern")

app = Chalice(app_name="pride-bus")

localhost = "localhost:3000"
TM_CORS_HOST = os.environ.get("TM_CORS_HOST", localhost)

if TM_CORS_HOST != localhost:
    app.register_middleware(ConvertToMiddleware(datadog_lambda_wrapper))
    cors_config = CORSConfig(allow_origin=f"https://{TM_CORS_HOST}", max_age=3600)
else:
    cors_config = CORSConfig(allow_origin="*", max_age=3600)

MBTA_V3_API_KEY = os.environ.get("MBTA_V3_API_KEY")

BASE_URL = "https://api-v3.mbta.com"
ENDPOINTS = {
    "bus": "/vehicles/y1833?api_key={api_key}",
    "shape": "/shapes/{id}?api_key={api_key}",
    "trip": "/trips/{id}?api_key={api_key}",
    "route": "/routes/{id}?api_key={api_key}",
    "stop": "/stops/{id}?api_key={api_key}",
}


@app.route("/api/{endpoint}", cors=cors_config)
def api_bus(endpoint: str):
    if not MBTA_V3_API_KEY:
        return Response(body=json.dumps({"error": "API key not set"}), status_code=500)

    url = BASE_URL + ENDPOINTS[endpoint].format(api_key=MBTA_V3_API_KEY)
    response = requests.get(url)
    return Response(
        body=response.text,
        status_code=response.status_code,
        headers={"Content-Type": "application/json"},
    )


@app.route("/api/{endpoint}/{id}", cors=cors_config)
def api(endpoint: str, id: str):
    if not MBTA_V3_API_KEY:
        return Response(body=json.dumps({"error": "API key not set"}), status_code=500)

    url = BASE_URL + ENDPOINTS[endpoint].format(api_key=MBTA_V3_API_KEY, id=id)
    response = requests.get(url)
    return Response(
        body=response.text,
        status_code=response.status_code,
        headers={"Content-Type": "application/json"},
    )

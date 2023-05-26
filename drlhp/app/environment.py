# snippet implementation fundamental pattern conversion environment

import requests

AUTOTRACE_PORT = 8111
THE_ENDPOINT_WE_WANT = {
    "the_endpoint":"autotrace",
    "port": AUTOTRACE_PORT,
    "base_url": f"http://localhost:{AUTOTRACE_PORT}",
    "openapi": "openapi.json"
}

USE_THIS_FILE = "square.png"
PATTERN_FILE= f"{USE_THIS_FILE}"

def return_default_endpoint_args(endpoint=THE_ENDPOINT_WE_WANT):
    the_json = requests.get(
        endpoint['base_url']+'/'+endpoint['openapi']
    ).json()

    print(the_json)
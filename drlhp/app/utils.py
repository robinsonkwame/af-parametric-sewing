import requests

AUTOTRACE_PORT = 8111
THE_ENDPOINT_WE_WANT = {
    "the_endpoint":"autotrace",
    "port": AUTOTRACE_PORT,
    "base_url": f"http://localhost:{AUTOTRACE_PORT}",
    "openapi": "openapi.json"
}

def return_default_endpoint_args_ordering(endpoint=THE_ENDPOINT_WE_WANT):
    def access_the_properties(the_json):
        return the_json['components']['schemas']['Body_autotrace_autotrace__post']['properties']

    the_json = requests.get(
        endpoint['base_url']+'/'+endpoint['openapi']
    ).json()

    return [
        key for key in access_the_properties(the_json).keys() if '-' in key
    ]

def return_args_properties(endpoint=THE_ENDPOINT_WE_WANT):
    def access_the_properties(the_json):
        return the_json['components']['schemas']['Body_autotrace_autotrace__post']['properties']

    the_json = requests.get(
        endpoint['base_url']+'/'+endpoint['openapi']
    ).json()

    return {
        key[1:]: value for key, value in access_the_properties(the_json).items() if '-' in key
    }


# we fix the autotrace signature order on the openapi endpoint
ARGUMENT_SIGNATURE = return_default_endpoint_args_ordering()
ARGUMENT_PROPERTIES = return_args_properties()
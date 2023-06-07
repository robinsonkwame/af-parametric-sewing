import requests

AUTOTRACE_PORT = 8111
THE_ENDPOINT_WE_WANT = {
    "the_endpoint":"autotrace/",
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

def sample_to_autotrace(the_sample_arguments):
    def process_arg(the_argument, value):
        # if value == True:
        #     return f"-{the_argument}"
        # elif value != False:
        #     return f"-{the_argument}={value}"
        # # skip = False args
        return (f"-{the_argument}", value)
        # skip = False args        

    return {
        process_arg(key, value) for key, value in the_sample_arguments.items() if value != False
    }

    # return " ".join(
    #     [process_arg(argument, value) for argument, value in 
    #      the_sample_arguments.items() if value != False
    #     ]
    # )

# we fix the autotrace signature order on the openapi endpoint
ARGUMENT_SIGNATURE = return_default_endpoint_args_ordering()
ARGUMENT_PROPERTIES = return_args_properties()
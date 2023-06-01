# snippet implementation fundamental pattern conversion environment
import requests
from autotrace import rule_for_boolean

AUTOTRACE_PORT = 8111
THE_ENDPOINT_WE_WANT = {
    "the_endpoint":"autotrace",
    "port": AUTOTRACE_PORT,
    "base_url": f"http://localhost:{AUTOTRACE_PORT}",
    "openapi": "openapi.json"
}

USE_THIS_FILE = "square.png"
PATTERN_FILE= f"{USE_THIS_FILE}"
IMAGE_CACHE = {}

def return_default_endpoint_args_ordering(endpoint=THE_ENDPOINT_WE_WANT):
    def access_the_properties(the_json):
        return the_json['components']['schemas']['Body_autotrace_autotrace__post']['properties']
    the_json = requests.get(
        endpoint['base_url']+'/'+endpoint['openapi']
    ).json()

    return [
        key for key in access_the_properties(the_json).keys() if '-' in key
    ]

# we fix the autotrace signature order on the openapi endpoint
ARGUMENT_SIGNATURE = return_default_endpoint_args_ordering()

def from_spaces(a_sampled_space, signature):
    return {
        signature[sample_index]: sample_value            
            for sample_index, sample_value in enumerate(a_sampled_space)
    }

def call_autotrace(use_this_image, use_these_spaces, endpoint=THE_ENDPOINT_WE_WANT, signature=ARGUMENT_SIGNATURE):
    use_these_arguments = from_spaces(use_these_spaces, ARGUMENT_SIGNATURE)

    print(use_these_arguments)

    response = requests.post(
        endpoint['base_url']+'/'+endpoint['the_endpoint'],
        files={
            'a_file': (
                use_this_image, 
                open(use_this_image, 'rb'),
                'image/png'
            )
        },
        params=use_these_arguments
    )
    if response.ok:
        pass
        # return .svg so it can be turned into an observation

print(
    call_autotrace('/tmp/square.png', use_these_spaces=[1 for _ in ARGUMENT_SIGNATURE])
)


# TODO:
#
# 1) finish autotrace, provides spaces for each parameter
# 2) using that, construct the actions for a customenv
# 3) build a custom observation space, somethign super simple, like a scalar 0-1 for overlap
# 4) implement a function that uses the autotrace endpint to derive an observation; call w/in the step function

# import gym
# from gym import spaces
# from subprocess import Popen, PIPE

# class CustomEnv(gym.Env):
#     def __init__(self):
#         super(CustomEnv, self).__init__()

#         # Define the observation space
#         self.observation_space = spaces.Box(low=0, high=255, shape=(64, 64, 3), dtype=np.uint8)

#         # Define the action space
#         self.action_space = spaces.Discrete(2)  # Example: binary action space

#         # Initialize the external process
#         self.process = Popen(['your_command'], stdout=PIPE, stderr=PIPE)

#     def step(self, action):
#         # Send the action to the external process and get the next observation, reward, and done flag
#         # Example: communicate with the process and parse the output
#         stdout, stderr = self.process.communicate(input=str(action).encode())
#         observation = parse_observation(stdout)
#         reward = parse_reward(stdout)
#         done = parse_done(stdout)

#         return observation, reward, done, {}

#     def reset(self):
#         # Reset the environment and get the initial observation
#         # Example: send a reset command to the process and parse the output
#         self.process.stdin.write(b'reset\n')
#         self.process.stdin.flush()
#         stdout, stderr = self.process.communicate()
#         observation = parse_observation(stdout)

#         return observation

#     def close(self):
#         # Terminate the external process
#         self.process.terminate()
#         self.process.wait()

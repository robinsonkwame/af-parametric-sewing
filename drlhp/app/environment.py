# snippet implementation fundamental pattern conversion environment
import requests
from app.autotrace import rule_for_boolean

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

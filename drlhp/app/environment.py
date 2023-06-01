from gym import Env
from gym.spaces import Dict
from gym.spaces.utils import flatten_space, unflatten
from action import PARAMETERS_TO_SPACES
from observation import PERCEPTUAL_P_AB_SCORE, stub_perceptual_score
import numpy as np

class AutoTrace(Env):
    def __init__(self):
        super(AutoTrace, self).__init__()

        # see https://github.com/openai/gym/blob/master/gym/spaces/utils.py#L330-L342
        self.action_space = flatten_space(
            Dict(PARAMETERS_TO_SPACES)
        )
        # check/ensure that order matches ordering of parameters!!!
        self.observation_space = PERCEPTUAL_P_AB_SCORE

        self.number_of_episodes_ran = 0

        self.the_current_action = None

    def reset(self):
        # Reset the environment and return the initial observation/state
        initial_observation = self._get_observation()
        return initial_observation

    def step(self, the_action):
        self.number_of_episodes_ran += 1

        self._register(the_action)

        reward = self._get_reward()
        the_next_observation = reward #self._get_observation()
        reward = self._get_reward()
        done = self._stub_done()
        info = {"episode": self.number_of_episodes_ran}

        return the_next_observation, reward, done, info

    def _register(self, the_action):
        self.the_current_action = the_action

    def _get_observation(self):
        return self._get_reward() # yeah
    
    def _get_reward(self):
        # stub
        if self.the_current_action is None:
            return self.observation_space.max()

        return stub_perceptual_score(self.the_current_action) # always doing better  
    
    def _stub_done(self):
        done = False
        if self.number_of_episodes_ran > 100:
            done = True
        return done
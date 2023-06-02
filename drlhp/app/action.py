import numpy as np
from typing import Union
from gym.spaces import Box, Discrete, Dict, MultiDiscrete
from collections import OrderedDict
from utils import ARGUMENT_PROPERTIES

LOWER_MAGNITUDE = 0.001
UPPER_MAGNITUDE = 100

LOWER_MAGNITUDE_INTEGER = 0
UPPER_MAGNITUDE_INTEGER = 100

def discretize_dict_space(dict_space, bins):
    nvec = []

    for key, item in dict_space.items():
        space = item['space']
        if isinstance(space, Box):
            n = bins[key]
            nvec.append(n)
        elif isinstance(space, Discrete):
            nvec.append(space.n)
        else:
            raise ValueError(f"Unsupported space type: {type(space)}")

    multi_discrete_space = MultiDiscrete(nvec)

    return {
        "MultiDiscretizedDictSpace": multi_discrete_space
    }

def convert_sample_to_a_dict_sample(sample, dict_space, bins):
    dict_sample = {}

    for (key, item), value in zip(dict_space.items(), sample):
        space = item['space']
        if isinstance(space, Box):
            dict_sample[key] = np.interp(
                value, 
                [0, bins[key]], 
                [space.low[0], space.high[0]]
            )
        elif isinstance(space, Discrete):
            dict_sample[key] = value + item['start']
        else:
            raise ValueError(f"Unsupported space type: {type(space)}")

    return dict_sample

def return_box(func):
    def wrapper(*args, **kwargs):
        lower, upper = func(*args, **kwargs)
        return Box(low=lower, high=upper, shape=(1,))
    return wrapper

def return_discrete(func):
    def wrapper(*args, **kwargs):
        the_values, start_from = func(*args, **kwargs)
        return Discrete(len(the_values))
    return wrapper

@return_box
def rule_for_real_type(the_doc_key):
    lower = LOWER_MAGNITUDE
    upper = UPPER_MAGNITUDE

    lower *= the_doc_key.get('default', 1)
    upper *= the_doc_key.get('default', 1)

    return (
        lower, upper
    )

def rule_for_background_color(the_doc_key):
    """
    From white to grayish brown
    """
    return {
        "White": "#FFFFFF",
        "Light Gray": "#F2F2F2",
        "Gainsboro": "#DCDCDC",
        "Silver": "#C0C0C0",
        "Gray": "#808080",
        "Dim Gray": "#696969",
        "Dark Gray": "#A9A9A9",
        "Slate Gray": "#708090",
        "Grayish": "#A8A8A8",
        "Grayish Brown":" #6B543"
    }

def rule_for_color_count():
    return (
        1, 256
    )

@return_discrete
def rule_for_boolean():
    return [0,1], 0

@return_discrete
def rule_for_unsigned(the_doc_key):
    lower = LOWER_MAGNITUDE_INTEGER
    upper = UPPER_MAGNITUDE_INTEGER

    upper *= the_doc_key.get('default', 1)

    return (
        list(range(lower, upper))
    )

# Gym 0.21 doesn't support Discrete(start=...) so we wrap things
PARAMETERS_TO_SPACES = {
    "test_discrete": {'space': Discrete(4), 'start' : -1},
    "test_box": {'space': Box(low=0, high=1, shape=(1,))}
}
NUMBER_OF_BINS_FOR = {
    "test_box": 50
}
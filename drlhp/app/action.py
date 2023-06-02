import numpy as np
from typing import Union
from gym.spaces import Box, Discrete, Dict, MultiDiscrete
from collections import OrderedDict
from utils import ARGUMENT_PROPERTIES

LOWER_MAGNITUDE = 0.001
UPPER_MAGNITUDE = 100

LOWER_MAGNITUDE_INTEGER = 0
UPPER_MAGNITUDE_INTEGER = 100

# get these two workign tmmrw
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
        elif isinstance(space, MultiDiscrete):
            dict_sample[key] = value # really
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
        list(range(lower, upper)), lower
    )

# my version of gym doesn't support Discrete start !?
PARAMETERS_TO_SPACES = {
    "test_discrete": {'space': Discrete(4), 'start' : -1},
    "test_box": {'space': Box(low=0, high=1, shape=(1,))}
}

# PARAMETERS_TO_SPACES = {
#     #"centerline":  rule_for_boolean(),
#     #"filter-iterations": rule_for_unsigned(ARGUMENT_PROPERTIES['filter-iterations']),
#     "line-reversion-threshold": rule_for_real_type(ARGUMENT_PROPERTIES['line-reversion-threshold']),
#     # "corner-always-threshold": rule_for_unsigned,
#     # "background-color": rule_for_background_color,
#     # "color-count": rule_for_color_count,
#     # "corner-surround": rule_for_unsigned,
#     # "corner-threshold": rule_for_unsigned,
#     # "error-threshold": rule_for_real_type,
# }


# test dict to multidiscrete
bins={
    "test_box": 50
}
new_action_space = discretize_dict_space(PARAMETERS_TO_SPACES, bins=bins)

print(
    f"Our discretized action space is: {new_action_space}"
)

a_sample = new_action_space['MultiDiscretizedDictSpace'].sample()

print(
    f"And our sample from it is {a_sample}"
)

a_dict_sample = convert_sample_to_a_dict_sample(a_sample, PARAMETERS_TO_SPACES, bins)

print(
    "back converted to...",
    a_sample,
    a_dict_sample
)
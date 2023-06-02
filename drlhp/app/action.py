import numpy as np
from gym.spaces import Box, Discrete, Dict, MultiDiscrete
from collections import OrderedDict
from utils import ARGUMENT_PROPERTIES

LOWER_MAGNITUDE = 0.001
UPPER_MAGNITUDE = 100

LOWER_MAGNITUDE_INTEGER = 0
UPPER_MAGNITUDE_INTEGER = 100

# get these two workign tmmrw
def discretize_dict_space(dict_space, bins):
    low = []
    high = []
    nvec = []
    spaces = []

    for key, space in dict_space.items():
        if isinstance(space, Box):
            low.extend(space.low.tolist())
            high.extend(space.high.tolist())
            n = bins[key]
            nvec.append(n)
            spaces.append(Discrete(n))
        elif isinstance(space, Discrete):
            low.append(space.n)
            high.append(space.n)
            nvec.append(1)
            spaces.append(space)
        else:
            raise ValueError(f"Unsupported space type: {type(space)}")

    multi_discrete_space = MultiDiscrete(nvec)
    multi_discrete_space.low = np.array(low)
    multi_discrete_space.high = np.array(high)

    return multi_discrete_space, spaces

def convert_sample_to_a_dict_sample(sample, dict_space):
    dict_sample = {}

    for (key, space), value in zip(dict_space.items(), sample):
        if isinstance(space, Box):
            dict_sample[key] = np.interp(value, [0, space.n - 1], [space.low, space.high])
        elif isinstance(space, Discrete):
            dict_sample[key] = value
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
        the_values = func(*args, **kwargs)
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
    return [0,1]

@return_discrete
def rule_for_unsigned(the_doc_key):
    lower = LOWER_MAGNITUDE_INTEGER
    upper = UPPER_MAGNITUDE_INTEGER

    upper *= the_doc_key.get('default', 1)

    return (
        list(range(lower, upper))
    )

PARAMETERS_TO_SPACES = Dict({
    "test_param": MultiDiscrete(4),
    "test_param2": MultiDiscrete(9)
})
    


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
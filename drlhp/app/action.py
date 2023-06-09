import numpy as np
from gym.spaces import Box, Discrete, MultiDiscrete
from utils import ARGUMENT_PROPERTIES

LOWER_MAGNITUDE = 0.001
UPPER_MAGNITUDE = 100

LOWER_MAGNITUDE_INTEGER = 0
UPPER_MAGNITUDE_INTEGER = 50

def discretize_dict_space(dict_space, bins):
    nvec = []

    for key, item in dict_space.items():
        space = item['space']
        if isinstance(space, Box):
            n = bins['default']
            if key in bins:
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
            xp_high = bins['default']
            if key in bins:
                xp_high = bins[key]
            dict_sample[key] = np.interp(
                value, 
                [0, xp_high], 
                [space.low[0], space.high[0]]
            )
        elif isinstance(space, Discrete):
            if space.n > 2:
                dict_sample[key] = value
                #if 'start' in space: # <-- how did this even work before?
                if 'start' in item: # integer
                    dict_sample[key] += item.get('start', 0)
                if 'index_only' in item and 'list_of_categories' in item: # categorical
                    dict_sample[key] = item['list_of_categories'][value-1] # index into the space
            else:
                dict_sample[key] = value == 1 # boolean
        else:
            raise ValueError(f"Unsupported space type: {type(space)}")

    return dict_sample

def return_box(func):
    def wrapper(*args, **kwargs):
        lower, upper = func(*args, **kwargs)
        return {
            'space': Box(low=lower, high=upper, shape=(1,))
        }
    return wrapper

# Gym 0.21 doesn't support Discrete(start=...) so we wrap things
def return_discrete(func):
    def wrapper(*args, **kwargs):
        low, high = func(*args, **kwargs)

        return {
            'space': Discrete(high-low+1),
            'start': low
        }
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

BACKGROUND_COLORS = [
        "#FFFFFF",
        "#F2F2F2",
        "#DCDCDC",
        "#C0C0C0",
        "#808080",
        "#696969",
        "#A9A9A9",
        "#708090",
        "#A8A8A8",
        "#6B5433"
    ]

def rule_for_background_color(the_colors=BACKGROUND_COLORS):
    """
    From white to grayish brown
    """
    return {
        'space': Discrete(len(the_colors)),
        'index_only': True, # sample to argumnet converter will just index
        'list_of_categories': the_colors
    }

def rule_for_color_count():
    return {
        'space': Discrete(256),
        'index_only': True
    }

@return_discrete
def rule_for_boolean():
    return 0, 1

@return_discrete
def rule_for_unsigned(the_doc_key):
    lower = LOWER_MAGNITUDE_INTEGER
    upper = UPPER_MAGNITUDE_INTEGER

    upper *= the_doc_key.get('default', 1)

    return lower, upper

NUMBER_OF_BINS_FOR = {
    "test_box": 50,
    "default": 50
}

PARAMETERS_TO_SPACES = {
    "background-color": rule_for_background_color(),
    "centerline":  rule_for_boolean(),
    "line-threshold": rule_for_real_type(ARGUMENT_PROPERTIES['line-threshold']),
    "noise-removal": rule_for_real_type(ARGUMENT_PROPERTIES['noise-removal']),
    #"preserve-width":  rule_for_boolean(), # crashes cairo svg2png?
    #-color-count number of colors a color bitmap is reduced to, it does not work on grayscale, allowed are 1..256        
    "width-weight-factor": rule_for_real_type(ARGUMENT_PROPERTIES["width-weight-factor"]),
    "remove-adjacent-corners":  rule_for_boolean(),
    "tangent-surround": rule_for_unsigned(ARGUMENT_PROPERTIES['tangent-surround']),
    "corner-threshold": rule_for_unsigned(ARGUMENT_PROPERTIES['corner-threshold']),
    "remove-adjacent-corners":  rule_for_boolean(),
    "filter-iterations": rule_for_unsigned(ARGUMENT_PROPERTIES['filter-iterations']),
    "line-reversion-threshold": rule_for_real_type(ARGUMENT_PROPERTIES['line-reversion-threshold']),
    "corner-always-threshold": rule_for_unsigned(ARGUMENT_PROPERTIES['corner-always-threshold']),
    "corner-surround": rule_for_unsigned(ARGUMENT_PROPERTIES['corner-surround']),
    "error-threshold": rule_for_real_type(ARGUMENT_PROPERTIES['error-threshold'])

}
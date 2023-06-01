import gym
from gym.spaces import Box, Discrete, Tuple, Dict
from collections import OrderedDict
from utils import ARGUMENT_PROPERTIES

LOWER_MAGNITUDE = 0.001
UPPER_MAGNITUDE = 100

LOWER_MAGNITUDE_INTEGER = 0
UPPER_MAGNITUDE_INTEGER = 100

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
    return (
        True, False
    )

@return_discrete
def rule_for_unsigned(the_doc_key):
    lower = LOWER_MAGNITUDE_INTEGER
    upper = UPPER_MAGNITUDE_INTEGER

    upper *= the_doc_key.get('default', 1)

    return (
        list(range(lower, upper))
    )

PARAMETERS_TO_SPACES = {
    "centerline":  rule_for_boolean(),
    "filter-iterations": rule_for_unsigned(ARGUMENT_PROPERTIES['filter-iterations']),
    "line-reversion-threshold": rule_for_real_type(ARGUMENT_PROPERTIES['line-reversion-threshold']),
    # "corner-always-threshold": rule_for_unsigned,
    # "background-color": rule_for_background_color,
    # "color-count": rule_for_color_count,
    # "corner-surround": rule_for_unsigned,
    # "corner-threshold": rule_for_unsigned,
    # "error-threshold": rule_for_real_type,
}

# class ArgsToSpaceMapper:
#     def __init__(self, gym.Env, parameter_to_space=parameter_to_space):
#         super(ArgsToSpaceMapper, self).__init__()

#         self.args_to_space = Dict()
#         for the_index, an_argument, a_space in enumerate(parameter_to_space.items()):
#             self.args_to_space[an_argument] = {
#                 'a_space': a_space(),
#                 'the_index': the_index
#             }
#         self.space_to_args = list(self.args_to_space.keys())

#         self.observation_space = FlattenObservation(self.args_to_space)
#         self.action_space = FlattenAction(self.space_to_args) #????

#     def args_to_spaces(self):
#         lookup_from = self.args_to_space
#         return [
#             lookup_from[arg].sample() for arg in lookup_from
#         ]

#     def spaces_to_args(self):
#         return self.space_to_args
    


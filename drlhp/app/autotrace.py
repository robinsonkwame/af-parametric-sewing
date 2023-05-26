import gym
from gym.spaces import Box, Discrete

LOWER_MAGNITUDE = 0.001
UPPER_MAGNITUDE = 100

LOWER_MAGNITUDE_INTEGER = 0
UPPER_MAGNITUDE_INTEGER = 100

def return_box(func):
    def wrapper(*args, **kwargs):
        lower, upper = func(*args, **kwargs)
        return BOX(low=(lower), high=(upper), shape=(2,))
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

def rule_for_unsigned(the_doc_key):
    lower = LOWER_MAGNITUDE_INTEGER
    upper = UPPER_MAGNITUDE_INTEGER

    upper *= the_doc_key.get('default', 1)

    return (
        list(range(lower, upper))
    )

# a subset of parameters to explore, hand selected
# KISS to support first examples
parameter_to_space = {
    "centerline":  rule_for_boolean,
    "filter-iterations": rule_for_unsigned,
    "line-reversion-threshold": rule_for_real_type,
    # "corner-always-threshold": rule_for_unsigned,
    # "background-color": rule_for_background_color,
    # "color-count": rule_for_color_count,
    # "corner-surround": rule_for_unsigned,
    # "corner-threshold": rule_for_unsigned,
    # "error-threshold": rule_for_real_type,
}

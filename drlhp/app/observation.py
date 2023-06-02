import requests
from utils import ARGUMENT_SIGNATURE, THE_ENDPOINT_WE_WANT
from gym.spaces import Box
import numpy as np
import random

# from Prashnani (2018) PieAPP. CVPR 
# # from https://prashnani.github.io/index_files/Prashnani_CVPR_2018_PieAPP_paper.pdf
# ... "In this paper, we use the Bradley-Terry (BT) sigmoid model [9] for h," (pg 3)
#
# note: they fram in terms of (R)eference image, (A) the left image, (B) the right image
# and estimate P AB( perceptual error S_A, S_B)
PERCEPTUAL_P_AB_SCORE = Box(low=0, high=1, shape=(1,))

# For testing, helping with integration testing/coding
random.seed(42)
STUB_PREVIOUS_RESULT = 0

def stub_perceptual_score(the_action, n_samples=100):
    global STUB_PREVIOUS_RESULT
    STUB_PREVIOUS_RESULT = random.random() + STUB_PREVIOUS_RESULT + 0.25 # always increasing

    return np.array([STUB_PREVIOUS_RESULT])


def from_spaces(a_sampled_space, signature):
    """
    Essentially assigns values while handling the edge case
    of indicator parameters, like -centerline. True parameters
    are simply included and false parameters are omitted.

    maps from spaces to parameters to call an endpoint with with
    """
    return {
        signature[sample_index]: sample_value            
            for sample_index, sample_value in enumerate(a_sampled_space)
    }

def call_autotrace(use_this_image, use_these_spaces, endpoint=THE_ENDPOINT_WE_WANT, signature=ARGUMENT_SIGNATURE):
    use_these_arguments = from_spaces(use_these_spaces, ARGUMENT_SIGNATURE)

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

# print(
#     call_autotrace('/tmp/square.png', use_these_spaces=[1 for _ in ARGUMENT_SIGNATURE])
# )
import io
import requests
from utils import ARGUMENT_SIGNATURE, THE_ENDPOINT_WE_WANT
import cairosvg
from PIL import Image
from gym.spaces import Box, Dict
import numpy as np
import random


# from Prashnani (2018) PieAPP. CVPR 
# # from https://prashnani.github.io/index_files/Prashnani_CVPR_2018_PieAPP_paper.pdf
# ... "In this paper, we use the Bradley-Terry (BT) sigmoid model [9] for h," (pg 3)
# ^ probability, so [0, 1]
# note: they fram in terms of (R)eference image, (A) the left image, (B) the right image
# and estimate P AB( perceptual error S_A, S_B)
random.seed(42)
STUB_PREVIOUS_RESULT = 0

PERCEPTUAL_P_AB_SCORE = Box(0, 1, shape=(1,), dtype=np.float32)

# For testing, helping with integration testing/coding

def stub_perceptual_score(the_action, n_samples=100):
    global STUB_PREVIOUS_RESULT
    STUB_PREVIOUS_RESULT = random.random() + STUB_PREVIOUS_RESULT + 0.25 # always increasing

    return STUB_PREVIOUS_RESULT #np.array([STUB_PREVIOUS_RESULT])


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

def call_autotrace(use_this_image, use_these_arguments, endpoint=THE_ENDPOINT_WE_WANT, signature=ARGUMENT_SIGNATURE):
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

    return response # this isn't really opaque :/

def handle_mime_svg_xml(response):
    """
    Returns numpy array as a rastered .svg
    """
    response = None
    if response.ok:
        the_svg_data = response.content
        the_png_conversion = cairosvg.svg2png(bytestring=the_svg_data)
        response = np.array(
            Image.open(
                io.BytesIO(
                    the_png_conversion
                )
            )
        )

    return response

print(
    call_autotrace('/tmp/square.png', use_these_arguments="")
)
# then store off, pass response to handle...
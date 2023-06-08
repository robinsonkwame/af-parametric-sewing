import io
import requests
from utils import ARGUMENT_SIGNATURE, THE_ENDPOINT_WE_WANT, sample_to_autotrace
import cairosvg
from PIL import Image
from gym.spaces import Box, Dict
import numpy as np
import random


# from Prashnani (2018) PieAPP. CVPR 
# # from https://prashnani.github.io/index_files/Prashnani_CVPR_2018_PieAPP_paper.pdf
# ... "In this paper, we use the Bradley-Terry (BT) sigmoid model [9] for h," (pg 3)
#
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

    return STUB_PREVIOUS_RESULT


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
    def prepare_multipart_data(file_dict, argument_dict):
        data = {}

        # Add file entries to the data dictionary
        for key, value in file_dict.items():
            data[key] = value
        
        # Add argument entries to the data dictionary
        for key, value in argument_dict.items():
            # Prepend the key with '-' and convert it to the suitable form
            param_key = f"-{key}"
            param_value = (None, value)

            data[param_key] = param_value

        return data
    
    the_file_argument = {
            'a_file': (
                use_this_image, 
                open(use_this_image, 'rb'),
                'image/png'
            )
        }

    the_multi_part_data = prepare_multipart_data(
        file_dict=the_file_argument,
        argument_dict=use_these_arguments
    )

    print(the_multi_part_data)

    response = requests.post(
        endpoint['base_url']+'/'+endpoint['the_endpoint'],
        files= the_multi_part_data,
    )

    return response

def get_quick_image_score(a_svg_response, use_this_image_pil, index):
    the_svg_data = a_svg_response
    the_png_conversion = cairosvg.svg2png(bytestring=the_svg_data)
    the_png_conversion = Image.open(
            io.BytesIO(
                the_png_conversion
            )
    )# assumed to always be "L" or grayscale? Should probably check this
    def frobenius_distance(image1, image2):
        difference = image1 - image2
        squared_difference = np.square(difference)
        sum_of_squared_difference = np.sum(squared_difference)
        frobenius_norm = np.sqrt(sum_of_squared_difference)
        return frobenius_norm

    # Scale the Frobenius distance between 0 and 1
    def scale_frobenius_distance(image1, image2):
        max_distance = 2*255 #np.sqrt(np.sum(np.square(image1.max() - image2.min())))
        frobenius_norm = frobenius_distance(image1, image2)
        scaled_distance = frobenius_norm / max_distance
        return scaled_distance

    the_png_conversion.save(f"TEST_converted_image-{index}.png")
    #use_this_image_pil.save(f"TEST_source_image-{index}.png")

    # for now it's simplest to convert both to grayscale and work from there
    # This does obsfucate the space that the RL algorithm and the score are
    # working to and from but I think it'll be okay
    use_this_image_pil = np.array(
        use_this_image_pil.convert("L")
    )
    the_png_conversion = np.array(
        the_png_conversion.convert("L")
    ) # autotrace guarantees they're the same size
    
    # # 0 is better (less distance)
    # frobenius_distance = scale_frobenius_distance(
    #     use_this_image_pil,
    #     the_png_conversion
    # )
    # Something is off w the scaling logic so we just return the value
    distance_from_source_to_conversion = frobenius_distance(
        use_this_image_pil,
        the_png_conversion
    )

    # use_this_image_buffer work with this buffer
    print(
        the_png_conversion.shape,
        use_this_image_pil.shape,
        distance_from_source_to_conversion
    )

    return distance_from_source_to_conversion

def handle_mime_svg_xml(response, apply_this_function, **kwargs):
    """
    Returns numpy array as a rastered .svg
    """
    return_response = None
    if response.ok:
        frobenius_distance = apply_this_function(
            response.content,
            **kwargs
        )
        return_response = {
            "status": "success",
            "response": response.text,
            "frobenius_distance": frobenius_distance
        }
    else: # autotraced errored out, broke program
        return_response = {
            "status": "error",
            "response": response.text,
            "frobenius_distance": 1.0
        }

    return return_response

def convert_png_to_image(file_path):
    return Image.open(
        file_path
    )

# so ... this should be memoized, esp at scale

# Env provides sampled arguments as sample_arguments and the file to use
#
# THE_FILE_TO_USE = '/tmp/square.png'
# the_png_conversion = convert_png_to_image(THE_FILE_TO_USE)
# use_these_arguments = sample_to_autotrace(sample_arguments)
# response = call_autotrace(THE_FILE_TO_USE, use_these_arguments="")
# handle_mime_svg_xml(
#     response, 
#     apply_this_function=get_quick_image_score, 
#     use_this_image_pil=the_png_conversion
# )
# ^ pass response back to environment so that the agent/policy can interpret


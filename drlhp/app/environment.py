import io
import os
import glob
import subprocess
import numpy as np
from PIL import Image
from gym import Env
from gym.spaces import Box, Dict
from action import (
    PARAMETERS_TO_SPACES, NUMBER_OF_BINS_FOR, 
    discretize_dict_space, convert_sample_to_a_dict_sample
)
from observation import (
    PERCEPTUAL_P_AB_SCORE, stub_perceptual_score,
    convert_png_to_image, sample_to_autotrace,
    call_autotrace, handle_mime_svg_xml,
    get_quick_image_score
)

class VideoRecorder:
    def __init__(self, output_file="video.mp4", output_dir="./videos/", fps=20):
        self.output_file = output_file
        self.output_dir = output_dir
        self.fps = fps
        self.frame_count = 0
    
        self.file_path = f"{self.output_dir}{self.output_file}"

    def add_frame(self, frame):
        frame_file = f"{self.output_dir}frame_{self.frame_count}.png"
        with open(frame_file, 'wb') as f:
            f.write(frame.getvalue())
        self.frame_count += 1
    
    def create_video(self):

        # WHY IS THIS GETTING HIT TWICE?
        print("\n\t SKIPPING VIDEO CREATION")

        # cmd = [
        #     "ffmpeg",
        #     "-y",
        #     "-framerate",
        #     str(self.fps),
        #     "-i",
        #     f"{self.output_dir}frame_%d.png",
        #     "-c:v",
        #     "libx264",
        #     "-pix_fmt",
        #     "yuv420p",
        #     self.file_path
        # ]
        # subprocess.run(cmd)

        png_files = glob.glob(f"{self.output_dir}/*.png")
        # Delete each PNG file
        for file in png_files:
            os.remove(file)        

class AutoTrace(Env):    
    def __init__(self, source_filepath):

        super(AutoTrace, self).__init__()

        self.action_space = discretize_dict_space(
            PARAMETERS_TO_SPACES,
            NUMBER_OF_BINS_FOR
        )['MultiDiscretizedDictSpace']
        
        self.observation_space = PERCEPTUAL_P_AB_SCORE

        self.number_of_episodes_ran = 0
        self.the_current_action = None

        self.video_recorder = VideoRecorder()

        self.source_filepath = source_filepath
        self.source_png_file = convert_png_to_image(source_filepath)


    def reset(self):
        self.video_recorder = VideoRecorder()

        return self.observation_space.sample()

    def step(self, the_action):
        self.number_of_episodes_ran += 1

        self._register(the_action)

        reward = self._get_reward()

        # If the reward and observation have the same values, it means that the agent receives
        # the same information for both its observations and rewards. This scenario could
        # occur in certain simplified environments or toy problems where the observation 
        # itself is used as the reward signal.

        # Here the agent's objective would typically be to learn a policy that 
        # directly maximizes the observed values. It would select actions 
        # that lead to higher observed values because those actions are considered more 
        # desirable or beneficial.

        # In most realistic reinforcement learning scenarios, the reward and observation 
        # are distinct and serve different purposes. The reward provides a more explicit
        # feedback signal that guides the agent's learning process, while the observation 
        # provides information about the environment's state or features necessary for 
        # decision-making.
        the_next_observation = reward
        done = self._stub_done()

        # bug: https://github.com/hill-a/stable-baselines/issues/977
        info = {
            "action": the_action,
            "autotrace_parameters": self.the_current_action,
        }

        # Add frame to video recorder
        self.video_recorder.add_frame(
            self.render(mode="rgb_array")
        )

        return the_next_observation, reward, done, info

    def _register(self, the_action):        
        the_current_action = convert_sample_to_a_dict_sample(
            the_action,
            PARAMETERS_TO_SPACES,
            NUMBER_OF_BINS_FOR
        )

        self.the_current_action = sample_to_autotrace(
            the_current_action
        )

    def _get_observation(self):
        return self._get_reward()
    
    def _get_reward(self):
        """
        Interact with endpoint, handle result to obtain reward score
        """
        the_reward = 0
        STATUS = 'status'
        SCORE_KEY = 'frobenius_distance'

        if self.the_current_action is None:
            the_reward = self.observation_space.sample()
        else:
            print(f"\t going with {self.the_current_action} and {self.number_of_episodes_ran}")
            response = call_autotrace(
              self.source_filepath,
              use_these_arguments = self.the_current_action
            )
            endpoint_response = handle_mime_svg_xml(
                response, 
                apply_this_function=get_quick_image_score, 
                use_this_image_pil=self.source_png_file,
                index=self.number_of_episodes_ran
            )
            print(
                endpoint_response[STATUS],
                endpoint_response[SCORE_KEY],
                endpoint_response["response"][-100:]
            )
            # The endpoint returns normalized 0-1 difference, with 0 being better
            # so we reverse map (yes I know the operationalization is mucking
            # severeal concepts)
            the_reward = 1 - endpoint_response[SCORE_KEY]

        return the_reward
        #return stub_perceptual_score(self.the_current_action)
    
    def _stub_done(self):
        done = False
        if self.number_of_episodes_ran > 50:
            done = True

        # see https://stackoverflow.com/questions/71786530/rollout-summary-statistics-not-being-monitored-for-customenv-using-stable-baseli
        # If done not set False then statistics etc aren't logged?
        return done
    
    def render(self, mode='rgb_array'):
        # Open the image using Pillow
        my_square = Image.open('./square.png')

        # Rotate the image by 3 degrees
        rotated_image = my_square.rotate( 3 * self.number_of_episodes_ran % 360)

        # Create an in-memory buffer to store the rotated image
        buffer = io.BytesIO()

        # Save the rotated image to the buffer in PNG format
        rotated_image.save(buffer, format='PNG')

        # Seek to the beginning of the buffer
        buffer.seek(0)

        # Return the buffer
        return buffer

    def close(self):
        # EXCEPTED FIRST CALL; unsure where other one
        # comes from
        self.video_recorder.create_video()
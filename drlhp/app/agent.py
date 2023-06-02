from environment import AutoTrace
from stable_baselines3 import PPO
from gym.wrappers.monitoring.video_recorder import VideoRecorder


print("\t ... starting incremental stub testing with environment")

the_gym_environment = AutoTrace()

video_recorder = VideoRecorder(
    the_gym_environment, 
    path='video.mp4'
)


POLICY_TYPE = "MlpPolicy" #"MultiInputPolicy" complains that observation has no space; version of Gym too old?

the_agent = PPO(POLICY_TYPE, the_gym_environment, verbose=1)

# Define your custom training loop
for i in range(1):
    observation = the_gym_environment.reset()
    for _ in range(1):
        # Perform the action in the environment
        action, _ = the_agent.predict(observation)
        observation, reward, done, info = the_gym_environment.step(action)

        # Record the frame using VideoRecorder
        video_recorder.capture_frame()

        # Update the model
        the_agent.learn(total_timesteps=1, reset_num_timesteps=False)

video_recorder.close()

print(f"Done! look for video?")

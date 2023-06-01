from environment import AutoTrace
from stable_baselines3 import PPO

print("\t ... starting incremental stub testing with environment")

the_gym_environment = AutoTrace()
the_agent = PPO('MlpPolicy', the_gym_environment, verbose=1)

the_agent.learn(total_timesteps=100)
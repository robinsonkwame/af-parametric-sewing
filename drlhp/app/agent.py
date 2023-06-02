from environment import AutoTrace
from stable_baselines3 import PPO

print("\t ... starting incremental stub testing with environment")

the_gym_environment = AutoTrace()

POLICY_TYPE = "MlpPolicy" #"MultiInputPolicy" complains that observation has no space; version of Gym too old?
the_agent = PPO(POLICY_TYPE, the_gym_environment, verbose=1)

the_agent.learn(total_timesteps=1)
from environment import AutoTrace
from stable_baselines3 import PPO
from stable_baselines3.common.monitor import Monitor

POLICY_TYPE = "MlpPolicy" #"MultiInputPolicy" GoalEnv? complains that observation has no space; version of Gym too old?

the_gym_environment = AutoTrace()

monitor_env = Monitor(the_gym_environment, 'logs/')

the_agent = PPO(POLICY_TYPE, monitor_env, verbose=1)

the_agent.learn(total_timesteps=100, reset_num_timesteps = False, tb_log_name = "PPO")
the_agent.save('the_agent')
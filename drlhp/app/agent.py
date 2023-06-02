from environment import AutoTrace
from stable_baselines3 import PPO
from gym.wrappers import Monitor

# /usr/lib/python3.8/site-packages/gym/wrappers/monitor.py:86: UserWarning: WARN: 
# Trying to monitor an environment which has no 'spec' set. This usually means you 
# did not create it via 'gym.make', and is recommended only for advanced users.
env = AutoTrace()
env = Monitor(env, "./logs", force=True)
model = PPO("MlpPolicy", env)
model.learn(total_timesteps=10, tb_log_name = "PPO")
model.save('the_agent')
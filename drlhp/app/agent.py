from environment import AutoTrace
from stable_baselines3 import PPO
from gym.wrappers import Monitor

# /usr/lib/python3.8/site-packages/gym/wrappers/monitor.py:86: UserWarning: WARN: 
# Trying to monitor an environment which has no 'spec' set. This usually means you 
# did not create it via 'gym.make', and is recommended only for advanced users.

#THE_FILE_TO_USE = '/tmp/square.png'
THE_FILE_TO_USE = '/tmp/sleeve.png'
env = AutoTrace(source_filepath=THE_FILE_TO_USE)
env = Monitor(env, "./logs", force=True)

n_steps = 100

model = PPO(
    "MlpPolicy",
    env=env,
    n_epochs=1,
    n_steps=n_steps,
    seed=42,
    batch_size=n_steps
)

model.learn(
    total_timesteps=n_steps, 
    tb_log_name = "PPO"
) # model set up to do 1 run of 10 step rollout for debugging
#model.save('the_agent')
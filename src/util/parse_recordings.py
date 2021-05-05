import pandas as pd
import os
import json

url = "../recordings/"
exercise = "arm_circles"

parsed_frames = []
parsed_twod = []
pkl_frames = os.listdir(url + exercise)
pkl_frames.sort()

for frame in pkl_frames:
    # print(frame[:-4])
    frame_data = pd.read_pickle(url + exercise + "/" + frame)
    parsed_frames.append(json.loads(frame_data["frame"]))
    parsed_twod.append(json.loads(frame_data["twod"]))


# print(parsed_frames[-1]["ts"] - parsed_frames[0]["ts"])

with open("../recordings_json/frames/{}.json".format(exercise), "w") as f:
    json.dump(parsed_frames, f, indent=3)

with open("../recordings_json/twod/{}.json".format(exercise), "w") as f:
    json.dump(parsed_twod, f, indent=3)

import requests
import time
import os
import json
from dotenv import load_dotenv
#import schedule

load_dotenv()
def fetch_data():
    url = os.environ.get("url")
    headers = {
        "User-Agent": "github.com/Cale547 AoChie (Leaderboard manager)",
        "Cookie": os.environ.get("sessionCookie")
    }

    response = requests.get(url, headers=headers, timeout=20)

    if response.status_code == 200:
        data = response.json()
        str_data = json.dumps(data)

        print(str_data)
        
        if os.path.isfile("storedScores.json"):
            os.remove("storedScores.json")
        stored_file = open("storedScores.json", "x",encoding="UTF8")
        stored_file.write(str_data)

        #for entry in data:
        #   stored_file.write(entry)
        #stored_file.close()
    
    else:
        print("Failed to retrieve data:", response.status_code)



#schedule.every(15).minutes.do(fetch_data)

#while True:
    #schedule.run_pending()
    #time.sleep(1)
fetch_data()


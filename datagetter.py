import time
import os
import json
import requests
from dotenv import load_dotenv
import schedule
import tools
import databaserecorder

load_dotenv()
def fetch_data():
    print("Fetching data at time",tools.unix_to_human(int(time.time())))
    url = os.environ.get("url")
    headers = {
        "User-Agent": "github.com/Cale547 AoChie (Leaderboard manager)",
        "Cookie": os.environ.get("sessionCookie")
    }

    response = requests.get(url, headers=headers, timeout=20)

    if response.status_code == 200:
        data = response.json()
        str_data = json.dumps(data)
        
        if os.path.isfile("storedScores.json"):
            os.remove("storedScores.json")
        stored_file = open("storedScores.json", "x",encoding="UTF8")
        stored_file.write(str_data)
        stored_file.close()

        databaserecorder.main()


    
    else:
        print("Failed to retrieve data:", response.status_code)



schedule.every(15).minutes.do(fetch_data)

if int(time.time()-os.path.getmtime("storedScores.json")) >= 900:
    fetch_data()
    print("Initial fetch complete")
print("Scheduler started at",tools.unix_to_human(time.time()))
while True:
    #print(int(time.time()-os.path.getmtime("storedScores.json")),"seconds since last update")
    schedule.run_pending()
    time.sleep(5)

import json
import os
from dotenv import load_dotenv
import psycopg2 as pcg

def unix_to_human(ux_time):
    if ux_time < 0:
        print("Unable to calculate dates before Unix epoch (January 1st 1970)")
        return "Unable to calculate date for " + str(ux_time)
    time_left = ux_time
    m_length = [31,28,31,30,31,30,31,31,30,31,30,31]
    year = 1970
    month = 1
    day = 1
    hour = 0
    minute = 0
    second = 0

    # 1 day is 24*3600 = 86400 seconds
    # 1 month is 86400*m_length[month] = 2678400 for a 31-day month
    # 1 year is 365*86400 = 31536000 seconds or 31536000+86400 = 31622400 seconds if year % 4 == 0
    while time_left >= 31536000:
        if year % 4 == 0:
            time_left -= 86400 # removing leap day
        time_left -= 31536000 # removing 365 days
        year += 1

    while time_left >= 2678400: # removing 31-day (and under) months
        time_left -= 86400*m_length[month-1]
        if year % 4 == 0 and month == 2:
            time_left -= 86400
        month += 1
        if month == 13:
            month = 1

    if time_left >= 2592000: # removing last 30-day month
        time_left -= 2592000
        month += 1
    elif year % 4 == 0 and time_left >= 2505600: # removing last 29-day month
        time_left -= 2505600
        month += 1
    elif year % 4 != 0 and time_left >= 2419200: # removing last 28-day month
        time_left -= 2419200
        month += 1

    while time_left >= 86400: # removing days
        time_left -= 86400
        day += 1
    while time_left >= 3600:
        time_left -= 3600
        hour += 1
    while time_left >= 60:
        time_left -= 60
        minute += 1
    while time_left >= 1:
        time_left -= 1
        second += 1
    if time_left > 0: # Should be impossible
        print("Couldn't remove all time")
        return

    timestamp1 = f'{year:04d}{month:02d}{day:02d} {hour:02d}:{minute:02d}:{second:02d}'
    timestamp2 = f'{day:02d}/{month:02d}/{year:04d} {hour:02d}:{minute:02d}:{second:02d}'
    return timestamp2



with open("storedScores.json","r",encoding="UTF8") as f:
    old_data = json.load(f)
    old_data_members = dict(old_data['members'])
    f.close()

load_dotenv()
connection = pcg.connect(database = os.environ.get("pcgDatabse"),
                        user = os.environ.get("pcgUser"),
                        host= os.environ.get("localhost"),
                        password = os.environ.get("postgresPass"),
                        port = os.environ.get("pcgPort"))
cursor = connection.cursor()
#cursor.execute("""
#
#""")
connection.commit()
cursor.close()
connection.close()

for member in old_data_members:
    current_user = dict(old_data_members[member])
    #print(current_user.keys()) # last_star_ts, name, global_score, stars, id, local_score, !completion_day_level!
    name = current_user['name']
    last_star_time = unix_to_human(current_user['last_star_ts'])
    print(name,last_star_time)



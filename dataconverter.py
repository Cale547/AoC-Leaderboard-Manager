import json
import os
from dotenv import load_dotenv
import psycopg2 as pcg
import tools


with open("storedScores.json","r",encoding="UTF8") as f:
    data = json.load(f)
    data_members = dict(data['members'])
    f.close()

load_dotenv()
connection = pcg.connect(database = os.environ.get("pcgDatabse"),
                        user = os.environ.get("pcgUser"),
                        host= os.environ.get("localhost"),
                        password = os.environ.get("pcgPass"),
                        port = os.environ.get("pcgPort"))
cursor = connection.cursor()
cursor.execute("""SELECT * FROM player
               LIMIT 1;""")
newTable = (len(cursor.fetchall()) == 0)


for member in data_members:
        current_user = dict(data_members[member])
        #print(current_user.keys()) # last_star_ts, name, global_score, stars, id, local_score, !completion_day_level!
        user_id = current_user['id']
        name = current_user['name']
        local_score = current_user['local_score']
        last_star_ts = tools.unix_to_human(current_user['last_star_ts'])
        time = last_star_ts[0]
        date = last_star_ts[1]
        if date == "01/01/1970":
            time = date = "n/a"
        stars = current_user['stars']
        global_score = current_user['global_score']

        if newTable:
            cursor.execute("""INSERT INTO player (user_id, username, local_score, last_star_time, last_star_date, stars, global_score) 
                    VALUES (%s,%s,%s,%s,%s,%s,%s);""", (user_id, name, local_score, time, date, stars, global_score))
        else:
            cursor.execute("""UPDATE player 
                           SET local_score=%s, last_star_time=%s, last_star_date=%s, stars=%s, global_score=%s
                           WHERE user_id=%s;""", (local_score, time, date, stars, global_score, user_id))



cursor.execute("""
    SELECT * FROM player;   
""")
for r in cursor.fetchall():
   print(r)

connection.commit()
cursor.close()
connection.close()

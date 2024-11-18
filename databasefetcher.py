import os
from dotenv import load_dotenv
import psycopg2 as pcg

load_dotenv()
connection = pcg.connect(database = os.environ.get("pcgDatabse"),
                        user = os.environ.get("pcgUser"),
                        host= os.environ.get("localhost"),
                        password = os.environ.get("pcgPass"),
                        port = os.environ.get("pcgPort"))
cursor = connection.cursor()

cursor.execute("""SELECT * FROM player;""")
connection.commit()

print(cursor.fetchall())
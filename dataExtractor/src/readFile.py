import os
import mysql.connector


class OB:
    fi = ''
    nu = 0


files = []
fileEndings = []

entries = os.scandir('C:/Users/Jonas/Desktop/DeutschAndreaErzaehlt/')
for entry in entries:
    for file in os.listdir('C:/Users/Jonas/Desktop/DeutschAndreaErzaehlt/' + entry.name):
        if file.endswith(".txt"):
            ob = OB()
            ob.fi = file
            ob.nu = entry.name
            files.append(
                ob
            )

for file in files:
    print(file.fi)

mydb = mysql.connector.connect(
    host='localhost',
    user='root',
    passwd='password',
    database='labeling-tool'
)

mycursor = mydb.cursor()
index = 0

for file in files:
    index + 1
    sql = 'insert into textAudioIndex (id, samplingRate, textStartPos, textEndPos, audioStartPos, audioEndPos, speakerKey, labeled, correct, wrong, transcript_file_id) values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
    val = (index, '44100', 2, '2', '3', '4', '5', '6', '7', '0', file.nu)
    mycursor.execute(sql, val)
    mydb.commit()

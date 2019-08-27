import mysql.connector

mydb = mysql.connector.connect(
    host='localhost',
    user='root',
    passwd='password',
    database='labeling-tool'
)

mycursor = mydb.cursor()

sql = 'insert into textAudioIndex (id, firstName, lastName, email, password) values (%s, %s, %s, %s, %s)'
val = ('1', 'Roik', 'Smith', 'jiffy@snoff.ch', 'pwd')
mycursor.execute(sql, val)

mydb.commit()

print(mycursor.rowcount, 'record inserted')

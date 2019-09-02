import mysql.connector
import os
import spacy
from mutagen.mp3 import MP3

# Setup DB-Connection
dataBase = mysql.connector.connect(
    host='localhost',
    user='root',
    passwd='password',
    database='labeling-tool'
)

dataBaseCursor = dataBase.cursor()
dataBaseCursor.execute("truncate table textAudioIndex")
print("Cleared TextAudioIndex")

index = 0


class Snippet:
    id = 0
    samplingRate = 0
    textLength = 0
    text = ''
    textStartPosition = 0
    textEndPosition = 0
    percentageTotal = 0
    audioLength = 0
    audioStartPosition = 0
    audioEndPosition = 0


def searchDirectories():
    print('Loading...')
    fileEndings = []
    entries = os.scandir('/home/jonas/Documents/DeutschAndreaErzaehlt/')
    for entry in entries:
        for fileData in os.listdir('/home/jonas/Documents/DeutschAndreaErzaehlt/' + entry.name):
            if fileData.endswith(".txt"):
                fileEndings.append(entry.name)
                extractDataToDB(entry.name)
    print('Done!')


# --------------------------

def extractDataToDB(folderNumber):
    global index

    file = open('/home/jonas/Documents/DeutschAndreaErzaehlt/' + folderNumber + '/transcript.txt')
    data = file.read()
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(data)
    file.close()
    fileLength = len(data)

    lengthArray = []

    # Add Snippet Object to LengthArray
    for te in [sent.text for sent in doc.sents]:
        index = index + 1
        snippet = Snippet()

        snippet.id = index
        snippet.textLength = len(te)
        snippet.text = te
        snippet.percentageTotal = snippet.textLength / fileLength

        lengthArray.append(snippet)

    for element in lengthArray:
        element.textStartPosition = data.find(element.text)
        element.textEndPosition = data.find(element.text) + len(element.text)

    # ---------------------

    # Get Audiofile
    audio = MP3('/home/jonas/Documents/DeutschAndreaErzaehlt/' + folderNumber + '/audio.mp3')
    audioFileLength = audio.info.length
    samplingRate = audio.info.sample_rate


    pos = 0

    for u in lengthArray:
        u.samplingRate = samplingRate
        u.audioLength = u.percentageTotal * audioFileLength
        pos = pos + u.audioLength
        u.audioStartPosition = round(pos * u.samplingRate)
        u.audioEndPosition = round((pos + u.audioLength) * u.samplingRate)

    # ----------------------

    # Insert values into DB
    for file in lengthArray:
        sql = 'INSERT INTO textAudioIndex (id, samplingRate, textStartPos, textEndPos, audioStartPos, audioEndPos, speakerKey, labeled, correct, wrong, transcript_file_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
        val = (file.id, file.samplingRate, file.textStartPosition, file.textEndPosition, file.audioStartPosition, file.audioEndPosition, 1, 0, 0, 0, folderNumber)
        dataBaseCursor.execute(sql, val)
        dataBase.commit()


searchDirectories()

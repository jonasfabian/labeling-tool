import logging
import os
import wave

import mysql.connector
from bs4 import BeautifulSoup
from pydub import AudioSegment

host = "localhost"
database = "labeling-tool"

password = "labeling-tool"
user = "labeling-tool"
connection = mysql.connector.connect(
    host=host,
    database=database,
    user=user,
    password=password,
)
connection.autocommit = False
cursor = connection.cursor(dictionary=True)

base_dir = "../data"
source_dir = os.path.join(base_dir, "source")

source_name = 'Digitaltag'
source_desc = 'Digitaltag 2019'


def get_last_insert_id(dict_cursor):
    dict_cursor.execute('select last_insert_id() as id')
    return dict_cursor.fetchone()['id']


def replace_extension(file, new_extension):
    root, _ = os.path.splitext(file)
    if not new_extension.startswith('.'):
        new_extension = '.' + new_extension
    return root + new_extension


def search_directories():
    try:
        # init directories
        os.makedirs(os.path.join(base_dir, "text_audio"))
        os.makedirs(os.path.join(base_dir, "original_text"))
        os.makedirs(os.path.join(base_dir, "recording"))
    except FileExistsError:
        # directory already exists
        pass
    logging.info('Loading...')
    entries = os.scandir(source_dir)
    for entry in entries:
        for fileData in os.listdir(os.path.join(source_dir, entry.name)):
            if fileData.endswith(".xml"):
                extract_data_to_db(entry.name)
    logging.info('Done!')


def extract_data_to_db(folderNumber: str):
    try:
        index = os.path.join(source_dir, folderNumber, 'indexes.xml')
        audio = os.path.join(source_dir, folderNumber, 'audio.wav')
        cursor.execute('insert into source(description,name,raw_audio_path,raw_file_path) VALUE(%s,%s,%s,%s)',
                       [source_desc, source_name, audio, index])
        source_id = get_last_insert_id(cursor)

        with open(index, encoding='utf-8') as file:
            soup = BeautifulSoup(file.read(), 'html.parser')
        with wave.open(audio, 'rb') as f_wave:
            speakers = dict()
            for speaker in soup.find_all('speaker'):
                speaker_id = speaker['id']

                gender = speaker.find('sex')['value']
                if gender == 'f' or gender == 'm':
                    pass
                else:
                    gender = 'none'

                language = speaker.find('languages-used').find('language')
                if language is not None:
                    language = language['lang']
                    if language == 'gsw':
                        language = 'Swiss German'
                    elif language == 'deu':
                        language = 'Standard German'
                    else:
                        language = None

                dialect = None
                for info in speaker.find('ud-speaker-information').find_all('ud-information'):
                    if info['attribute-name'] == 'dialect':
                        dialect = info.get_text()
                        break
                if dialect is not None:
                    dialect = dialect.upper().strip()
                    if dialect in {'BS', 'BE', 'GR', 'LU', 'OST', 'VS', 'ZH'}:
                        pass
                    elif dialect == 'BERN':
                        dialect = 'BE'
                    elif dialect == 'SG':
                        dialect = 'OST'
                    elif dialect in {'DE', 'HOCHDEUTSCH', 'BAYERN'}:
                        language = 'Standard German'
                        dialect = None
                    else:
                        dialect = None
                if language is None or language == 'Standard German':
                    dialect = None
                if language is not None:
                    cursor.execute('insert into speaker (name, language,dialect,sex) values (%s, %s,%s,%s)',
                                   [speaker_id, language, dialect, gender])
                    speaker_id_db = get_last_insert_id(cursor)
                    speakers[speaker_id] = {'speaker_id_db': speaker_id_db, }
                else:
                    logging.warning(f'skipping speaker {speaker_id} because no language is set.')

            times = {tli['id']: float(tli['time']) for tli in soup.find_all('tli')}

            for tier in soup.find_all('tier'):
                if tier.has_attr('speaker'):
                    speaker_id_xml = tier['speaker']
                    speaker = speakers.get(speaker_id_xml)
                    if speaker is not None:
                        speaker_id_db = speaker['speaker_id_db']
                        for event in tier.find_all('event'):
                            start_time = times[event['start']]
                            end_time = times[event['end']]
                            duration_seconds = end_time - start_time
                            if duration_seconds > 0.0:
                                transcript_text = event.get_text()

                                cursor.execute(
                                    "insert into text_audio ( audio_start,  audio_end, text, path_to_file, speaker_id,source_id)values (%s, %s, %s, %s, %s, %s)",
                                    [start_time, end_time, transcript_text, 'PLACEHOLDER', speaker_id_db, source_id]
                                )
                                text_audio_id = get_last_insert_id(cursor)
                                audio_path_to_file = f'{text_audio_id}.flac'
                                cursor.execute('update text_audio set path_to_file = %s where id = %s',
                                               [audio_path_to_file, text_audio_id])

                                f_wave.setpos(int(start_time * f_wave.getframerate()))
                                audio_bytes = f_wave.readframes(int(duration_seconds * f_wave.getframerate()))
                                audio_segment = AudioSegment(
                                    data=audio_bytes,
                                    sample_width=f_wave.getsampwidth(),
                                    frame_rate=f_wave.getframerate(),
                                    channels=f_wave.getnchannels(),
                                )
                                audio_segment = audio_segment.set_channels(1)
                                audio_segment.export(os.path.join(base_dir, "text_audio", audio_path_to_file),
                                                     format='flac')
                            else:
                                logging.warning(
                                    f"skipping event with start={event['start']} because its duration of {duration_seconds} is <= 0.0.")
                    else:
                        logging.warning(f'skipping utterances of speaker {id} because no language is set.')

                else:
                    logging.warning(f"skipping tier {tier['id']} because no speaker is set.")

        connection.commit()
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        cursor.close()
        connection.close()


if __name__ == '__main__':
    search_directories()

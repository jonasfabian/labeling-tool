import os
import re
import sys

import mysql.connector
import spacy

from config import *

NLP = spacy.load('de_core_news_sm', disable=['ner'])
WHITESPACE_REGEX = re.compile(r'[ \t]+')


def split_to_sentences(transcript):
    transcript = transcript.replace('-\n', '')
    transcript = transcript.replace(' \n', ' ')
    transcript = transcript.replace('\n', ' ')
    transcript = transcript.replace('\t', ' ')
    transcript = WHITESPACE_REGEX.sub(' ', transcript)
    transcript = transcript.strip()

    doc = NLP(transcript)

    return [sent.text for sent in doc.sents]


if __name__ == '__main__':
    fileIds = sys.argv[1]
    connection = mysql.connector.connect(
        host=host,
        database=database,
        user=user,
        password=password,
    )
    connection.autocommit = False
    cursor = connection.cursor(dictionary=True)
    try:
        for fileId in fileIds.split(','):
            fp = os.path.join(base_dir, 'extracted_text', fileId + ".txt")
            sentences = split_to_sentences(open(fp, encoding="utf-8").read())
            for excerpt in sentences:
                cursor.execute("insert into excerpt(original_text_id,excerpt) values(%s,%s)", [fileId, excerpt])
            print(fileId + " done.")
            os.remove(fp)
            connection.commit()
    finally:
        cursor.close()
        connection.close()

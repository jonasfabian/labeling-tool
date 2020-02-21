import re
import sys

import spacy

NLP = spacy.load('de_core_news_sm', disable=['ner'])
WHITESPACE_REGEX = re.compile(r'[ \t]+')


def preprocess_transcript_for_sentence_split(transcript):
    transcript = transcript.replace('-\n', '')
    transcript = transcript.replace(' \n', ' ')
    transcript = transcript.replace('\n', ' ')
    transcript = transcript.replace('\t', ' ')

    transcript = WHITESPACE_REGEX.sub(' ', transcript)
    transcript = transcript.strip()

    return transcript


def split_to_sentences(transcript):
    doc = NLP(preprocess_transcript_for_sentence_split(transcript))

    return [sent.text for sent in doc.sents]


if __name__ == '__main__':
    s = sys.argv[1]
    print(s)

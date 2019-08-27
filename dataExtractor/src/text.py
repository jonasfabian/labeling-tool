import nltk.data

tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
fp = open("/home/jonas/Documents/DeutschAndreaErzaehlt/36/transcript.txt")
data = fp.read()
print('\n-----\n'.join(tokenizer.tokenize(data)))

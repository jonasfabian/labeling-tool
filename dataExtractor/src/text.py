import nltk.data

#download the punkt package
#nltk.download()
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
file = open('C:/Users/Jonas/Desktop/DeutschAndreaErzaehlt/87/transcript.txt')
data = file.read()
fileLength = len(data)


class Snippet:
    id = 0
    length = 0
    sentence = ''
    startPos = 0
    endPos = 0


lengthArray = []
index = 0

# Add Snippet Object to LengthArray
for te in tokenizer.tokenize(data):
    index = index + 1
    snippet = Snippet()

    snippet.id = index
    snippet.length = len(te)
    snippet.sentence = te

    lengthArray.append(snippet)

for element in lengthArray:
    element.startPos = data.find(element.sentence)
    element.endPos = data.find(element.sentence) + len(element.sentence)


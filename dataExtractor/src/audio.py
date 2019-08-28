from mutagen.mp3 import MP3

audio = MP3('C:/Users/Jonas/Desktop/DeutschAndreaErzaehlt/audio.mp3')
audioFileLength = audio.info.length
print(audioFileLength)
print(audio.info.sample_rate)

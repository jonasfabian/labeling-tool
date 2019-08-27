from mutagen.mp3 import MP3

audio = MP3('/home/jonas/Documents/DeutschAndreaErzaehlt/36/audio.mp3')
audioFileLength = audio.info.length
print(audioFileLength)
print(audio.info.sample_rate)

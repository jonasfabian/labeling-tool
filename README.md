# Requirements
**Required**
* Java 8
* MySQL Ver 14.14 Distrib 5.7.27
* Node.js 12.10.0
* Scala 2.12.8

Note: Other versions might work, but have not been tested yet

**Optional**
* Node.js
  * Angular-CLI
* IntelliJ Idea (Webstorm / PyCharm)

# Setup Backend
1. Go to `MigrateDB.scala` and change the path variables to your the desired directory. Do the same thing in the `LabelingToolService.scala` file.

Your directory should look like the following example:
```bash
├── your directory
│   ├── 36
│   │   ├── audio.mp3
│   │   ├── transcript.txt
│   │   ├── transcript_indexes.xml
│   ├── 37
│   │   ├── audio.mp3
│   │   ├── transcript.txt
│   │   ├── transcript_indexes.xml
│   ├── 38
│   │   ├── audio.mp3
│   │   ├── transcript.txt
│   │   ├── transcript_indexes.xml
│   ├── ...
```

The `transcript_indexes.xml` should look like this:

```xml
<XMLIndexFile>
    <Version>2.0.0</Version>
    <SamplingRate>44100</SamplingRate>
    <NumberOfIndices>146</NumberOfIndices>
    <TextAudioIndex>
        <TextStartPos>49</TextStartPos>
        <TextEndPos>146</TextEndPos>
        <AudioStartPos>1279561</AudioStartPos>
        <AudioEndPos>1692337</AudioEndPos>
        <SpeakerKey>0</SpeakerKey>
    </TextAudioIndex>
    <TextAudioIndex>
        <TextStartPos>148</TextStartPos>
        <TextEndPos>204</TextEndPos>
        <AudioStartPos>1728499</AudioStartPos>
        <AudioEndPos>1895197</AudioEndPos>
        <SpeakerKey>0</SpeakerKey>
    </TextAudioIndex>
    <TextAudioIndex>
        <TextStartPos>206</TextStartPos>
        <TextEndPos>286</TextEndPos>
        <AudioStartPos>1907104</AudioStartPos>
        <AudioEndPos>2112169</AudioEndPos>
        <SpeakerKey>0</SpeakerKey>
    </TextAudioIndex>
```

1. Start your MariaDB server on default port `3306`. Use `root` as username and `password` as password. 
1. Open backend directory and start `SetupDB`. This will create all tables and clear its data if there's already some.
1. Insert data into the database by running `MigrateDB`.
1. To start the RestAPI run the `WebServer` file.


# Setup Frontend

1. Clone the Github Project (https://github.com/jonasfabian/labeling-tool.git)
1. Open the console and move to the frontend folder of the project
1. Type: `ng serve` or `npm start`
1. Go to http://localhost:4200

# Create an Account
To start labeling, you first have to register yourself. Click on `Login` in the top right corner. You should be redirected to the login-page, in which you have to click on register at the bottom of the login-form. You should now register yourself.

# Start Labeling
After you have registered yourself succesfully, you can start the labeling process. Click the menu-icon in the top left corner to expand the sidenav. There you will see different tools for labeling. You can begin with checking already matched snippets, or edit unprecise snippets.

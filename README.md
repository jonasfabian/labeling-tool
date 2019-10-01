# Setup Backend
**1.**  Go to `MigrateDB.scala` and change the path variables to your the desired directory. Do the same thing in the `LabelingToolService.scala` file.

Your directory should look like the following example:
```
├── your directory
├─────36
├────────audio.mp3
├────────transcript.txt
├────────transcript_indexes.xml
├─────37
├────────audio.mp3
├────────transcript.txt
├────────transcript_indexes.xml
├─────38
├────────audio.mp3
├────────transcript.txt
├────────transcript_indexes.xml
```
Of course you can change the file names, you have to change them in the code aswell. Otherwise the migration wont work anymore.

The xml-data-structure should look like this:

```
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

**2.** Start your MySQL server on default port `3306`. Use `root` as username and `password` as password. 

**3.** Open backend directory and start `SetupDB`. This will create all tables and clear its data if there's already some.

**4.** Insert data into the database by running `MigrateDB`.

**5.** To start the RestAPI run the `WebServer` file.


# Setup Frontend
**1.** Install the Angular CLI (https://angular.io/cli)

**2.** Clone the Github Project (https://github.com/jonasfabian/labeling-tool.git)

**3.** Open the project in your favorite IDE (IntelliJ Idea recommended)

**4.** Open the console and move to the frontend folder of the project

**5.** Type: `ng serve -o` (Your browser should open a new tab with the app started)

# Create an Account
To start labeling, you first have to register yourself. Click on `Login` in the top right corner. You should be redirected to the login-page, in which you have to click on register at the bottom of the login-form. You should now register yourself.

# Start Labeling
After you have registered yourself succesfully, you can start the labeling process. Click the menu-icon in the top left corner to expand the sidenav. There you will see different features. You can begin with checking already matched snippets, or edit unprecise snippets.

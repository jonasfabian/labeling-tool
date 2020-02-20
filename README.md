## Requirements
**Required**
* Java 11 
* MariaDB 10.4
* Node.js 12.10.0

Note: Other versions might work, but have not been tested yet

**Optional**
* npm: @angular/cli
* IntelliJ Idea
## Data Structure
* the data can be loaded using `data-import/data-import.py`
* the datastructure should look like this.
* `data` the base data directory (can be changed in the configuration)
   * `data-source` directory containing the raw data used by the import & edit
      * `<id>` id of the transcript
         * `audio.wav` the raw audio file
         * `indexes.xml` the transcript
   * `orginal_text` used to save the original text documents
      * `<id>.bin`
   * `recoding` used to save the recordings
      * `<id>.ogg`
   * `text-audio` used to save pre-cut audio
      * `<id>.flac`
## Development
run `gradle generateSampleJooqSchemaSource --rerun-tasks` to update the jooq database classes
run `gradle devBootRun` && `npm start` to run the development version

## Deployment
some additional packages may be needed (Ubuntu 18.04.3 ):
* `sudo apt install default-libmysqlclient-dev python3 mariadb-client libssl-dev nginx`
* mariadb 10.4 see https://downloads.mariadb.org/mariadb/repositories/#distro=Ubuntu&distro_release=bionic--ubuntu_bionic&mirror=cnrs&version=10.4

**NOTE:** for deployments the default admin password should be changed.

1. run `gradle buildProd` to build the production jar
1. `rsync backend/build/libs/backend-1.0.0-SNAPSHOT.jar s1042:~/labeling-tool/backend-1.0.0-SNAPSHOT.jar`
1. `ssh s1042`
1. `systemctl restart labeling-tool`

### Automatic Deployment
1. `nano /etc/nginx/nginx.conf` 
    ```nginx
    http {
        //...
        server {
            listen	80;
            server_name localhost;
            location / {
                proxy_pass http://127.0.0.1:8080/;
            }
            location /v2//app/ {
                proxy_pass http://localhost:8084/;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Forwarded-Port $server_port;
            }
            location /v2/app/ {
                return 301 https://www.cs.technik.fhnw.ch/speech-to-text-labeling-tool/app-v2/;
            }

        }
    }
    
    ```
1. `nano /lib/systemd/system/labeling-tool.service`
    ```
    [Unit]
    Description=Labeling Tool
    After=network.target
    [Service]
    Type=simple
    Restart=always
    RestartSec=1
    User=stt
    ExecStart=/usr/bin/java -jar /home/stt/labeling-tool/backend-1.0.0-SNAPSHOT.jar
    [Install]
    WantedBy=multi-user.target
    ```
1. `systemctl enable labeling-tool.service`

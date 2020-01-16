# Requirements
**Required**
* Python 3
* MariaDB: 10.1.43-MariaDB to 10.4.11-MariaDB
* Node.js 12.10.0

Note: Other versions might work, but have not been tested yet

**Optional**
* npm: @angular/cli
* IntelliJ Idea (Webstorm / PyCharm)

# Setup
## Development
### Backend
1. clone the submodule using `git submodule init` & `git submodule update` 
1. change the configuration in `flask/config.py` to match your setup.
1. Start setup.py
1. Start migration.py
1. Start rest.py

### Frontend
1. run `ng serve` or `npm start` in the frontend directory
1. Go to http://localhost:4200

## Production
some additional packages needed (Ubuntu 18.04.3 ):
* `sudo apt install default-libmysqlclient-dev python3 mariadb-client libssl-dev nginx`
### Frontend
1. change the the url in `environment.prod.ts`
1. install locked dependencies using `npm ci`
1. build `ng build --prod`
1. copy new files `rm -rf flask/static/public/ && mkdir -p flask/static/public/ && rsync -av frontend/dist/labeling-tool/ flask/static/public/`

### Backend

1. change the configuration in `flask/config.py` to match your setup.
1. install dependencies 
   1. `python3 -m venv venv`
   1. `source venv/bin/activate` (assumes bash is used)
   1. `pip install -r requirements.txt`
1. Start setup.py
1. Start migration.py
1. Start rest.py

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
        }
    }
    
    ```
1. `nano /lib/systemd/system/labelin-tool.service`
    ```
    [Unit]
    Description=Flask for labeling tool
    After=network.target
    [Service]
    Type=simple
    Restart=always
    RestartSec=1
    ExecStart=/bin/bash ~/flask-master/start_flask_labeling-tool.sh
    [Install]
    WantedBy=multi-user.target
    ```


# Create an Account
To start labeling, you first have to register yourself. Click on `Login` in the top right corner. You should be redirected to the login-page, in which you have to click on register at the bottom of the login-form. You should now register yourself.

# Start Labeling
After you have registered yourself succesfully, you can start the labeling process. Click the menu-icon in the top left corner to expand the sidenav. There you will see different tools for labeling. You can begin with checking already matched snippets, or edit unprecise snippets.

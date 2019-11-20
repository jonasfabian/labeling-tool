# Requirements
**Required**
* Python 3
* Mariadb
* Node.js 12.10.0

Note: Other versions might work, but have not been tested yet

**Optional**
* Node.js
  * Angular-CLI
* IntelliJ Idea (Webstorm / PyCharm)

1. Clone the Github Project (https://github.com/jonasfabian/labeling-tool.git)

# Setup
## Development
### Backend
1. clone the submodule using `git submodule init` & `git submodule update` 
1. Go to `flask/*,py` and change the path variables to your the desired directory. Do the same thing in the `LabelingToolService.scala` file.
1. Start setup.py
1. Start migration.py
1. Start rest.py

### Frontend
1. Open the console and move to the frontend folder of the project
1. Type: `ng serve` or `npm start`
1. Go to http://localhost:4200

## Production
some additional packages needed:
* `sudo apt install default-libmysqlclient-dev python3 mariadb-client libssl-dev`
### Frontend
1. change the the url in `environment.prod.ts`
1. install locked dependencies using `npm ci`
1. build `ng build --prod`
1. copy files `rm -rf flask/static/public/ && mkdir -p flask/static/public/ && rsync -av frontend/dist/labeling-tool/ flask/static/public/`

### Backend

1. Go to `flask/*,py` and change the path variables to your the desired directory.
1. install dependencies 
   1. `python3 -m venv venv`
   1. `source venv/bin/activate` (assumes bash is used)
   1. `pip install -r requirements.txt`
1. Start setup.py
1. Start migration.py
1. Start rest.py

TODO add description of automatic startup task here etc.

# Create an Account
To start labeling, you first have to register yourself. Click on `Login` in the top right corner. You should be redirected to the login-page, in which you have to click on register at the bottom of the login-form. You should now register yourself.

# Start Labeling
After you have registered yourself succesfully, you can start the labeling process. Click the menu-icon in the top left corner to expand the sidenav. There you will see different tools for labeling. You can begin with checking already matched snippets, or edit unprecise snippets.

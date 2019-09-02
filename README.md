# Setup Backend
**1.** Start your MySQL server on default port `3306`. Use `root` as username and `password` as password. 

**2.** Open backend directory and start `SetupDB`. This will create all tables and clear its data.

**3.** Insert data into the database by running `JooqSchemaGenerator`.

**4.** Run the python script `text.py`. This will migrate the textAudioIndex data.

**5.** To start the RestAPI run the `WebServer` file. The Webserver should run now.


# Setup Frontend
**1.** Install Angular CLI (https://angular.io/cli)

**2.** Clone the Github Project (https://github.com/jonasfabian/labeling-tool.git)

**3.** Open the project in your favorite IDE (IntelliJ Idea recommended)

**4.** Open console and move to the frontend folder of the project

**5.** Type: `ng serve -o` (Your browser should open a new tab)

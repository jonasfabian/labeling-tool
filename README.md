# Setup Backend
**1.** Start your MySQL server on default port "3306"

**2.** Open the backend in your favorite IDE (IntelliJ Idea recommended)

**3.** Migrate the DB by running `JooqSchemaGenerator` in the JooqSchemaGenerator-file

**4.** Next you have to start the Rest Server. You can do this by running `WebServer` in the Webserver-file

**5.** If you navigate to `localhost:8080/api/match/getMatch` you should be able to see an empty array. If you already have some matches in your database, you should be able to see an array of matches in json format.

# Setup Frontend
**1.** Install Angular CLI (https://angular.io/cli)

**2.** Clone the Github Project (https://github.com/jonasfabian/labeling-tool.git)

**3.** Open the project in your favorite IDE (IntelliJ Idea recommended)

**4.** Open console and move to the frontend folder of the project

**5.** Type: `ng serve -o` (Your browser should open a new tab)

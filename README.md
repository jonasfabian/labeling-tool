# Setup Backend
**1.** Start your MySQL server on default port `3306`. Use `root` as username and `password` as password. 

**2.** Open backend directory and start `SetupDB`. This will create all tables and clear its data if there's already some.

**3.** Insert data into the database by running `MigrateDB`.

**4.** To start the RestAPI run the `WebServer` file.


# Setup Frontend
**1.** Install the Angular CLI (https://angular.io/cli)

**2.** Clone the Github Project (https://github.com/jonasfabian/labeling-tool.git)

**3.** Open the project in your favorite IDE (IntelliJ Idea recommended)

**4.** Open the console and move to the frontend folder of the project

**5.** Type: `ng serve -o` (Your browser should open a new tab with the app started)

# Create an Account
To start labeling, you first have to register yourself. Click on `Login` in the top right cornber on the nav-bar. You should be redirected to the login-page, in which you have to click on register at the bottom of the login-form. You should now register yourself.

# Start Labeling
After you have registered yourself succesfully, you can start the labeling process. Click the menu-icon in the top left corner to expand the sidenav. There you will see different features. You can begin with checking already matched snippets, or edit unprecise snippets.

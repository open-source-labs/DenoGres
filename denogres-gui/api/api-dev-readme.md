# <u>A Message for Future DenoGres Developers</u>

Hello and thank you for researching, viewing, and possibly iterating on the DenoGres project.

DenoGres is, at its core, an Object Relational Mapper for PostgreSQL and Deno. That means it takes the information from a database and introspects it into model classes that can be accessed and manipulated directly your code. As of DenoGres 2.0 there was the creation of a basic GUI database app/tool to go along with the ORM. This tool was the primary focus of DenoGres 3.0, and the GUI is becoming a useful standalone tool for viewing and diagraming Postgres databases. 

The GUI is located in its own repo, distinct from the primary DenoGres tool repo. This is because the GUI has its own user database and associated functionality. The GUI web app can be launched from within the primary DenoGres CLI tool, and then from there each user must make an account and add/manipulate their data through the GUI. One could think of the GUI itself as a tool similar to, for example, DBSpy or other database visualizers.

If you're reading this, you're in the DenoGres GUI repo. In an effort to get you up and running ASAP with how this app is structured, we've created the folllowing readme:


## <u>Back-End</u>

The DengoGres GUI backend is handling communicating with the front end as well as two databases simultaneously.

A user database is the first database, this is a ElephantSQL Postgres instance which is the store of the information for the users. This database is fixed and admin'd by the DenoGres team. In the file structure and names, this database is always referenced as "usersDatabase" or "users". Credentials for this database can be provided by OSLabs, if needed. 

The second database is any PostGreSQL database which has been entered by the user of the tool. The connection information for these is associated with each user account and stored in the above user database. Credentials and connection information is added by a logged-in user using the Connections page/component on the front end. This is the database the user will then be able to query in the Console page, as well as view an ERD for in the ERD page. In the file structure and names, this database is always referenced as "database" or "db".


## <u>File Structure of the Back-End</u>

All of the back-end files are neatly contained the 'api' folder. Within this directory is the following structure and files:


- **controllers**: standard middleware controllers that handle arriving request, call on services and repositories, and send responses
- **connections**: folder containing two files: 
    1. database.ts which is where the connection is made to the working database as entered by the user of the GUI
    2. usersDatabase.ts which is where the connection is made to the user database.
- **repositories**: these TS files will handle the management of the database operations for both databases. Each create, delete, or update will take place, in its logic, here.
- **services**: these are the files that handle data manipulation and logic - such as validations, formatting queries, aggregating queries before being returned, etc.
- **utilities**: these files handle authorization, encryption, and other simple server-side needs
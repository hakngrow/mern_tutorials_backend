## Tutorials Listing app using MERN stack - REST CRUD APIs

We will build REST APIs that create, retrieve, update, delete and find tutorials by title.

The following table shows an overview of the REST APIs that will be built:

| Methods | URLs | Actions |
| --- | --- | --- |
| GET | api/tutorials | Get all tutorials |
| GET | api/tutorials/:id | Get tutorial by `id` |
| POST | api/tutorials | Add new tutorial |
| PUT | api/tutorials/:id | Update a tutorial by `id` |
| DELETE | api/tutorials/:id | Remove a tutorial by `id` |
| DELETE | api/tutorials | Remove all tutorials |
| GET | api/tutorials/published | Get all published tutorials |
| GET | api/tutorials?title=[keywords] | Find all tutorials with title contains keywords |


### Project Structure

Below is the project structure of our REST APIs.

| Folder/File | Purpose |
| --- | --- |
| `server.js` | Main entry point of app |
| `db.config.js` | Stores database connection parameters |
| `tutorial.controller.js` | Controller of the app, handles the CRUD operations |
| `tutorial.model.js` | Schema definition of Tutorial table in database |
| `tutorial.routes.js` | Mapping of API routes to the controller functions |

![Project Structure](/public/images/project_structure.jpg)





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


### REST APIs App Structure

![Project Structure](/public/images/project_structure.jpg)

| Folder/File | Purpose |
| --- | --- |
| `server.js` | Main entry point of app |
| `db.config.js` | Stores database connection parameters |
| `tutorial.controller.js` | Controller of the app, handles the CRUD operations |
| `tutorial.model.js` | Schema definition of Tutorial table in database |
| `tutorial.routes.js` | Mapping of API routes to the controller functions |


### Create Node.js App

#### 1. Create a application folder
```
mkdir mern_tutorials_backend
cd mern_tutorials_backend
```

#### 2. Initialize a Node.js application
```
npm init
```

#### 3.  Install the necessary modules: `express`, `mongoose`, `cors`, `dotenv`
```
npm install express mongoose cors dotenv --save
```

#### 4. Setup the Express web application framework<br/>

Using your preferred code editor, create a new `server.js` file in the application root folder.

```
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Testing route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to tutorials listing REST APIs backend." });
});

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
```

#### Using the `dotenv` module

Using `dotenv`, we load configuration parameters in a `.env` file into `process.env`.

Create a `.env` file with the following contents at the root folder (refer to App structure). 
```
# Database credentials
DB_USER=<Your DB user name>
DB_PASSWORD=<Your DB user password>

# Web server port
PORT=8080
```

To load the `.env` file, as early as possible in our application, we require and configure `dotenv`.
```
require("dotenv").config();
```

`process.env` now has the keys and values we defined in the `.env` file.
```
const PORT = process.env.PORT || 8080;
```

#### Using the `cors` module

CORS is for Cross-Origin Resource Sharing. It allows us to relax the security applied to an API. This is done by bypassing the Access-Control-Allow-Origin headers, which specify which origins can access the API.

In other words, CORS is a security feature that restricts cross-origin HTTP requests with other servers and specifies which domains can access your resources. 

Check this guide to learn more about the [CORS policy](https://www.section.io/engineering-education/what-is-cors-policy/).

We are using CORS here because we will be creating a front-end to interact with these APIs.  Here we configure that requests from `localhost`, port `8081` can make calls to our APIs.
```
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
```

#### Using the `express` module

We use the `express` web application framework to create the REST APIs.  In the initial `server.js`, we do the following:
1. Parse requests of type JSON and URL encoded form data
2. Define a GET route for simple testing
3. Listen to port 8080 for incoming requests

#### Verify Setup

To verify the setup so far, run `node server.js` at the root folder.

Start your browser, enter the URL http://localhost:8080.

If you see the following JSON response in your browser, the setup is working and we can proceed to work with the database.

![Project Structure](/public/images/test.jpg)

### 2. MongoDB Setup

We will be using the [MongoDB Atlas](https://www.mongodb.com) the cloud-hosted MongoDB service.  Head over to their URL and create a free account. 

After your account is created, you can proceed to create an organization.  Give your organization a name.  Select MongoDB Atlas as the cloud service.  After which, you will be prompted to add members and set permissions.  Since you are the only user, ignore this part and proceed to create the organization.

![Create an organization](/public/images/create_organization.jpg)

Under your new organization, create a new project.  Give your project a name.  Again ignore the prompt to add members and set permissions, and create the project.

![Create a project](/public/images/create_project.jpg)

In your new project, create a new database.  Be sure to select the free and shared option, or else, you will have to pay for it.

![Select the free, shared cluster](/public/images/select_free_cluster.jpg)

You can then select your preferred cloud provider and choose a location near to where you are.

![Select cloud provider and region](/public/images/select_cloud_region.jpg)

Give your database a meaningful name.

![Enter cluster name](/public/images/cluster_name.jpg)



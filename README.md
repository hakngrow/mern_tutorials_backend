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


#### REST APIs App Structure

![Project Structure](/public/images/project_structure.jpg)

| Folder/File | Purpose |
| --- | --- |
| `server.js` | Main entry point of app |
| `db.config.js` | Stores database connection parameters |
| `tutorial.controller.js` | Controller of the app, handles the CRUD operations |
| `tutorial.model.js` | Schema definition of Tutorial table in database |
| `tutorial.routes.js` | Mapping of API routes to the controller functions |


### 1. Create Node.js App

#### 1.1 Create a application folder
```
mkdir mern_tutorials_backend
cd mern_tutorials_backend
```

#### 1.2 Initialize a Node.js application
```
npm init
```

#### 1.3  Install the necessary modules: `express`, `mongoose`, `cors`, `dotenv`
```
npm install express mongoose cors dotenv --save
```

#### 1.4 Setup the Express web application framework<br/>

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

#### 1.5 Using the `dotenv` module

Using `dotenv`, we load configuration parameters in a `.env` file into `process.env`.

Create a `.env` file with the following contents at the root folder (refer to App structure). 
```
# Database credentials
DB_NAME=<Your DB name>
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

#### 1.6 Using the `cors` module

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

#### 1.7 Using the `express` module

We use the `express` web application framework to create the REST APIs.  In the initial `server.js`, we do the following:
1. Parse requests of type JSON and URL encoded form data
2. Define a GET route for simple testing
3. Listen to port 8080 for incoming requests

#### 1.8 Verify Setup

To verify the setup so far, run `node server.js` at the root folder.

Start your browser, enter the URL http://localhost:8080.

If you see the following JSON response in your browser, the setup is working and we can proceed to work with the database.

![Project Structure](/public/images/test.jpg)

### 2. MongoDB Setup

We will be using the [MongoDB Atlas](https://www.mongodb.com) the cloud-hosted MongoDB service.  Head over to their URL and create a free account. 

#### 2.1 Create an organization

After your account is created, you can proceed to create an organization.  Give your organization a name.  Select MongoDB Atlas as the cloud service.  After which, you will be prompted to add members and set permissions.  Since you are the only user, ignore this part and proceed to create the organization.

![Create an organization](/public/images/create_organization.jpg)

#### 2.2 Create a project

Under your new organization, create a new project.  Give your project a name.  Again ignore the prompt to add members and set permissions, and create the project.

![Create a project](/public/images/create_project.jpg)

#### 2.3 Create a cluster

In your new project, create a new cluster.  Be sure to select the free and shared option, or else, you will have to pay for it.

![Select the free, shared cluster](/public/images/select_free_cluster.jpg)

You can then select your preferred cloud provider and choose a location near to where you are.

![Select cloud provider and region](/public/images/select_cloud_region.jpg)

Give your cluster a meaningful name.

![Enter cluster name](/public/images/cluster_name.jpg)

It will take a while to provision the new cluster.  After it is done, it will appear in the database deployments list.

![Database Deployments](/public/images/database_deployments.jpg)

#### 2.4 Create a database and collection

Click on the `Browse Collections` and then the `Add My Own Data` buttons to start creating a database. 

![Create a database](/public/images/create_database.jpg)

Give your database a meaningful name.  A collection in MongoDB is like a table in a traditional DBMS.  We will name our collection `tutorials`. 

![Name your database](/public/images/database_name.jpg)

#### 2.5 Create a database user

After creating the database and collection, we need to create a database user account that our APIs will use to access the database.  Click on `Database Access` on the navigation side bar.  Click on the `ADD NEW DATABASE USER` button.

![Grant database access](/public/images/database_access.jpg)

Select `Password` for Authentication Method, enter your desired user name and password, select `Read and write to any database` for Database User Privileges. Click on the `Add User` button. 

![Add a database user](/public/images/create_user.jpg)

#### 2.6 Copy connection string

Next, we need to connect to the database for our APIs to perform CRUD operations.  Click on `Databases` on the left navigation side bar.  Click on the `Connect` button.

![Database Deployments](/public/images/database_deployments.jpg)

Click on the `Connect your application` button to learn how to connect to the database.

![Connect application](/public/images/connect_application.jpg)

To connect our `node.js` application to the MongoDB Atlas, we need a connection string.  A connection string is used to identify the server instance and database to connect to.  Also specified in the string, are connection parameters like the login details and driver.  To learn more about connection strings, click [here](https://www.sciencedirect.com/topics/computer-science/connection-string).

![Copy your connection string](/public/images/connection_string.jpg)

Make sure that `node.js` is selected for the driver and `4.0 or later` for the version.  The format of the connection string will be similar to the one below.  You will have to replace the `<user name>`, `<password>` and `<database>` sections with the values that you used earlier when creating the database and user account. Copy the connection string and store it somewhere safe.

```
mongodb+srv://<user name>:<password>@mern.cqtzf.mongodb.net/<database name>?retryWrites=true&w=majority
```

In summary, these are the following steps needed to get MongoDB Atlas ready for our use:
1. Create account at MongoDB Atlas
2. Create an organization
3. Create a project
4. Create a cluster
5. Create a database
6. Create a database user
7. Copy the connection string


### 3. Connecting Node.js to MongoDB

The `mongoose` module ([installed earlier](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#3--install-the-necessary-modules-express-mongoose-cors-dotenv)) is an MongoDB object modelling tool for `node.js`.  It allows our REST APIs to perform CRUD opertions on the MongoDB database. 

#### 3.1 Setup database config

In the `app` folder, create a `config` folder (refer to the [app structure](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#rest-apis-app-structure)).  In the `config` folder create a database config file `db.config.js` with the following:

```
module.exports = {
  url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cp50y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
};
```

Note that the values of `process.env.DB_USER`, `process.env.DB_PASSWORD` and `process.env.DB_NAME` are stored in the `.env` file we created in the [`dotenv`](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#15-using-the-dotenv-module) section.

#### 3.2 Define `Mongoose`

In the `app` folder, create a `models` folder.  In the `models` folder, create a `index.js` file with the following:

```
const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js")(mongoose);

module.exports = db;
```

We `require` the database config file and the 'mongoose' module.  We then store the `mongoose` module, the connection string, and the tutorial model in an object, and expose it via `exports`.  We will create the tutorial model in the next section

#### 3.3 Tutorial model

In the `models` folder, create a `tutorial.model.js` file with the following:

```
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean
    },
    { timestamps: true }
  );

  const Tutorial = mongoose.model("tutorial", schema);
  
  return Tutorial;
};
```

The Tutorial `mongoose` model above represents the `tutorial` collection we created earlier in the [MongoDB setup](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#24-create-a-database-and-collection).










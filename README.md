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

#### REST APIs Architecture

Our Node.js + Express + MongoDB Atlas application will follow this architecture:

![Project Architecture](/public/images/architecture.jpg)

Node.js Express exports REST APIs & interacts with MongoDB Atlas database using Mongoose ODM.

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


### 3. Connect Node.js to MongoDB

The `mongoose` module ([installed earlier](https://github.com/hakngrow/mern_tutorials_backend#13--install-the-necessary-modules-express-mongoose-cors-dotenv)) is an MongoDB object modelling tool for `node.js`.  It allows our REST APIs to perform CRUD opertions on the MongoDB database. 

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

The Tutorial `mongoose` model above represents the `tutorial` collection we created earlier in the [MongoDB setup](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#24-create-a-database-and-collection).  The model can be liken to the table definition of a traditional RDBMS.  

Inserting a tutorial via Mongoose will produce the following document object.  A document is like a row or record in traditional RDBMS.  Because we included `{ timestamps: true }` in the schema, the `createdAt` and `updatedAt` fields are auto-generated and updated. The `_id` and `__v` field are the auto-generated primary key and version key respectively.

```
{
  "_id": "5e363b135036a835ac1a7da8",
  "title": "Javascript Tutorial",
  "description": "Description for tutorial",
  "published": true,
  "createdAt": "2020-02-02T02:59:31.198Z",
  "updatedAt": "2020-02-02T02:59:31.198Z",
  "__v": 0
}
```

In our front-end later, we will be using a primary key `id` field instead of `_id`.  As such, we have to override the `toJSON` method that maps the default object to a custom object.  The `mongoose` model can be modified as follows:
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

  // Override toJSON function
  schema.method("toJSON", function() {
    // Deconstruct into custom object that excludes auto-generated fields __v and _id
    const { __v, _id, ...object } = this.toObject();

    // Create new id field with value of primary key _id 
    object.id = _id;

    return object;
  });

  const Tutorial = mongoose.model("tutorial", schema);
  
  return Tutorial;
};
```

In doing so, inserting a tutorial document produces the following object:
```
{
  "id": "5e363b135036a835ac1a7da8",
  "title": "Javascript Tutorial",
  "description": "Description for tutorial",
  "published": true,
  "createdAt": "2020-02-02T02:59:31.198Z",
  "updatedAt": "2020-02-02T02:59:31.198Z"
}
```

At this point, the `node.js` application is basically linked, via `mongoose`, to the MongoDB.  We can proceed to create the controller that implements the CRUD operations using the `mongoose` model.


### 4. Create the Controller

In the `app` folder, create a `controllers` folder.  In the `controllers` folder, create a `tutorial.controller.js` file with the following CRUD functions:
- create:  to create a new tutorial
- findAll: to retrieve all tutorials
- findOne: to find a tutorial by `id`
- update: to update a tutorial by `id`
- delete: to remove a tutorial by `id`
- deleteAll: to remove all tutorials
- findAllPublished: to find all tutorials by `title`

By requiring the `models` folder, we load the [`index.js`](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#32-define-mongoose) from the `models` folder, which in turn loads the `tutorial` model defined [previously](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#33-tutorial-model).  For more information about the `mongoose` model API, please click [here](https://mongoosejs.com/docs/models.html).

```
const db = require("../models");

const Tutorial = db.tutorials;

// Create and save a new tutorial
exports.create = (req, res) => {
};

// Retrieve all tutorials from the database.
exports.findAll = (req, res) => {
};

// Find a single tutorial with an id
exports.findOne = (req, res) => {
};

// Update a tutorial by the id in the request
exports.update = (req, res) => {
};

// Delete a tutorial with the specified id in the request
exports.delete = (req, res) => {
};

// Delete all tutorials from the database.
exports.deleteAll = (req, res) => {
};

// Find all published tutorials
exports.findAllPublished = (req, res) => {
};
```

#### 4.1 Create a new tutorial

```
// Create and save a new tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  // Create a tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  });

  // Save tutorial in the database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the tutorial.",
      });
    });
};
```

#### 4.2 Retrieve all tutorials by `title`

```
// Retrieve all tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Tutorial.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
```

We use `req.query.title` to get the query string from the HTML request and set it as a condition for `findAll()` method.  The condition is defined as a regular expression (`$regex`).  The `$options` set to `"i"` means the match will be case-insensitive.

```
{ title: { $regex: new RegExp(title), $options: "i" } }
```

#### 4.3 Retrieve a tutorial

```
// Find a single tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found tutorial with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving tutorial with id=" + id });
    });
};
```

#### 4.4 Update a tutorial

```
// Update a tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update tutorial with id=${id}. Maybe tutorial was not found!`,
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating tutorial with id=" + id,
      });
    });
};
```

#### 4.5 Delete a tutorial

```
// Delete a tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete tutorial with id=${id}. Maybe tutorial was not found!`,
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete tutorial with id=" + id,
      });
    });
};
```

#### 4.6 Delete all tutorials

```
// Delete all tutorials from the database.
exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};
```

#### 4.7 Find all published tutorials

```
// Find all published tutorials
exports.findAllPublished = (req, res) => {
    Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
```


### 5. Define the API Routes

Using the combination of API path and HTTP request methods (GET, POST, PUT, DELETE), we expose the CRUD operations defined previously in the controller to a client.  

| Route | Method | Function |
| --- | ---| --- |
| `/api/tutorials` |  GET | [Retrieve all tutorials by `title`](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#42-retrieve-all-tutorials-by-title) |
| `/api/tutorials` | POST | [Create a new tutorial](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#41-create-a-new-tutorial) |
| `/api/tutorials` | DELETE | [Delete all tutorials](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#46-delete-all-tutorials) |
| `/api/tutorials/:id` | GET | [Retrieve a tutorial with `id`](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#43-retrieve-a-tutorial) |
| `/api/tutorials/:id` | PUT | [Updates a tutorial with `id`](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#44-update-a-tutorial) |
| `/api/tutorials/:id` | DELETE | [Delete a tutorial with `id`](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#45-delete-a-tutorial) |
| `/api/tutorials/published` | GET | [Retrieves all published tutorials](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#47-find-all-published-tutorials) |

In the `app` folder, create a `routes` folder. In the `routes` folder, create a `tutorial.routes.js` file with the following:

```
module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");
  
    var router = require("express").Router();
  
    // Create a new tutorial
    router.post("/", tutorials.create);
  
    // Retrieve all tutorials
    router.get("/", tutorials.findAll);
  
    // Retrieve all published tutorials
    router.get("/published", tutorials.findAllPublished);
  
    // Retrieve a single tutorial with id
    router.get("/:id", tutorials.findOne);
  
    // Update a tutorial with id
    router.put("/:id", tutorials.update);
  
    // Delete a tutorial with id
    router.delete("/:id", tutorials.delete);
  
    // Create a new tutorial
    router.delete("/", tutorials.deleteAll);
  
    app.use('/api/tutorials', router);
  };
```

We define our routing rules using the `express.js` framework.  Note how `express` routing is done using the path, HTTP method and route parameters.  For more infromation on how routing work in `express.js`, click [here](https://expressjs.com/en/guide/routing.html).

We require the `express` module and `tutorial.controller.js` that we defined [earlier](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#4-create-the-controller).  To make these API routes work, we need to register them with the app by requiring it in `server.js`.

```
...

// API routes
require("./app/routes/tutorial.routes")(app);

...
```

### 6. Test the APIs

Type `node server.js` at the root folder to run the `node.js` app. 

Next we will be using [Postman](https://www.postman.com/) to test the APIs we have created.  Postman is an API platform that makes it easy for developers to create, share, test and document APIs. This is done by allowing users to create and save simple and complex HTTP/S requests, as well as read their responses.  Download and sign up for a free account if you have not done so.

#### 6.1 Create a new tutorial using `POST /api/tutorials` API

![Create a tutorial](/public/images/test_create_tutorial.jpg)

6.1.1 Select the `POST` HTTP method.

6.1.2 Enter `localhost:8080/api/tutorials` as the request URL. `localhost` refers to the computer on which the `node.js` app is running on.  `8080` refers to the port that the `node.js` app was [configured](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#15-using-the-dotenv-module) to listen to. `/api/tutorials` together with the `POST` HTTP method invokes the [API](https://github.com/hakngrow/mern_tutorials_backend/blob/master/README.md#41-create-a-new-tutorial) to create a tutorial.

6.1.3 Click on the `Body` tab to provide the tutorial data in the body of the HTTP POST request.

6.1.4 Click on the `raw` option as we will be providing the tutorial data in JSON format.

6.1.5 Select the `JSON` option.

6.1.6 Construct a JSON object with the tutorial fields of `title` and `description`.

6.1.7 Click on the `Send` button to fire the HTTP request to our `node.js` app.

6.1.8 Done correctly, Postman will receive a HTTP response from the `node.js` app.  In the body of the response is the tutorial document created.  Besides the `title` and `description` fields we provided in the request, the `published` field is initialized to `false`, the `id` and timestamp fields are auto-generated.


#### 6.2 Retrieve a tutorial by id using `GET /tutorials/:id` API

![Retrieve a tutorial](/public/images/test_retrieve_tutorial.jpg)

6.2.1 Select the `GET` HTTP method.

6.2.2 Enter `localhost:8080/api/tutorials/6199d191fc3b6060e3abd093` as the request URL. `6199d191fc3b6060e3abd093` is the `id` of the tutorial you wish to retrieve.

6.2.3 Click on the `Body` tab.

6.2.4 Click on the `none` option to specify that this HTTP request has no body.

6.2.5 Postman receives a HTTP response with a tutorial document JSON object in the body.


#### 6.3 Update a tutorial using `PUT /tutorials/:id` API

![Update a tutorial](/public/images/test_update_tutorial.jpg)

6.3.1 Select the `PUT` HTTP method.

6.3.2 Enter `localhost:8080/api/tutorials/6199d191fc3b6060e3abd093` as the request URL.

6.3.3 Click on the `Body` tab.

6.3.4 Click on the `raw` option as we will be providing the tutorial updates in JSON format.

6.3.5 Select the `JSON` option.

6.3.6 Construct a JSON object with the tutorial fields of `description` and `published`, and give them some arbitrary values.

6.3.7 Click on the `Send` button.

6.3.8 A returned JSON message states that the update was successful.


#### 6.4 Find all tutorials with `title` containing "javascript" using `GET /tutorials?title=javascript` API

![Retrieve tutorials by title](/public/images/test_retrieve_tutorials_title.jpg)


#### 6.5 Find all published tutorials using `GET /tutorials/published` API

![Retrieve published tutorials](/public/images/test_retrieve_tutorials_published.jpg)


#### 6.6 Delete a tutorial using `DELETE /tutorials/:id` API

![Delete a tutorial](/public/images/test_delete_tutorial.jpg)


#### 6.7 Delete all tutorials using `DELETE /tutorials` API

![Delete all tutorials](/public/images/test_delete_tutorials.jpg)

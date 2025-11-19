const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require('express');
require('dotenv').config();

// Use MONGODB_URI env var first, then fallback to local DB named 'cardamom-connect'
let uri = process.env.CC_MONGODB_URI;
let dbName = process.env.CC_MONGODB_DB;

if (process.env.NODE_ENV === "development") {
  uri = 'mongodb://127.0.0.1:27017/cardamom-connect';
  console.info("Using development database settings");
} else {
  console.info("Using production database settings");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let clientOptions = {};
if (process.env.NODE_ENV === "production") {
  clientOptions = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
      useNewUrlParser: true
    }
  }
}
const client = new MongoClient(uri, clientOptions);

var app = express();

async function CONNECT_TO_DATABASE() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db(dbName).command({ ping: 1 });
    console.log("Pinged your connection. You successfully connected to MongoDB!");
    app.locals.db = client.db(dbName);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function getDBInstance() {
  try {
    await client.connect();
    return client.db(dbName);
  } catch (err) {
    console.error("Error connecting to database:", err);
    return null;
  }
}

async function closeDBInstance() {
  try {
    await client.close();
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
}

module.exports = {
  CONNECT_TO_DATABASE,
  getDBInstance,
  closeDBInstance
};
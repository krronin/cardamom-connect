const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require('express');
require('dotenv').config();

// Use MONGODB_URI env var first, then fallback to local DB named 'cardamom-connect'
let uri = "mongodb+srv://krronin_db_user:5hqAANxKMWrzYZLi@cluster-aws.s1dr1qv.mongodb.net/?appName=Cluster-AWS";
let dbName = "cardamom-connect";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useNewUrlParser: true
  }
});

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
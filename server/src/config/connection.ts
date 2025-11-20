import { config } from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

config();

// Use MONGODB_URI env var first, then fallback to local DB named 'cardamom-connect'
const uri = process.env.NODE_ENV === "production" ? process.env.MONGODB_URI_PRODUCTION : process.env.MONGODB_URI_DEVELOPMENT;
const dbName = process.env.MONGODB_NAME;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function CONNECT_TO_DATABASE() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db(dbName).command({ ping: 1 });
    console.log(
      "Pinged your connection. You successfully connected to MongoDB!"
    );
    return client.db(dbName);
  } catch {
    console.error("Error connecting to database");
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

export {
  CONNECT_TO_DATABASE,
  getDBInstance,
  closeDBInstance,
};

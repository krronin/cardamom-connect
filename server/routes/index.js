var express = require('express');

const router = express.Router();
const { getDBInstance } = require('../db/connection');

/* GET home page. */
router.get('/', async function (req, res, next) {
  const dbInstance = await getDBInstance();
  dbInstance.client.connect();
  const collections = await dbInstance.listCollections().toArray();
  const users = dbInstance.collection("users"); // Example operation to verify DB access
  // const collectionNames = collections.map(col => col.name);

  console.log("Collection Names:", await users.findOne());
  res.render('index', { title: 'Express' });
});

module.exports = router;

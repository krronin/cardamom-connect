var express = require('express');
var userRouter = express.Router();
var crypto = require('crypto');
const { generateRandomPassword, generateUserId } = require('../utils');
const { getDb } = require('../db/connection');

var app = express();

function makeId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2));
}

function stripPassword(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

/* GET users listing from MongoDB 'users' collection. */
userRouter.get('/', async function (req, res, next) {
  try {
    const appDB = app && app.locals && app.locals.db;
    const db = appDB || getDb();

    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const users = await db.collection('users').find({}).toArray();
    // Never return passwords in API responses
    const safe = users.map(u => stripPassword(u));

    res.json(safe);
  } catch (err) {
    next(err);
  }
});

// POST /login - authenticate user from MongoDB
userRouter.post('/login', async function (req, res, next) {
  try {
    const identifier = req.body.identifier || req.body.username || req.body.email;
    const password = req.body.password;

    if (!identifier || !password) return res.status(400).json({ error: 'identifier and password required' });

    const appDB = app && app.locals && app.locals.db;
    const db = appDB || getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const user = await db.collection('users').findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Demo only: plaintext password comparison. In production use bcrypt/argon2.
    if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

    const token = crypto.randomBytes(24).toString('hex');

    res.json({ message: 'Login successful', token, user: stripPassword(user) });
  } catch (err) {
    next(err);
  }
});

// POST /create - create a new user in MongoDB 'users' collection
userRouter.post('/create', async function (req, res, next) {
  try {
    const {
      businessName,
      businessAddress,
      phone,
      gstNumber,
      email
    } = req.body;

    const password = generateRandomPassword();
    const uuid = generateUserId(gstNumber);

    if (!businessName || !phone || !gstNumber) return res.status(400).json({ error: 'Business name, phone and GST number are required' });

    const appDB = app && app.locals && app.locals.db;
    const db = appDB || getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    // Check existing
    const exists = await db.collection('users').findOne({ $or: [{ businessName }, { phone }, { gstNumber }] });
    if (exists) {
      return res.status(409).json({ error: 'Business name or phone or GST number already exists' });
    }

    console.log(new Date().toISOString());

    const user = {
      _id: makeId(),
      businessName,
      phone,
      gstNumber,
      joiningDate: new Date().toISOString(),
      password,
      email,
      uuid,
      businessAddress
    };

    await db.collection('users').insertOne(user);

    res.status(201).json({ message: 'User created', user: stripPassword(user) });
  } catch (err) {
    next(err);
  }
});

// PATCH /patch - update an existing user in MongoDB 'users' collection
userRouter.patch('/update', async function (req, res, next) {
  try {
    const {
      businessName,
      businessAddress,
      phone,
      gstNumber,
      email
    } = req.body;

    const appDB = app && app.locals && app.locals.db;
    const db = appDB || getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    // Check existing
    const userDetails = await db.collection('users').findOne({ $or: [{ businessName }, { phone }, { gstNumber }] });
    if (userDetails) {
      db.collection('users').updateOne({ _id: userDetails._id }, {
        $set: {
          businessName,
          businessAddress,
          phone,
          gstNumber,
          email
        }
      });
      return res.status(200).json({ message: 'User details updated successfully' });
    } else {
      return res.status(409).json({ error: 'User details not found' });
    }
  } catch (err) {
    next(err);
  }
});

// DELETE /delete - delete a user in MongoDB 'users' collection
userRouter.delete('/delete/:uuid', async function (req, res, next) {
  try {
    const appDB = app && app.locals && app.locals.db;
    const db = appDB || getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    // Check existing
    const userDetails = await db.collection('users').deleteOne({ uuid: req.params.uuid });
    if (userDetails) {
      db.collection('users').deleteOne({ _id: userDetails._id });
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(409).json({ error: 'User details not found' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
import express from "express";
import crypto from 'crypto';
import { generateRandomPassword, generateUserId } from "../utils/index.utils";

const userRouter = express.Router();

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
    const dbInstance = req.app.locals.db;

    if (!dbInstance) return res.status(500).json({ error: 'Database not initialized' });

    const users = await dbInstance.collection("users").find({}).toArray();

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

    const dbInstance = req.app.locals.db;

    if (!dbInstance) return res.status(500).json({ error: 'Database not initialized' });

    const user = await dbInstance.collection('users').findOne({ $or: [{ username: identifier }, { email: identifier }] });
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
    const dbInstance = req.app.locals.db;

    if (!dbInstance) return res.status(500).json({ error: 'Database not initialized' });

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

    // Check existing
    const exists = await dbInstance.collection('users').findOne({ $or: [{ uuid }] });
    if (exists) {
      return res.status(409).json({ error: 'Business name or phone or GST number already exists' });
    }

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

    await dbInstance.collection('users').insertOne(user);

    res.status(201).json({ message: 'User created', user: stripPassword(user) });
  } catch (err) {
    next(err);
  }
});

// PATCH /patch - update an existing user in MongoDB 'users' collection
userRouter.patch('/update', async function (req, res, next) {
  try {
    const dbInstance = req.app.locals.db;

    if (!dbInstance) return res.status(500).json({ error: 'Database not initialized' });

    const {
      businessName,
      businessAddress,
      phone,
      gstNumber,
      email,
      uuid
    } = req.body;

    // Check existing
    const userDetails = await dbInstance.collection('users').findOne({ uuid });
    if (userDetails) {
      dbInstance.collection('users').updateOne({ _id: userDetails._id }, {
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
    const dbInstance = req.app.locals.db;

    if (!dbInstance) return res.status(500).json({ error: 'Database not initialized' });

    // Check existing
    const userDetails = await dbInstance.collection('users').deleteOne({ uuid: req.params.uuid });
    if (userDetails) {
      dbInstance.collection('users').deleteOne({ _id: userDetails._id });
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(409).json({ error: 'User details not found' });
    }
  } catch (err) {
    next(err);
  }
});

export default userRouter;
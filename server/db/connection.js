(function () {
	'use strict';
	require('dotenv').config();

	const { MongoClient, ServerApiVersion } = require('mongodb');

	// Use MONGODB_URI env var first, then fallback to local DB named 'cardamom-connect'
	const uri = process.env.CC_MONGODB_URI || 'mongodb://127.0.0.1:27017';
	const dbName = process.env.CC_MONGODB_DB || 'cardamom-connect';

	let client;
	let db;

	async function connect() {
		if (db) return;

		client = new MongoClient(uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			}
		});
		await client.connect();
		db = client.db(dbName);
		console.log(`Connected to MongoDB: ${uri}/${dbName}`);
		return db;
	}

	async function getDb() {
		// if (!db) throw new Error('Database not initialized. Call connect() first.');
		if (!db) await connect();
		return db;
	}

	async function close() {
		if (client) {
			await client.close();
			client = null;
			db = null;
		}
	}

	module.exports = { connect, getDb, close };

})();


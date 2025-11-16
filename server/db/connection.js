(function () {
	'use strict';

	const { MongoClient } = require('mongodb');

	// Use MONGODB_URI env var first, then fallback to local DB named 'cardamom-connect'
	const fallback_uri = "mongodb+srv://krronin_db_user:5hqAANxKMWrzYZLi@cluster-aws.s1dr1qv.mongodb.net/?appName=Cluster-AWS";
	const uri = process.env.CC_MONGODB_URI || fallback_uri || 'mongodb://127.0.0.1:27017';
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

	function getDb() {
		if (!db) throw new Error('Database not initialized. Call connect() first.');
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


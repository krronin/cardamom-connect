(function () {
	'use strict';

	const { MongoClient } = require('mongodb');

	// Use MONGODB_URI env var first, then fallback to local DB named 'nutribid'
	const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
	const dbName = process.env.MONGODB_DB || 'cardamom-connect';

	let client;
	let db;

	async function connect() {
		if (db) return ;

		client = new MongoClient(uri);
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


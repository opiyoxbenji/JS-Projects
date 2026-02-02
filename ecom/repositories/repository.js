const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
	// Constructor for the Repository class
	constructor(filename) {
		// Check if filename is provided then throw error if not
		if (!filename) {
			throw new Error('Creating a repository requires a filename');
		}

		this.filename = filename;
		try {
			// Check if the file exists. If not, create it with empty brackets
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	// Create a new record in the repository
	// Generate a random id for the record
	// Add the record to the existing records
	// Write all the records back to the file
	async create(attrs) {
		attrs.id = this.randomId();

		const records = await this.getAll();
		records.push(attrs);
		await this.writeAll(records);

		return attrs;
	}

  // Get all records from the file
	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: 'utf8',
			}),
		);
	}

  // Write all records to the file
	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2),
		);
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find(record => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter(record => record.id !== id);
		await this.writeAll(filteredRecords);
	}

	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find(record => record.id === id);

		if (!record) {
			throw new Error(`Record with id ${id} not found`);
		}

		Object.assign(record, attrs);
		await this.writeAll(records);
	}

	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;

			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}

			if (found) {
				return record;
			}
		}
	}
};

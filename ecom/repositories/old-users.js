const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

// class UsersRepository {
// 	constructor(filename) {
// 		if (!filename) {
// 			throw new Error('Creating requires a filename!!!');
// 		}
// 		this.filename = filename;
// 		try {
// 			fs.accessSync(this.filename);
// 		} catch (err) {
// 			fs.writeFileSync(this.filename, '[]');
// 		}
// 	}

// 	async getAll() {
// 		// Open the file, read & parse contents then return parsed data
// 		return (contents = JSON.parse(
// 			await fs.promises.readFile(this.filename, {
// 				encoding: 'utf8',
// 			}),
// 		));
// 	}

// 	// saving records
// 	async create(attrs) {
// 		attrs.id = this.randomId();

// 		const records = await this.getAll();
// 		records.push(attrs);

// 		await this.writeAll(records);
// 	}

// 	async writeAll(records) {
// 		await fs.promises.writeFile(
// 			this.filename,
// 			JSON.stringify(records, null, 2),
// 		);
// 	}

// 	// random id gen
// 	randomId() {
// 		return crypto.randomBytes(4).toString('hex');
// 	}

// 	// finding by ID
// 	async getOne(id) {
// 		const records = await this.getAll();
// 		return records.find(record => record.id === id);
// 	}

// 	// deleting records
// 	async delete(id) {
// 		const records = await this.getAll();
// 		const filteredRecords = records.filter(record => record.id !== id);
// 		await this.writeAll(filteredRecords);
// 	}

// 	// updating records
// 	async update(id, attrs) {
// 		const records = await this.getAll();
// 		const record = records.find(record => record.id === id);

// 		if (!record) {
// 			throw new Error(`Record with id ${id} not found`);
// 		}

// 		Object.assign(record, attrs);
// 		await this.writeAll(records);
// 	}
// }

// const test = async () => {
// 	const repo = new UsersRepository('users.json');

// 	await repo.create({ email: 'yolo@tolo.com'})
// };
// test();

class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new Error('Creating a repository requires a filename');
		}

		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: 'utf8',
			}),
		);
	}

	async create(attrs) {
		attrs.id = this.randomId();

		// salting && hashing password
		const salt = crypto.randomBytes(16).toString('hex');
		const buf = await scrypt(attrs.password, salt, 64);

		const records = await this.getAll();
		const record = {
			...attrs,
			password: `${buf.toString('hex')}.${salt}`,
		};

		records.push(record);

		await this.writeAll(records);

		return record;
	}

	// comparing hashed passwords
	async comparePasswords(saved, supplied) {
		const [hashed, salt] = saved.split('.');
		const buf = await scrypt(supplied, salt, 64);
		return hashed === buf.toString('hex');
	}

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
			throw new Error(`Record with id:${id} not found`);
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
}

module.exports = new UsersRepository('users.json');

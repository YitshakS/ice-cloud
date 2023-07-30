import { createConnection } from "mysql2"; // "mysql2/promise";

// create connection to the database
const connection = createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	database: process.env.MYSQL_DATABASE,
	password: process.env.MYSQL_PASSWORD,
});

// open MySQL connection
connection.connect((err) => {
	// if (err) throw error;
	if (err) console.log("Error: MySQL not connected");
	else console.log("MySQL connected");
});

class transaction {
	constructor(transaction) {
		this.date = transaction.date;
		this.branch_name = transaction.branch_name;
		this.flavor_name = transaction.flavor_name;
		this.weight = transaction.weight;
	}
	static create(newTransaction, result) {
		connection.query(
			"INSERT INTO transactions SET ?",
			newTransaction,
			(err, res) => {
				if (err) {
					console.log("error: ", err);
					result(err, null);
					return;
				}

				// console.log("created transaction: ", {
				// 	id: res.insertId,
				// 	...newTransaction,
				// });
				result(null, { id: res.insertId, ...newTransaction });
			}
		);
	}
	static findById(transactionId, result) {
		connection.query(
			`SELECT * FROM transactions WHERE id = ${transactionId}`,
			(err, res) => {
				if (err) {
					console.log("error: ", err);
					result(err, null);
					return;
				}

				if (res.length) {
					// console.log("found transaction: ", res[0]);
					result(null, res[0]);
					return;
				}

				// not found transaction with the id
				result({ kind: "not_found" }, null);
			}
		);
	}
	static getAll(result) {
		connection.query("SELECT * FROM transactions", (err, res) => {
			if (err) {
				console.log("error: ", err);
				result(null, err);
				return;
			}

			// console.log("transactions: ", res);
			result(null, res);
		});
	}
	static updateById(id, transaction, result) {
		connection.query(
			"UPDATE transactions SET date = ?, branch_name = ?, flavor_name = ?, weight = ? WHERE id = ?",
			[
				id,
				transaction.date,
				transaction.branch_name,
				transaction.flavor_name,
				transaction.weight,
			],
			(err, res) => {
				if (err) {
					console.log("error: ", err);
					result(null, err);
					return;
				}

				if (res.affectedRows == 0) {
					// not found transaction with the id
					result({ kind: "not_found" }, null);
					return;
				}

				// console.log("updated transaction: ", { id: id, ...transaction });
				result(null, { id: id, ...transaction });
			}
		);
	}
	static remove(id, result) {
		connection.query(
			"DELETE FROM transactions WHERE id = ?",
			id,
			(err, res) => {
				if (err) {
					console.log("error: ", err);
					result(null, err);
					return;
				}

				if (res.affectedRows == 0) {
					// not found transaction with the id
					result({ kind: "not_found" }, null);
					return;
				}

				// console.log("deleted transaction with id: ", id);
				result(null, res);
			}
		);
	}
	static removeAll(result) {
		connection.query("DELETE FROM transactions", (err, res) => {
			if (err) {
				console.log("error: ", err);
				result(null, err);
				return;
			}

			// console.log(`deleted ${res.affectedRows} transactions`);
			result(null, res);
		});
	}
}

export default transaction;

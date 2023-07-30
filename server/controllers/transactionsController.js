import transactionsModel from "../models/transactionsModel.js";

export async function deleteOneTransaction(req, res) {
	await transactionsModel
		.findByIdAndRemove(req.params.transaction_id)
		.catch((err) => console.log(err));
	res.send("transaction deleted");
	// console.log("transaction deleted");
}

export async function deleteTransactions(_, res) {
	await transactionsModel.deleteMany().catch((err) => console.log(err));
	res.send("transactions deleted");
	// console.log("transactions deleted");
}

export async function loadTransactions(_, res) {
	const transactions = await transactionsModel
		.find()
		.catch((err) => console.log(err));
	res.send(transactions);
	// console.log("transactions loaded", transactions);
}

export async function saveOneTransaction(req, res) {
	const transaction = await transactionsModel
		.create(req.body)
		.catch((err) => console.log(err));
	res.send("transaction saved");
	// console.log("transaction saved", transaction);
}

export async function saveTransactions(req, res) {
	const transactions = await transactionsModel
		.insertMany(req.body, { ordered: false })
		.catch((err) => console.log(err));
	res.send("transactions saved");
	// console.log("transactions saved", transactions);
}

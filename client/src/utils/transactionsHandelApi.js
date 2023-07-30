import axios from "axios";

const baseUrl = process.env.REACT_APP_PROXY + "/transactions";

export async function deleteOneTransaction(transaction_id) {
	await axios
		.delete(`${baseUrl}/deleteOneTransaction/${transaction_id}`)
		.catch((err) => console.log(err.response.data));
	console.log("transaction deleted");
}

export async function loadTransactions(setTransactions) {
	const transactions = await axios
		.get(`${baseUrl}/loadTransactions`)
		.catch((err) => console.log(err.response.data));
	if (transactions) {
		console.log("transactions loaded", transactions.data);
		setTransactions(transactions.data);
	}
}

export async function saveOneTransaction(transaction) {
	await axios
		.post(`${baseUrl}/saveOneTransaction`, transaction)
		.catch((err) => console.log(err.response.data));
	console.log("new transaction saved");
}

export async function saveTransactions(transactions) {
	await axios
		.delete(`${baseUrl}/deleteTransactions`, {})
		.catch((err) => console.log(err.response.data));
	console.log("old transactions deleted");
	await axios
		.post(`${baseUrl}/saveTransactions`, transactions)
		.catch((err) => console.log(err.response.data));
	console.log("new transactions saved");
}

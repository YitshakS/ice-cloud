import transactionModel from "../models/transactionsSqlModel.js";

// Create and Save a new transaction
export function create(req, res) {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}

	// Create a transaction
	const transaction = new transactionModel();
	({
		date: req.body.date,
		branch_name: req.body.branch_name,
		flavor_name: req.body.flavor_name,
		weight: req.body.weight,
	});

	// Save transaction in the database
	transactionModel.create(transaction, (err, data) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the Transaction.",
			});
		else res.send(data);
	});
}

// Retrieve all transactions from the database.
export function findAll(_, res) {
	transactionModel.getAll((err, data) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving transactions.",
			});
		else res.send(data);
	});
}

// Find a single transaction with a transactionId
export function findOne(req, res) {
	transactionModel.findById(req.params.transactionId, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				res.status(404).send({
					message: `Not found Transaction with id ${req.params.transactionId}.`,
				});
			} else {
				res.status(500).send({
					message:
						"Error retrieving Transaction with id " + req.params.transactionId,
				});
			}
		} else res.send(data);
	});
}

// Update an transaction identified by the transactionId in the request
export function update(req, res) {
	// Validate Request
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}

	transactionModel.updateById(
		req.params.transactionId,
		new transactionModel(req.body),
		(err, data) => {
			if (err) {
				if (err.kind === "not_found") {
					res.status(404).send({
						message: `Not found Transaction with id ${req.params.transactionId}.`,
					});
				} else {
					res.status(500).send({
						message:
							"Error updating Transaction with id " + req.params.transactionId,
					});
				}
			} else res.send(data);
		}
	);
}

// Delete an transaction with the specified transactionId in the request
export function deleteOne(req, res) {
	transactionModel.remove(req.params.transactionId, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				res.status(404).send({
					message: `Not found Transaction with id ${req.params.transactionId}.`,
				});
			} else {
				res.status(500).send({
					message:
						"Could not delete Transaction with id " + req.params.transactionId,
				});
			}
		} else res.send({ message: `Transaction was deleted successfully!` });
	});
}

// Delete all transactions from the database.
export function deleteAll(_, res) {
	transactionModel.removeAll((err, data) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while removing all transactions.",
			});
		else res.send({ message: `All Transactions were deleted successfully!` });
	});
}

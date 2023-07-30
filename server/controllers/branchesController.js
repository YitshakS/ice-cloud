import branchesModel from "../models/branchesModel.js";

export async function loadBranches(_, res) {
	const branches = await branchesModel.find().catch((err) => console.log(err));
	res.send(branches);
	// console.log("branches loaded", branches);
}

export async function deleteBranches(_, res) {
	await branchesModel.deleteMany().catch((err) => console.log(err));
	res.send("old branches deleted");
	// console.log("old branches deleted");
}

export async function saveBranches(req, res) {
	// const branches =
	await branchesModel
		.insertMany(req.body, { ordered: false })
		.catch((err) => console.log(err));
	res.send("new branches saved");
	// console.log("new branches saved", branches);
}

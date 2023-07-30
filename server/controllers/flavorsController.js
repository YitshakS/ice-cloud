import flavorsModel from "../models/flavorsModel.js";

export async function loadFlavors(_, res) {
	const flavors = await flavorsModel.find().catch((err) => console.log(err));
	res.send(flavors);
	// console.log("flavors loaded", flavors);
}

export async function deleteFlavors(_, res) {
	await flavorsModel.deleteMany().catch((err) => console.log(err));
	res.send("flavors deleted");
	// console.log("flavors deleted");
}

export async function saveFlavors(req, res) {
	// const flavors =
	await flavorsModel
		.insertMany(req.body, { ordered: false })
		.catch((err) => console.log(err));
	res.send("flavors saved");
	// console.log("flavors saved", flavors);
}

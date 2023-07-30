import axios from "axios";

const baseUrl = process.env.REACT_APP_PROXY + "/branches";

export async function loadBranches(setBranches) {
	const branches = await axios
		.get(`${baseUrl}/loadBranches`)
		.catch((err) => console.log(err.response.data));
	if (branches) {
		console.log("branches loaded", branches.data);
		setBranches(branches.data);
	}
}

export async function saveBranches(branches) {
	await axios
		.delete(`${baseUrl}/deleteBranches`, {})
		.catch((err) => console.log(err.response.data));
	console.log("old branches deleted");
	await axios
		.post(`${baseUrl}/saveBranches`, branches)
		.catch((err) => console.log(err.response.data));
	console.log("new branches saved");
}

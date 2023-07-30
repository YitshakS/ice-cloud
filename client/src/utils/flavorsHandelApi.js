import axios from "axios";

const baseUrl = process.env.REACT_APP_PROXY + "/flavors";

export async function loadFlavors(setFlavors) {
	const flavors = await axios
		.get(`${baseUrl}/loadFlavors`)
		.catch((err) => console.log(err.response.data));
	if (flavors) {
		console.log("flavors loaded", flavors.data);
		setFlavors(flavors.data);
	}
}

export async function saveFlavors(flavors) {
	await axios
		.delete(`${baseUrl}/deleteFlavors`, {})
		.catch((err) => console.log(err.response.data));
	console.log("old flavors deleted");
	await axios
		.post(`${baseUrl}/saveFlavors`, flavors)
		.catch((err) => console.log(err.response.data));
	console.log("new flavors saved");
}

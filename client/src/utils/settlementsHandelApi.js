import axios from "axios";

const baseUrl = process.env.REACT_APP_PROXY + "/settlements";

export async function loadSettlements(setSettlements) {
	const settlements = await axios
		.get(`${baseUrl}/loadSettlements`)
		.catch((err) => console.log(err.response.data));
	if (settlements) {
		console.log("settlements loaded", settlements.data.settlements);
		setSettlements(settlements.data.settlements);
	}
}

import axios from "axios";

const baseUrl = process.env.REACT_APP_PROXY + "/date";

export async function loadDate(date, setSelectedDateJewishData) {
	const jewishData = await axios
		.get(`${baseUrl}/loadDate/${date}`)
		.catch((err) => console.log(err.response.data));
	if (jewishData) {
		console.log("date loaded", jewishData.data, `${baseUrl}/loadDate/${date}`);

		const obj = {
			hebrew_date: jewishData.data.hebrew_date,
			business_day: jewishData.data.business_day,
			events: jewishData.data.events,
		};

		if (setSelectedDateJewishData) setSelectedDateJewishData(obj);
		return obj;
	}
}

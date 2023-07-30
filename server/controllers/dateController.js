import axios from "axios";

export async function loadDate(req, res) {
	const dateJson = await axios
		.get(
			// Documentation:
			// https://hebcal.com/home/195/jewish-calendar-rest-api
			// https://hebcal.com/home/219/hebrew-date-converter-rest-api
			`https://hebcal.com/hebcal?v=1&cfg=json&d=on&lg=he&i=on&maj=on&mf=on&min=on&mod=on&nx=on&o=on&s=on&ss=on&start=${req.params.date}&end=${req.params.date}`
		)
		// .catch((err) => console.log(err));
		.catch(() => {
			console.log("Error: hebrew date not loaded");
			res.status(400).send("Error: hebrew date not loaded");
		});
	if (!dateJson || !dateJson.data) return;

	if (dateJson === undefined) {
		console.log("Error: dateJson === undefined");
		return res.status(400).send("error");
	}

	let resJson = { business_day: 1, hebrew_date: [], events: [] };

	dateJson.data.items.forEach((item) => {
		// set work percent
		let dayOfWeek = new Date(req.params.date).getDay() + 1; // get day of week
		// if Erev Sabbath / Erev Holiday
		if (dayOfWeek === 6 || item.hebrew.includes("ערב"))
			resJson.business_day = 0.5;
		// if Sabbath / Holiday
		else if (dayOfWeek === 7 || item.yomtov) resJson.business_day = 0;

		// set hebrew date
		if (item.category === "hebdate")
			resJson.hebrew_date =
				item.heDateParts.d +
				" ב" +
				item.heDateParts.m +
				" ה'" +
				item.heDateParts.y;
		// set events
		else resJson.events.push(item.hebrew);
	});
	res.json(resJson);
}

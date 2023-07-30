import axios from "axios";
import fs from "fs";

export async function loadSettlements(_, res) {
	// ישובים - גילאים
	const json1 = await axios
		.get(
			`https://data.gov.il/api/3/action/datastore_search?resource_id=64edd0ee-3d5d-43ce-8562-c336c24dbc1f&limit=1500`
		)
		// .catch((err) => console.log(err));
		.catch(() => {
			console.log("Error: settlement - ages not loaded");
			res.status(400).send("Error: settlement - ages not loaded");
		});
	if (!json1 || !json1.data) return;

	// ישובים - מגזרים

	// פונקציה זו פועלת במחשב אך לא בשרת
	// const json2 = await axios
	// 	.get(
	// 		`https://boardsgenerator.cbs.gov.il/Handlers/WebParts/YishuvimHandler.ashx?dataMode=Yeshuv&filters={"Years":"2021"}&language=Hebrew&mode=GridData&pageNumber=-1`
	// 	)
	// 	// .catch((err) => console.log(err));
	// 	.catch(() => {
	// 		console.log("Error: settlement - sectors not loaded");
	// 		res.status(400).send("Error: settlement - sectors not loaded");
	// 	});
	// if (!json2 || !json2.data) return;

	// לכן הנתונים מתוך קובץ
	const json2 = {
		data: JSON.parse(fs.readFileSync("json/YishuvimHandler.json", "utf8")),
	};

	// ישובים - קואורדינטות

	// https://data-israeldata.opendata.arcgis.com/datasets/a589d87604c6477ca4afb78f205b98fb_0/api
	const json3 = await axios
		.get(
			`https://services8.arcgis.com/JcXY3lLZni6BK4El/arcgis/rest/services/CITY/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`
		)
		// .catch((err) => console.log(err));
		.catch(() => {
			console.log("Error: settlement - coordinates not loaded");
			res.status(400).send("Error: settlement - coordinates not loaded");
		});
	if (!json3 || !json3.data) return;

	// תחנות מטאורולוגיות - קואורדינטות
	let json4 = await axios
		.get("https://api.ims.gov.il/v1/envista/stations", {
			headers: {
				Authorization: process.env.IMS_GOV_IL_AUTHORIZATION,
			},
		})
		// .catch((err) => console.log(err));
		.catch(() => {
			console.log("Error: meteorological stations not loaded");
			res.status(400).send("Error: meteorological stations not loaded");
		});
	if (!json4 || !json4.data) return;

	// מיזוג גילאים ומגזרים לפי סמל ישוב
	let settlements = json1.data.result.records.map((a) =>
		Object.assign(
			a,
			json2.data.Table.find(
				(b) => parseInt(a.סמל_ישוב) === parseInt(b.SemelYishuv)
			)
		)
	);

	// מיזוג המיזוג הקודם עם קואורדינטות לפי סמל ישוב
	settlements = settlements.map((a) =>
		Object.assign(
			a,
			json3.data.features.find(
				(b) => parseInt(a.סמל_ישוב) === b.attributes.SETL_CODE
			)
		)
	);

	// 1714 הסרת ישובים שאינם כוללים נתוני גילאים, כמו סמל ישוב
	settlements = settlements.filter((o) => Object.keys(o).includes("סמל_ישוב"));

	// הסרת ישובים שאינם כוללים נתוני מגזרים, כמו סמל ישוב 932
	settlements = settlements.filter((o) =>
		Object.keys(o).includes("SemelYishuv")
	);

	// הסרת ישובים שאינם כוללים נתוני קואורדינטות, כמו סמל ישוב 22
	settlements = settlements.filter((o) =>
		Object.keys(o).includes("attributes")
	);

	// הוספת אחוזי גילאים ומגזרים
	settlements.forEach((settlement) => {
		// אחוזי גילאים
		settlement.percentage = {
			age_0_5: parseFloat(
				(
					(parseInt(settlement.גיל_0_5) * 100) /
					parseInt(settlement.סהכ)
				).toFixed(1)
			),
			age_6_18: parseFloat(
				(
					(parseInt(settlement.גיל_6_18) * 100) /
					parseInt(settlement.סהכ)
				).toFixed(1)
			),
			age_19_45: parseFloat(
				(
					(parseInt(settlement.גיל_19_45) * 100) /
					parseInt(settlement.סהכ)
				).toFixed(1)
			),
			age_46_55: parseFloat(
				(
					(parseInt(settlement.גיל_46_55) * 100) /
					parseInt(settlement.סהכ)
				).toFixed(1)
			),
			age_56_64: parseFloat(
				(
					(parseInt(settlement.גיל_56_64) * 100) /
					parseInt(settlement.סהכ)
				).toFixed(1)
			),
			age_65_plus: parseFloat(
				(
					(parseInt(settlement.גיל_65_פלוס) * 100) /
					parseInt(settlement.סהכ)
				).toFixed(1)
			),
			// אחוזי מגזרים
			jews: parseFloat(
				(
					((parseInt(settlement.PepoleNumberJewish.replace(/\D/g, "")) || 0) *
						100) /
					(parseInt(settlement.PepoleNumber.replace(/\D/g, "")) || 0)
				).toFixed(1)
			),
			arabs: parseFloat(
				(
					((parseInt(settlement.PepoleNumberArab.replace(/\D/g, "")) || 0) *
						100) /
					(parseInt(settlement.PepoleNumber.replace(/\D/g, "")) || 0)
				).toFixed(1)
			),
		};
		settlement.percentage.others = parseFloat(
			(
				100 -
				(settlement.percentage.jews + settlement.percentage.arabs)
			).toFixed(1)
		);
	});

	// הסרת תחנות שאין להן ערוצי טמפרטורה
	json4.data = json4.data.filter((o1) =>
		o1.monitors.some((o2) => o2.name === "TD")
	);

	// השארת הפרטים הרלוונטים בלבד - מספר מזהה, שם וקואורדינטות
	let stations = [];
	json4.data.forEach((item) => {
		stations.push({
			id: item.stationId,
			name: item.name,
			latitude: item.location.latitude,
			longitude: item.location.longitude,
		});
	});

	// קבלת קואורדינטות של ישוב ומציאת התחנה המטאורולוגית הקרובה ביותר
	// https://stackoverflow.com/a/71578538/5354360
	function closestLocation(targetLocation, locationData) {
		function vectorDistance(dx, dy) {
			return Math.sqrt(dx * dx + dy * dy);
		}

		function locationDistance(location1, location2) {
			let dx = location1.latitude - location2.latitude,
				dy = location1.longitude - location2.longitude;

			return vectorDistance(dx, dy);
		}

		return locationData.reduce(function (prev, curr) {
			let prevDistance = locationDistance(targetLocation, prev),
				currDistance = locationDistance(targetLocation, curr);
			return prevDistance < currDistance ? prev : curr;
		});
	}

	// עבור כל ישוב
	settlements.forEach((settlement) => {
		// מציאת התחנה המטאורולוגית הקרובה ביותר והוספתה לפרטי הישוב
		settlement.meteorological_station = closestLocation(
			// קואורדינטות הישוב
			{
				latitude: settlement.geometry.y,
				longitude: settlement.geometry.x,
			},
			// קואורדינטות התחנות
			stations
		);
	});

	// תוצאת המיזוג ממויינת לפי סמל ישוב
	// לצורך הרשימה הנפתחת מבוצע מיון לפי שם ישוב
	// שם ישוב ממויין לפי נתוני מגזרים
	// כי בנתוני הגילאים ישנם רווחים מיותרים וסוגרים הפוכים
	// ובנתוני הקואורדינטות חסרים שמות ישובים, כמו סמל ישוב 1342
	settlements.sort((a, b) => {
		if (a.Name < b.Name) {
			return -1;
		}
	});

	res.send({ settlements });
}

// הפונקציות הבאות אינן נצרכות לתוכנית

// רשימת המחוזות
// ["הדרום", "המרכז", "הצפון", "חיפה", "יהודה והשומרון", "ירושלים", "תל אביב"]
export async function loadDistricts(_, res) {
	// פילוח ישובים לפי מגזרים

	// :פילטרים
	// dataMode=Yeshuv
	// dataMode=Artzi
	// filters={"Years":"2021"}
	// filters={"Years":2021,"Subjects":"501"}
	// filtersearch=אריאל
	// pageNumber=1
	// pageNumber=-1
	// search=
	// subject=BaseData
	// subject=LocalAuthorities
	const districts = await axios
		.get(
			`https://boardsgenerator.cbs.gov.il/Handlers/WebParts/YishuvimHandler.ashx?dataMode=Yeshuv&filters={"Years":"2021"}&language=Hebrew&mode=GridData&pageNumber=-1`
		)
		.catch((err) => console.log(err));

	res.send([...new Set(districts.data.Table.map((item) => item.Machoz))]);
}

// רשימת הנפות
// [
// "לא ידוע ",
// "אשקלון ", "באר שבע ", "בית לחם ", "גולן " "ג'נין ", "השרון ", "חברון ", "חדרה ", "חולון ", "חיפה ", "טול כרם ",
// "ירדן )יריחו( ", "ירושלים ", "כנרת ", "נצרת ", "עכו ", "עפולה ", "פתח תקווה ", "צפת ", "ראמאללה ", "רחובות ", "רמלה ", "רמת גן ", "שכם ", "תל אביב "
// ]
export async function loadSubDistricts(_, res) {
	// פילוח ישובים לפי גילאים
	const subDistricts = await axios
		.get(
			`https://data.gov.il/api/3/action/datastore_search?resource_id=64edd0ee-3d5d-43ce-8562-c336c24dbc1f&limit=1500`
		)
		.catch((err) => console.log(err));

	// const array = [
	// 	...new Set(
	// 		subDistricts.data.result.records.map((item) =>
	// 			JSON.stringify({ נפה: item.נפה, סמל_נפה: item.סמל_נפה })
	// 		)
	// 	),
	// ].map((e) => JSON.parse(e));

	const array = [];
	subDistricts.data.result.records.forEach((item) => {
		if (!array.some((e) => e.סמל_נפה === item.סמל_נפה))
			array.push({ נפה: item.נפה, סמל_נפה: item.סמל_נפה });
	});
	res.json({ subDistricts: array });
}

// דוגמה לקבלת שני שדות מבוקשים: שמות הישובים והנפות
export async function loadSettlementsNamesAndSubDistricts(_, res) {
	// פילוח ישובים לפי גילאים
	const settlementsNamesAndSubDistricts = await axios
		.get(
			`https://data.gov.il/api/3/action/datastore_search?resource_id=64edd0ee-3d5d-43ce-8562-c336c24dbc1f&limit=1500`
		)
		.catch((err) => console.log(err));

	let json = [];
	settlementsNamesAndSubDistricts.data.result.records.forEach((item) => {
		json.push({ name: item.שם_ישוב, sub_districts: item.נפה });
	});
	res.json({ settlements: json });
}

// ישובים עם קואורדינטות
// XML
// https://data.gov.il/dataset/828
// JSON
// https://data-israeldata.opendata.arcgis.com/datasets/IsraelData::שמות-יישובים-עם-קואורדינטות/about

export async function loadCoordinates(_, res) {
	fs.readFile(
		"json/שמות_יישובים_עם_קואורדינטות.geojson",
		"utf8",
		function (err, data) {
			if (err) throw err;
			res.send(JSON.parse(data).features);
		}
	);
}

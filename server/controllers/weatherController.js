import axios from "axios";
import e from "cors";

export async function loadWeather(req, res) {
	const station_id = req.params.station_id;
	const date = new Date(req.params.date);
	const yyyy = date.getFullYear();
	const mm = date.getMonth() + 1;
	const dd = date.getDate();

	const weather = await axios
		.get(
			// "https://api.ims.gov.il/v1/envista/regions",
			// "https://api.ims.gov.il/v1/envista/stations", // כל התחנות
			// "https://api.ims.gov.il/v1/envista/stations/178", // תחנה ספציפית
			// `https://api.ims.gov.il/v1/envista/stations/${station_id}/data/daily/2022/12/18`, // תאריך ספציפי
			`https://api.ims.gov.il/v1/envista/stations/${station_id}/data/daily/${yyyy}/${mm}/${dd}`, // תאריך ספציפי
			// "https://api.ims.gov.il/v1/envista/stations/21/data?from=2022/10/28&to=2022/12/18", // טווח תאריכים
			{
				headers: {
					Authorization: process.env.IMS_GOV_IL_AUTHORIZATION,
				},
			}
		)
		// .catch((err) => console.log(err));
		.catch(() => {
			console.log("Error: weather not loaded");
			res.status(400).send("Error: weather not loaded");
		});
	if (!weather || !weather.data || !weather.data.data) return;

	return res.status(200).send({
		celsius_temperature: weather.data.data[
			weather.data.data.length - 1
		].channels.find((c) => c.name === "TD").value,
	});
}

export async function loadStationsCoordinates(req, res) {
	const stations = await axios
		.get("https://api.ims.gov.il/v1/envista/stations", {
			headers: {
				Authorization: process.env.IMS_GOV_IL_AUTHORIZATION,
			},
		})
		// .catch((err) => console.log(err));
		.catch(() => {
			console.log("Error: stations coordinates not loaded");
			res.status(400).send("Error: stations coordinates not loaded");
		});
	if (!stations || !stations.data) return;

	let stations_coordinates = [];
	stations.data.forEach((item) => {
		stations_coordinates.push({
			weather_station_id: item.stationId,
			weather_station_name: item.name,
			weather_station_latitude: item.location.latitude,
			weather_station_longitude: item.location.longitude,
		});
	});
	// res.json({ stations: stations_coordinates });

	// הפונקציה מקבלת קורדינטות של ישוב ומוצאת את התחנה המטראולוגית הקרובה ביותר
	// https://stackoverflow.com/a/71578538/5354360
	function closestLocation(targetLocation, locationData) {
		function vectorDistance(dx, dy) {
			return Math.sqrt(dx * dx + dy * dy);
		}

		function locationDistance(location1, location2) {
			let dx = location1.latitude - location2.weather_station_latitude,
				dy = location1.longitude - location2.weather_station_longitude;

			return vectorDistance(dx, dy);
		}

		return locationData.reduce(function (prev, curr) {
			let prevDistance = locationDistance(targetLocation, prev),
				currDistance = locationDistance(targetLocation, curr);
			return prevDistance < currDistance ? prev : curr;
		});
	}

	let targetLocation = { latitude: 32.0924483, longitude: 35.2101504 };
	let closest = closestLocation(targetLocation, stations_coordinates);

	res.send(closest);
}

// מאגרי נתונים מטאורולוגיים
// https://ims.data.gov.il
// https://ims.gov.il/he/data_gov

// תחנות השירות המטאורולוגי
// https://ims.gov.il/he/stations

// API הסבר על השימוש ב
// https://ims.gov.il/sites/default/files/2020-08/פקודות%20API%20(2).pdf
// https://ims.gov.il/he/ObservationDataAPI

// לפני שהגדרתי זיהוי תחנה מטאורולוגית קרובה ביותר לפי קואורדינטות, הזיהוי התבצע לפי סמל נפה ומספר תחנה

// // ממיר סמל נפה במזהה תחנה מטאורולוגית
// const station_id =
// 	// מזהיי תחנות
// 	[
// 		208, 23, 59, 54, 62, 54, 46, 115, 275, 54, 16, 26, 275, 178, 343, 16, 178,
// 		77, 77, 228, 107, 24, 224, 90, 10,
// 	][
// 		// סמלי נפות
// 		[
// 			61, 11, 62, 53, 21, 44, 32, 22, 41, 43, 23, 31, 42, 51, 24, 25, 52, 77,
// 			76, 75, 73, 74, 71, 72, 29,
// 		].indexOf(parseInt(req.params.sub_districts_symbol))
// 	];

// נפה:לא ידוע		 סמל_נפה:0
// נפה:אשקלון		סמל_נפה:61	stationId:208	name:ASHQELON PORT
// נפה:ירושלים		סמל_נפה:11	stationId:23	name:JERUSALEM CENTRE
// נפה:באר שבע		סמל_נפה:62	stationId:59	name:BEER SHEVA
// נפה:חולון		סמל_נפה:53	stationId:54	name:BET DAGAN				הכי קרוב
// נפה:צפת			סמל_נפה:21	stationId:62	name:ZEFAT HAR KENAAN
// נפה:רחובות		סמל_נפה:44	stationId:54	name:BET DAGAN				הכי קרוב
// נפה:חדרה			סמל_נפה:32	stationId:46	name:HADERA PORT
// נפה:כנרת			סמל_נפה:22	stationId:115	name:LEV KINERET
// נפה:השרון		סמל_נפה:41	stationId:275	name:HAKFAR HAYAROK			הכי קרוב
// נפה:רמלה			סמל_נפה:43	stationId:54	name:BET DAGAN				הכי קרוב
// נפה:עפולה		סמל_נפה:23	stationId:16	name:AFULA NIR HAEMEQ
// נפה:חיפה			סמל_נפה:31	stationId:26	name:HAIFA PORT
// נפה:פתח תקווה	סמל_נפה:42	stationId:275	name:HAKFAR HAYAROK			הכי קרוב
// נפה:תל אביב		סמל_נפה:51	stationId:178	name:TEL AVIV COAST
// נפה:עכו			סמל_נפה:24	stationId:343	name:SHAVE ZIYYON			הכי קרוב
// נפה:נצרת			סמל_נפה:25	stationId:16	name:AFULA NIR HAEMEQ		הכי קרוב
// נפה:רמת גן		סמל_נפה:52	stationId:178	name:TEL AVIV COAST			הכי קרוב
// נפה:חברון		סמל_נפה:77	stationId:77	name:ROSH ZURIM				הכי קרוב
// נפה:בית לחם		סמל_נפה:76	stationId:77	name:ROSH ZURIM				הכי קרוב
// נפה:ירדן )יריחו(	סמל_נפה:75	stationId:228	name:BET HAARAVA			הכי קרוב
// נפה:טול כרם		סמל_נפה:73	stationId:107	name:EN HAHORESH			הכי קרוב
// נפה:ראמאללה		סמל_נפה:74	stationId:24	name:HAR HARASHA			הכי קרוב
// נפה:ג'נין		סמל_נפה:71	stationId:224	name:MAALE GILBOA			הכי קרוב
// נפה:שכם			סמל_נפה:72	stationId:90	name:ITAMAR					הכי קרוב
// נפה:גולן			סמל_נפה:29	stationId:10	name:MEROM GOLAN PICMAN

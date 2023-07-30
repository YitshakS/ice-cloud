import axios from "axios";

const baseUrl = process.env.REACT_APP_PROXY + "/weather";

export async function loadWeather(StationId, selectedDate, setWeather) {
	const weather = await axios
		.get(`${baseUrl}/loadWeather/${StationId}/${selectedDate}`)
		.catch((err) => console.log(err.response.data));
	if (weather) {
		console.log(
			"weather loaded",
			weather.data,
			`${baseUrl}/loadWeather/${StationId}/${selectedDate}`
		);

		if (setWeather) setWeather(weather.data.celsius_temperature);
		return weather.data.celsius_temperature;
	}
}

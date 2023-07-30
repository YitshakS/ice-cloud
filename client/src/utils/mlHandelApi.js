import axios from "axios";

const baseUrl = process.env.REACT_APP_PROXY + "/bigml";

// טעינת חיזוי
export async function loadML(transaction, setPrediction) {
	const prediction = await axios
		.get(`${baseUrl}/loadML/${JSON.stringify(transaction)}`)
		.catch((err) => console.log(err.response.data));
	if (prediction) {
		console.log(
			"prediction loaded",
			prediction.data.prediction,
			`${baseUrl}/loadML/`,
			transaction
		);
		if (setPrediction) setPrediction(prediction.data.prediction);
		return prediction.data.prediction;
	}
}

// שמירת סט אימון
export async function saveML(transactions) {
	// מחיקת הקישור למודל ישן (אם קיים)
	await axios
		.delete(`${baseUrl}/deleteML`, {})
		.catch((err) => console.log(err.response.data));
	console.log("old model deleted");

	// שליחת סט האימון, יצירת מודל חדש ושמירת הקישור למודל החדש
	await axios
		.post(`${baseUrl}/saveML`, transactions)
		.catch((err) => console.log(err.response.data));
	console.log("new model saved");
}

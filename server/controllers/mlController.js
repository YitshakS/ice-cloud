import mlModel from "../models/mlModel.js";
import fs from "fs";
import bigml from "bigml";

// BigML Node.js
// https://github.com/bigmlcom/bigml-node#readme
// https://github.com/bigmlcom/bigml-node/blob/master/docs/index.md

export async function loadML(req, res) {
	// MongoDB טעינת הקישור למודל מ
	const ml = await mlModel.find().catch((err) => {
		console.log(err);
		res.status(400).send("Error: prediction not loaded");
		return;
	});

	if (ml.length === 0) {
		console.log("Error: prediction not loaded");
		return;
	}

	// חיזוי
	const localModel = new bigml.LocalModel(ml[0].model);

	localModel.predict(
		JSON.parse(req.params.transaction),
		(error, prediction) => {
			if (!error) res.send(prediction);
			else res.send(error);
		}
	);

	// console.log("model loaded", ml);
}

export async function deleteML(_, res) {
	await mlModel.deleteMany().catch((err) => console.log(err));
	res.send("model deleted");
	// console.log("model deleted");
}

export async function saveML(req, res) {
	// bigml בפורמט הנתמך ע"י json יש לודא שמבנה ה
	// https://bigml.com/api/sources?id=json-sources

	// לקובץ ושליחתו במקום לשולחם ישירות, כי קובץ מאפשר שליחת כמות גדולה יותר של נתונים json יצוא נתוני ה
	let json2file = req.body;

	// json שמירה כקובץ
	// await fs.promises.writeFile(
	// 	"./tmp/bigml.json",
	// 	JSON.stringify(json2file),
	// 	"utf8",
	// 	(err) => {
	// 		if (err) console.log(err);
	// 	}
	// );

	// לא שומר על סדר העמודות אלא ממיין אותן לפי אלף-בית bigml ה json בשליחת
	// במקור העמודות מסודרות לפי הגיון וכן העמודה האחרונה מוגדרת לחיזוי
	// csv כדי לשמור על הסדר המקורי נמיר ל

	// csv ל json המרת
	// https://stackoverflow.com/a/58769574/5354360
	function convertToCSV(arr) {
		const array = [Object.keys(arr[0])].concat(arr);

		return array
			.map((it) => {
				return Object.values(it).toString();
			})
			.join("\n");
	}

	// csv שמירה כקובץ
	await fs.promises.writeFile(
		"./tmp/bigml.csv",
		convertToCSV(json2file),
		"utf8",
		(err) => {
			if (err) console.log(err);
		}
	);

	// console.log("file created");

	// ויצירת מודל חדש bigml שליחת הקובץ ל
	const connection = new bigml.BigML();
	const source = new bigml.Source(connection);
	const dataset = new bigml.Dataset(connection);
	const model = new bigml.Model(connection);

	source.create("./tmp/bigml.csv", (error, sourceInfo) => {
		if (!error && sourceInfo) {
			dataset.create(sourceInfo, (error, datasetInfo) => {
				if (!error && datasetInfo) {
					model.create(datasetInfo, async (error, modelInfo) => {
						if (!error && modelInfo) {
							// MongoDB שמירת הקישור למודל ב
							// const ml =
							await mlModel
								.create({ model: modelInfo.resource }) // , { ordered: false }
								.catch((err) => console.log(err));
						}
					});
				}
			});
		}
	});

	// console.log("BigML connected");
	// console.log("Error: BigML not connected");

	res.send("model saved");
	// console.log("model saved", ml);
}

/////////////////////////////////////////////////////////////////////////////////////

// import { mquery } from "mongoose";
// import routes from "./routes/routes.js";
// import user from "./routes/User.js";
// import * as bigml from "bigml";
// bigml.import = "bigml";
// app.get("/bigml", (req, res) => {

// const input_data = { "petal length": 2 }
// const prediction = new bigml.Prediction(connection);
// prediction.create(modelInfo, input_data, (_error, prediction) => {
// console.log(
// "prediction.code = ",
// prediction.code, // סטטוס החיזוי
// "\n\n",

// "prediction.object.input_data = ", // קלט החיזוי
// prediction.object.input_data,
// "\n\n",

// "prediction.object.output = ", // פלט החיזוי
// prediction.object.output,
// "\n\n",

// "modelInfo:", // פרטי המודל
// "\n",
// JSON.stringify(modelInfo),
// "\n\n",

// "JSON.stringify(prediction):", // פרטי החיזוי
// "\n",
// JSON.stringify(prediction)
// );
// res.json(prediction);

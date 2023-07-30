import Calendar from "../components/Calendar";
import Languages from "../components/Languages/Languages.json";
import SubmitButton from "../components/SubmitButton/SubmitButton";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ContextLanguages } from "../Contexts/ContextLanguages";
import { ContextSettlements } from "../Contexts/ContextSettlements";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loadBranches } from "../utils/branchesHandelApi";
import { loadDate } from "../utils/dateHandelApi";
import { loadFlavors } from "../utils/flavorsHandelApi";
// import { loadWeather } from "../utils/weatherHandelApi.js";
import { loadML, saveML } from "../utils/mlHandelApi.js";

export default function Predictions() {
	const { selectedLanguage } = useContext(ContextLanguages); // השפה הנבחרת
	const { settlements } = useContext(ContextSettlements); // פרטי הישובים
	const [branches, setBranches] = useState([]); // סניפים
	const [flavors, setFlavors] = useState([]); // טעמים

	const [dateStart, setDateStart] = useState("2022-09-25"); // תאריך תחילת הסימולציה
	const [dateEnd, setDateEnd] = useState("2022-10-25"); // תאריך סוף הסימולציה
	const [isSimulatorRunning, setIsSimulatorRunning] = useState(false); // חסימת כפתור סימולטור בזמן ריצת הסימולטור
	const [transactionsTraining, setTransactionsTraining] = useState([]); // טרנזקציות לאימון שהסימולטור יוצר
	const [transactionTrainingAmount, setTransactionTrainingAmount] = useState(0); // כמות הטרנזקציות שהסימולטור אמור ליצור
	const [transactionTrainingCounter, setTransactionTrainingCounter] =
		useState(0); // כמות הטרנזקציות שהסימולטור יצר עד כה
	const [alert, setAlert] = useState(""); // הודעות התראה כשאין טרנזקציות לשליחה או כשיש הרבה לעיבוד

	const [selectedDate, setSelectedDate] = useState(); // בחירת תאריך לחיזוי
	const [selectedDateJewishData, setSelectedDateJewishData] = useState(); // פרטי התאריך לחיזוי
	const [transactionsPrediction, setTransactionsPrediction] = useState([]); // טרנזקציות עבורן רוצים לנבא את כמות הגלידה

	// השהיה, עבור הצגת והעלמת הודעות התראה
	const delay = (delayInMs) => {
		return new Promise((resolve) => setTimeout(resolve, delayInMs));
	};

	// כמות הטרנזקציות לאימון = כמות הימים * כמות הסניפים * כמות הטעמים
	const daysBetweenDates = useCallback(async () => {
		const days =
			(new Date(dateEnd) - new Date(dateStart)) / (1000 * 60 * 60 * 24) + 1;
		if (!isNaN(days))
			setTransactionTrainingAmount(days * branches.length * flavors.length);

		// התראה על מספר גדול של טרנזקציות
		if (transactionTrainingAmount > 500) {
			setAlert(Languages.many_transactions[selectedLanguage]);
			await delay(9000);
			setAlert("");
		}
	}, [
		branches.length,
		dateEnd,
		dateStart,
		flavors.length,
		selectedLanguage,
		transactionTrainingAmount,
	]);

	// שליחת טרנזקציות האימון שהסימולטור יצר
	const handleSubmitTransactionsForTraining = async (e) => {
		e.preventDefault(); // ביטול ניקוי הטופס לאחר שליחתו

		// אם אין טרנזקציות
		if (transactionsTraining.length === 0) {
			setAlert(Languages.no_transactions[selectedLanguage]); // הצגת התראה
			await delay(9000); // השהיה
			setAlert(""); // מחיקת התראה
		}
		// אחרת שליחת הטרנזקציות למידת המכונה
		else {
			saveML(transactionsTraining);
			console.log("transactions submited", transactionsTraining);
		}
	};

	// שליחת הטרנזקציות עבורן רוצים לנבא את כמות הגלידה
	const handleSubmitTransactionsForPrediction = async (e) => {
		e.preventDefault(); // ביטול ניקוי הטופס לאחר שליחתו
		handleCreateTransactionsForPrediction(); // יצירת הטרנזקציות על פי התאריך שנבחר

		// const aaa = await handleCreateTransactionsSimulatorClicked2();
		// setTransactions2(aaa);
		// console.log("transactions2 before", transactions2);
		// console.log("transactions2 after", transactions2);
		// setPrediction(transactions2[0].weight_kg);
		// saveML(transactions);
		// console.log("transactions submited", transactions);
	};

	// יצירת טרנזקציות לאימון
	const handleCreateTransactionsForTraining = useCallback(async () => {
		// const handleCreateTransactionsSimulatorClicked = async () => {

		setIsSimulatorRunning(true); // חסימת כפתור הרצת הסימולטור
		setTransactionsTraining([]); // איפוס הטרנזקציות המוצגות (אם היו מריצות קודמות)
		let make_transactions = []; // מערך יצירת טרנזקציות

		// const start = new Date("2022-01-01"); // תאריך תחילת הסימולטור
		// const end = new Date("2022-01-03"); // תאריך סוף הסימולטור

		// המתנה לטעינת הישובים, הסניפים והטעמים
		if (settlements.length > 0 && branches.length > 0 && flavors.length > 0) {
			// יצירת טרנזקציות בהתאם לטווח התאריכים הנבחר
			for (
				let d = new Date(dateStart);
				d <= new Date(dateEnd);
				d.setDate(d.getDate() + 1)
			) {
				let transaction = {};

				transaction.year = d.getFullYear(); // שנה
				transaction.month = d.getMonth() + 1; // חודש
				transaction.day_of_month = d.getDate(); // יום בחודש
				transaction.day_of_week = d.getDay() + 1; // יום בשבוע

				const jewishData = await loadDate(d.toISOString().split("T")[0]);
				transaction.hebrew_date = jewishData.hebrew_date; // תאריך עברי
				transaction.percent_business_day = jewishData.business_day; // אחוז יום עסקים
				// transaction.events = JSON.stringify(jewishData.events); // אירועים
				transaction.events = jewishData.events.join(" | "); // אירועים

				// עבור כל סניף
				for (let b = 0; b < branches.length; b++) {
					transaction.branch_name = branches[b].name; // שם
					transaction.branch_owner = branches[b].owner; // בעלים
					transaction.branch_settlement = branches[b].settlement; // ישוב

					const selectedSettlement = settlements.find(
						(itm) => itm.Name === branches[b].settlement
					);

					transaction.meteorological_station_id =
						selectedSettlement.meteorological_station.id; // תחנה מטאורולוגית

					// מזג האויר הוא רק על תאריכים מהעבר עד היום
					// if (d < Date.now()) {
					// 	const weather = await loadWeather(
					// 		transaction.meteorological_station_id,
					// 		d.toISOString().split("T")[0]
					// 	);
					// 	transaction.weather_temperature = weather; // טמפרטורת מזג אויר
					// } else transaction.weather_temperature = null; // csv כדי לשמור על אחידות ביצוא ל

					transaction.percent_age_0_5 = selectedSettlement.percentage.age_0_5; // אחוז גילאי 0 עד 5
					transaction.percent_age_6_18 = selectedSettlement.percentage.age_6_18; // אחוז גילאי 6 עד 18
					transaction.percent_age_19_45 =
						selectedSettlement.percentage.age_19_45; // אחוז גילאי 19 עד 45
					transaction.percent_age_46_55 =
						selectedSettlement.percentage.age_46_55; // אחוז גילאי 46 עד 55
					transaction.percent_age_56_64 =
						selectedSettlement.percentage.age_56_64; // אחוז גילאי 56 עד 64
					transaction.percent_age_65_plus =
						selectedSettlement.percentage.age_65_plus; // אחוז גילאי 65 ומעלה
					transaction.percent_jews = selectedSettlement.percentage.jews; // אחוז יהודים
					transaction.percent_arabs = selectedSettlement.percentage.arabs; // אחוז ערבים
					transaction.percent_others = selectedSettlement.percentage.others; // אחוז אחרים

					// עבור כל טעם
					flavors.forEach((flavor) => {
						transaction.flavor = flavor.name; // שם

						// כדי לבדוק אם למידת המכונה פועלת, הגרלתי את משקל המכירה היומית והכפלתי את התוצאה באחוז יום העבודה
						// כלומר ביום עסקים מלא ימכרו כרגיל, בחצי יום עסקים ימכרו פחות, וביום שאינו עסקים לא ימכרו כלום
						transaction.weight_kg = parseFloat(
							(Math.random() * 100 * transaction.percent_business_day).toFixed(
								1
							)
						);

						make_transactions.push({ ...transaction }); // הוספת הטרנזקציה למערך הטרנזקציות
						setTransactionTrainingCounter(make_transactions.length); // עדכון מונה הטרנזקציות שנוצרו עד כה

						// לא עובד
						// setTransactions((prevTransactions) => [
						// 	...prevTransactions,
						// 	{ ...transaction },
						// ]);
					});
				}
				setTransactionsTraining(make_transactions); // עדכון הטרנזקציות לתצוגה תוך כדי בנייתן
			}
			// כשהבניה מסתיימת
			console.log("transactions", make_transactions);
			// setTransactionsTraining(make_transactions); // עדכון הטרנזקציות לתצוגה
			setIsSimulatorRunning(false); // שחרור כפתור הרצת הסימולטור
		}
	}, [branches, dateEnd, dateStart, flavors, settlements]);

	// יצירת טרנזקציות לניבוי
	const handleCreateTransactionsForPrediction = useCallback(async () => {
		// const handleCreateTransactionsSimulatorClicked2 = async () => {
		//		setIsSimulatorRunning(true); // ביטול כפתור בחירת תאריך
		setTransactionsPrediction([]); // איפוס הטרנזקציות המוצגות (אם היו מריצות קודמות)
		let make_transactions = []; // מערך יצירת טרנזקציות

		// המתנה לטעינת הישובים, הסניפים והטעמים
		if (
			settlements.length > 0 &&
			branches.length > 0 &&
			flavors.length > 0 &&
			Object.keys(selectedDateJewishData).length > 0
		) {
			// יצירת טרנזקציות בהתאם לתאריך הנבחר
			let d = new Date(selectedDate);
			let transaction = {};

			transaction.year = d.getFullYear(); // שנה
			transaction.month = d.getMonth() + 1; // חודש
			transaction.day_of_month = d.getDate(); // יום בחודש
			transaction.day_of_week = d.getDay() + 1; // יום בשבוע

			// const jewishData = await loadDate(d.toISOString().split("T")[0]);
			// transaction.hebrew_date = jewishData.hebrew_date;
			// transaction.percent_business_day = jewishData.business_day;
			// transaction.events = jewishData.events;

			transaction.hebrew_date = selectedDateJewishData.hebrew_date; // תאריך עברי
			transaction.percent_business_day = selectedDateJewishData.business_day; // אחוז יום עסקים
			transaction.events = selectedDateJewishData.events.join(" | ");

			// transaction.events = JSON.stringify(selectedDateJewishData.events); // אירועים
			// console.log(transaction.events);

			// עבור כל סניף
			for (let b = 0; b < branches.length; b++) {
				transaction.branch_name = branches[b].name; // שם
				transaction.branch_owner = branches[b].owner; // בעלים
				transaction.branch_settlement = branches[b].settlement; // ישוב

				const selectedSettlement = settlements.find(
					(itm) => itm.Name === branches[b].settlement
				);

				transaction.meteorological_station_id =
					selectedSettlement.meteorological_station.id; // תחנה מטאורולוגית

				// מזג האויר הוא רק על תאריכים מהעבר עד היום
				// if (d < Date.now()) {
				// 	const weather = await loadWeather(
				// 		transaction.meteorological_station_id,
				// 		d.toISOString().split("T")[0]
				// 	);
				// 	transaction.weather_temperature = weather; // טמפרטורת מזג אויר
				// } else transaction.weather_temperature = null; // csv כדי לשמור על אחידות ביצוא ל

				transaction.percent_age_0_5 = selectedSettlement.percentage.age_0_5; // אחוז גילאי 0 עד 5
				transaction.percent_age_6_18 = selectedSettlement.percentage.age_6_18; // אחוז גילאי 6 עד 18
				transaction.percent_age_19_45 = selectedSettlement.percentage.age_19_45; // אחוז גילאי 19 עד 45
				transaction.percent_age_46_55 = selectedSettlement.percentage.age_46_55; // אחוז גילאי 46 עד 55
				transaction.percent_age_56_64 = selectedSettlement.percentage.age_56_64; // אחוז גילאי 56 עד 64
				transaction.percent_age_65_plus =
					selectedSettlement.percentage.age_65_plus; // אחוז גילאי 65 ומעלה
				transaction.percent_jews = selectedSettlement.percentage.jews; // אחוז יהודים
				transaction.percent_arabs = selectedSettlement.percentage.arabs; // אחוז ערבים
				transaction.percent_others = selectedSettlement.percentage.others; // אחוז אחרים

				let predictions = [];

				// עבור כל טעם
				for (let f = 0; f < flavors.length; f++) {
					// transaction.flavor = flavors[f].name; // שם /////////////////////////////////

					// כדי לבדוק אם למידת המכונה פועלת, הגרלתי את משקל המכירה היומית והכפלתי את התוצאה באחוז יום העבודה
					// transaction.weight_kg = parseFloat(
					// 	(Math.random() * 100 * transaction.percent_business_day).toFixed(1)
					// );

					// הוספת הטרנזקציה למערך הטרנזקציות

					// for (let i = 0; i < transactions2.length; i++) {
					// 	transactions2[i].weight_kg = await loadML(transactions2[i]);
					// }

					// transaction.weight_kg = await loadML({ ...transaction }); // הוספת ניבוי המשקל לטרנזקציה ///////////////////////////

					// setTransactions2((prevTransactions) => [
					// 	...prevTransactions,
					// 	{ ...transaction },
					// ]);

					// make_transactions.push({ ...transaction }); // הוספת הטרנזקציה למערך הטרנזקציות ////////////////////////

					let transaction_to_predict = { ...transaction };
					transaction_to_predict.flavor = flavors[f].name;
					predictions.push({
						flavor: flavors[f].name,
						weight_kg: await loadML({ ...transaction_to_predict }),
					});
					// });
				}
				transaction.predictions = predictions;
				make_transactions.push({ ...transaction });
			}

			console.log("make_transactions2", make_transactions);
			// let arr = [...make_transactions];
			// setTransactionsPrediction([]);
			setTransactionsPrediction([...make_transactions]);
			console.log("transactions2", transactionsPrediction);

			// setIsSimulatorRunning(false);
			// setTransactions2([1, 2, 3]);
			// return make_transactions2;
		}
	}, [
		branches,
		flavors,
		selectedDate,
		selectedDateJewishData,
		settlements,
		transactionsPrediction,
	]);

	useEffect(() => {
		loadFlavors(setFlavors);
		loadBranches(setBranches);
	}, []);

	useEffect(() => {
		daysBetweenDates();
	}, [daysBetweenDates]);

	// כיוון הגרף

	// let selectedDirection = Languages.languages.find(
	// 	(language) => language.name === selectedLanguage
	// ).direction;

	// function chartDirection(arr) {
	// 	if (selectedDirection === "ltr") return arr;
	// 	else return arr.reverse();
	// }

	// const mount = useRef();
	// useEffect(() => {
	// 	if (!mount.current) {
	// 		mount.current = true;
	// 		return;
	// 	}
	// 	handleCreateTransactionsSimulatorClicked();
	// }, [handleCreateTransactionsSimulatorClicked]);

	// useEffect(() => {
	// 	transactions_simulation();
	// });

	return (
		<>
			<h1>
				<span style={{ fontSize: "2rem", fontFamily: "Noto Color Emoji" }}>
					{"\ud83d\udcca"}
				</span>{" "}
				{Languages.predictions[selectedLanguage]}
			</h1>

			<form onSubmit={handleSubmitTransactionsForTraining}>
				<fieldset>
					<legend>
						<h2>{Languages.model_building[selectedLanguage]}</h2>
					</legend>
					<h3>{Languages.start_date[selectedLanguage]}:</h3>{" "}
					<input
						required
						// step="1"
						type="date"
						max={dateEnd}
						onChange={(e) => {
							setDateStart(e.target.value);
							// alert(dateStart);
							// setSelectedDate(e.target.value);
							// handleChangeDate(e);
							// daysBetweenDates();
						}}
						defaultValue={dateStart}
					></input>
					&emsp;
					<h3>{Languages.end_date[selectedLanguage]}:</h3>{" "}
					<input
						required
						// step="1"
						type="date"
						min={dateStart}
						onChange={(e) => {
							setDateEnd(e.target.value);

							// setSelectedDate(e.target.value);
							// handleChangeDate(e);

							// daysBetweenDates();
						}}
						defaultValue={dateEnd}
					></input>
					&emsp;
					<input
						disabled={
							branches.length === 0 ||
							settlements.length === 0 ||
							flavors.length === 0 ||
							isSimulatorRunning
						}
						// disabled
						type="button"
						value={Languages.run_simulator[selectedLanguage]}
						onClick={() => handleCreateTransactionsForTraining()}
					/>
					&emsp;
					<h3>
						{transactionTrainingCounter} / {transactionTrainingAmount}{" "}
						{Languages.progress[selectedLanguage]}:
					</h3>{" "}
					<progress
						id="counter"
						max={transactionTrainingAmount}
						value={transactionTrainingCounter}
					>
						{transactionTrainingCounter}
					</progress>
					{/* שליחת הטרנזקציות */}
					&emsp;
					<SubmitButton />
					{/* התראות */}
					{alert === "" ? (
						""
					) : (
						<>
							&emsp;
							<div className="alert alert-danger">
								<FontAwesomeIcon
									icon={faTriangleExclamation}
									size="xl"
									cursor="pointer"
								/>{" "}
								{alert}
							</div>
						</>
					)}
				</fieldset>
			</form>
			<fieldset>
				<legend>
					<h2>{Languages.training_set[selectedLanguage]}</h2>
				</legend>
				{transactionsTraining === undefined ? (
					""
				) : (
					<div className="table_container">
						<table className="table_content">
							<thead className="aa11">
								<tr>
									<th>Transaction number</th>
									<th>Flavor</th>
									<th>Weight (kg)</th>
									<th>Year</th>
									<th>Month</th>
									<th>Day of month</th>
									<th>Day of week</th>
									<th>Hebrew date</th>
									<th>Events</th>
									<th>Percent business day</th>
									<th>Branch name</th>
									<th>Branch owner</th>
									<th>Branch settlement</th>
									<th>Meteorological station id</th>
									{/* <th>Weather temperature</th> */}
									<th>Percent age 0 5</th>
									<th>Percent age 6 18</th>
									<th>Percent age 19 45</th>
									<th>Percent age 46 55</th>
									<th>Percent age 56 64</th>
									<th>Percent age 65 plus</th>
									<th>Percent jews</th>
									<th>Percent arabs</th>
									<th>Percent others</th>
								</tr>
							</thead>
							<tbody>
								{
									// // transactions === undefined
									// transactions.length < 2 ? (
									// 	<tr>
									// 		<td colSpan="100%">"Loasin"</td>
									// 	</tr>
									// ) : (
									transactionsTraining.map((transaction, index) => {
										return (
											<tr key={index}>
												<td>{index + 1}</td>
												<td>{transaction.flavor}</td>
												<td>{transaction.weight_kg}</td>
												<td>{transaction.year}</td>
												<td>{transaction.month}</td>
												<td>{transaction.day_of_month}</td>
												<td>{transaction.day_of_week}</td>
												<td>{transaction.hebrew_date}</td>
												<td>
													{/* ירידת שורה אחר כל תא */}
													{/* {transaction.events.map((event) => (<div>{event}</div>))} */}

													{/* פסיק אחר כל תא */}
													{/* {transaction.events.join(", ")} */}

													{transaction.events}
												</td>
												<td>{transaction.percent_business_day}</td>
												<td>{transaction.branch_name}</td>
												<td>{transaction.branch_owner}</td>
												<td>{transaction.branch_settlement}</td>
												<td>{transaction.meteorological_station_id}</td>
												{/* <td>{transaction.weather_temperature}</td> */}
												<td>{transaction.percent_age_0_5}</td>
												<td>{transaction.percent_age_6_18}</td>
												<td>{transaction.percent_age_19_45}</td>
												<td>{transaction.percent_age_46_55}</td>
												<td>{transaction.percent_age_56_64}</td>
												<td>{transaction.percent_age_65_plus}</td>
												<td>{transaction.percent_jews}</td>
												<td>{transaction.percent_arabs}</td>
												<td>{transaction.percent_others}</td>
											</tr>
										);
									})
									// )
									// .reverse()
								}
							</tbody>
						</table>
					</div>
				)}
			</fieldset>
			<fieldset>
				<legend>
					<h2>{Languages.predictions[selectedLanguage]}</h2>
				</legend>
				<form
					onSubmit={(e) => {
						handleSubmitTransactionsForPrediction(e);
					}}
				>
					<Calendar
						setSelectedDate={setSelectedDate}
						setSelectedDateJewishData={setSelectedDateJewishData}
					/>
					&emsp;
					<SubmitButton />
				</form>
				{transactionsPrediction.length === 0
					? " "
					: transactionsPrediction.map((transaction, index) => {
							return (
								<div key={index}>
									<h3>{Languages.name[selectedLanguage]}:</h3>{" "}
									<input
										readOnly
										disabled="disabled"
										value={transaction.branch_name}
									/>
									&emsp;
									{/* בעלים */}
									<h3>{Languages.owner[selectedLanguage]}:</h3>{" "}
									<input
										readOnly
										disabled="disabled"
										value={transaction.branch_owner}
									/>
									&emsp;
									{/* ישוב */}
									<h3>{Languages.settlement[selectedLanguage]}:</h3>{" "}
									<input
										disabled="disabled"
										readOnly
										value={transaction.branch_settlement}
									/>
									{/* &emsp;
									<h3>{Languages.flavor[selectedLanguage]}:</h3>{" "}
									<input
										size="60"
										disabled="disabled"
										readOnly
										value={JSON.stringify(transaction.predictions)}
									/> */}
									<div className="chart">
										<h3>{Languages.weight[selectedLanguage]}:</h3>{" "}
										{/* גרף מעגל */}
										<ReactApexChart
											type="donut"
											height={250}
											width={200}
											options={{
												dataLabels: {
													style: {
														fontFamily: "inherit",
														fontSize: "10px",
														fontWeight: "normal",
													},
												},
												labels: transaction.predictions.map(
													(flavor) => flavor.flavor
												),
												legend: {
													fontFamily: "inherit",
													fontSize: "10px",
													horizontalAlign: "right",
													position: "bottom",
												},
												plotOptions: {
													pie: {
														donut: {
															size: "40%",
														},
													},
												},
											}}
											series={transaction.predictions.map(
												(flavor) => flavor.weight_kg
											)}
										/>{" "}
										{/* גרף קווים */}
										<ReactApexChart
											type="bar"
											height={233}
											width={350}
											options={{
												dataLabels: {
													// style: {
													// 	fontFamily: "inherit",
													// 	fontSize: "10px",
													// 	fontWeight: "normal",
													// },
												},
												labels:
													// chartDirection([
													transaction.predictions.map(
														(flavor1) => flavor1.flavor
													),
												// ]),
												legend: {
													show: false,
												},
												plotOptions: {
													bar: {
														columnWidth: "85%",
														distributed: true,
													},
												},
												xaxis: {
													labels: {
														style: {
															fontFamily: "inherit",
															// fontSize: "10px",
														},
													},
												},
												yaxis: {
													// min: 0,
													max: 100,
													// tickAmount: 10,
													labels: {
														style: {
															fontFamily: "inherit",
														},
													},
												},
											}}
											series={[
												{
													data:
														// chartDirection([
														transaction.predictions.map(
															(flavor1) => flavor1.weight_kg
														),
													// ]),
												},
											]}
										/>{" "}
										<h3>{Languages.kilogram[selectedLanguage]}</h3>
										<br />
										<br />
										<br />
									</div>
								</div>
							);
					  })}
			</fieldset>
		</>
	);
}
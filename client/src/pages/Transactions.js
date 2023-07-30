import Calendar from "../components/Calendar";
import Languages from "../components/Languages/Languages.json";
import SubmitButton from "../components/SubmitButton/SubmitButton";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ContextLanguages } from "../Contexts/ContextLanguages";
import { ContextSettlements } from "../Contexts/ContextSettlements";
import { loadBranches } from "../utils/branchesHandelApi";
import { loadFlavors } from "../utils/flavorsHandelApi";
import {
	deleteOneTransaction,
	loadTransactions,
	saveOneTransaction,
} from "../utils/transactionsHandelApi";
import { loadWeather } from "../utils/weatherHandelApi";

// import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

// אייקונים להוספת והסרת שדה
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function Transactions() {
	const { selectedLanguage } = useContext(ContextLanguages);
	const { settlements } = useContext(ContextSettlements);

	const [branch, setBranch] = useState([]);
	const [flavor, setFlavor] = useState([]);
	const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
	const [selectedDate, setSelectedDate] = useState();
	const [selectedDateJewishData, setSelectedDateJewishData] = useState();
	const [selectedFlavorIndex, setSelectedFlavorIndex] = useState(0);
	const [weather, setWeather] = useState(0);
	const [weight, setWeight] = useState("");
	const [transactions, setTransactions] = useState([]);

	// modal
	const [modalBody, setModalBody] = useState();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	function handleShow(modalBody) {
		setModalBody(modalBody);
		setShow(true);
	}

	// כיווני הגרפים
	let selectedDirection = Languages.languages.find(
		(language) => language.name === selectedLanguage
	).direction;

	function chartDirection(arr) {
		if (selectedDirection === "ltr") return arr;
		else return arr.reverse();
	}

	// const [transaction, setTransaction] = useState(
	// {
	// flavor: "", weight_g: ""
	// year: "", month: "", day_of_month: "", day_of_week: "", hours: "", minutes: "", seconds: "", events: "", percent_business_day: "",
	// branch_name: "", branch_owner: "", branch_settlement: "", meteorological_station_id,
	// weather_temperature: "",
	// percent_age_0_5: "", percent_age_6_18: "", percent_age_19_45: "", percent_age_46_55: "", percent_age_56_64: "", percent_age_65_plus: "",
	// percent_arabs: "", percent_jews: "" percent_others: "",
	// }
	// );

	const handleSubmitTransaction = async (e) => {
		e.preventDefault(); // ביטול ניקוי טופס שנלשח

		let transaction = {};

		// הוספת השדות מהטופס לטרנזקציה
		transaction.flavor = flavor[selectedFlavorIndex - 1].name; // טעם
		transaction.weight_g = parseFloat(weight); // כמות גרם

		const date = new Date(selectedDate);
		transaction.year = date.getFullYear(); // שנה לועזית
		transaction.month = date.getMonth() + 1; // חודש לועזי
		transaction.day_of_month = date.getDate(); // יום בחודש לועזי
		transaction.day_of_week = date.getDay() + 1; // יום בשבוע
		transaction.hours = date.getHours(); // שעה
		transaction.minutes = date.getMinutes(); // דקה
		transaction.seconds = date.getSeconds(); // שניה

		transaction.hebrew_date = selectedDateJewishData.hebrew_date; // תאריך עברי - לפרק ליום, חודש, שנה
		transaction.events = selectedDateJewishData.events; // jewish_events ארועים - לשנות ל
		transaction.percent_business_day = selectedDateJewishData.business_day; // יום עסקים

		transaction.branch_name = branch[selectedBranchIndex - 1].name;
		transaction.branch_owner = branch[selectedBranchIndex - 1].owner;
		transaction.branch_settlement = branch[selectedBranchIndex - 1].settlement;

		const selectedSettlement = settlements.find(
			(itm) => itm.Name === branch[selectedBranchIndex - 1].settlement // + " " // אם משתמשים בשדה שם_ישוב צריך להוסיף רווח
		);

		transaction.meteorological_station_id =
			selectedSettlement.meteorological_station.id;

		transaction.weather_temperature = weather; // טמפרטורת מזג אוויר

		transaction.percent_age_0_5 = selectedSettlement.percentage.age_0_5; // אחוז גילאי 0 עד 5
		transaction.percent_age_6_18 = selectedSettlement.percentage.age_6_18; // אחוז גילאי 6 עד 18
		transaction.percent_age_19_45 = selectedSettlement.percentage.age_19_45; // אחוז גילאי 19 עד 45
		transaction.percent_age_46_55 = selectedSettlement.percentage.age_46_55; // אחוז גילאי 46 עד 55
		transaction.percent_age_56_64 = selectedSettlement.percentage.age_56_64; // אחוז גילאי 56 עד 64
		transaction.percent_age_65_plus = selectedSettlement.percentage.age_65_plus; // אחוז גילאי 65 ומעלה
		transaction.percent_jews = selectedSettlement.percentage.jews; // אחוז יהודים
		transaction.percent_arabs = selectedSettlement.percentage.arabs; // אחוז ערבים
		transaction.percent_others = selectedSettlement.percentage.others; // אחוז אחרים

		console.log("transaction submited", transaction);

		// שמירת הטרנזקציה
		saveOneTransaction(transaction);

		// טעינת הטרנזקציות לרענון הטבלה ולבדיקה שהטרנזקציה נקלטה
		// אפשר לשפר, לטעון רק את הטרנזקציה האחרונה, ולהוסיף אותה לטבלה הקיימת
		loadTransactions(setTransactions);
	};

	const handleDeleteTransaction = async (transaction_id) => {
		deleteOneTransaction(transaction_id);

		// טעינת הטרנזקציות לרענון הטבלה ולבדיקה שהטרנזקציה נמחקה
		// אפשר לשפר, למחוק ישירות מהטבלה, אבל צריך לודא שהיא נמחקה גם מבסיס הנתונים
		loadTransactions(setTransactions);
	};

	useEffect(() => {
		loadBranches(setBranch);
		loadFlavors(setFlavor);
		loadTransactions(setTransactions);
	}, []);

	const mount = useRef(true);
	useEffect(() => {
		if (mount.current) {
			// componentDidMount
			mount.current = false;
		} else {
			// componentDidUpdate
			// אם נטענה רשימת הישובים ונבחר סניף ונבחר תאריך
			if (
				settlements !== undefined &&
				selectedBranchIndex !== 0 &&
				selectedDate
			) {
				// טעינת טמפרטורת מזג האוויר
				const station_id = settlements.find(
					(itm) => itm.Name === branch[selectedBranchIndex - 1].settlement
				).meteorological_station.id;

				loadWeather(station_id, selectedDate, setWeather);
			} else setWeather(0);
		}
	}, [branch, selectedBranchIndex, selectedDate, settlements]);

	useEffect(() => {
		// הזזת פסי הגלילה של טבלת העסקאות לתחילת הטבלה
		// const table_container =
		// 	document.getElementsByClassName("table_container")[0];
		// table_container.scrollTop = table_container.scrollHeight;
		// table_container.scrollLeft = -table_container.scrollWidth;
		//
		// ניסיון לסדר את הכותרת הדביקה במקום
		// const thead = table_container.getElementsByTagName("thead")[0];
		// thead.style.position = "sticky";
		// thead.style.top =
		// 	Math.abs(
		// 		-table_container.scrollHeight +
		// 			table_container.clientHeight +
		// 			table_container.clientHeight
		// 	).toString() + "px";
		// table_container.scrollTop = 144;
		// table_container.scrollLeft = -1086;
		// console.log(table_container.clientHeight);
		// console.log(table_container.offsetHeight);
		// console.log(table_container.scrollHeight);
		// console.log(table_container.clientWidth);
		// console.log(table_container.offsetWidth);
		// console.log(table_container.scrollWidth);
	});

	return (
		<>
			<h1>
				{/* כותרת עמוד*/}
				<span style={{ fontSize: "2rem", fontFamily: "Noto Color Emoji" }}>
					{"\ud83d\udcb3"}
				</span>{" "}
				{Languages.transactions[selectedLanguage]}
			</h1>
			{/* טופס */}
			<form
				// autoComplete="off"
				// className="App"
				// id="form"
				onSubmit={(e) => handleSubmitTransaction(e)}
			>
				<fieldset>
					<legend>
						<h2>{Languages.manual_update[selectedLanguage]}</h2>
					</legend>
					{/* בחירת טעם */}
					<h2>{Languages.flavors[selectedLanguage]}</h2>
					<h3>{Languages.name[selectedLanguage]}:</h3>{" "}
					<select
						required
						defaultValue=""
						name="flavor"
						onChange={(e) => setSelectedFlavorIndex(e.target.selectedIndex)}
					>
						<option
							// disabled
							hidden // style={{ display: "none" }}
							value="" // selected
						>
							{Languages.name[selectedLanguage]}
						</option>
						{flavor.map((itm, index) => (
							<option key={index}>{itm.name}</option>
						))}
					</select>
					&emsp;
					{/* בחירת משקל */}
					<h3>{Languages.weight[selectedLanguage]}:</h3>{" "}
					<input
						min="0.1"
						step="0.1"
						required
						type="number"
						onChange={(e) => setWeight(e.target.value)}
					/>{" "}
					<h3>{Languages.gram[selectedLanguage]}</h3>
					<br />
					<br />
					{/* בחירת סניף */}
					<h2>{Languages.branches[selectedLanguage]}</h2>
					<h3>{Languages.name[selectedLanguage]}:</h3>{" "}
					<select
						defaultValue=""
						name="branch"
						required
						// כשנבחר סניף עדכון אינדקס הסניף בהתאם
						onChange={(e) => setSelectedBranchIndex(e.target.selectedIndex)}
					>
						<option
							// disabled
							hidden // style={{ display: "none" }}
							value="" // selected
						>
							{Languages.name[selectedLanguage]}
						</option>
						{branch.map((itm, index) => (
							<option key={index}>{itm.name}</option>
						))}
					</select>
					&emsp;
					{/* בעלים */}
					<h3>{Languages.owner[selectedLanguage]}:</h3>{" "}
					<input
						readOnly
						disabled="disabled"
						value={
							// אם לא נבחר סניף
							selectedBranchIndex === 0
								? ""
								: branch[selectedBranchIndex - 1].owner
						}
					/>
					&emsp;
					{/* ישוב */}
					<h3>{Languages.settlement[selectedLanguage]}:</h3>{" "}
					<input
						disabled="disabled"
						readOnly
						value={
							// אם לא נבחר סניף
							selectedBranchIndex === 0
								? ""
								: branch[selectedBranchIndex - 1].settlement
						}
					/>
					<br />
					<br />
					{/* בחירת תאריך */}
					<h2>{Languages.date[selectedLanguage]}</h2>
					<Calendar
						setSelectedDate={setSelectedDate}
						setSelectedDateJewishData={setSelectedDateJewishData}
					/>
					<br />
					<br />
					<h2>{Languages.weather[selectedLanguage]}</h2>
					{/* מספר תחנה מטאורולוגית */}
					<h3>{Languages.meteorological_station_id[selectedLanguage]}:</h3>{" "}
					<input
						readOnly
						disabled="disabled"
						value={
							// אם לא נבחר סניף
							selectedBranchIndex === 0 || settlements === undefined
								? ""
								: settlements.find(
										(itm) =>
											itm.Name === branch[selectedBranchIndex - 1].settlement
								  ).meteorological_station.id
						}
					/>
					&emsp;
					{/* מקום תחנה מטאורולוגית */}
					<h3>
						{Languages.meteorological_station_location[selectedLanguage]}:
					</h3>{" "}
					<input
						readOnly
						disabled="disabled"
						value={
							// אם לא נבחר סניף
							selectedBranchIndex === 0 || settlements === undefined
								? ""
								: settlements.find(
										(itm) =>
											itm.Name === branch[selectedBranchIndex - 1].settlement
								  ).meteorological_station.name
						}
					/>
					&emsp;
					<h3>{Languages.temperature[selectedLanguage]}:</h3>{" "}
					<input readOnly disabled="disabled" value={weather} />
					{" \u2103"}
					<br />
					<br />
					{/* שליחת הטופס */}
					<SubmitButton />
				</fieldset>
			</form>
			<fieldset>
				<legend>
					<h2>{Languages.all_transactions[selectedLanguage]}</h2>
				</legend>
				{transactions === undefined ? (
					""
				) : (
					<div className="table_container">
						<table className="table_content">
							<thead className="aa11">
								<tr>
									<th></th>
									<th>Transaction ID</th>
									<th>Flavor</th>
									<th>Weight (g)</th>
									<th>Year</th>
									<th>Month</th>
									<th>Day of month</th>
									<th>Day of week</th>
									<th>Hours</th>
									<th>Minutes</th>
									<th>Seconds</th>
									<th>Hebrew date</th>
									<th>Events</th>
									<th>Percent business day</th>
									<th>Branch name</th>
									<th>Branch owner</th>
									<th>Branch settlement</th>
									<th>Meteorological station id</th>
									<th>Weather temperature</th>
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
								{transactions
									.map((transaction) => {
										return (
											<tr
												onClick={() => handleShow(transaction)}
												// onClick={() => alert(JSON.stringify(transaction))}
												key={transaction._id}
											>
												<td>
													<FontAwesomeIcon
														icon={faCircleXmark}
														size="xl"
														color="red"
														cursor="pointer"
														onClick={() =>
															handleDeleteTransaction(transaction._id)
														}
													/>
												</td>
												<td>{transaction._id}</td>
												<td>{transaction.flavor}</td>
												<td>{transaction.weight_g}</td>
												<td>{transaction.year}</td>
												<td>{transaction.month}</td>
												<td>{transaction.day_of_month}</td>
												<td>{transaction.day_of_week}</td>
												<td>{transaction.hours}</td>
												<td>{transaction.minutes}</td>
												<td>{transaction.seconds}</td>
												<td>{transaction.hebrew_date}</td>
												<td>
													{/* ירידת שורה אחר כל תא */}
													{/* {transaction.events.map((event) => (<div>{event}</div>))} */}

													{/* פסיק אחר כל תא */}
													{transaction.events.join(", ")}
												</td>
												<td>{transaction.percent_business_day}</td>
												<td>{transaction.branch_name}</td>
												<td>{transaction.branch_owner}</td>
												<td>{transaction.branch_settlement}</td>
												<td>{transaction.meteorological_station_id}</td>
												<td>{transaction.weather_temperature}</td>
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
									.reverse()}
							</tbody>
						</table>
					</div>
				)}
			</fieldset>
			{/* <Modal
				// show={showName} onHide={close}
				show={true}
			>
				<Modal.Header closeButton>
					<Modal.Title>Set Name</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<span>
						<Form.Control
							type="text"
							// By binding the value of "tmpName" to the "value" prop
							// You make sure that the Form.Control never gets out-of-sync with "tmpName".
							value={tmpName}
							onChange={(event) => setTmpName(event.target.value)}
						/>
					</span>
				</Modal.Body>
				<Modal.Footer>{buttons}</Modal.Footer>
			</Modal> */}
			{/* <div
				className="modal show"
				style={{ display: "block", position: "initial" }}
			>
				<Modal.Dialog>
					<Modal.Header closeButton>
						<Modal.Title>Modal title</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<p>Modal body text goes here.</p>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary">Close</Button>
						<Button variant="primary">Save changes</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</div> */}
			{/* <Button variant="primary" onClick={handleShow}>
				Launch demo modal
			</Button> */}

			{modalBody !== undefined && (
				<Modal show={show} onHide={handleClose} size="lg">
					<Modal.Header closeButton>
						<Modal.Title>Drill down</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h3>Transaction ID:</h3> {modalBody._id}
						{/* <input readOnly disabled="disabled" value={modalBody._id} /> */}
						{/* <span className="disabled_input">{modalBody._id}</span>  */}
						<br />
						<h3>Flavor:</h3> {modalBody.flavor}
						&emsp;<h3>Weight (g):</h3> {modalBody.weight_g}
						<br />
						<h3>Year:</h3> {modalBody.year}&emsp;
						<h3>Month:</h3> {modalBody.month}&emsp;
						<h3>Day of month:</h3> {modalBody.day_of_month}&emsp;
						<h3>Day of week:</h3> {modalBody.day_of_week}&emsp;
						<br />
						<h3>Hours:</h3> {modalBody.hours}&emsp;
						<h3>Minutes:</h3> {modalBody.minutes}&emsp;
						<h3>Seconds:</h3> {modalBody.seconds}&emsp;
						<br />
						<h3>Hebrew date:</h3> {modalBody.hebrew_date}&emsp;
						{/* פסיק אחר כל תא */}
						<h3>Events:</h3> {modalBody.events.join(", ")}&emsp;
						{/* ירידת שורה אחר כל תא */}
						{/* {transaction.events.map((event) => (<div>{event}</div>))} */}
						<h3>Percent business day:</h3> {modalBody.percent_business_day}
						<br />
						<h3>Branch name:</h3>&emsp;
						{modalBody.branch_name}&emsp;
						<h3>Branch owner:</h3> {modalBody.branch_owner}&emsp;
						<h3>Branch settlement:</h3> {modalBody.branch_settlement}
						<br />
						<h3>Meteorological station id:</h3>{" "}
						{modalBody.meteorological_station_id}&emsp;
						<h3>Weather temperature:</h3> {modalBody.weather_temperature}
						<br />
						{/* Percent age 0 5 {modalBody.percent_age_0_5}
						Percent age 6 18 {modalBody.percent_age_6_18}
						Percent age 19 45 {modalBody.percent_age_19_45}
						Percent age 46 55 {modalBody.percent_age_46_55}
						Percent age 56 64 {modalBody.percent_age_56_64}
						Percent age 65 plus {modalBody.percent_age_65_plus}
						Percent jews {modalBody.percent_jews}
						Percent arabs {modalBody.percent_arabs}
						Percent others {modalBody.percent_others} */}
						<>
							<br />
							<div className="chart">
								<h3>{Languages.ages[selectedLanguage]}:</h3>{" "}
								{/* גילאים - גרף מעגל */}
								<ReactApexChart
									type="donut"
									height={250}
									width={200}
									options={{
										// colors: [
										// 	"rgb(255, 99, 132)",
										// 	"rgb(54, 162, 235)",
										// 	"rgb(255, 205, 86)",
										// ],
										dataLabels: {
											style: {
												fontFamily: "inherit",
												fontSize: "10px",
												fontWeight: "normal",
											},
										},
										labels: [
											"0 - 5",
											"6 - 18",
											"19 - 45",
											"46 - 55",
											"56 - 64",
											"65+",
										],
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
									series={[
										modalBody.percent_age_0_5,
										modalBody.percent_age_6_18,
										modalBody.percent_age_19_45,
										modalBody.percent_age_46_55,
										modalBody.percent_age_56_64,
										modalBody.percent_age_65_plus,
									]}
								/>{" "}
								{/* גילאים - גרף קווים */}
								<ReactApexChart
									type="bar"
									height={233}
									width={350}
									options={{
										dataLabels: {
											style: {
												fontFamily: "inherit",
												fontSize: "10px",
												fontWeight: "normal",
											},
										},
										labels: [
											"0 - 5",
											"6 - 18",
											"19 - 45",
											"46 - 55",
											"56 - 64",
											"65+",
										],
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
													fontSize: "10px",
												},
											},
										},
										yaxis: {
											labels: {
												style: {
													fontFamily: "inherit",
												},
											},
										},
									}}
									series={[
										{
											data: [
												modalBody.percent_age_0_5,
												modalBody.percent_age_6_18,
												modalBody.percent_age_19_45,
												modalBody.percent_age_46_55,
												modalBody.percent_age_56_64,
												modalBody.percent_age_65_plus,
											],
										},
									]}
								/>
								<br />
								<h3>{Languages.sectors[selectedLanguage]}:</h3>{" "}
								{/* סקטור - גרף מעגל */}
								<ReactApexChart
									type="donut"
									height={250}
									width={203}
									options={{
										dataLabels: {
											style: {
												fontFamily: "inherit",
												fontSize: "10px",
												fontWeight: "normal",
											},
										},
										labels: chartDirection([
											Languages.jews[selectedLanguage],
											Languages.arabs[selectedLanguage],
											Languages.others[selectedLanguage],
										]),
										legend: {
											fontFamily: "inherit",
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
									series={chartDirection([
										modalBody.percent_jews,
										modalBody.percent_arabs,
										modalBody.percent_others,
									])}
								/>{" "}
								{/* סקטור - גרף קווים */}
								<ReactApexChart
									type="bar"
									height={242}
									width={225}
									options={{
										dataLabels: {
											style: {
												fontFamily: "inherit",
												fontSize: "10px",
												fontWeight: "normal",
											},
										},
										labels: chartDirection([
											Languages.jews[selectedLanguage],
											Languages.arabs[selectedLanguage],
											Languages.others[selectedLanguage],
										]),
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
												},
											},
										},
										yaxis: {
											labels: {
												style: {
													fontFamily: "inherit",
												},
											},
										},
									}}
									series={[
										{
											data: chartDirection([
												modalBody.percent_jews,
												modalBody.percent_arabs,
												modalBody.percent_others,
											]),
										},
									]}
								/>
							</div>
						</>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			)}
		</>
	);
}
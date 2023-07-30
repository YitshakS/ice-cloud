import { ContextLanguages } from "../Contexts/ContextLanguages"; // שפה נבחרת
import { loadDate } from "../utils/dateHandelApi"; // תאריך עברי ומידע לגביו
import Languages from "./Languages/Languages.json"; // שפות
import React, { useState, useContext, useEffect, useRef } from "react";

export default function Calendar(props) {
	const { selectedLanguage } = useContext(ContextLanguages); // שפה נבחרת
	const [selectedDate, setSelectedDate] = useState(); // Date.now() // new Date()
	const [selectedDateJewishData, setSelectedDateJewishData] = useState({});

	const mounted = useRef();
	useEffect(() => {
		if (!mounted.current) {
			// do componentDidMount logic
			mounted.current = true;
		} else {
			// do componentDidUpdate logic
			props.setSelectedDate(selectedDate);
			props.setSelectedDateJewishData(selectedDateJewishData);
		}
	});

	const handleChangeDate = (e) => {
		// e.target.valueAsDate.getDay() + 1;
		const date = e.target.value;
		// אם התאריך חוקי
		if (date)
			// טעינת התאריך העברי והמידע לגביו
			loadDate(date, setSelectedDateJewishData);
	};

	return (
		<>
			{/* בחירת תאריך */}
			<h3>{Languages.gregorian_date[selectedLanguage]}:</h3>{" "}
			<input
				required
				step="1"
				type="datetime-local"
				onChange={(e) => {
					setSelectedDate(e.target.value);
					handleChangeDate(e);
				}}
			></input>
			&emsp;
			{/* תאריך עברי */}
			<h3>{Languages.hebrew_date[selectedLanguage]}:</h3>{" "}
			<input
				disabled="disabled"
				readOnly
				value={
					selectedDateJewishData.hebrew_date === undefined
						? ""
						: selectedDateJewishData.hebrew_date
				}
			/>
			&emsp;
			{/* יום עסקים */}
			<h3>{Languages.business_day[selectedLanguage]}:</h3>{" "}
			<input
				disabled="disabled"
				readOnly
				value={
					(selectedDateJewishData.business_day === 0 &&
						Languages.no[selectedLanguage]) ||
					(selectedDateJewishData.business_day === 0.5 &&
						Languages.half[selectedLanguage]) ||
					(selectedDateJewishData.business_day === 1 &&
						Languages.full[selectedLanguage])
				}
			/>
			&emsp;
			{/* אירועים */}
			<h3>{Languages.events[selectedLanguage]}:</h3>&nbsp;
			<span className="disabled_input">
				{selectedDateJewishData.events &&
					selectedDateJewishData.events.join(", ")}
			</span>
		</>
	);
}

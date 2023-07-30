import "./SubmitButton.css";

import Languages from "../Languages/Languages.json";
import React, { useContext, useState } from "react";
import { ContextLanguages } from "../../Contexts/ContextLanguages";

export default function SubmitButton() {
	const { selectedLanguage } = useContext(ContextLanguages);

	// אנימצית כפתור שלח טופס
	const [btnSubmitStyle, setBtnSubmitStyle] = useState({ btnSubmitStyle: "" });
	const handleSubmit = (e) => {
		// בדיקה שהטופס שנלח תקין
		if (e.target.form.checkValidity()) {
			// הפעלת השליחה
			e.target.form.dispatchEvent(new Event("submit"));
		} else return;

		setBtnSubmitStyle("onclic"); // אנימציית עיגול
		setTimeout(() => {
			setBtnSubmitStyle("validate"); // אנימציית התקבל
			setTimeout(() => {
				setBtnSubmitStyle(""); // ביטול האנימציות
			}, 1250);
		}, 2500);
	};

	return (
		<>
			<button
				id="button"
				type="submit"
				className={`btn-submit ${btnSubmitStyle}`}
				after={Languages.send[selectedLanguage]}
				onClick={(e) => {
					handleSubmit(e);
				}}
			></button>
		</>
	);
}

// bootstrap עיצוב
// import "bootstrap/dist/css/bootstrap.min.css";
// import Form from "react-bootstrap/Form";

import { loadFlavors, saveFlavors } from "../utils/flavorsHandelApi";

import React, { useContext, useEffect, useState } from "react";

import Branch from "../components/Branch";

// שפות
import Languages from "../components/Languages/Languages.json";
import { ContextLanguages } from "../Contexts/ContextLanguages";

// אייקונים להוספת והסרת שדה
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import SubmitButton from "../components/SubmitButton/SubmitButton";

export default function Settings() {
	const { selectedLanguage } = useContext(ContextLanguages); // טעינת השפה שנבחרה

	const [flavors, setFlavors] = useState([
		// { name: "וניל" },
		// { name: "שוקולד" },
	]);

	// שליחת טעמים
	const handleSubmitFlavors = (e) => {
		e.preventDefault(); // ביטול ניקוי הטופס לאחר שליחתו
		saveFlavors(flavors);
		console.log("flavors submited", { flavors });
	};

	// הוספת טעם
	const addFlavor = () => {
		let flavor = {
			name: "",
		};
		setFlavors([...flavors, flavor]);
	};

	// שינוי טעם
	const handleFlavorChange = (element, index) => {
		let flavor = [...flavors];
		flavor[index][element.target.name] = element.target.value;
		setFlavors(flavor);
	};

	// מחיקת טעם
	const removeFlavor = (index) => {
		let data = [...flavors];
		data.splice(index, 1);
		setFlavors(data);
	};

	useEffect(() => {
		// טעינת טעמים
		loadFlavors(setFlavors);
	}, []);

	///////////////////////////

	// const handleSubmit = (e) => {
	// 	e.preventDefault(); // ביטול ניקוי הטופס לאחר שליחתו
	// 	console.log("Submit");
	// };

	return (
		<>
			<h1>
				<span style={{ fontSize: "2rem", fontFamily: "Noto Color Emoji" }}>
					{"\u2699\ufe0f"}
				</span>{" "}
				{Languages.settings[selectedLanguage]}
			</h1>
			<form onSubmit={handleSubmitFlavors}>
				<fieldset>
					<legend>
						<h2>{Languages.flavors[selectedLanguage]}</h2>
					</legend>
					{flavors.map((form, index) => {
						return (
							<div key={index}>
								<FontAwesomeIcon
									icon={faCircleXmark}
									size="xl"
									color="red"
									cursor="pointer"
									onClick={() => removeFlavor(index)}
								/>
								&emsp;
								<h3>{Languages.flavor[selectedLanguage]}:</h3>{" "}
								<input
									required
									name="name"
									placeholder={Languages.flavor[selectedLanguage]}
									onChange={(element) => handleFlavorChange(element, index)}
									value={form.name}
								/>
							</div>
						);
					})}
					<FontAwesomeIcon
						icon={faCirclePlus}
						size="xl"
						color="green"
						cursor="pointer"
						onClick={addFlavor}
					/>
					<br />
					<br />
					<SubmitButton />
				</fieldset>
			</form>
			<Branch />
		</>
	);
}

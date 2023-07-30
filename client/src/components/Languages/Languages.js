import languagesJson from "./Languages.json";
import React, { useContext } from "react";
import { ContextLanguages } from "../../Contexts/ContextLanguages";
import "./Language.css";

export default function LanguageSelect() {
	const { setSelectedLanguage } = useContext(ContextLanguages);
	return (
		<div className="language">
			<select
				onChange={(e) => {
					setSelectedLanguage(e.target.value);
				}}
			>
				{/* {languages.lang.map((element) => (
					<option key={element[0]} value={element}>
						{element[0]} {element[2]}
					</option>
				))} */}
				{languagesJson.languages.map((element) => (
					<option key={element.name} value={element.name}>
						{element.name} {element.flag_emoji}
					</option>
				))}

				{/* {languagesJson.languages2.map((element) => (
					<option key={element.name} value={element.name}>
						{element.name} {element.flag_emoji}
					</option>
				))} */}
			</select>
		</div>
	);
}

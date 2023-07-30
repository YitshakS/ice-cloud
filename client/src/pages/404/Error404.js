import error from "./../../images/404.png";
import "./Error404.css";
import Languages from "../../components/Languages/Languages.json";
import React, { useContext } from "react";
import { ContextLanguages } from "../../Contexts/ContextLanguages";

export default function Error404() {
	const { selectedLanguage } = useContext(ContextLanguages);
	return (
		<div className="error404">
			<h1
				dangerouslySetInnerHTML={{
					__html: Languages.error_404[selectedLanguage],
				}}
			></h1>
			<img src={error} alt={"error 404 page not found"} />
		</div>
	);
}

import logo from "./../images/logo.gif";
import Languages from "../components/Languages/Languages.json";
import React, { useContext } from "react";
import { ContextLanguages } from "../Contexts/ContextLanguages";

export default function Home() {
	const { selectedLanguage } = useContext(ContextLanguages);
	return (
		<div className="home">
			<h1
				dangerouslySetInnerHTML={{
					__html: Languages.site_name[selectedLanguage],
				}}
			></h1>
			<img src={logo} alt={"home page"} />
			<br />
			<br />
			<div
				dangerouslySetInnerHTML={{
					__html: Languages.site_description[selectedLanguage],
				}}
			></div>
			<br />
			<br />
		</div>
	);
}

import "./NavBar.css";
import Languages from "../Languages/Languages.json";
import React, { useContext } from "react";
import { ContextLanguages } from "../../Contexts/ContextLanguages";

import { Link, useMatch, useResolvedPath } from "react-router-dom";
import logo from "./../../images/logo.gif";
import LanguageSelect from "../Languages/Languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faGear,
	faMoneyCheckDollar,
	faChartLine,
	faSmile,
} from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
	const { selectedLanguage } = useContext(ContextLanguages);

	return (
		<nav className="nav">
			<Link to="/" className="site-title">
				<img src={logo} className="logo" alt={"logo"} />
				<span
					className="site_name"
					dangerouslySetInnerHTML={{
						__html: Languages.site_name[selectedLanguage],
					}}
				></span>
			</Link>
			<ul>
				<LanguageSelect to />
				<CustomLink to="/">
					<FontAwesomeIcon
						icon={faHouse}
						className="fontawesome_margin_right"
					/>
					{Languages.home[selectedLanguage]}
				</CustomLink>
				<CustomLink to="/settings">
					<FontAwesomeIcon icon={faGear} className="fontawesome_margin_right" />
					{Languages.settings[selectedLanguage]}
				</CustomLink>
				<CustomLink to="/transactions">
					<FontAwesomeIcon
						icon={faMoneyCheckDollar}
						className="fontawesome_margin_right"
					/>
					{Languages.transactions[selectedLanguage]}
				</CustomLink>
				<CustomLink to="/predictions">
					<FontAwesomeIcon
						icon={faChartLine}
						className="fontawesome_margin_right"
					/>
					{Languages.predictions[selectedLanguage]}
				</CustomLink>
				<CustomLink to="/jokes">
					<FontAwesomeIcon
						icon={faSmile}
						className="fontawesome_margin_right"
					/>
					{Languages.jokes[selectedLanguage]}
				</CustomLink>
			</ul>
		</nav>
	);
}

function CustomLink({ to, children, ...props }) {
	const ResolvedPath = useResolvedPath(to);
	const isActive = useMatch({ path: ResolvedPath.pathname, end: true });
	return (
		<li className={isActive ? "active" : ""}>
			<Link to={to} {...props}>
				{children}
			</Link>
		</li>
	);
}

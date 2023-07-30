import React, { useEffect, useMemo, useState } from "react";
import Languages from "./components/Languages/Languages.json";
import { ContextLanguages } from "./Contexts/ContextLanguages";
import { ContextSettlements } from "./Contexts/ContextSettlements";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Error404 from "./pages/404/Error404";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Transactions from "./pages/Transactions";
import Predictions from "./pages/Predictions";
import Jokes from "./pages/Jokes";

import { loadSettlements } from "./utils/settlementsHandelApi.js";

function App() {
	// משתנים גלובליים

	// production או גרסת יצור development מציג האם גרסת פיתוח
	// alert(process.env.NODE_ENV);

	const [selectedLanguage, setSelectedLanguage] = useState(
		Languages.languages.find((language) => language.default === "true").name
	); // שפה
	const [settlements, setSettlements] = useState([]); // ערים

	const ContextLanguagesProviderValue = useMemo(
		() => ({ selectedLanguage, setSelectedLanguage }),
		[selectedLanguage, setSelectedLanguage]
	);

	const ContextSettlementsProviderValue = useMemo(
		() => ({ settlements, setSettlements }),
		[settlements, setSettlements]
	);

	useEffect(() => {
		// לשיפור היעילות טעינה חד פעמית של כל הערים לכל האפליקציה
		loadSettlements(setSettlements);
		// לשיפור היעילות להוסיף טעינה חד פעמית של כל השפות
	}, []);

	return (
		<div
			style={{
				// direction: `${languagesJson.languages[0].direction}`,
				direction: `${
					Languages.languages.find(
						(language) => language.name === selectedLanguage
					).direction
				}`,
			}}
		>
			{/* <div style={{ direction: `${selectedLanguage.direction}` }}> */}
			<ContextLanguages.Provider value={ContextLanguagesProviderValue}>
				<ContextSettlements.Provider value={ContextSettlementsProviderValue}>
					<NavBar />
					<div className="pages_container">
						<Routes>
							<Route path="*" element={<Error404 />} />
							<Route path="/" element={<Home />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/transactions" element={<Transactions />} />
							<Route path="/predictions" element={<Predictions />} />
							<Route path="/jokes" element={<Jokes />} />
						</Routes>
					</div>
				</ContextSettlements.Provider>
			</ContextLanguages.Provider>
		</div>
	);
}

export default App;

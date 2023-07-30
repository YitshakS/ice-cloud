import { loadBranches, saveBranches } from "../utils/branchesHandelApi";

import SubmitButton from "../components/SubmitButton/SubmitButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import Settlements from "./Settlements/Settlements";

import Languages from "./Languages/Languages.json";
import { ContextLanguages } from "../Contexts/ContextLanguages";
import React, { useContext, useEffect, useState } from "react";

export default function Branch() {
	const { selectedLanguage } = useContext(ContextLanguages);

	const [branches, setBranches] = useState([
		// { name: "123", owner: "1111", settlement: "אבו סנאן" },
		// { name: "", owner: "222", settlement: "בני ברק" },
		// { name: "", owner: "222", settlement: "חיפה" },
	]);

	const handleBranchChange = (element, index) => {
		let branch = [...branches];
		branch[index][element.target.name] = element.target.value;
		setBranches(branch);
	};

	const handleSubmitBranches = (e) => {
		e.preventDefault(); // ביטול ניקוי הטופס לאחר שליחתו
		saveBranches(branches);
		console.log("branches submited", { branches });
	};

	const addBranch = () => {
		let branch = {
			name: "",
			owner: "",
			settlement: "",
		};

		setBranches([...branches, branch]);
	};

	const removeBranch = (index) => {
		let branch = [...branches];
		branch.splice(index, 1);
		setBranches(branch);
	};

	useEffect(() => {
		// טעינת טעמים
		loadBranches(setBranches);
	}, []);

	return (
		<div className="App">
			<form onSubmit={handleSubmitBranches}>
				<fieldset>
					<legend>
						<h2>{Languages.branches[selectedLanguage]}</h2>
					</legend>
					{branches.map((form, index) => {
						return (
							<div key={index}>
								<FontAwesomeIcon
									icon={faCircleXmark}
									size="xl"
									color="red"
									cursor="pointer"
									onClick={() => removeBranch(index)}
								/>
								&emsp;
								<h3>{Languages.name[selectedLanguage]}:</h3>{" "}
								<input
									name="name"
									onChange={(element) => handleBranchChange(element, index)}
									placeholder={Languages.name[selectedLanguage]}
									required
									value={form.name}
								/>
								&emsp;
								<h3>{Languages.owner[selectedLanguage]}:</h3>{" "}
								<input
									name="owner"
									onChange={(element) => handleBranchChange(element, index)}
									placeholder={Languages.owner[selectedLanguage]}
									required
									value={form.owner}
								/>
								<br />
								<br />
								&emsp; &emsp;{" "}
								<Settlements
									handleFormChange={handleBranchChange}
									index={index}
									// name="settlement"
									settlements_name={form.settlement}
									// value={form.settlement}
								/>
								<br />
								<br />
								<br />
							</div>
						);
					})}
					<FontAwesomeIcon
						icon={faCirclePlus}
						size="xl"
						color="green"
						cursor="pointer"
						onClick={addBranch}
					/>
					<br />
					<br />
					<SubmitButton />
					{/* <button onClick={submit}>Submit</button> */}
				</fieldset>
			</form>
		</div>
	);
}

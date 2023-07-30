import React, { useContext, useEffect, useState } from "react";

import Languages from "./../Languages/Languages.json";
import { ContextLanguages } from "../../Contexts/ContextLanguages";
import { ContextSettlements } from "../../Contexts/ContextSettlements";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import ReactApexChart from "react-apexcharts";

export default function Settlements(props) {
	const { selectedLanguage } = useContext(ContextLanguages);
	const { settlements } = useContext(ContextSettlements);

	let selectedDirection = Languages.languages.find(
		(language) => language.name === selectedLanguage
	).direction;

	function chartDirection(arr) {
		if (selectedDirection === "ltr") return arr;
		else return arr.reverse();
	}

	const [selectedSettlementIndex, setSelectedSettlementIndex] = useState(0);

	const handleSettlementChange = (e) => {
		setSelectedSettlementIndex(e.target.selectedIndex);
		props.handleFormChange(e, props.index);
	};

	useEffect(() => {
		// אם נטען ישוב שנבחר בעבר
		if (props.settlements_name !== "") {
			// אינדקס מערך הערים יעודכן בהתאם לישוב שנבחר בעבר
			setSelectedSettlementIndex(
				settlements.findIndex(
					(itm) => itm.Name === props.settlements_name // + " " // אם משתמשים בשדה שם_ישוב צריך להוסיף רווח
				) + 1
			);
		}
	}, [
		props.settlements_name,
		selectedSettlementIndex,
		setSelectedSettlementIndex,
		settlements,
	]);

	return (
		<>
			<h3>{Languages.settlement[selectedLanguage]}:</h3>{" "}
			{settlements.length < 2 ? (
				<>
					{/* אם טרם הסתיימה טעינת הערים תוצג הודעת טעינה */}
					{Languages.loading[selectedLanguage]}{" "}
					<FontAwesomeIcon
						size="xl"
						icon={faSpinner}
						className="fa-spin fa-pulse"
						// style={{ "--fa-animation-duration": "2s" }}
					/>
				</>
			) : (
				<>
					{/* בחירת ישוב */}
					<select
						required
						name="settlement"
						defaultValue={props.settlements_name}
						// כשנבחר ישוב עדכון האינדקס בהתאם
						onChange={(e) => handleSettlementChange(e)}
					>
						<option
							// disabled
							hidden // style={{ display: "none" }}
							value="" // selected
						>
							{Languages.settlement[selectedLanguage]}
						</option>
						{settlements.map((itm, i) => (
							<option key={i}>{itm.Name}</option>
						))}
					</select>
					&emsp;
					{/* הצגת מזהה ישוב */}
					<h3>{Languages.settlement_id[selectedLanguage]}:</h3>{" "}
					<input
						readOnly
						disabled="disabled"
						value={
							// אם לא נבחר ישוב בעבר ולא כעת
							selectedSettlementIndex === 0
								? ""
								: settlements[selectedSettlementIndex - 1].סמל_ישוב
						}
					/>
					&emsp;
					{/* <h3>{Languages.sub_district[selectedLanguage]}:</h3>{" "}
					<input
						readOnly
						disabled="disabled"
						value={
							// אם לא נבחר ישוב בעבר ולא כעת
							selectedSettlementIndex === 0
								? ""
								: settlements[selectedSettlementIndex - 1].נפה
						}
					/> */}
					{
						// אם לא נבחר ישוב בעבר ולא כעת
						selectedSettlementIndex === 0 ? (
							""
						) : (
							<>
								<br />
								<div className="chart">
									&emsp; &emsp; <h3>{Languages.ages[selectedLanguage]}:</h3>{" "}
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
											parseInt(
												settlements[selectedSettlementIndex - 1].גיל_0_5
											),
											parseInt(
												settlements[selectedSettlementIndex - 1].גיל_6_18
											),
											parseInt(
												settlements[selectedSettlementIndex - 1].גיל_19_45
											),
											parseInt(
												settlements[selectedSettlementIndex - 1].גיל_46_55
											),
											parseInt(
												settlements[selectedSettlementIndex - 1].גיל_56_64
											),
											parseInt(
												settlements[selectedSettlementIndex - 1].גיל_65_פלוס
											),
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
													settlements[selectedSettlementIndex - 1].גיל_0_5,

													settlements[selectedSettlementIndex - 1].גיל_6_18,

													settlements[selectedSettlementIndex - 1].גיל_19_45,

													settlements[selectedSettlementIndex - 1].גיל_46_55,

													settlements[selectedSettlementIndex - 1].גיל_56_64,

													settlements[selectedSettlementIndex - 1].גיל_65_פלוס,
												],
											},
										]}
									/>
									&emsp;
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
											parseInt(
												settlements[
													selectedSettlementIndex - 1
												].PepoleNumberJewish.replace(/\D/g, "")
											) || 0,
											parseInt(
												settlements[
													selectedSettlementIndex - 1
												].PepoleNumberArab.replace(/\D/g, "")
											) || 0,
											(parseInt(
												settlements[
													selectedSettlementIndex - 1
												].PepoleNumber.replace(/\D/g, "")
											) || 0) -
												((parseInt(
													settlements[
														selectedSettlementIndex - 1
													].PepoleNumberJewish.replace(/\D/g, "")
												) || 0) +
													(parseInt(
														settlements[
															selectedSettlementIndex - 1
														].PepoleNumberArab.replace(/\D/g, "")
													) || 0)),
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
													parseInt(
														settlements[
															selectedSettlementIndex - 1
														].PepoleNumberJewish.replace(/\D/g, "")
													) || 0,
													parseInt(
														settlements[
															selectedSettlementIndex - 1
														].PepoleNumberArab.replace(/\D/g, "")
													) || 0,
													(parseInt(
														settlements[
															selectedSettlementIndex - 1
														].PepoleNumber.replace(/\D/g, "")
													) || 0) -
														((parseInt(
															settlements[
																selectedSettlementIndex - 1
															].PepoleNumberJewish.replace(/\D/g, "")
														) || 0) +
															(parseInt(
																settlements[
																	selectedSettlementIndex - 1
																].PepoleNumberArab.replace(/\D/g, "")
															) || 0)),
												]),
											},
										]}
									/>
								</div>
							</>
						)
					}
				</>
			)}
		</>
	);
}

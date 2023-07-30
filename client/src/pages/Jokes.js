// import { loadFlavors } from "../utils/handelFlavorsApi";
// import React, { useEffect, useState } from "react";

import React, { useContext } from "react";
import Languages from "../components/Languages/Languages.json";
import { ContextLanguages } from "../Contexts/ContextLanguages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faGear,
	faMoneyCheckDollar,
	faChartLine,
} from "@fortawesome/free-solid-svg-icons";

// 1
import "chart.js/auto";
import { Chart } from "react-chartjs-2";

// 2
import ReactApexChart from "react-apexcharts";

export default function Test() {
	const { selectedLanguage } = useContext(ContextLanguages);

	// const [data1, setData1] = useState([]);
	// const [toDo, setTodo] = useState([]);

	// useEffect(() => {
	// 	loadFlavors(setTodo);
	// 	console.log(toDo);
	// }, []);

	return (
		<>
			<h1>
				<span style={{ fontSize: "2rem", fontFamily: "Noto Color Emoji" }}>
					{"\ud83d\ude00"}
				</span>{" "}
				{Languages.jokes[selectedLanguage]}
			</h1>
			{/* {toDo !== "undefined" &&
				toDo.map((item) => <p key={item._id}>{item.text}</p>)} */}
			{/* {toDo.map((item) => {
				return (
					<div key={item._id}>
						<p>!!!</p>
					</div>
				);
			})} */}
			<h2>API {Languages.hebrew_date[selectedLanguage]}</h2>
			<iframe
				title="t1"
				scrolling="no"
				src={`https://tiktok.com/embed/7178944999692979502?lang=${selectedLanguage};`}
				style={{
					border: 0,
					height: "561px", // הגובה של הוידאו ללא התיאור מתחת, כדי לא להפעיל את הוידאו
					// height: "578px", // הגובה המקימלי שלא מפעיל את הוידאו, אך הגלגלת האנכית נשארת
					// height: "724px", // הגובה המלא, אמור לבטל את הגלגלת האנכית אך מפעיל את הוידאו
					// overflow: "hidden", // אמור להסתיר את הגלגלת האנכית אך לא פועל
				}}
			></iframe>
			<h2>API {Languages.weather[selectedLanguage]}</h2>
			<iframe
				title="t2"
				src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FEretzNehederet.Keshet%2Fvideos%2F629450905329441%2F&show_text=true&width=560&t=0"
				// width="560"
				width="450"
				height="429"
				style={{ border: "none", overflow: "hidden", verticalAlign: "top" }}
				scrolling="no"
				frameBorder="0"
				allowFullScreen={true}
				allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
			></iframe>
			&emsp;
			<iframe
				title="t3"
				src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid08jH1mjs8qYdQ1e6j1SGHnQNN3hrtw7RbpF5BQQGatGE4aiVh7gjBquvSRegoKTHAl%26id%3D932371893447097&show_text=true&width=500"
				// width="500"
				width="450"
				height="528"
				style={{ border: "none", overflow: "hidden", verticalAlign: "top" }}
				scrolling="no"
				frameBorder="0"
				allowFullScreen={true}
				allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
			></iframe>
			&emsp;
			<iframe
				title="t4"
				src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Ftalithakumiguesthouse%2Fposts%2Fpfbid0qyxhdzMSV8TRs5cSJCfBVecvmLq4MCK4sSLejWRdw2G1g6P8QEzmCvegH14osxs8l&show_text=true&width=500"
				// width="500"
				width="450"
				height="665"
				style={{ border: "none", overflow: "hidden", verticalAlign: "top" }}
				scrolling="no"
				frameBorder="0"
				allowFullScreen={true}
				allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
			></iframe>
			<h1>Test</h1>
			<div style={{ width: "200px" }}>
				{/* {data1.length === 0 && setData1([300, 50, 100])} */}
				<Chart
					type="doughnut"
					data={{
						labels: ["Red", "Blue", "Yellow"],

						datasets: [
							{
								data: [300, 50, 100],
								backgroundColor: [
									"rgb(255, 99, 132)",
									"rgb(54, 162, 235)",
									"rgb(255, 205, 86)",
								],
								hoverOffset: 10,
							},
						],
					}}
					options={{
						maintainAspectRatio: false,
						plugins: {
							legend: {
								labels: {
									font: {
										size: 10,
									},
									usePointStyle: true,
									// boxWidth: 10,
								},
								position: "bottom",
								// align: "middle",
							},
						},
					}}
				/>
			</div>
			<ReactApexChart
				type="donut"
				width={200}
				height={200}
				options={{
					dataLabels: {
						enabled: true,
						style: {
							fontSize: "10px",
							fontFamily: "inherit",
							fontWeight: "normal",
						},
					},
					labels: ["Red", "Blue", "Yellow"],
					legend: {
						position: "bottom",
						fontFamily: "inherit",
						fontSize: "10px",
					},
					colors: [
						"rgb(255, 99, 132)",
						"rgb(54, 162, 235)",
						"rgb(255, 205, 86)",
					],
					plotOptions: {
						pie: {
							donut: {
								size: "40%",
							},
						},
					},
				}}
				series={[300, 50, 100]}
			/>
			<br />
			⚙️ &#9881;&#65039; {"\u2699\ufe0f"}
			<span style={{ fontFamily: "Noto Color Emoji" }}>
				&#9881;&#65039;
			</span>{" "}
			<FontAwesomeIcon icon={faGear} />{" "}
			<FontAwesomeIcon
				icon={faGear}
				className="fa-spin"
				style={{ "--fa-animation-duration": "10s" }}
			/>
			<FontAwesomeIcon
				icon={faGear}
				className="fa-spin fa-spin-reverse"
				style={{
					"--fa-animation-duration": "10s",
				}}
			/>
			<FontAwesomeIcon
				icon={faGear}
				className="fa-spin"
				style={{
					"--fa-animation-duration": "10s",
					"--fa-animation-direction": "reverse",
				}}
			/>
			<br />
			🏠&#127968;{"\ud83c\udfe0"}
			🏡&#127969;{"\ud83c\udfe1"}
			🏘️&#127960;&#65039;{"\ud83c\udFd8\ufE0f"}
			🏚️&#127962;&#65039;{"\ud83c\udfda\ufe0f"}
			<span style={{ fontFamily: "Noto Color Emoji" }}>🏠🏡🏘️🏚️</span>
			<FontAwesomeIcon icon={faHouse} />
			<br />
			🪪&#129706;{"\ud83e\udeaa"}
			{""} 💳&#128179;{"\ud83d\udcb3"}
			<span style={{ fontFamily: "Noto Color Emoji" }}>🪪💳</span>
			<FontAwesomeIcon icon={faMoneyCheckDollar} />
			<br />
			📈&#128200;{"\ud83d\udcc8"}
			📉&#128201;{"\ud83d\udcc9"}
			📊&#128202;{"\ud83d\udcca"}
			<span style={{ fontFamily: "Noto Color Emoji" }}>📈📉📊</span>
			<FontAwesomeIcon icon={faChartLine} />
		</>
	);
}

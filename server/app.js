import bigmlRoute from "./routes/bigmlRoute.js";
import branchesRoute from "./routes/branchesRoute.js";
import cors from "cors";
import dateRoute from "./routes/dateRoute.js";
import "dotenv/config.js";
import express from "express";
import flavorsRoute from "./routes/flavorsRoute.js";
import mongoose from "mongoose";
import settlementsRoute from "./routes/settlementsRoute.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import transactionsSqlRoute from "./routes/transactionsSqlRoute.js";
import weatherRoute from "./routes/weatherRoute.js";

const app = express();

app.use(cors()); // server ל client מאפשר תקשורת בין
app.use(express.json({ limit: "50mb" })); // server ל client מ json מאפשר שליחת
// app.use(express.urlencoded({ limit: "50mb" }));
// app.use(express.static("public"));

app.get("/", (_, res) => {
	res.send("Server OK");
});

// בסיסי לבדיקה api הגדרת
// app.get("/api", (_, res) => {
// 	res.json({ test: ["one", "two", "three"] });
// });

app.use("/bigml", bigmlRoute);
app.use("/branches", branchesRoute);
app.use("/date", dateRoute);
app.use("/flavors", flavorsRoute);
app.use("/settlements", settlementsRoute);
app.use("/transactions", transactionsRoute);
app.use("/transactionsSql", transactionsSqlRoute);
app.use("/weather", weatherRoute);

// import axios from "axios";
//
// app.get("/aaa", async (req, res) => {
//	const response = await axios.get("https://bbb")
//	.catch((err) => console.log(err.response.data))
//	res.json(response.data))
// });

// MongoDB התקשרות עם
mongoose
	.set("strictQuery", false)
	.connect(process.env.MONGODB_URL)
	.then(() => console.log("MongoDB connected"))
	// .catch((err) => console.log(err));
	.catch(() => console.log("Error: MongoDB not connected"));

// הרמת השרת

// כשמרצים על מחשב צריך את זה
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server on port http://localhost:${port}`);
});

// כשמריצים דרך fastcomet של cPanel צריך את זה
// import { createServer } from "http";
// const server = createServer(app);
// server.listen(console.log("server OK"));

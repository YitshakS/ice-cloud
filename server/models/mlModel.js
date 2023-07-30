import "dotenv/config.js";

import { Schema, model } from "mongoose";

const mlSchema = new Schema({
	model: {
		type: String,
		require: true,
	},
});

export default model(process.env.MONGODB_COLLECTION_ML, mlSchema);

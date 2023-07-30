import "dotenv/config.js";

import { Schema, model } from "mongoose";

const flavorsSchema = new Schema({
	name: {
		type: String,
		require: true,
	},
});

export default model(process.env.MONGODB_COLLECTION_FLAVORS, flavorsSchema);

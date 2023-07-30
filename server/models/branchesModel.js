import "dotenv/config.js";

import { Schema, model } from "mongoose";

const branchesSchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	owner: {
		type: String,
		require: true,
	},
	settlement: {
		type: String,
		require: true,
	},
});

export default model(process.env.MONGODB_COLLECTION_BRANCHES, branchesSchema);

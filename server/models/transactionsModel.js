import "dotenv/config.js";

import { Schema, model } from "mongoose";

const transactionsSchema = new Schema({
	flavor: {
		type: String,
		require: true,
	},
	weight_g: {
		type: Number,
		require: true,
	},
	year: {
		type: Number,
		require: true,
	},
	month: {
		type: Number,
		require: true,
	},
	day_of_month: {
		type: Number,
		require: true,
	},
	day_of_week: {
		type: Number,
		require: true,
	},
	hours: {
		type: Number,
		require: true,
	},
	minutes: {
		type: Number,
		require: true,
	},
	seconds: {
		type: Number,
		require: true,
	},
	hebrew_date: {
		type: String,
		require: true,
	},
	events: {
		type: Array,
		require: true,
	},
	percent_business_day: {
		type: Number,
		require: true,
	},
	branch_name: {
		type: String,
		require: true,
	},
	branch_owner: {
		type: String,
		require: true,
	},
	branch_settlement: {
		type: String,
		require: true,
	},
	meteorological_station_id: {
		type: Number,
		require: true,
	},
	weather_temperature: {
		type: Number,
		require: true,
	},
	percent_age_0_5: {
		type: Number,
		require: true,
	},
	percent_age_6_18: {
		type: Number,
		require: true,
	},
	percent_age_19_45: {
		type: Number,
		require: true,
	},
	percent_age_46_55: {
		type: Number,
		require: true,
	},
	percent_age_56_64: {
		type: Number,
		require: true,
	},
	percent_age_65_plus: {
		type: Number,
		require: true,
	},
	percent_jews: {
		type: Number,
		require: true,
	},
	percent_arabs: {
		type: Number,
		require: true,
	},
	percent_others: {
		type: Number,
		require: true,
	},
});

export default model(
	process.env.MONGODB_COLLECTION_TRANSACTIONS,
	transactionsSchema
);

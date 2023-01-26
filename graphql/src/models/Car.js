import { Schema, model } from "mongoose";

const userSchema = new Schema ({
	modelname: {
		type: String,
		required: true
	},
	year: Number
})

export default model("Car", userSchema)
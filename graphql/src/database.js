import mongoose from "mongoose";

export async function connect() {	
	try {
		await mongoose.connect("mongodb://localhost/mongodbtest1", {
			useNewUrlParser: true
		})

		console.log("DB Connected")
	} catch(e) {
		console.log("DB Not Connected" + e)
	}
}

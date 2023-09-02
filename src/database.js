import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/redditclone", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(db => console.log("DDBB Connected"))
.catch(error => console.log(error))
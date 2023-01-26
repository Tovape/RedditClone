import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema.js";
import { connect } from "./database.js";
import dotenv from "dotenv";
dotenv.config()
const router = express.Router()
const app = express();

connect();

app.set("view-engine", "ejs")
app.use(express.json({limit: "20mb"}));
app.use(express.urlencoded({limit: "20mb", extended: true}));
app.set("views", "src/views");

app.get("/", function (req, res) {
	res.render("index.ejs")
})

app.use("/graphql", graphqlHTTP({
	graphiql: true,
	schema: schema,
	context: {
		messageId: "test"
	}
}));

/*
app.post("/login", (req, res) => {

})
*/

app.listen(3000, () => console.log("Server on port 3000"))
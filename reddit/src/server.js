import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import authRoutes from "./routes/auth.routes.js";
import "./database.js";
import { createRoles } from "./roles.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import favicon from "serve-favicon";
import bodyParser from "body-parser";
const __dirname = path.resolve();
const app = express();
const port = 3000;
createRoles();

// USE
app.use(morgan("dev"))
app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname)));
app.use(favicon(__dirname + '/files/icons/favicon.ico'));
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb', extended: true}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(cookieParser());
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)

/* MOVE THIS TO MIDDLEWARES */

const authorization = (req, res, next) => {
	
	var token = null;
	if (req.cookies.token) {
		token = req.cookies.token;
		token = ((JSON.parse(token))["token"])
	}
	
	if (token == null || token == "undefined") {
		res.redirect("/login")
	} else {
		try {
			const data = jwt.verify(token, "user-api-signed");
			if(data) {
				next()
			}
		} catch {
			return res.sendStatus(403);
		}
	}
};

const alreadyLogged = (req, res, next) => {
	var token = null;
	if (req.cookies.token) {
		token = req.cookies.token;
		token = ((JSON.parse(token))["token"])
	}
	
	if (token != null) {
		const data = jwt.verify(token, "user-api-signed");
				
		if((data) && (Object.keys(data).length !== 0)) {
			res.redirect("/account")
		} else {
			res.sendStatus(403).json({message: "An Error Accured"})
		}
	} else {
		next()
	}
};

// GET
app.get("/", (req, res) => {
	res.render('index.ejs'),
	app.use(express.static(__dirname + '/css')),
	app.use(express.static(__dirname + '/files')),
	app.use(express.static(__dirname + '/js'))
})

app.get("/login", alreadyLogged, (req, res) => {
	res.render('login.ejs')
})

app.get("/submit", (req, res) => {
	res.render('submit.ejs')
})

app.get("/search", (req, res) => {
	res.render('search.ejs')
})

app.get("/account", authorization, (req, res) => {
	res.render('account.ejs')
})

// Other
app.listen(port)
console.log("Server on Port " + port)
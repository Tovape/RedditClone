import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const verifyToken = async (req, res, next) => {
	try {
		const token = req.headers["x-access-token"];

		console.log(token)

		if (!token) return res.status(403).json({message: "No token provided"})

		const decoded = jwt.verify(token, "user-api-signed")
		req.userId = decoded.id;

		const user = await User.findById(req.userId, {password: 0})
		if (!user) return res.status(404).json({message: "No User Found"})

		next()
	} catch (e) {
		console.log(e)
		return res.status(401).json({message: "Auth Error"})
	}
}

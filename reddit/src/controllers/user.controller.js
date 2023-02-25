import Post from "../models/Post.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const getUsers = (req, res) => {

}

/* General - Get User By Id */

export const getUserById = async (req, res) => {
	const user = await User.findById(req.params.userId);
	res.status(201).json(user)	
}

export const updateUserById = (req, res) => {
	
}

export const deleteUserById = (req, res) => {
	
}

/* General - Add Saved Post */

export const addSavedPost = async (req, res) => {
	// Get User ID
	var temp = req.headers["x-access-token"]
	if (!temp) return res.status(403).json({message: "No token provided"})

	const decoded = jwt.verify(temp, "user-api-signed")
	req.body.posterId = decoded.id;
	
	if (!req.params.postId) return res.status(403).json({message: "No postId provided"})

	const alreadySaved = await User.find({"_id": req.body.posterId, "saved.postId": req.params.postId})

	if (alreadySaved.length == 0) {
		const savedPost = await User.update(
			{ _id: req.body.posterId,}, 
			{ $push: { saved: { "postId": req.params.postId } } }
		);
		
		return res.status(201).json({message: "Post Saved"});
	} else {	
		const alreadySaved = await User.update({ _id: req.body.posterId }, { "$pull": { "saved": { "postId": req.params.postId } }}, { safe: true, multi:true });
		
		return res.status(201).json({message: "Post Unsaved"});
	}
}
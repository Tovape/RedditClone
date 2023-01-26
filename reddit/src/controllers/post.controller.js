import Post from "../models/Post.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
	const posts = await Post.find();
	res.json(posts)
}

export const getPostsByTitle = async (req, res) => {
	if (!req.params.postTitle) {
		return res.status(405).json({message: "Title is required"})
	} else {
		var temp = 0;
		if (req.params.postLimit) {
			temp = req.params.postLimit
		}
		const post = await Post.find({"title": { $regex: '.*' + req.params.postTitle + '.*' } }).skip(temp).limit(10)
		res.json(post)
	}
}

export const createPost = async (req, res) => {
	if (!req.body.title) {
		return res.status(405).json({message: "Title is required"})
	}
	
	// Get User ID
	var temp = req.headers["x-access-token"]
	const decoded = jwt.verify(temp, "user-api-signed")
	req.body.poster = decoded.id;
	
	if (!req.body.description) {
		return res.status(405).json({message: "Description is required"})
	}
	
	const newPost = new Post({
		poster: req.body.poster,
		title: req.body.title,
		description: req.body.description,
		upvotes: 0,
		downvotes: 0,
		imgUrl: (req.body.image !== null ? req.body.image : null),
		comments: null
	})
	
	const postSaved = await newPost.save();
	res.status(201).json(postSaved);
}

export const getPostById = async (req, res) => {
	const post = await Post.findById(req.params.postId);
	res.status(201).json(post)	
}

export const updatePostById = async (req, res) => {
	const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, {
		new: true
	})
	res.status(204).json(updatedPost)
}

export const deletePostById = async (req, res) => {
	const { postId } = req.params;

	const token = req.headers["x-access-token"];

	if (!token) return res.status(403).json({message: "No token provided"})

	const decoded = jwt.verify(token, "user-api-signed")
	req.userId = decoded.id;

	const user = await User.findById(req.userId, {password: 0})
	if (!user) return res.status(404).json({message: "No User Found"})

	const post = await Post.find({_id: postId, poster: user._id})
	console.log(user._id)
	console.log(post)
	console.log(postId)
	if (!post || post.length === 0) {
		console.log("Not Allowed")
		res.status(403).json({message: "Not Allowed"})
	} else {
		await Post.findByIdAndDelete(postId)
		res.status(204).json();
	}
}
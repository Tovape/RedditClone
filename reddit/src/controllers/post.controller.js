import Post from "../models/Post.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
	var sort = 0;
	
	if (req.params.postSort) {
		sort = req.params.postSort
		if (sort == 0) {
			const posts = await Post.find()
				.sort({'upvotes': 'asc'})
			res.json(posts)
		} else if (sort == 1) {
			const posts = await Post.find()
				.sort({'downvotes': 'asc'})
			res.json(posts)
		} else if (sort == 2) {
			const posts = await Post.find()
				.sort({'createdAt': 'asc'})
			res.json(posts)
		} else if (sort == 3) {
			const posts = await Post.find()
				.sort({'createdAt': 'desc'})
			res.json(posts)
		} else {
			const posts = await Post.find()
			res.json(posts)
		}
		
	} else {
		const posts = await Post.find()
		res.json(posts)
	}
}

export const getPostsByTitle = async (req, res) => {
	if (!req.params.postTitle) {
		return res.status(405).json({message: "Title is required"})
	} else {
		var temp = 0;
		var sort = 0;
		
		if (req.params.postLimit) {
			temp = req.params.postLimit
		}
		
		if (req.params.postSort) {
			sort = req.params.postSort
			if (sort == 0) {
				const post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
					.sort({'upvotes': 'asc'})
				res.json(post)
			} else if (sort == 1) {
				const post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
					.sort({'upvotes': 'desc'})
				res.json(post)
			} else if (sort == 2) {
				const post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
					.sort({'createdAt': 'asc'})
				res.json(post)
			} else if (sort == 3) {
				const post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
					.sort({'createdAt': 'desc'})
				res.json(post)
			} else {
				const post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
				res.json(post)
			}
			
		} else {
			const post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
				.skip(temp)
				.limit(10)
			res.json(post)
		}
	}
}

export const createPost = async (req, res) => {
	if (!req.body.title) {
		return res.status(405).json({message: "Title is required"})
	}
	
	// Get User ID
	var temp = req.headers["x-access-token"]
	if (!temp) return res.status(403).json({message: "No token provided"})

	const decoded = jwt.verify(temp, "user-api-signed")
	req.body.posterId = decoded.id;
	
	if (!req.body.description) {
		return res.status(405).json({message: "Description is required"})
	}
	
	const getposterName = await User.findById(req.body.posterId);

	const newPost = new Post({
		posterId: req.body.posterId,
		posterName: getposterName.username,
		title: req.body.title,
		description: req.body.description,
		upvotes: [
			{ posterId: "63d0e100949d0701d33ab620" },
			{ posterId: "63d0e100949d0701d33ab621" },
			{ posterId: "63d0e100949d0701d33ab622" }
		],
		downvotes: null,
		imgUrl: (req.body.image !== null ? req.body.image : null),
		comments: [
			{
				posterId: "63d0e100949d0701d33ab620",
				posterName: "Tovape",
				comment: "Example Coment 1",
				upvotes: [
					{ posterId: "63d0e100949d0701d33ab620" },
					{ posterId: "63d0e100949d0701d33ab621" },
					{ posterId: "63d0e100949d0701d33ab622" }
				],
				downvotes: null,
				comments: {
					posterId: "63d0e100949d0701d33ab620",
					posterName: "Tovape",
					comment: "Example thread 1",
					upvotes: null,
					downvotes: [
						{ posterId: "63d0e100949d0701d33ab620" },
						{ posterId: "63d0e100949d0701d33ab621" },
						{ posterId: "63d0e100949d0701d33ab622" }
					],
					comments: null
				}
			},
			{
				posterId: "63d0e100949d0701d33ab621",
				posterName: "Tovape",
				comment: "Example Coment 2",
				upvotes: [
					{ posterId: "63d0e100949d0701d33ab620" }
				],
				downvotes: null,
				comments: null
			}
		]
	})
	
	const postSaved = await newPost.save();
	res.status(201).json(postSaved);
}

export const getPostById = async (req, res) => {
	const post = await Post.findById(req.params.postId);
	res.status(201).json(post)	
}

export const getPostsByAccount = async (req, res) => {
	// Get User ID
	var temp = req.headers["x-access-token"]
	if (!temp) return res.status(403).json({message: "No token provided"})

	const decoded = jwt.verify(temp, "user-api-signed")
	req.body.posterId = decoded.id;
	
	const post = await Post.find({posterId: req.body.posterId});
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

	if (!post || post.length === 0) {
		console.log("Not Allowed")
		res.status(403).json({message: "Not Allowed"})
	} else {
		await Post.findByIdAndDelete(postId)
		res.status(204).json();
	}
}
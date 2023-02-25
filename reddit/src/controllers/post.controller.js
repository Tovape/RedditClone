import Post from "../models/Post.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* General - Get Posts */

export const getPosts = async (req, res) => {
	var sort = 0;
	var decoded = null;
	var userStats = null;
	var posts = null;
	
	// Get User ID
	var temp = req.headers["x-access-token"]
	
	if (temp) {
		decoded = jwt.verify(temp, "user-api-signed")
		req.body.posterId = decoded.id;

		userStats = await User.findById(req.body.posterId);	
	}

	if (req.params.postSort) {
		sort = req.params.postSort
		if (sort == 0) {
			posts = await Post.find()
				.sort({'upvotes': 'asc'})
		} else if (sort == 1) {
			posts = await Post.find()
				.sort({'downvotes': 'asc'})
		} else if (sort == 2) {
			posts = await Post.find()
				.sort({'createdAt': 'asc'})
		} else if (sort == 3) {
			posts = await Post.find()
				.sort({'createdAt': 'desc'})
		} else {
			posts = await Post.find()
		}
	} else {
		posts = await Post.find()
	}
	
	res.json({posts, "userstats": userStats})
}

/* Search - Get Posts By Title */

export const getPostsByTitle = async (req, res) => {
	var post = null;
	
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
				post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
					.sort({'upvotes': 'asc'})
			} else if (sort == 1) {
				post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
					.sort({'upvotes': 'desc'})
			} else if (sort == 2) {
				post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
					.sort({'createdAt': 'asc'})
			} else if (sort == 3) {
				post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
					.sort({'createdAt': 'desc'})
			} else {
				post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
					.skip(temp)
					.limit(10)
			}
			
		} else {
			post = await Post.find({ "title": { $regex: '.*' + req.params.postTitle + '.*' } })
				.skip(temp)
				.limit(10)
		}
		res.json({"posts": post})
	}
}

/* Submit - Create post */

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
		upvotes: [{}],
		downvotes: [{}],
		imgUrl: (req.body.image !== null ? req.body.image : null),
		comments: [{}]
	})
	
	const postSaved = await newPost.save();
	res.status(201).json(postSaved);
}

/* General - Get Post By Id */

export const getPostById = async (req, res) => {
	const post = await Post.findById(req.params.postId);
	res.status(201).json({"posts": post})	
}

/* Account - Get Posts By Account */

export const getPostsByAccount = async (req, res) => {
	var userStats = null;
	
	// Get User ID
	var temp = req.headers["x-access-token"]
	if (!temp) return res.status(403).json({message: "No token provided"})

	const decoded = jwt.verify(temp, "user-api-signed")
	req.body.posterId = decoded.id;
	
	const post = await Post.find({posterId: req.body.posterId});
	
	userStats = await User.findById(req.body.posterId);	
	
	res.status(201).json({"posts": post, "userstats": userStats})	
}

/* General - Update Post By Id */

export const updatePostById = async (req, res) => {
	const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, {
		new: true
	})
	res.status(204).json(updatedPost)
}

/* General - Delete Post By Id */

export const deletePostById = async (req, res) => {
	const { postId } = req.params;
	// Get User ID
	var temp = req.headers["x-access-token"]
	if (!temp) return res.status(403).json({message: "No token provided"})

	const decoded = jwt.verify(temp, "user-api-signed")
	req.body.posterId = decoded.id;

	const user = await User.find({_id: req.body.posterId});
	if (!user) return res.status(404).json({message: "No User Found"})

	const post = await Post.find({_id: postId, poster: user._id})

	if (!post || post.length === 0) {
		console.log("Not Allowed")
		res.status(403).json({message: "Not Allowed"})
	} else {
		await Post.findByIdAndDelete(postId)
		res.status(201).json({message: "Post Deleted"});
	}
}

/* General - Comment Post */

export const createComment = async (req, res) => {
	// Get User ID
	var temp = req.headers["x-access-token"]
	if (!temp) return res.status(403).json({message: "No token provided"})

	const decoded = jwt.verify(temp, "user-api-signed")
	req.body.posterId = decoded.id;
	
	if (!req.body.comment) return res.status(403).json({message: "No comment provided"})
	if (!req.params.postId) return res.status(403).json({message: "No postid provided"})
	
	const getposterName = await User.findById(req.body.posterId);

	var comment = {
		"posterId": req.body.posterId,
		"posterName": getposterName.username,
		"comment": req.body.comment,
		upvotes: null,
		downvotes: null
	}

	const updatedPost = await Post.update(
		{ _id: req.params.postId,}, 
		{ $push: { comments: comment } }
	);
	
	return res.status(201).json({updatedPost, "message": "Comment Posted"});
}

/* General - Save Post */

export const savedPostAccount = async (req, res) => {
	var decoded = null;
	var userStats = null;
	var posts = null;
	
	// Get User ID
	var temp = req.headers["x-access-token"]
	
	if (temp) {
		decoded = jwt.verify(temp, "user-api-signed")
		req.body.posterId = decoded.id;

		userStats = await User.findById(req.body.posterId);	
	}
	
	const userSaved = await User.find({_id: req.body.posterId});
	
	var posts = []

	for (let i = 1; i < userSaved[0].saved.length; i++) {
		posts.push(await Post.find({_id: userSaved[0].saved[i].postId}))
	}
		
	posts = posts.map((o) => o[0])
	
	res.status(201).json({posts, "userstats": userStats})	
}

/* Account - Get Upvoted Posts */

export const upvotedPostAccount = async (req, res) => {
	var decoded = null;
	var userStats = null;
	var posts = null;
	
	// Get User ID
	var temp = req.headers["x-access-token"]
	
	if (temp) {
		decoded = jwt.verify(temp, "user-api-signed")
		req.body.posterId = decoded.id;

		userStats = await User.findById(req.body.posterId);	
	}
	
	const userSaved = await User.find({_id: req.body.posterId});
	
	var posts = []

	for (let i = 1; i < userSaved[0].upvoted.length; i++) {
		posts.push(await Post.find({_id: userSaved[0].upvoted[i].postId}))
	}
		
	posts = posts.map((o) => o[0])
	
	res.status(201).json({posts, "userstats": userStats})	
}

/* Account - Get Downvoted Posts */

export const downvotedPostAccount = async (req, res) => {
	var decoded = null;
	var userStats = null;
	var posts = null;
	
	// Get User ID
	var temp = req.headers["x-access-token"]
	
	if (temp) {
		decoded = jwt.verify(temp, "user-api-signed")
		req.body.posterId = decoded.id;

		userStats = await User.findById(req.body.posterId);	
	}
	
	const userSaved = await User.find({_id: req.body.posterId});
	
	var posts = []

	for (let i = 1; i < userSaved[0].downvoted.length; i++) {
		posts.push(await Post.find({_id: userSaved[0].downvoted[i].postId}))
	}
		
	posts = posts.map((o) => o[0])
	
	res.status(201).json({posts, "userstats": userStats})		
}

/* General - Upvote Post */

export const upvotePost = async (req, res) => {
	// Get User ID
	var temp = req.headers["x-access-token"]
	if (!temp) return res.status(403).json({message: "No token provided"})

	const decoded = jwt.verify(temp, "user-api-signed")
	req.body.posterId = decoded.id;
	
	if (!req.params.postId) return res.status(403).json({message: "No postId provided"})

	const alreadyUpvoted = await Post.find({"upvotes.posterId": req.body.posterId})

	if (alreadyUpvoted.length == 0) {
		const post = await Post.update(
			{ _id: req.params.postId,}, 
			{ $push: { upvotes: { "posterId": req.body.posterId } } }
		);
		
		await Post.update(
			{ _id: req.params.postId },
			{ "$pull": { "downvotes": { "posterId": req.body.posterId } } },
			{ safe: true, multi:true }
		);

		await User.update(
			{ _id: req.body.posterId },
			{ "$push": { "upvoted": { "postId": req.params.postId } } }
		);
		
		await User.update(
			{ _id: req.body.posterId },
			{ "$pull": { "downvoted": { "postId": req.params.postId } } },
			{ safe: true, multi:true }
		);
		
		return res.status(201).json({message: "Post Upvoted"});
	} else {	
		const post = await Post.update(
			{ _id: req.params.postId },
			{ "$pull": { "upvotes": { "posterId": req.body.posterId } } },
			{ safe: true, multi:true }
		);
		
		await User.update(
			{ _id: req.body.posterId },
			{ "$pull": { "upvoted": { "postId": req.params.postId } } },
			{ safe: true, multi:true }
		);
		
		return res.status(201).json({message: "Post Un Upvoted"});
	}
}

/* General - Downvote Post */

export const downvotePost = async (req, res) => {
	// Get User ID
	var temp = req.headers["x-access-token"]
	if (!temp) return res.status(403).json({message: "No token provided"})

	const decoded = jwt.verify(temp, "user-api-signed")
	req.body.posterId = decoded.id;
	
	if (!req.params.postId) return res.status(403).json({message: "No postId provided"})

	const alreadyDownvoted = await Post.find({"downvotes.posterId": req.body.posterId})

	if (alreadyDownvoted.length == 0) {
		const post = await Post.update(
			{ _id: req.params.postId,}, 
			{ $push: { downvotes: { "posterId": req.body.posterId } } }
		);
		
		await Post.update(
			{ _id: req.params.postId },
			{ "$pull": { "upvotes": { "posterId": req.body.posterId } } },
			{ safe: true, multi:true }
		);
		
		await User.update(
			{ _id: req.body.posterId },
			{ "$push": { "downvoted": { "postId": req.params.postId } } }
		);
		
		await User.update(
			{ _id: req.body.posterId },
			{ "$pull": { "upvoted": { "postId": req.params.postId } } },
			{ safe: true, multi:true }
		);
		
		return res.status(201).json({message: "Post Downvoted"});
	} else {	
		const post = await Post.update(
			{ _id: req.params.postId },
			{ "$pull": { "downvotes": { "posterId": req.body.posterId } } },
			{ safe: true, multi:true }
		);
		
		await User.update(
			{ _id: req.body.posterId },
			{ "$pull": { "downvoted": { "postId": req.params.postId } } },
			{ safe: true, multi:true }
		);
		
		return res.status(201).json({message: "Post Un Downvoted"});
	}
}

import { Schema, model } from "mongoose";

const downvoteSchema = new Schema({
	posterId: {
		type: String,
		required: true
	}
})

const upvoteSchema = new Schema({
	posterId: {
		type: String,
		required: true
	}	
})

const commentSchema = new Schema({
	posterId: {
		type: String,
		required: true
	},
	posterName: {
		type: String,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	upvotes: [upvoteSchema],
	downvotes: [downvoteSchema]
}, {
	timestamps: true,
	versionKey: false
})

commentSchema.add({
	comments: [commentSchema]
})

const postSchema = new Schema({
	posterId: {
		type: String,
		required: true
	},
	posterName: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	upvotes: [upvoteSchema],
	downvotes: [downvoteSchema],
	imgUrl: String,
	comments: [commentSchema]
}, {
	timestamps: true,
	versionKey: false
})

export default model('Post', postSchema);
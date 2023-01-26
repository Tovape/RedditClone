import { Schema, model } from "mongoose";

const commentSchema = new Schema({
	poster: {
		type: String,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	upvotes: Number,
	downvotes: Number
}, {
	timestamps: true,
	versionKey: false
})

const postSchema = new Schema({
	poster: {
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
	upvotes: Number,
	downvotes: Number,
	imgUrl: String,
	comments: commentSchema
}, {
	timestamps: true,
	versionKey: false
})

export default model('Post', postSchema);
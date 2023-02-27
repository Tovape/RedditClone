import { Schema, model } from "mongoose";

const downvoteSchema = new Schema({
	posterId: {
		type: String
	}
}, {
	versionKey: false
})

const upvoteSchema = new Schema({
	posterId: {
		type: String
	}	
}, {
	versionKey: false
})

const commentSchema = new Schema({
	posterId: {
		type: String
	},
	posterName: {
		type: String
	},
	comment: {
		type: String
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
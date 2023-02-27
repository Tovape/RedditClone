import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const savedPost = new Schema({
	postId: {
		type: String
	}
}, {
	versionKey: false
})

const downvoteSchema = new Schema({
	postId: {
		type: String
	}
}, {
	versionKey: false
})

const upvoteSchema = new Schema({
	postId: {
		type: String
	}	
}, {
	versionKey: false
})

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	saved: [savedPost],
	upvoted: [upvoteSchema],
	downvoted: [downvoteSchema],
	roles: [{
		ref: "Role",
		type: Schema.Types.ObjectId
	}]
}, {
	timestamps: true,
	versionKey: false
})

userSchema.statics.encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(10)
	return await bcrypt.hash(password, salt)
}
userSchema.statics.comparePassword = async (password, recievedpassword) => {
	return await bcrypt.compare(password, recievedpassword)
}

export default model('User', userSchema);
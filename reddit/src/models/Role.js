import { Schema, model } from "mongoose";
import Role from "../models/Role.js";

export async function getRoles() {
	var roles = await Role.find({}).select('name -_id');
	roles = [...new Set(roles.map(x => x.name))];
	return roles;
}

const roleSchema = new Schema({
	name: String,
	description: String
}, {
	versionKey: false
})

export default model("Role", roleSchema)
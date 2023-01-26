import { getRoles } from "../models/Role.js";
import User from "../models/User.js"; 

export const checkDuplicate = async (req, res, next) => {
	const user = await User.findOne({username: req.body.username})

	if (user) return res.status(400).json({
		message: "User Already Extists"
	})
	
	const email = await User.findOne({email: req.body.email})
	
	if (email) return res.status(400).json({
		message: "Email Already Extists"
	})
	
	next()
}

export const chechRolesExisted = async (req, res, next) => {
	const roles = await getRoles();
	
	if (req.body.roles) {
		for (let i = 0; i < req.body.roles.length; i++) {
			if (!roles.includes(req.body.roles[i])) {
				console.log(req.body.roles[i])
				return res.status(400).json({
					message: "Role " + req.body.roles[i] + " does not exist"
				})
			}
		}
	}
	
	next()
}


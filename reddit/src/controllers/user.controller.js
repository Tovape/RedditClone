export const getUsers = (req, res) => {

}

export const getUserById = async (req, res) => {
	const user = await User.findById(req.params.userId);
	res.status(201).json(user)	
}

export const updateUserById = (req, res) => {
	
}

export const deleteUserById = (req, res) => {
	
}
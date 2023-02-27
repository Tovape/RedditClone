import Role from "./models/Role.js";

export const createRoles = async () => {
	try {
		const count = await Role.estimatedDocumentCount()
		
		if(count > 0) return;
		
		const values = await Promise.all([
			new Role({ name: "user", description: "For Users" }).save(),
			new Role({ name: "admin", description: "For Administrators" }).save()
		]);
			
		console.log(values)
	} catch (error) {
		console.log(error)
	}
}
import datos from "./datos.js";
import User from "./models/User.js";
import Car from "./models/Car.js";

export const resolvers = {
	Query: {
		data: () => {
			return "hola";
		},
		data2: () => {
			return 2;
		},
		funct(root, args, ctx) {
			console.log(args.name)
			console.log(ctx)
			return "hola func";
		},
		datos() {
			return datos;
		},
		async Users() {
			return await User.find()
		},
		async Cars() {
			return await Car.find()
		}
	},
	Mutation: {
		createDatos(_, { input }) {
			input.id = datos.length;
			datos.push(input)
			return input;
		},
		async createUser(_, { input }) {
			const newUser = new User(input)
			console.log(newUser)
			await newUser.save();
			return newUser;
		},
		async deleteUser(_, { id }) {
			return await User.findByIdAndDelete(id)
		},
		async updateUser(_, { id, input }) {
			return await User.findByIdAndUpdate(id, input, { new: true })
		},
		async createCar(_, { input }) {
			const newCar = new Car(input)
			console.log(newCar)
			await newCar.save();
			return newCar;
		},
		async updateCar(_, { id, input }) {
			return await Car.findByIdAndUpdate(id, input, { new: true })
		},
		async deleteCar(_, { id }) {
			return await Car.findByIdAndDelete(id)
		}
	}
};
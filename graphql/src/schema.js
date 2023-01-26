import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers.js";

const typeDefs = `
	type Query {
		data: String
		data2: Int
		funct(name: String!): String
		datos: [Datos]
		Users: [User]
		Cars: [Car]
	}
	
	type Datos {
		id: ID
		title: String!
		desc: String!
		price: Int
	}
	
	type User {
		id: ID
		firstname: String!
		lastname: String
		age: Int!
	}
	
	type Car {
		id: ID
		modelname: String!
		year: Int
	}
	
	type Mutation {
		createDatos(input: DatosInput): Datos
		createUser(input: UserInput): User
		deleteUser(id: ID): User
		updateUser(id: ID, input: UserInput): User
		createCar(input: CarsInput): Car
		updateCar(id: ID, input: CarsInput): Car
		deleteCar(id: ID): Car
	}
	
	input DatosInput {
		title: String!
		desc: String!
		price: Int	
	}
	
	input UserInput {
		firstname: String!
		lastname: String
		age: Int!
	}
	
	
	input CarsInput {
		modelname: String!
		year: Int
	}
`;

export default makeExecutableSchema ({
	typeDefs: typeDefs,
	resolvers: resolvers
})
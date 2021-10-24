import { gql } from "apollo-server-core";

export default gql `

extend type Query {
  authUser: User!
  authenticateUser(username: String!, password: String!): AuthResponse!
}

extend type Mutation {
  registerUser(newUser: UserInput!): AuthResponse!
}

input UserInput {
  firstName: String!
  lastName: String!
  username: String!
  password: String!
  email: String!
  role: String!
}

type User {
    id: ID!
    email: String!
    username: String!
    lastName: String!
    firstName: String!
    role: Role!
    createdAt: String
    updatedAt: String
  }

  enum Role {
      User
      ADMIN
  }

  type AuthResponse {
    user: User!,
    token: String!
  }

`
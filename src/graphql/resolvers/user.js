import { ApolloError } from "apollo-server-errors";
import { hash, compare } from 'bcryptjs';
import { ObjectId } from "bson";

import { issueToken, serializeUser } from "../../functions";

export default {
  Query: {
    authenticateUser: async (_, {username, password}, {db}) => {
      try {
          let user = await db.collection("users").findOne({username});
          if(!user) {
              throw new Error('Username not found.');
          }
          let isMatch = await compare(password, user.password);
          if(!isMatch) {
              throw new Error('Invalid password.');
          }
          user.id = user._id;
          user = serializeUser(user);
          let token = await issueToken(user);
          return {
              user,
              token
          }
      } catch (error) {
          throw new ApolloError(error.message, 404);
      }
    },
  },
  Mutation: {
    registerUser: async (_, { newUser }, { db }) => {
        try {
            let { username, email } = newUser
        let user;
        user = await db.collection("users").findOne({ username });
        if(user) {
            throw new Error('Username is already taken.');
        }
        user = await db.collection("users").findOne({email});
        if(user) {
            throw new Error("Email is already taken.");
        }
        newUser.password = await hash(newUser.password, 10);
        let newUserId = await db.collection("users").insertOne(newUser);
        console.log(newUserId);
        let data = await db.collection("users").findOne(ObjectId(newUserId.insertedId))
        //result = result.toObject();
        data.id = data._id;
        const result = serializeUser(data);
        console.log('resssss::,',result);
        const token = await issueToken(data);
        return {
            token,
            user: result
        }
        } catch (error) {
         throw new ApolloError(error.message, 400)   
        }
    },
  },
};

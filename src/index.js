import { error, success } from "consola";
import express from "express";
import { graphqlUploadExpress } from "graphql-upload";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer, gql } from "apollo-server-express";
import path from "path";

import { PORT, DB } from "./config";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { MongoClient } from "mongodb";
import {applyMiddleware} from 'graphql-middleware';
import {rule, shield} from 'graphql-shield'
import { schemaDirectives } from "./graphql/directives";
import AuthMiddleware from './middleware/auth'

let mongoClient = null;

const app = express();
app.use((req, res, next) => {
  req.db = mongoClient.db("archi_graphql_api");
  next();
});
app.use(AuthMiddleware);
app.use(graphqlUploadExpress());
//app.use(express.static("uploads"));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives
});
const server = new ApolloServer({
  schema,
  playground: false,
  context: ({ req }) => {
    let { db, isAuth, user } = req;

    return {
      req,
      isAuth,
      user,
      db,
    };
  },
});

const startApp = async () => {
  try {
    MongoClient.connect(
      DB,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, client) {
        if (err) {
          console.log("Mongo connection error");
        } else {
          success({
            badge: true,
            message: `Successfully connected with the Database.`,
          });
          mongoClient = client;
        }
      }
    );
    await server.start();
    server.applyMiddleware({
      app,
    });

    app.listen(PORT, () =>
      success({
        badge: true,
        message: `Server started on PORT ${PORT}`,
      })
    );
  } catch (err) {
    console.log('erro:',err);
    // error({
    //   badge: true,
    //   message: err.message,
    // });
  }
};

startApp();

import {error, success} from 'consola';
import express from 'express';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {ApolloServer, gql} from 'apollo-server-express';
import {
    join,
    parse
} from 'path';

import {PORT, DB} from './config';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import {MongoClient} from 'mongodb';

let mongoClient = null;

const app = express();
app.use(express.static(join(__dirname, './uploads')));
app.use((req,res,next)=>{
    req.db = mongoClient.db('archi_graphql_api');
    next();
});
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });
const server = new ApolloServer({
    schema,
    playground: false,
    context: ({
        req
    }) => {

        let {
            db,
        } = req;

        return {
            req,
            db,
        };
    }
})

const startApp = async () => { 
    try {
        MongoClient.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true},function (err, client) {
            if(err) {
            console.log('Mongo connection error');
            } else {
                success({
                    badge: true,
                    message: `Successfully connected with the Database.`
                })
            mongoClient = client;
            }
        })
        await server.start();
        server.applyMiddleware({
            app
        })
        
        
        app.listen(PORT, () => success({
            badge: true,
            message: `Server started on PORT ${PORT}`
        }))

          
    } catch (err) {
        error({
            badge: true,
            message: err.message
        })
    }
    
}

startApp();

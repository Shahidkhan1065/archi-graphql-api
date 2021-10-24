import { defaultFieldResolver } from "graphql";
import {ApolloError, SchemaDirectiveVisitor } from 'apollo-server-express';

export class IsAuthDirective  {
    //visitFieldDefinition(field) {
        //const { resolve = defaultFieldResolver } = field;
        // field.resolve = async function (...args) {
        //     let test = args;
        //     console.log('testing::',test);
        // }
    //}
}
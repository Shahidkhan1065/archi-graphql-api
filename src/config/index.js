import {config} from 'dotenv';
import { MongoClient } from 'mongodb';
let db;
const {parsed} = config();
const client = new MongoClient('mongodb://localhost:27017');

    




export const {
    PORT,
    MODE,
    IN_PROD = MODE === 'prod',
    DB = 'mongodb://localhost:27017',
    Connection = client,
    DB_NAME = 'archi_graphql_api'
    } = parsed 
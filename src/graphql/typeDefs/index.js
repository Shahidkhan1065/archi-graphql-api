import {gql} from 'apollo-server-express';

import baseDefs from './baseDefs';
import blog from './blog';
import user from './user';

export default [baseDefs, blog, user];
import {gql} from 'apollo-server-express';

import baseDefs from './baseDefs';
import blog from './blog';

export default [baseDefs, blog];
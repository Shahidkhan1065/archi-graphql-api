import { sign } from "jsonwebtoken";
import { pick } from "lodash";
import { SECRET } from '../config';

export const issueToken = async (user) => {
    let token = await sign(user, SECRET);
    return `Bearer ${token}`
}

export const serializeUser =  (user) => 
     pick(user, ['id', 'username', 'email', 'firstName', 'lastName', 'role'])

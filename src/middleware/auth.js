import { ObjectId } from "bson";
import { verify } from "jsonwebtoken";
import { SECRET } from "../config";

const AuthMiddleware = async (req, res, next) => {
    const authHeaders = req.get("Authorization");
    if(!authHeaders) {
        req.isAuth = false;
        return next();
    }

    let token = authHeaders.split(' ')[1];
    if(!token || token === '') {
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    try {
        decodedToken = verify(token, SECRET);
    } catch (error) {
        req.isAuth = false;
        return next();
    }

    if(!decodedToken) {
        req.isAuth = false;
        return next();
    }
    let authUser = await req.db.collection('users').findOne(ObjectId(decodedToken.id));
    if(!authUser) {
        req.isAuth = false;
        return next();
    }

    req.user = authUser;
    req.isAuth = true;
    return next();
}

export default AuthMiddleware;
import { DB } from './db';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export default class Authentication {
    //Returns token if correct, null otherwise
    static passwordLogin(user: string, pass: string) {
        let u = DB.Users.find(u => u.name == user && u.password == pass)
        if (u == null) return null;
        let payload = {
            user: u.id
        };
        return jwt.sign(payload, config.JWTSecret);
    }

    //Returns user or null
    static userFromToken(token: string) {
        let verifyOptions = {
            algorithm: ["RS256"]
        };
        try {
            var decoded: any = jwt.verify(token, config.JWTSecret);
            return DB.Users.find(u => u.id == decoded.user);
        }
        catch(err) {
            console.log(err);
            return null;
        }
    }
}
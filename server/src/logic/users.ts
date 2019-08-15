import { DB } from "./db";
import { UserInfo } from "../../../shared-objects/UserInfo";

export class Users {
    static getUserByID(id) {
        let user = DB.Users.find(v => v.id == id);
        return user;
    }
}
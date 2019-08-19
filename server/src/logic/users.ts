import { LoggedInUserInfo } from './../../../shared-objects/UserInfo';
import { DB } from "./db";
import { UserInfo } from "../../../shared-objects/UserInfo";
import sharp from 'sharp';
import path from 'path';

export class Users {
    static getUserByID(id: string) {
        let user = DB.Users.find(v => v.id == id);
        return user;
    }

    static getStandardUserByID(id: string) {
        let user = this.getUserByID(id);
        if(user == null) return null;
        let u: UserInfo = {
            id: user.id,
            name: user.name,
        }
        return u;
    }

    static getExpandedUserByID(id: string) {
        let user = this.getUserByID(id);
        if(user == null) return null;
        let u: LoggedInUserInfo = {
            id: user.id,
            name: user.name,
            courses: user.courses,
        }
        return u;
    }

    static getPfpImageBuffer(id: string, size?: number) {
        if (size == null) size = 256;
        let user = this.getUserByID(id);
        if (user == null) return null;
        return sharp(path.join(__dirname, '..', user.pfp))
            .resize(size, size)
            .png()
            .toBuffer()
    }
}
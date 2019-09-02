import { DB } from "./db";
import { PageData } from "../../../shared-objects/PageData";
import { Pages } from "./pages";

export class Comments {
    static getComment(id: string) {
        let comment = DB.Comments.find(v => v.id == id);
        if (comment != null) {
            return comment;
        }
        else return null;
    }

    static likeComment(cid: string, user: string) {
        let likes = this.getComment(cid).likes
        if (!likes.includes(user)) likes.push(user);
    }

    static unlikeComment(cid: string, user: string) {
        let likes = this.getComment(cid).likes
        if (likes.includes(user)) likes.splice(likes.indexOf(user), 1);
    }
}

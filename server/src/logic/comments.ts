import { DB } from "./db";
import { PageData } from "../../../shared-objects/PageData";
import { Pages } from "./pages";
const shortid = require('shortid');

export class Comments {
    static getComment(id: string) {
        let comment = DB.Comments.find(v => v.id == id);
        if (comment != null) {
            return comment;
        }
        else return null;
    }

    static postComment(data: string, pid: string, uid: string){
        let id = shortid.generate();
        let comment = {
            author: uid,
            content: data,
            id: id,
            isReply: false,
            likes: [],
            ownerPage: pid,
            replies: [],
            time: new Date().toString()
        }
        DB.Comments.push(comment);
        Pages.getPage(pid).comments.push(id);
        return comment;
    }

    static postReply(data: string, cid: string, pid: string, uid: string){
        let id = shortid.generate();
        let reply = {
            author: uid,
            content: data,
            id: id,
            isReply: true,
            likes: [],
            ownerPage: pid,
            replies: [],
            time: new Date().toString()
        }
        DB.Comments.push(reply);
        Comments.getComment(cid).replies.push(id);
        return reply;
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
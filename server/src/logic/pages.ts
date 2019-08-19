import { DB } from "./db";
import { PageData } from "../../../shared-objects/PageData";

export class Pages {
    static getPage(id: string) {
        let page = DB.Pages.find(v => v.id == id);
        if (page != null) {
            return page;
        }
        else return null;
    }

    static likeComment(pid: string, cid: string, user: string){
        let likes = this.getPage(pid).comments.find(c => c.id == cid).likes
        if(!likes.includes(user)) likes.push(user);
    }

    static unlikeComment(pid: string, cid: string, user: string){
        let likes = this.getPage(pid).comments.find(c => c.id == cid).likes
        if(likes.includes(user)) likes.splice(likes.indexOf(user), 1);
    }
}
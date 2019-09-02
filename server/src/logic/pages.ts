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
}
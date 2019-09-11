import { DB } from "./db";
import { PageData } from "../../../shared-objects/PageData";
import { Page } from "../models/Page";
const shortid = require('shortid');

export class Pages {
    static getPage(id: string) {
        let page = DB.Pages.find(v => v.id == id);
        if (page != null) {
            return page;
        }
        else return null;
    }

    static createPage(cid: string){
        let pid = shortid.generate();
        let page: Page = {
            comments: [],
            courseId: cid,
            data: {
                html: ""
            },
            id: pid,
            name: 'New Page',
            type: "html"
        }
        DB.Pages.push(page);
        let course = DB.Courses.find(c => c.id == cid);
        course.pages.push(page.id);
        return page;
    }

    static changePageName(id: string, name: string){
        DB.Pages.find(p => p.id == id).name = name;        
    }

    static updatePage(id: string, data: string){
        DB.Pages.find(p => p.id == id).data.html = data;        
    }
}
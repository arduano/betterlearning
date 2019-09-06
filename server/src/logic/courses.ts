import { ModifyCourseData } from './../../../shared-objects/CourseState';
import { DB } from "./db";
import { NavPage, NavPageFolder, CourseState } from "../../../shared-objects/CourseState";
import { Pages } from './pages';

export class Courses {
    static getBasicCourseData(id) {
        let course = DB.Courses.find(v => v.id == id);
        if (course != null) {
            let pages: (NavPage | NavPageFolder)[] = []
            course.navPages.forEach(pid1 => {
                if ((pid1 as any).name != null) {
                    let subpages: NavPage[] = [];
                    (pid1 as any).pages.forEach(pid2 => {
                        let page = DB.Pages.find(p => p.id == pid2)
                        if (page != null) {
                            subpages.push({ name: page.name, id: page.id });
                        }
                    });
                    pages.push({ name: (pid1 as any).name, pages: subpages });
                }
                else {
                    let page = DB.Pages.find(p => p.id == pid1)
                    if (page != null) {
                        pages.push({ name: page.name, id: page.id });
                    }
                }
            });
            let c: CourseState = {
                courseId: course.id,
                courseName: course.name,
                pages: pages,
                admins: course.admins
            }
            return c;
        }
        else return null;
    }

    static modifyCourseData(cid: string, data: ModifyCourseData){
        let course = this.getBasicCourseData(cid);
        if(course == null) return null;
        
        let c = DB.Courses.find(c => c.id == cid);
        if(c.name != data.courseName){
            c.name = data.courseName;
        }

        c.navPages = data.pages.map(p1 => {
            if((p1 as NavPageFolder).pages != null){
                return {
                    name: p1.name, 
                    pages: (p1 as NavPageFolder).pages.map(p2 => {
                        if(Pages.getPage(p2.id).name != p2.name){
                            Pages.changePageName(p2.id, p2.name);
                        }
                        return p2.id;
                    })
                }
            }
            else{
                if(Pages.getPage((p1 as NavPage).id).name != p1.name){
                    Pages.changePageName((p1 as NavPage).id, p1.name);
                }
                return (p1 as NavPage).id;
            }
        })
        return this.getBasicCourseData(cid);
    }
}
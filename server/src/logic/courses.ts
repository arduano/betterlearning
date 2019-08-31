import { DB } from "./db";
import { NavPage, NavPageFolder, CourseState } from "../../../shared-objects/CourseState";

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
}
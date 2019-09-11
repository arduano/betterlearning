import { Course } from './models/Course';
import Authentication from "./logic/authentication";
import { Pages } from "./logic/pages";
import { User } from "./models/User";
import { DB } from "./logic/db";
import { Page } from './models/Page';


const reqUser = (req) => (req as any).user as User;
const reqPage = (req) => (req as any).page as Page;
const reqComment = (req) => (req as any).comment as Comment;
const reqCourse = (req) => (req as any).course as Course;

const auth = (req, res, next) => {
    let token = req.headers.authorization;

    if (token == null) {
        res.status(403).send('no authentication token provided');
    }

    if (!token.startsWith('Bearer ')) {
        res.status(400).send('invalid authorization header format');
        return;
    }

    let user = Authentication.userFromToken(token.substr(7));
    if (user == null) {
        res.status(403).send('invalid authentication token');
        return;
    }
    req.user = user;
    next();
}
const page = (arg: string, admin?: boolean) => {
    if (admin == undefined) admin = false;
    return (req, res, next) => {
        let pid = req.params[arg];
        let page = Pages.getPage(pid);
        if (page == null) {
            res.status(404).send('page not found');
            return;
        }
        if (!((req as any).user as User).courses.map(c => c.id).includes(page.courseId)) {
            res.status(403).send('user doesn\'t have access to the course');
            return;
        }
        if (admin) {
            if (!DB.Courses.find(c => c.id == page.courseId).admins.includes(reqUser(req).id)) {
                res.status(403).send('insufficient user permissions');
                return;
            }
        }
        req.page = page;
        next();
    }
}
const comment = (arg: string) => {
    return (req, res, next) => {
        let cid = req.params[arg];

        let comment = DB.Comments.find(c => c.id == cid);
        if (comment == null) {
            res.status(404).send('comment not found');
            return;
        }
        let cpage = DB.Pages.find(p => p.id == comment.ownerPage);
        if (cpage == null) {
            res.status(404).send('page not found');
            return;
        }
        let user = ((req as any).user as User);

        if (!user.courses.map(c => c.id).includes(cpage.courseId)) {
            res.status(403).send('user doesn\'t have access to the course');
            return;
        }

        req.comment = comment;
        next();
    }
}
const course = (arg: string, admin?: boolean) => {
    if (admin == undefined) admin = false;
    return (req, res, next) => {
        let cid = req.params[arg];

        let course = DB.Courses.find(c => c.id == cid);
        if (course == null) {
            res.status(404).send('course not found');
            return;
        }
        let user = ((req as any).user as User);
        if (!user.courses.map(c => c.id).includes(course.id)) {
            res.status(403).send('user isn\'t part of course');
            return;
        }
        if (admin) {
            if (!course.admins.includes(reqUser(req).id)) {
                res.status(403).send('insufficient user permissions');
                return;
            }
        }

        req.course = course;
        next();
    }
}

export default {
    auth, page, comment, course
}
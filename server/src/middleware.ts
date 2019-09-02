import Authentication from "./logic/authentication";
import { Pages } from "./logic/pages";
import { User } from "./models/User";
import { DB } from "./logic/db";

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
const page = (arg: string) => {
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

        if(!user.courses.map(c => c.id).includes(cpage.courseId)){
            res.status(403).send('user doesn\'t have access to the course');
            return;
        }
        
        req.comment = comment;
        next();
    }
}

export default {
    auth, page, comment
}
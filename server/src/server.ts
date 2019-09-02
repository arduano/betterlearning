import { PageComments } from './../../shared-objects/PageComments';
import { UserInfo } from './../../shared-objects/UserInfo';
import { Users } from './logic/users';
import { PageComment } from '../../shared-objects/PageComment';
import { Pages } from './logic/pages';
import { Courses } from './logic/courses';
import { DB } from './logic/db';
import { LoggedInUserInfo } from '../../shared-objects/UserInfo'
import { CourseState, NavPage, NavPageFolder } from '../../shared-objects/CourseState'
import express from 'express';
import jwt from 'jsonwebtoken';
import Authentication from './logic/authentication';
import { User } from './models/User';
import { PageData } from '../../shared-objects/PageData';
import { Page } from './models/Page';
import m from './middleware';
import { Comments } from './logic/comments';
import { Comment } from './models/Comment';

const app = express();
const port = 8080;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, UPDATE');
    next();
});
app.use(express.json())

const reqUser = (req) => (req as any).user as User;
const reqPage = (req) => (req as any).page as Page;
const reqComment = (req) => (req as any).comment as Comment;

app.get('/', (req, res) => {
    res.send('h');
});

//Retrieve the course information
//Url: id (course id)
//Requires authorisation
//Returns CourseState object
app.get('/api1/course/:id', m.auth, (req, res) => {
    let course = Courses.getBasicCourseData(req.params.id)
    if (course != null) {
        res.status(200).send(course);
    }
    else
        res.status(404).send('course not found');
});

//Login the user
//Takes { name: string, pass: string }
//Returns { token: string }
app.post('/api1/login', (req, res) => {
    let token = Authentication.passwordLogin(req.body.name, req.body.pass);
    if (token != null)
        res.status(200).send({ token });
    else
        res.status(403).send('Incorrect Credentials');
});

//Takes course id, page id
//Returns PageData
app.get('/api1/page/:cid/:pid', m.auth, (req, res) => {
    if (!reqUser(req).courses.find(c => c.id == req.params.cid)) {
        res.status(404).send('course not found in user\'s courses');
        return;
    }
    let page = Pages.getPage(req.params.pid);
    if (page.courseId != req.params.cid) {
        res.status(404).send('page not found on course');
        return;
    }
    let p: PageData = {
        name: page.name,
        id: page.id,
        type: page.type,
        data: page.data
    }
    res.status(200).send(p);
})

//Takes page id
//Returns comments array
app.get('/api1/comments/:pid', m.auth, m.page('pid'), (req, res) => {
    let page = reqPage(req);
    let c: PageComments = {
        comments: page.comments.map(c => {
            let comment = Comments.getComment(c);
            if (comment == null) return null;
            let replies = comment.replies.map(r => {
                let reply = Comments.getComment(r)
                if(reply == null) return null;
                return {
                    id: reply.id,
                    author: reply.author,
                    time: reply.time
                }
            }).filter(r => r != null);
            return {
                id: comment.id,
                author: comment.author,
                replies: replies,
                time: comment.time
            }
        }).filter(c => c != null)
    };

    res.status(200).send(c);
})

//Takes comment id
//Returns comment data
app.get('/api1/comment/:cid', m.auth, m.comment('cid'), (req, res) => {
    let c: PageComment = reqComment(req);
    res.status(200).send(c);
})

//Takes page id and data
//Posts comment and returns comment data
app.post('/api1/comment/:pid', m.auth, m.page('pid'), (req, res) => {
    let c: PageComment = Comments.postComment(req.body.data, req.params.pid, reqUser(req).id);
    res.status(200).send(c);
})

//Takes page id, comment id and data
//Posts reply and returns comment data
app.post('/api1/reply/:pid/:cid', m.auth, m.page('pid'), m.comment('cid'), (req, res) => {
    let c: PageComment = Comments.postReply(req.body.data, req.params.cid, req.params.pid, reqUser(req).id);
    res.status(200).send(c);
})

//Takes page id and comment id
//likes the comment
app.put('/api1/likes/:cid', m.auth, m.comment('cid'), (req, res) => {
    Comments.likeComment(req.params.cid, reqUser(req).id);
    res.status(200).send('success');
})

//Takes page id and comment id
//unlikes the comment
app.delete('/api1/likes/:cid', m.auth, m.comment('cid'), (req, res) => {
    Comments.unlikeComment(req.params.cid, reqUser(req).id);
    res.status(200).send('success');
    
})

//Takes basic authentication with no extra data
//Returns user's own data
app.get('/api1/user/@me', m.auth, (req, res) => {
    let user = reqUser(req);
    let u = Users.getExpandedUserByID(user.id);
    res.status(200).send(u);
})

//Takes user id
//Returns basic user data
app.get('/api1/user/:uid', m.auth, (req, res) => {
    let user = Users.getStandardUserByID(req.params.uid);
    if (user == null) {
        res.status(404).send('user not found');
        return;
    }
    res.status(200).send(user);
})

//Takes user id and optional image size
//Returns user profile picture as image
app.get('/api1/userpfp/:uid', async (req, res) => {
    let size = 256;
    if (req.query.size != null) {
        size = parseInt(req.query.size)
        if (size != size) {
            res.status(400).send(req.query.size + ' isn\'t a valid size');
            return;
        };
    }
    let pfp = Users.getPfpImageBuffer(req.params.uid, size);
    if (pfp == null) {
        res.status(404).send('user not found');
        return;
    }
    res.status(200).end(await pfp);
})



app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
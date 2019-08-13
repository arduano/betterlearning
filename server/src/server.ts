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

const app = express();
const port = 8080;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(express.json())

const auth = (req, res, next) => {
    let token = req.headers.authorization;
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
const reqUser = (req) => (req as any).user as User;

app.get('/', (req, res) => {
    res.send('h');
});

//Retrieve the course information
//Url: id (course id)
//Requires authorisation
//Returns CourseState object
app.get('/api1/course/:id', auth, (req, res) => {
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
    console.log(req.body);

    let token = Authentication.passwordLogin(req.body.name, req.body.pass);
    if (token != null)
        res.status(200).send({ token });
    else
        res.status(403).send('Incorrect Credentials');
});

//Check if the token is valid
//Takes { token: string }
//Returns LoggedInUserInfo
app.post('/api1/user', (req, res) => {
    console.log(req.body);
    if (req.body.token == 'test_token')
        res.status(200).send('test_user');
    else
        res.status(403).send('Invalid Token');
});

//Takes course id, page id
//Returns PageData
app.get('/api1/page/:cid/:pid', auth, (req, res) => {
    if(!reqUser(req).courses.find(c => c.id == req.params.cid)){
        res.status(404).send('course not found in user\'s courses');
        return;
    }
    let page = Pages.getPage(req.params.pid);
    if(page.courseId != req.params.cid){
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

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
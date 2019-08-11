import { User } from './../models/User';
import { Page } from './../models/Page';
import { Course } from './../models/Course';

const Users: User[] = [
    {
        id: '1234',
        name: 'user1',
        email: 'user1@mail.com',
        password: 'pass',
        salt: 'hhhh',
        courses: [
            {
                id: '12345',
                completedTasks: []
            }
        ]
    },
    {
        id: '5678',
        name: 'user2',
        email: 'user2@mail.com',
        password: 'pass',
        salt: 'jjjjj',
        courses: [
            {
                id: '12345',
                completedTasks: []
            }
        ]
    }
]

const Courses: Course[] = [
    {
        name: 'Test Course',
        id: '1234',
        pages: ['1', '2'],
        navPages: [
            '1',
            '2',
            {
                name: 'Folder',
                pages: [
                    '2',
                    '2',
                    '1',
                ]
            }
        ]
    }]

const Pages: Page[] = [
    {
        id: '1',
        name: 'Page 1',
        url: 'p1',
        content: '<h1>Page 1</h1>'
    },
    {
        id: '2',
        name: 'Page 2',
        url: 'p2',
        content: '<h3>Page 2</h3>'
    }
]

export const DB = {
    Users,
    Courses,
    Pages,
}
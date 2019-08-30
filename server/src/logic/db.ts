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
        pfp: '/pfp/me.png',
        courses: [
            {
                id: '1234',
                admin: true,
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
        pfp: '/pfp/pfp.png',
        courses: [
            {
                id: '1234',
                admin: false,
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
                    '3',
                    '1',
                ]
            }
        ]
    }]

const Pages: Page[] = [
    {
        id: '1',
        courseId: '1234',
        name: 'Page 1',
        type: 'html',
        data: { html: '<div><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1><h1>Page 1</h1></div>' },
        comments: [
            {
                id: '1',
                author: '1234',
                content: 'test comment',
                time: new Date(),
                likes: [],
                replies: []
            },
            {
                id: '2',
                author: '1234',
                content: 'hhhhhh',
                time: new Date(),
                likes: [],
                replies: []
            }
        ]
    },
    {
        id: '2',
        courseId: '1234',
        name: 'Page 2',
        type: 'html',
        data: { html: '<h3>Page 2</h3>' },
        comments: []
    },
    {
        id: '3',
        courseId: '1234',
        name: 'Page 3 Page 3 Page 3 Page 3 Page 3 Page 3',
        type: 'html',
        data: { html: '<html><head><style>div{background-color:red;}</style></head><body><div>test</div></body></html>' },
        comments: [
            {
                id: '1',
                author: '1234',
                content: 'test comment',
                time: new Date(),
                likes: ['1234'],
                replies: []
            },
            {
                id: '2',
                author: '5678',
                content: 'hhhhhh',
                time: new Date(),
                likes: [],
                replies: []
            }
        ]
    }
]

export const DB = {
    Users,
    Courses,
    Pages,
}
import { User } from './../models/User';
import { Page } from './../models/Page';
import { Course } from './../models/Course';
import { Comment } from '../models/Comment';

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
       "name":"Demo Course",
       "id":"1234",
       "pages":[ 
          "1",
          "2",
          "Hjjfv62iL",
          "zFg3fb_Bo",
          "bxF3xKS2ca",
          "hIYALvaUV",
          "W5kn0JG18F"
       ],
       "navPages":[ 
          "Hjjfv62iL",
          "zFg3fb_Bo",
          { 
             "name":"Weekly Tasks",
             "pages":[ 
                "hIYALvaUV",
                "W5kn0JG18F",
                "bxF3xKS2ca"
             ]
          }
       ],
       "admins":[ 
          "1234"
       ]
    }
 ]

const Pages: Page[] = [ 
    { 
       "comments":[ 
          "fKbJuMCoR",
          "EwVg7AMXt"
       ],
       "courseId":"1234",
       "data":{ 
          "html":"<p><span class=\"ql-size-huge\">Intro Page</span></p><p><br></p><p>Not much to show here really, just a demo page</p><p><br></p><p>Have some lipsum:</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nibh cras pulvinar mattis nunc sed blandit libero volutpat sed. In ornare quam viverra orci sagittis eu volutpat odio. Id cursus metus aliquam eleifend. Velit egestas dui id ornare arcu odio. Sed vulputate mi sit amet mauris commodo. Eget nunc scelerisque viverra mauris in. Nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est. Egestas sed sed risus pretium quam vulputate dignissim suspendisse in. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat.</p><p>Sit amet nulla facilisi morbi tempus iaculis urna id volutpat. Urna duis convallis convallis tellus. Metus dictum at tempor commodo ullamcorper. Bibendum ut tristique et egestas quis ipsum suspendisse ultrices. Volutpat commodo sed egestas egestas fringilla phasellus faucibus. Rhoncus dolor purus non enim praesent. Est pellentesque elit ullamcorper dignissim cras. Sed nisi lacus sed viverra tellus in hac habitasse platea. Eget nunc lobortis mattis aliquam faucibus purus in massa. Et ligula ullamcorper malesuada proin libero nunc. Amet massa vitae tortor condimentum lacinia quis vel eros. Lorem dolor sed viverra ipsum. Arcu cursus vitae congue mauris rhoncus aenean vel. Sed odio morbi quis commodo odio aenean sed adipiscing diam. Faucibus nisl tincidunt eget nullam non nisi est. Amet consectetur adipiscing elit duis tristique.</p><p>Diam vulputate ut pharetra sit amet aliquam id diam maecenas. A pellentesque sit amet porttitor eget. Sed vulputate odio ut enim blandit. Risus ultricies tristique nulla aliquet enim tortor at auctor. Quam vulputate dignissim suspendisse in est. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Et ultrices neque ornare aenean euismod elementum nisi quis eleifend. Eu volutpat odio facilisis mauris sit. Sit amet massa vitae tortor. Ornare arcu dui vivamus arcu felis bibendum ut tristique. Velit ut tortor pretium viverra suspendisse. In arcu cursus euismod quis viverra nibh. Sapien eget mi proin sed libero enim sed faucibus turpis. Nunc sed id semper risus in hendrerit. Nulla facilisi etiam dignissim diam quis enim lobortis. Vel turpis nunc eget lorem dolor sed viverra ipsum nunc. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Nunc sed blandit libero volutpat sed cras ornare arcu. Orci sagittis eu volutpat odio facilisis mauris. Cras ornare arcu dui vivamus arcu felis bibendum ut tristique.</p><p>Tellus in metus vulputate eu scelerisque felis. Dui accumsan sit amet nulla facilisi. Neque ornare aenean euismod elementum nisi quis eleifend. Lectus arcu bibendum at varius vel. Morbi tristique senectus et netus et malesuada fames ac turpis. Maecenas ultricies mi eget mauris pharetra. Arcu risus quis varius quam quisque id. Lectus sit amet est placerat in egestas erat imperdiet sed. Laoreet sit amet cursus sit amet dictum sit amet. Fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Faucibus et molestie ac feugiat.</p><p>Erat pellentesque adipiscing commodo elit at imperdiet dui. Pretium nibh ipsum consequat nisl vel pretium lectus. Aliquet bibendum enim facilisis gravida neque. Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Ornare suspendisse sed nisi lacus sed. Porta non pulvinar neque laoreet suspendisse interdum consectetur libero id. Adipiscing bibendum est ultricies integer quis auctor elit sed vulputate. Quisque id diam vel quam elementum pulvinar etiam non quam. Sit amet consectetur adipiscing elit. Leo vel orci porta non.</p>"
       },
       "id":"Hjjfv62iL",
       "name":"Intro",
       "type":"html"
    },
    { 
       "comments":[ 
          "d8TSS1vY4"
       ],
       "courseId":"1234",
       "data":{ 
          "html":"<p>Week 1</p><ul><li>Eat Pizza</li><li>Learn C</li></ul><p>Week 2</p><ul><li>Eat Pizza</li><li>Mandelbrot</li></ul><p>Week 3</p><ul><li>Eat Pizza</li><li>Knowledge island</li></ul>"
       },
       "id":"zFg3fb_Bo",
       "name":"Course Timeline",
       "type":"html"
    },
    { 
       "comments":[ 

       ],
       "courseId":"1234",
       "data":{ 
          "html":""
       },
       "id":"bxF3xKS2ca",
       "name":"Week 3",
       "type":"html"
    },
    { 
       "comments":[ 

       ],
       "courseId":"1234",
       "data":{ 
          "html":""
       },
       "id":"hIYALvaUV",
       "name":"Week 1",
       "type":"html"
    },
    { 
       "comments":[ 

       ],
       "courseId":"1234",
       "data":{ 
          "html":""
       },
       "id":"W5kn0JG18F",
       "name":"Week 2",
       "type":"html"
    }
 ]

const Comments: Comment[] = [ 
    { 
       "id":"1",
       "isReply":false,
       "ownerPage":"2",
       "author":"1234",
       "content":"test comment",
       "time":"2019-09-11T09:34:06.067Z",
       "likes":[ 
          "1234"
       ],
       "replies":[ 
          "3"
       ]
    },
    { 
       "id":"2",
       "isReply":false,
       "ownerPage":"2",
       "author":"5678",
       "content":"<strong>hhhhhh</strong>",
       "time":"2019-09-11T09:34:06.067Z",
       "likes":[ 

       ],
       "replies":[ 

       ]
    },
    { 
       "id":"3",
       "isReply":false,
       "ownerPage":"2",
       "author":"5678",
       "content":"<strong>hhhhhh</strong>",
       "time":"2019-09-11T09:34:06.067Z",
       "likes":[ 

       ],
       "replies":[ 

       ]
    },
    { 
       "author":"1234",
       "content":"<p>Epic Lipsum!</p>",
       "id":"fKbJuMCoR",
       "isReply":false,
       "likes":[ 

       ],
       "ownerPage":"Hjjfv62iL",
       "replies":[ 
          "9I4nfVQl4",
          "E0wMTLudG"
       ],
       "time":"2019-09-11T09:40:14.483Z"
    },
    { 
       "author":"5678",
       "content":"<p>pizza</p>",
       "id":"d8TSS1vY4",
       "isReply":false,
       "likes":[ 

       ],
       "ownerPage":"zFg3fb_Bo",
       "replies":[ 

       ],
       "time":"2019-09-11T09:42:28.754Z"
    },
    { 
       "author":"5678",
       "content":"<p>Another comment...</p>",
       "id":"EwVg7AMXt",
       "isReply":false,
       "likes":[ 

       ],
       "ownerPage":"Hjjfv62iL",
       "replies":[ 

       ],
       "time":"2019-09-11T09:42:40.516Z"
    },
    { 
       "author":"5678",
       "content":"<p>Comment reply</p>",
       "id":"9I4nfVQl4",
       "isReply":true,
       "likes":[ 

       ],
       "ownerPage":"Hjjfv62iL",
       "replies":[ 

       ],
       "time":"2019-09-11T09:43:00.015Z"
    },
    { 
       "author":"1234",
       "content":"<p>Another reply :)))</p>",
       "id":"E0wMTLudG",
       "isReply":true,
       "likes":[ 

       ],
       "ownerPage":"Hjjfv62iL",
       "replies":[ 

       ],
       "time":"2019-09-11T09:43:26.977Z"
    }
 ]

export const DB = {
    Users,
    Courses,
    Pages,
    Comments,
}
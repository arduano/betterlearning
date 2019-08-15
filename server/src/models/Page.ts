import { PageData } from './../../../shared-objects/PageData';

interface Reply{
    id: string,
    author: string,
    time: Date,
    content: string,
    likes: string[]
}

interface Comment extends Reply{
    replies: Reply[]
}

export interface Page extends PageData{
    courseId: string,
    comments: Comment[]
}
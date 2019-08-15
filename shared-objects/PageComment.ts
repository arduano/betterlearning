interface PageReply {
    id: string,
    author: string,
    time: Date,
    content: string,
    likes: string[]
}

export interface PageComment extends PageReply {
    replies: PageReply[]
}
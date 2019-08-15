interface PageReply {
    id: string,
    author: string,
    time: Date,
    content: string,
    likes: number
}

export interface PageComment extends PageReply {
    replies: PageReply[]
}
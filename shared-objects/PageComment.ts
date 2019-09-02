export interface PageComment {
    id: string,
    ownerPage: string,
    isReply: boolean,
    author: string,
    time: Date,
    content: string,
    likes: string[]
    replies: string[],
}
export interface PageComment {
    id: string,
    ownerPage: string,
    isReply: boolean,
    author: string,
    time: string,
    content: string,
    likes: string[]
    replies: string[],
}
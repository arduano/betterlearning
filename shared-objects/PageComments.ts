export interface PageComments {
    comments?: {
        id: string,
        author: string,
        time: Date,
        replies: {
            id: string,
            author: string,
            time: Date,
        }[]
    }[]
}
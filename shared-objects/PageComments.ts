export interface PageComments {
    comments?: {
        id: string,
        author: string,
        time: string,
        replies: {
            id: string,
            author: string,
            time: string,
        }[]
    }[]
}
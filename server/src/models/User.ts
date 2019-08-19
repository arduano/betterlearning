export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    salt: string,
    pfp: string,
    courses: {
        id: string,
        admin: boolean,
        completedTasks: {
            id: string,
            time: Date
        }[]
    }[]
}
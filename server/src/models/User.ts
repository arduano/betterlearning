export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    salt: string,
    courses: {
        id: string,
        completedTasks: {
            id: string,
            time: Date
        }[]
    }[]
}
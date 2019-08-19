export interface UserInfo{
    id: string,
    name: string,
}

export interface LoggedInUserInfo extends UserInfo{
    courses: {
        id: string,
        admin: boolean,
        completedTasks: {
            id: string,
            time: Date
        }[]
    }[]
}
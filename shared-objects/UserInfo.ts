export interface UserInfo{
    id: string,
    name: string,
}

export interface LoggedInUserInfo extends UserInfo{
    courses: string[]
}
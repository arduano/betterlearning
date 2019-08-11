export interface UserInfo{
    id: string;
}

export interface LoggedInUserInfo extends UserInfo{
    courses: string[]
}
export interface NavPageFolder {
    name: string,
    pages: NavPage[],
}

export interface NavPage {
    id: string,
    name: string
}

export type NavState = (NavPage | NavPageFolder)[]

export interface CourseState {
    courseName: string,
    courseId: string,
    pages: NavState,
    admins: string[]
}

export interface ModifyCourseData {
    courseName: string,
    pages: NavState
}
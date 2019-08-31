export interface NavPageFolder {
    name: string,
    pages: NavPage[],
}

export interface NavPage {
    id: string,
    name: string
}

export interface CourseState {
    courseName: string,
    courseId: string,
    pages: (NavPage | NavPageFolder)[],
    admins: string[]
}
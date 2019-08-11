export interface NavPageFolder {
    name: string,
    pages: NavPage[],
}

export interface NavPage {
    url: string,
    name: string
}

export interface CourseState {
    courseName: string,
    courseId: string,
    pages: (NavPage | NavPageFolder)[],
}
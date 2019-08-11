import { Page } from './Page';
export interface Course {
    id: string,
    name: string,
    pages: string[]
    navPages: (string | { name: string, pages: string[] })[],
}

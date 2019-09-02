import { PageData } from './../../../shared-objects/PageData';

export interface Page extends PageData{
    courseId: string,
    comments: string[]
}
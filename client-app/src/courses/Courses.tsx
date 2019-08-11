import React from "react";
import { CourseState } from '../../../shared-objects/CourseState';

type CoursesState = {
    courses: CourseState[]
}

export class Courses extends React.Component<{}, CoursesState>{
    constructor(props: {}){
        super(props)
    }

    componentWillMount(){
        
    }
}
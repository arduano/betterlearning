import React, { useState } from "react";
import { CourseState } from '../../../shared-objects/CourseState';
import { WebApi } from "../utils/ServerApi";
import { NavLink, Redirect } from "react-router-dom";
import { useGlobal } from "reactn";
import { LoggedInUserInfo } from "../../../shared-objects/UserInfo";
import { AppState } from "../utils/AppState";

export const Courses = (props: {}) => {
    const [user, _]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');

    if (user == null) {
        return null;
    }


    return (
        <div className="courseList">
            {user.courses.map((c, i) => (<CourseTile courseid={c.id} key={i} />))}
        </div>
    )
}

const CourseTile = (props: { courseid: string }) => {
    const [course, setCourse]: [CourseState | null, any] = useState<CourseState | null>(null);

    if (course == null) {
        new WebApi().getCourse(props.courseid).then(c => setCourse(c));
    }

    return (
        <h1><NavLink to={`/course/${props.courseid}`}>{course == null ? "loading..." : course.courseName}</NavLink></h1>
    )
}
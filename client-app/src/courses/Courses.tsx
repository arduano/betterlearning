import React, { useState } from "react";
import { CourseState } from '../../../shared-objects/CourseState';
import { WebApi } from "../utils/ServerApi";
import { NavLink, Redirect } from "react-router-dom";
import { useGlobal } from "reactn";
import { LoggedInUserInfo } from "../../../shared-objects/UserInfo";
import { AppState } from "../utils/AppState";

export const Courses = (props: {}) => {
    const [userPromise, setUserPromise]: [Promise<LoggedInUserInfo> | null, any] = useState(null);
    const [user, setUser]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');

    if (user == null) {
        if (localStorage.getItem('token') == null) {
            return <Redirect to="/login" />
        }
        else {
            if (userPromise == null) {
                setUserPromise(new WebApi().getMe().then(me => {
                    setUser(me);
                    setUserPromise(null);
                }));
            }

            return <h1>Loading...</h1>
        }
    }

    return (
        <div className="courseList">
            {user.courses.map((c, i) => (<CourseTile courseid={c} key={i} />))}
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
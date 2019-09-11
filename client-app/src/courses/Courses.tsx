import React, { useState } from "react";
import { CourseState } from '../../../shared-objects/CourseState';
import { WebApi } from "../utils/ServerApi";
import { NavLink, Redirect } from "react-router-dom";
import { useGlobal } from "reactn";
import { Scroller } from "../scroller/Scroller";
import { LoggedInUserInfo } from "../../../shared-objects/UserInfo";
import { AppState } from "../utils/AppState";
import './Courses.scss';
const Sortable = require('react-sortablejs');

export const Courses = (props: {}) => {
    const [user, _]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');

    if (user == null) {
        return null;
    }

    return (
        <div className="courses-page-fill">
            <Scroller>
            <div className="courses-title">My Courses</div>
                <div className="course-list">
                    {user.courses.map((c, i) => (<CourseTile courseid={c.id} key={i} />))}
                </div>
            </Scroller>
        </div>
    )
}

const CourseTile = (props: { courseid: string }) => {
    const [course, setCourse]: [CourseState | null, any] = useState<CourseState | null>(null);

    if (course == null) {
        new WebApi().getCourse(props.courseid).then(c => setCourse(c));
    }

    return (
        <NavLink to={`/course/${props.courseid}`}><div className="course-link">{course == null ? "Loading..." : course.courseName}</div></NavLink>
    )
}
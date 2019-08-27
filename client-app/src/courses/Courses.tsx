import React, { useState } from "react";
import { CourseState } from '../../../shared-objects/CourseState';
import { WebApi } from "../utils/ServerApi";
import { NavLink, Redirect } from "react-router-dom";
import { useGlobal } from "reactn";
import { LoggedInUserInfo } from "../../../shared-objects/UserInfo";
import { AppState } from "../utils/AppState";
const Sortable = require('react-sortablejs');

export const Courses = (props: {}) => {
    const [user, _]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');

    if (user == null) {
        return null;
    }

    return (
        <div className="courseList">
            {user.courses.map((c, i) => (<CourseTile courseid={c.id} key={i} />))}
            <div>
                <Sortable
                    options={{
                        group: {
                            name: 'parent',
                            put: ['folder'],
                            pull: ['folder']
                        },
                        animation: 150,
                        fallbackOnBody: true,
                        swapThreshold: 0.2
                    }}
                >
                    {
                        (['t1', 't2', 't3'].map((e, i) => (
                            <li className="folder" key={i}>
                                {e}
                                <div style={{ paddingLeft: "30px" }}>
                                    <Sortable
                                        options={{
                                            group: {
                                                name: 'folder',
                                                pull: ['parent'],
                                                put: (from: any, to: any, h: HTMLElement) => {
                                                    return !h.classList.contains('folder');
                                                }
                                            },
                                            animation: 150,
                                            fallbackOnBody: true,
                                            swapThreshold: 0.2
                                        }}
                                    >
                                        {['c1', 'c2', 'c3'].map((e, i) => (
                                            <li>{e}<button onClick={e => console.log('test!')}>test</button></li>
                                        ))}
                                    </Sortable>
                                </div>
                            </li>
                        )))
                    }
                </Sortable>
            </div>
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
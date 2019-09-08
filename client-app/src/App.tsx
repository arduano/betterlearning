import React, { useState } from 'react';
import { History, Location } from 'history';
import PropTypes from "prop-types";
import logo from './logo.svg';
import './App.css';
import { Scroller } from './scroller/Scroller';
import { Course } from './course/Course';
import { AppState } from './utils/AppState';
import { thisExpression } from '@babel/types';
import { Login } from './login/Login';
import reactn, { useGlobal } from 'reactn';
import { Courses } from './courses/Courses';
import { LoggedInUserInfo } from '../../shared-objects/UserInfo';
import { WebApi } from './utils/ServerApi';
import MyProfile from './profile/MyProfile';
import { Redirect, Router, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

function App() {
	const [user, setUser]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');

	console.log('render')
	return (
		<div className="App">
			<BrowserRouter>
				<div>
					<AuthRoute exact path="/courses" component={Courses} />
					<Route exact path="/login" component={Login} />
					<AuthRoute path="/profile" component={MyProfile} />
					<AuthRoute path="/course/:id" component={Course} />
				</div>
			</BrowserRouter>
		</div>
	);
}

function AuthRoute(props: { path: string, component: any, exact?: boolean }) {
	const [user, setUser]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');
	const [userPromise, setUserPromise]: [Promise<LoggedInUserInfo> | null, any] = useState(null);

	if (localStorage.getItem('token') == null) {
		return <Redirect to="/login" />;
	}
	if (user == null) {
		if (userPromise == null) {
			setUserPromise(new WebApi().getMe().then(me => {
				setUser(me);
				setUserPromise(null);
			}));
		}

		return <h1>Loading...</h1>
	}
	console.log('returned', user)
	return <Route exact={props.exact} component={props.component} path={props.path} />
}

export default App;

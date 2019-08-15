import React, { useState } from 'react';
import { History, Location } from 'history';
import PropTypes from "prop-types";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import { Scroller } from './scroller/Scroller';
import { Course } from './course/Course';
import { AppState } from './utils/AppState';
import { thisExpression } from '@babel/types';
import { Login } from './login/Login';
import { useGlobal } from 'reactn';
import { Courses } from './courses/Courses';
import { LoggedInUserInfo } from '../../shared-objects/UserInfo';
import { WebApi } from './utils/ServerApi';

function App() {
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
		<div className="App">
			<Router>
				<Route render={(args: any) => {
					return (
						<Switch location={args.location}>
							<Route exact path="/" component={Courses} />
							<Route exact path="/login" component={Login} />
							<Route path="/course/:id" component={Course} />
						</Switch>
					)
				}} />
			</Router>
		</div>
	);
}

export default App;

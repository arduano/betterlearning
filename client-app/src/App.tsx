import React from 'react';
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
import { setGlobal } from 'reactn';
import { Courses } from './courses/Courses';

setGlobal<AppState>({
	signedInUser: null
});

class App extends React.Component {

	componentWillUnmount() {

	}

	componentWillMount() {

	}

	render() {
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
}

export default App;

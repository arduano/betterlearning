import React, { RefObject } from "react";
import './Course.scss';
import { Scroller } from "../scroller/Scroller";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import { WebApi } from "../utils/ServerApi";
import { CourseState, NavPage, NavPageFolder } from '../../../shared-objects/CourseState';
import { AppState, AppStateConsumer } from "../utils/AppState";
import { getGlobal } from 'reactn';
import { PageWrapper } from "../pages/PageWrapper";
import { PageData } from "../../../shared-objects/PageData";

interface CourseStatePrivate extends CourseState {
    navHidden: boolean
}

type CourseProps = { ctx: AppState, match: { params: { id: string } } };
export class Course extends React.Component<CourseProps, CourseStatePrivate> {
    webapi: WebApi | null = null;

    pageQueries: any = {};

    constructor(props: CourseProps, state: CourseState) {
        super(props)

        this.state = {
            pages: [],
            navHidden: true,
            courseName: '',
            courseId: ''
        };
        this.mobileToggleNav = this.mobileToggleNav.bind(this);
        this.PageFeeder = this.PageFeeder.bind(this);

        this.webapi = new WebApi();

        this.webapi.getCourse(this.props.match.params.id).then(state => {
            //Request all pages in nav
            state.pages.forEach(page => {
                if ((page as NavPage).id == null) {
                    (page as NavPageFolder).pages.forEach(page2 => {
                        let id = (page2 as NavPage).id;
                        if (this.webapi != null)
                            if (this.pageQueries[id] == null) {
                                this.pageQueries[id] = this.webapi.getPage(this.props.match.params.id, id);
                            }
                    });
                }
                else {
                    let id = (page as NavPage).id;
                    if (this.webapi != null)
                        if (this.pageQueries[id] == null) {
                            this.pageQueries[id] = this.webapi.getPage(this.props.match.params.id, id);
                        }
                }
            });

            this.setState(state);
        });
    }


    componentWillMount() {

    }

    componentDidMount() {

    }

    mobileToggleNav() {
        this.setState({ navHidden: !this.state.navHidden });
    }

    PageFeeder(props: { match: { params: { pageid: string } } }) {
        let data = this.pageQueries[props.match.params.pageid];
        if (data == null) return <div></div>
        return <div style={{height: "100%"}}><PageWrapper data={this.pageQueries[props.match.params.pageid]} /></div>
    }

    NavLinks(props: { pages: (NavPage | NavPageFolder)[], parent: Course }) {
        return (
            <div>
                {props.pages.map((e, i) => {
                    if ((e as NavPage).id != null) {
                        e = e as NavPage;
                        return (
                            <Link to={e.id} key={i}>
                                <div className="nav-link" onClick={() => { if (!props.parent.state.navHidden) props.parent.mobileToggleNav() }}>
                                    {e.name}
                                </div>
                            </Link>
                        );
                    }
                    else {
                        return (<NavFolder key={i} pages={(e as NavPageFolder).pages} parent={props.parent} name={e.name} />)
                    }
                })}
            </div>
        );
    }

    render() {
        if (localStorage.getItem('token') == null) {
            return (
                <Redirect to="/login" />
            )
        }

        return (
            <Router>
                <Route render={(location: any) => {
                    location = location.location;
                    return (
                        <div className="main">
                            <div className={`left-nav ${this.state.navHidden ? '' : 'nav-open'}`}>
                                <div className="nav-header">
                                </div>
                                <Scroller>
                                    <div className="nav-content">
                                        <div className='course-name'>{this.state.courseName}</div>
                                        <this.NavLinks pages={this.state.pages} parent={this} />
                                    </div>
                                </Scroller>
                            </div>
                            <div className="right-content">
                                <div className={`black-overlay ${this.state.navHidden ? '' : 'visible'}`} onClick={this.mobileToggleNav}>
                                </div>
                                <div className="top-bar">
                                    <div className="open-nav-button" onClick={this.mobileToggleNav}>
                                    </div>
                                </div>
                                <div className="content">
                                    <TransitionGroup>
                                        <CSSTransition
                                            key={location.pathname}
                                            classNames="fade"
                                            timeout={400}
                                        >
                                            <Switch location={location}>
                                                <Route exact path="/course/:courseid/:pageid" component={this.PageFeeder} />
                                                <Route render={() => <div>Not Found</div>} />
                                            </Switch>
                                        </CSSTransition>
                                    </TransitionGroup>
                                </div>
                            </div>
                        </div>
                    )
                }} />
            </Router>
        );
    }
}

class NavFolder extends React.Component<
    { pages: NavPage[], name: string, parent: Course },
    { folded: boolean, unfoldHeight: number }>{
    constructor(props: { pages: NavPage[], name: string, parent: Course }) {
        super(props)
        this.state = {
            folded: true,
            unfoldHeight: 0
        };
        this.linksHeight = React.createRef();
    }

    linksHeight: RefObject<HTMLDivElement>;

    render() {
        let pages = this.props.pages.map((e, i) => {
            if ((e as NavPage).id != null) {
                e = e as NavPage;
                return (
                    <Link to={e.id} key={i}>
                        <div className="nav-link nav-child-link" onClick={() => { if (!this.props.parent.state.navHidden) this.props.parent.mobileToggleNav() }}>
                            {e.name}
                        </div>
                    </Link>
                );
            }
        });

        return (
            <div>
                <div className={`nav-link nav-folder ${this.state.folded ? '' : 'open'}`} onClick={() => this.toggleFold(this)}>
                    <span>{this.props.name}</span>
                    <span className="nav-folder-arrow">
                        <i className="material-icons down">keyboard_arrow_down</i>
                        <i className="material-icons up">keyboard_arrow_up</i>
                    </span>
                </div>
                <div className="links-collapse" style={{ height: this.state.unfoldHeight }}>
                    <div className="top-shadow" />
                    <div ref={this.linksHeight}>
                        {pages}
                    </div>
                    <div className="bottom-shadow" />
                </div>
            </div>
        )
    }

    toggleFold(_: any) {
        this.setState({ folded: !this.state.folded });
        if (this.state.folded && this.linksHeight.current != null)
            this.setState({ unfoldHeight: this.linksHeight.current.clientHeight });
        else
            this.setState({ unfoldHeight: 0 });
    }
}
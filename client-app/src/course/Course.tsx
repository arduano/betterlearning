import React, { RefObject } from "react";
import './Course.scss';
import { Scroller } from "../scroller/Scroller";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { WebApi } from "../utils/ServerApi";
import { CourseState, NavPage, NavPageFolder } from '../../../shared-objects/CourseState';
import { AppState } from "../utils/AppState";
import { useGlobal } from 'reactn';
import { PageWrapper } from "../pages/PageWrapper";
import { PageData } from "../../../shared-objects/PageData";
import { LoggedInUserInfo } from "../../../shared-objects/UserInfo";
import MyProfile from "../profile/MyProfile";
const Sortable = require('react-sortablejs');

interface CourseStatePrivate extends CourseState {
    navHidden: boolean,
    profileOpen: boolean
}

type CourseProps = { match: { params: { id: string } } };
export class Course extends React.Component<CourseProps, CourseStatePrivate> {
    webapi: WebApi | null = null;

    pageQueries: any = {};

    constructor(props: CourseProps, state: CourseState) {
        super(props)

        this.state = {
            pages: [],
            navHidden: true,
            courseName: '',
            courseId: '',
            profileOpen: false
        };
        this.mobileToggleNav = this.mobileToggleNav.bind(this);
        this.PageFeeder = this.PageFeeder.bind(this);
        this.OpenFirstPage = this.OpenFirstPage.bind(this);
        this.UserPfp = this.UserPfp.bind(this);
        this.renderMainView = this.renderMainView.bind(this);

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
        return <div style={{ height: "100%" }}><PageWrapper data={this.pageQueries[props.match.params.pageid]} /></div>
    }

    OpenFirstPage(props: { match: { params: { courseid: string } } }) {
        if (this.state.pages.length == 0 && this.state.courseId == '') return null;
        let firstPage = '@default';
        for (let i = 0; i < this.state.pages.length; i++) {
            if ((this.state.pages[i] as NavPage).id == null) {
                let folder = this.state.pages[i] as NavPageFolder;
                if (folder.pages.length != 0) {
                    firstPage = folder.pages[0].id;
                    break;
                }
            }
            else {
                firstPage = (this.state.pages[i] as NavPage).id;
                break;
            }
        }
        console.log(this.state.pages);
        return <Redirect to={`/course/${props.match.params.courseid}/${firstPage}`} />
    }

    UserPfp(props: {}) {
        const [user, setUser]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');
        if (this.webapi != null && user != null)
            return <img className="main-user-pfp" src={this.webapi.getPfpUrl(user.id, 512)} />
        return <div></div>
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

    renderMainView() {
        return (
            <Router>
                <Route render={(location: any) => {
                    location = location.location;
                    return (
                        <div className="main">
                            <div className={`left-nav ${this.state.navHidden ? '' : 'nav-open'}`}>
                                <div className="nav-header">
                                </div>
                                <div className="nav-content">
                                    <Scroller>
                                        <div className="nav-content">
                                            <div className='course-name'>{this.state.courseName}</div>
                                            <this.NavLinks pages={this.state.pages} parent={this} />
                                        </div>
                                    </Scroller>
                                </div>
                            </div>
                            <div className="right-content">
                                <div className={`black-overlay ${this.state.navHidden ? '' : 'visible'}`} onClick={this.mobileToggleNav}>
                                </div>
                                <div className="top-bar">
                                    <div className="left">
                                        <div className="open-nav-button" onClick={this.mobileToggleNav}>
                                        </div>
                                    </div>
                                    <div className="middle">
                                    </div>
                                    <div className="right" onClick={(() => this.setState({ profileOpen: true }))}>
                                        <this.UserPfp />
                                        <div className="profile-button">
                                            <div>Profile</div>
                                        </div>
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
                                                <Route exact path="/course/:courseid" component={this.OpenFirstPage} />
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
        )
    }

    render() {
        return (
            <div className="fill">
                <TransitionGroup>
                    <CSSTransition
                        key={this.state.profileOpen ? 1 : 0}
                        classNames="zoom-fade"
                        timeout={400}
                    >
                        {
                            (() => {
                                if (this.state.profileOpen) return (
                                    <div className="profile-view">
                                        <MyProfile onCloseClicked={(() => this.setState({ profileOpen: false }))} />
                                    </div>
                                )
                                return <div className="courses-view">{this.renderMainView()}</div>;
                            })()
                        }
                    </CSSTransition>
                </TransitionGroup>
            </div>
        )
    }
}

function EditableNavLinks(props: {}){
    const [user, _]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');
    
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
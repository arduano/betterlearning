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

interface CourseStatePrivate extends CourseState {
    navHidden: boolean
}

type CourseProps = { ctx: AppState, match: { params: { id: string } } };
export class Course extends React.Component<CourseProps, CourseStatePrivate > {
    webapi: WebApi | null = null;

    constructor(props: CourseProps, state: CourseState) {
        super(props)

        this.state = {
            pages: [],
            navHidden: true,
            courseName: '',
            courseId: ''
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.webapi = new WebApi();
        //console.log('state', )
        //console.log('test', (this.context as AppState).testvar)

        this.webapi.getCourse(this.props.match.params.id).then(pages => {
            this.setState(pages);
        });
    }

    mobileToggleNav(_: any) {
        this.setState({ navHidden: !this.state.navHidden });
    }

    NavLinks(props: { pages: (NavPage | NavPageFolder)[], parent: Course }) {
        return (
            <div>
                {props.pages.map((e, i) => {
                    if ((e as NavPage).url != null) {
                        e = e as NavPage;
                        return (
                            <Link to={e.url} key={i}>
                                <div className="nav-link" onClick={() => { if (!props.parent.state.navHidden) props.parent.mobileToggleNav(this) }}>
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
                                <div className={`black-overlay ${this.state.navHidden ? '' : 'visible'}`} onClick={() => this.mobileToggleNav(this)}>
                                </div>
                                <div className="top-bar">
                                    <div className="open-nav-button" onClick={() => this.mobileToggleNav(this)}>
                                    </div>
                                </div>
                                <div className="content">
                                    <div>
                                        <div style={styles.content}>
                                            <TransitionGroup>
                                                <CSSTransition
                                                    key={location.pathname}
                                                    classNames="fade"
                                                    timeout={400}
                                                >
                                                    <Switch location={location}>
                                                        <Route exact path="/hsl/:h/:s/:l" component={HSL} />
                                                        <Route exact path="/rgb/:r/:g/:b" component={RGB} />
                                                        <Route exact path="/longpage" component={LongPage} />
                                                        <Route render={() => <div>Not Found</div>} />
                                                    </Switch>
                                                </CSSTransition>
                                            </TransitionGroup>
                                        </div>
                                    </div>
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
            if ((e as NavPage).url != null) {
                e = e as NavPage;
                return (
                    <Link to={e.url} key={i}>
                        <div className="nav-link nav-child-link" onClick={() => { if (!this.props.parent.state.navHidden) this.props.parent.mobileToggleNav(this) }}>
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

function HSL({ match: { params } }: any) {
    return (
        <div
            style={{
                ...styles.fill,
                ...styles.hsl,
                background: `hsl(${params.h}, ${params.s}%, ${params.l}%)`
            }}
        >
            hsl(
        {params.h}, {params.s}
            %, {params.l}
            %)
      </div>
    );
}

function RGB({ match: { params } }: any) {
    return (
        <div
            style={{
                ...styles.fill,
                ...styles.rgb,
                background: `rgb(${params.r}, ${params.g}, ${params.b})`
            }}
        >
            rgb(
        {params.r}, {params.g}, {params.b})
      </div>
    );
}

function LongPage({ match: { params } }: any) {
    let lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    let lines = lipsum.split(' ').map(l => (<h1>{l}</h1>));

    return (
        <div style={styles.fill}>
            <Scroller>
                <h1>{lines}</h1>
            </Scroller>
        </div>
    );
}

const styles: any = {};

styles.fill = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
};

styles.content = {
    ...styles.fill,
    textAlign: "center"
};

styles.navItem = {
    textAlign: "center",
    flex: 1,
    listStyleType: "none",
    padding: "10px"
};

styles.hsl = {
    ...styles.fill,
    color: "white",
    paddingTop: "20px",
    fontSize: "30px"
};

styles.rgb = {
    ...styles.fill,
    color: "white",
    paddingTop: "20px",
    fontSize: "30px"
};
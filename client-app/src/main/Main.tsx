import React, { RefObject } from "react";
import './Main.scss';
import { Scroller } from "../scroller/Scroller";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import { WebApi } from "../utils/server-api";

interface PageFolder {
    name: string,
    pages: Page[],
}

interface Page {
    url: string,
    name: string
}

export interface MainState {
    pages: (Page | PageFolder)[],
    courseName: string
}

class NavFolder extends React.Component<
    { pages: Page[], name: string, parent: Main },
    { folded: boolean, unfoldHeight: number }>{
    constructor(props: { pages: Page[], name: string, parent: Main }) {
        super(props)
        this.state = {
            folded: true,
            unfoldHeight: 0
        };
        this.linksHeight = React.createRef();
    }

    linksHeight: RefObject<HTMLDivElement>;

    render() {
        let pages = this.props.pages.map(e => {
            if ((e as Page).url != null) {
                e = e as Page;
                return (
                    <Link to={e.url}>
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

interface MainStatePrivate extends MainState {
    navHidden: boolean
}

export class Main extends React.Component<{}, MainStatePrivate>{
    constructor(props: {}, state: MainState) {
        super(props)
        this.state = {
            pages: [],
            navHidden: true,
            courseName: ''
        };
        WebApi.getNavPages().then(pages => {
            setTimeout(() => this.setState(pages), 2000);

        });
    }

    mobileToggleNav(_: any) {
        this.setState({ navHidden: !this.state.navHidden });
    }

    NavLinks(props: { pages: (Page | PageFolder)[], parent: Main }) {
        return (
            <div>
                {props.pages.map(e => {
                    if ((e as Page).url != null) {
                        e = e as Page;
                        return (
                            <Link to={e.url}>
                                <div className="nav-link" onClick={() => { if (!props.parent.state.navHidden) props.parent.mobileToggleNav(this) }}>
                                    {e.name}
                                </div>
                            </Link>
                        );
                    }
                    else {
                        return (<NavFolder pages={(e as PageFolder).pages} parent={props.parent} name={e.name} />)
                    }
                })}
            </div>
        );
    }

    render() {
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
                                                {/* no different than other usage of
                                                    CSSTransition, just make sure to pass
                                                    `location` to `Switch` so it can match
                                                    the old location as it animates out
                                                */}
                                                <CSSTransition
                                                    key={location.pathname}
                                                    classNames="fade"
                                                    timeout={400}
                                                >
                                                    <Switch location={location}>
                                                        <Route exact path="/hsl/:h/:s/:l" component={HSL} />
                                                        <Route exact path="/rgb/:r/:g/:b" component={RGB} />
                                                        <Route exact path="/longpage" component={LongPage} />
                                                        {/* Without this `Route`, we would get errors during
                                                            the initial transition from `/` to `/hsl/10/90/50`
                                                        */}
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

function NavLink(props: any) {
    return (
        <li style={styles.navItem}>
            <Link {...props} style={{ color: "inherit" }} />
        </li>
    );
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
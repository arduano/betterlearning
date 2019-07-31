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

type PageFolder = {
    name: string,
    pages: Page[],
}

type Page = {
    url: string,
    name: string
}

type MainState = {
    pages: (Page | PageFolder)[],
    navHidden: boolean
}

class NavFolder extends React.Component<{ pages: Page[], name: string, parent: Main }, { folded: boolean, unfoldHeight: number }>{
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
                <div className={`nav-link ${this.state.folded ? '' : 'open'}`} onClick={() => this.toggleFold(this)}>
                    {this.props.name}
                </div>
                <div className="links-collapse" style={{ height: this.state.unfoldHeight }}>
                    <div className="top-shadow"/>
                    <div ref={this.linksHeight}>
                        {pages}
                    </div>
                    <div className="bottom-shadow"/>
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

export class Main extends React.Component<{}, MainState>{
    constructor(props: {}, state: MainState) {
        super(props)
        this.state = {
            pages: [
                { name: 'Red', url: '/hsl/10/90/50' },
                { name: 'Green', url: '/hsl/120/100/40' },
                { name: 'Blue', url: '/rgb/33/150/243' },
                {
                    name: 'Link Folder', pages: [
                        { name: 'Red', url: '/hsl/10/90/50' },
                        { name: 'Green', url: '/hsl/120/100/40' },
                        { name: 'Blue', url: '/rgb/33/150/243' },
                        { name: 'Pink', url: '/rgb/240/98/146' }
                    ]
                },
                { name: 'Pink', url: '/rgb/240/98/146' },
            ],
            navHidden: true
        };
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
                                <div className="nav-content">

                                    <this.NavLinks pages={this.state.pages} parent={this} />
                                </div>
                            </div>
                            <div className="right-content">
                                <div className={`black-overlay ${this.state.navHidden ? '' : 'visible'}`} onClick={() => this.mobileToggleNav(this)}>
                                </div>
                                <div className="top-bar">
                                    <div className="open-nav-button" onClick={() => this.mobileToggleNav(this)}>
                                    </div>
                                </div>
                                <div className="content">
                                    <Scroller>
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
                                                            {/* Without this `Route`, we would get errors during
                                                                the initial transition from `/` to `/hsl/10/90/50`
                                                            */}
                                                            <Route render={() => <div>Not Found</div>} />
                                                        </Switch>
                                                    </CSSTransition>
                                                </TransitionGroup>
                                            </div>
                                        </div>
                                    </Scroller>
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

const styles: any = {};

styles.fill = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
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
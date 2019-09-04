import React, { RefObject, useState } from "react";
import './Course.scss';
import { Scroller } from "../scroller/Scroller";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink } from "react-router-dom";
import { WebApi } from "../utils/ServerApi";
import { CourseState, NavPage, NavPageFolder } from '../../../shared-objects/CourseState';
import { AppState } from "../utils/AppState";
import { useGlobal, Component } from 'reactn';
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
export class Course extends Component<CourseProps, CourseStatePrivate> {
    webapi: WebApi | null = null;

    pageQueries: any = {};

    props: CourseProps;

    isUserTeacher: boolean = false;

    constructor(props: CourseProps, state: CourseState) {
        super();
        this.props = props;
        this.state = {
            pages: [],
            navHidden: true,
            courseName: '',
            courseId: '',
            admins: [],
            profileOpen: false
        };

        this.mobileToggleNav = this.mobileToggleNav.bind(this);
        this.PageFeeder = this.PageFeeder.bind(this);
        this.OpenFirstPage = this.OpenFirstPage.bind(this);
        this.UserPfp = this.UserPfp.bind(this);
        this.renderMainView = this.renderMainView.bind(this);
        this.EditableNavLinks = this.EditableNavLinks.bind(this);

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

            this.isUserTeacher = state.admins.includes(((this.global as AppState).signedInUser as LoggedInUserInfo).id);

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

    EditableNavLinks(props: { pages: (NavPage | NavPageFolder)[] }) {
        interface Folder extends NavPageFolder {
            folded: boolean,
            id: string
        }

        const [user, _]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');
        const [editing, setEditing]: [boolean, any] = useState(false);
        const [pages, setPages]: [(NavPage | Folder)[], any] = useState([])
        const [lastFolderID, setLastFolderID]: [number, any] = useState(0)
        const [resetState, setResetState]: [boolean, any] = useState(false);

        let _pages: (NavPage | Folder)[] = pages;
        function _setPages(p: (NavPage | Folder)[]) {
            _pages = p;
            setPages(p);
        }
        const [pageDict, setPageDict]: [any, any] = useState(null)

        if ((props.pages.length != pages.length && pages.length == 0) || resetState) {
            let pgs: (NavPage | Folder)[] = []

            let folderid = lastFolderID;
            props.pages.forEach(p => {
                if ((p as NavPage).id == null) {
                    let f: Folder = {
                        id: '@' + folderid++,
                        folded: true,
                        name: (p as NavPageFolder).name,
                        pages: []
                    };
                    (p as NavPageFolder).pages.forEach(_p => {
                        f.pages.push({ ..._p });
                    });
                    pgs.push(f);
                }
                else {
                    pgs.push({ ...p } as NavPage);
                }
            });
            setLastFolderID(folderid);
            setPages(pgs);
            if (resetState) setResetState(false)
        }

        if (pageDict == null && pages.length != 0)
            updatePageDict();

        function updatePageDict() {
            let d: any = {};
            pages.forEach(p => {
                d[p.id] = p;
                if ((p as Folder).pages != null) {
                    (p as NavPageFolder).pages.forEach(_p => {
                        d[_p.id] = _p;
                    });
                }
            });
            setPageDict(d);
        }

        function getPageList(p: string[]) {
            return p.map(_p => pageDict[_p]);
        }

        const EditableNavLink = ((props: { link: NavPage, editing: boolean, onDelete: () => void }) => {
            const [editingName, setEditingName]: [boolean, any] = useState(false);
            const [linkName, setLinkName]: [string, any] = useState(props.link.name);

            if (!editing && editingName) setEditingName(false);

            function onEdit(e: React.ChangeEvent<HTMLInputElement>) {
                setLinkName(e.target.value);
                props.link.name = e.target.value;
            }

            props.link.name = linkName;

            return (
                <Link to={props.link.id}>
                    <div className={`nav-link nav-child-link ${props.editing ? 'editing' : ''} ${editingName ? 'editing-name' : ''}`} onClick={() => { if (!this.state.navHidden) this.mobileToggleNav() }}>
                        <div className="highlight-fill"></div>
                        <div className="material-icons drag-handle">drag_indicator</div>
                        {
                            editingName ?
                                (
                                    <div className="input-container">
                                        <div>
                                            <input onClick={e => { e.stopPropagation(); e.preventDefault(); }} onChange={onEdit} value={linkName} />
                                        </div>
                                    </div>
                                ) :
                                (
                                    <div className="name">{linkName}</div>
                                )

                        }
                        <div className="material-icons edit-icon" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingName(!editingName);
                        }}>{editingName ? 'save' : 'create'}</div>
                        <div className="material-icons delete-icon" onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation();
                            props.onDelete();
                        }}>delete</div>
                    </div>
                </Link>
            )
        }).bind(this);

        const EditableNavLinkFolder = ((props: { folder: Folder, id: number, editing: boolean, onDelete: () => void }) => {
            if (props.folder.folded == null) props.folder.folded = true;
            const [heightAuto, setHeightAuto]: [boolean, any] = useState<boolean>(!props.folder.folded);
            const [folded, setFolded]: [boolean, any] = useState<boolean>(props.folder.folded);
            const [unfoldHeight, setUnfoldHeight]: [number, any] = useState<number>(0);

            const [editingName, setEditingName]: [boolean, any] = useState(false);
            const [linkName, setLinkName]: [string, any] = useState(props.folder.name);


            const [tout, setTout]: [number | null, any] = useState(null);
            const [heightRef, setHeightRef]: [HTMLElement | null, any] = useState<HTMLElement | null>(null);

            function onEdit(e: React.ChangeEvent<HTMLInputElement>) {
                setLinkName(e.target.value);
                props.folder.name = e.target.value;
            }

            if (!folded && heightRef != null)
                if (heightRef.clientHeight != unfoldHeight)
                    setUnfoldHeight(heightRef!.clientHeight);

            const toggleOpen = () => {
                props.folder.folded = !props.folder.folded;
                setFolded(props.folder.folded);
                if (!folded) {
                    setHeightAuto(false);
                    if (tout != null) {
                        clearTimeout(tout);
                    }
                    setTout(setTimeout(() => {
                        setUnfoldHeight(0);
                        setTout(null);
                    }, 30))
                }
                else {
                    setUnfoldHeight(heightRef!.clientHeight);
                    if (tout != null) clearTimeout(tout);
                    setTout(setTimeout(() => {
                        setHeightAuto(true);
                        setTout(null);
                    }, 300))
                }
            }

            return (
                <div>
                    <div className={`nav-link nav-folder ${folded ? '' : 'open'} ${props.editing ? 'editing' : ''}`} onClick={toggleOpen}>
                        <div className="highlight-fill"></div>
                        <div className="material-icons drag-handle">drag_indicator</div>
                        {
                            editingName ?
                                (
                                    <div className="input-container">
                                        <div>
                                            <input onClick={e => { e.stopPropagation(); e.preventDefault(); }} onChange={onEdit} value={linkName} />
                                        </div>
                                    </div>
                                ) :
                                (
                                    <div className="name">{linkName}</div>
                                )

                        }
                        <div className="material-icons edit-icon" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingName(!editingName);
                        }}>{editingName ? 'save' : 'create'}</div>
                        <div className="material-icons delete-icon" onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation();
                            props.onDelete();
                        }}>delete</div>
                        <span className="nav-folder-arrow">
                            <i className="material-icons down">keyboard_arrow_down</i>
                            <i className="material-icons up">keyboard_arrow_up</i>
                        </span>
                    </div>
                    <div className={`links-collapse ${heightAuto ? 'height-auto' : ''}`} style={{ height: heightAuto ? undefined : (unfoldHeight) }}>
                        <div ref={(e) => {
                            setHeightRef(e);
                        }}>
                            <Sortable
                                tag="div"
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
                                    swapThreshold: 0.2,
                                    disabled: !editing
                                }}
                                ref={(e: any) => { if (e != null) e.sortable.options.disabled = !editing }}
                                onChange={(order: any, sortable: any, evt: any) => {
                                    console.log(order)
                                    _setPages(_pages.map(e => {
                                        if (e.id == props.folder.id) {
                                            (e as Folder).pages = getPageList(order);
                                        }
                                        return e;
                                    }));
                                }}
                            >
                                {
                                    props.folder.pages.map((e, i) => (
                                        <div key={i} data-id={e.id}>
                                            <EditableNavLink editing={props.editing} onDelete={() => { props.folder.pages.splice(i, 1); setPages(pages.map((e: any) => e)); }} link={e} />
                                        </div>
                                    ))
                                }
                            </Sortable>
                        </div>
                    </div>
                </div >
            )

        }).bind(this);

        return (
            <div>
                <Sortable
                    tag="div"
                    options={{
                        group: {
                            name: 'parent',
                            put: ['folder'],
                            pull: ['folder']
                        },
                        animation: 150,
                        fallbackOnBody: true,
                        swapThreshold: 0.2,
                        disabled: !editing
                    }}
                    onChange={(order: any, sortable: any, evt: any) => {
                        console.log('parent', order, getPageList(order))
                        _setPages(getPageList(order));
                    }}
                    ref={(e: any) => { if (e != null) e.sortable.options.disabled = !editing }}
                >
                    {_pages.map((p, i) => {
                        if ((p as Folder).pages == null) {
                            return (
                                <div key={i} data-id={(p as NavPage).id}>
                                    <EditableNavLink editing={editing} onDelete={() => { pages.splice(i, 1); setPages(pages.map((e: any) => e)); }} link={p as NavPage} />
                                </div>
                            )
                        }
                        else {
                            return (
                                <div key={i} data-id={p.id} className="folder">
                                    <EditableNavLinkFolder editing={editing} onDelete={() => { pages.splice(i, 1, ...(p as Folder).pages); setPages(pages.map((e: any) => e)); }} id={i} folder={p as Folder}></EditableNavLinkFolder>
                                </div>
                            )
                        }
                    })}
                </Sortable>
                {this.isUserTeacher && (<div className="edit-buttons-container">
                    <div>
                        <button className="edit" onClick={() => setEditing(!editing)}>{editing ? 'Save' : 'Edit'}</button>
                        {editing && (<button className="cancel-edit" onClick={() => {
                            setEditing(false);
                            setResetState(true);
                        }}>Cancel</button>)}
                    </div>
                    {editing && (
                        <div>
                            <button className="new-folder" onClick={() => {
                                pages.push({ folded: false, id: '@' + lastFolderID, name: 'Folder', pages: [] });
                                setPages(pages.map((e: any) => e));
                                setLastFolderID(lastFolderID + 1);
                                updatePageDict();
                            }}>New Folder</button>
                            <button className="new-page" onClick={() => {
                                let page = this.webapi!.createPage(this.props.match.params.id);
                                page.then(p => {
                                    pages.push({ id: p.id, name: p.name });
                                    this.pageQueries[p.id] = page;
                                    setPages(pages.map((e: any) => e));
                                    setLastFolderID(lastFolderID + 1);
                                    updatePageDict();
                                })
                            }}>New Page</button>
                        </div>
                    )}
                </div>)}
            </div >
        )
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
                                            {/*<this.NavLinks pages={this.state.pages} parent={this} />*/}
                                            <this.EditableNavLinks pages={this.state.pages} />
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
                                        <div className="profile-button">
                                            <this.UserPfp />
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
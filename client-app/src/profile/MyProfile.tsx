import React, { Component, RefObject } from 'react';
import { useState, useEffect } from "react";
import { useGlobal } from 'reactn';
import { LoggedInUserInfo } from "../../../shared-objects/UserInfo";
import { AppState } from "../utils/AppState";
import "./MyProfile.scss";
import { Scroller } from '../scroller/Scroller';
import { WebApi } from '../utils/ServerApi';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

enum Pages {
    None,
    Account,
    Security,
}

const Settings = {
    Account: (props: {}) => {
        const [user, setUser]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');
        const webapi = new WebApi();
        if (user == null) return null;
        return (
            <div className="info-box account">
                <div className="pfp-box">
                    <img src={webapi.getPfpUrl(user.id, 512)} />
                </div>
                <div className="other-box">
                    <div className="name">
                        <EditableText name="Name" text={user.name} onEdited={(s) => { }} />
                    </div>
                    <div className="email">
                        <EditableText name="Email" text={"testemail@gmail.com"} onEdited={(s) => { }} />
                    </div>
                </div>
            </div>
        )
    }
}

type EditableTextProps = {
    text: string,
    onEdited: (newText: string) => void,
    name?: string,
    error?: string
}

class EditableText extends React.Component<
    EditableTextProps,
    { editing: boolean, loading: boolean, text: string, changed: boolean, noTransition: boolean, boxWidth: number }> {

    constructor(props: EditableTextProps) {
        super(props)
        this.state = {
            text: props.text,
            editing: false,
            loading: false,
            changed: true,
            noTransition: true,
            boxWidth: 0
        }
        this.onEdit = this.onEdit.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.onEditClicked = this.onEditClicked.bind(this);
        this.refreshSize = this.refreshSize.bind(this);
    }

    measureRef: RefObject<HTMLSpanElement> = React.createRef();
    inputRef: RefObject<HTMLInputElement> = React.createRef();

    onEdit(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ text: e.target.value, changed: true });
    }

    onEditClicked() {
        if (this.state.editing) {
            this.setState({ editing: false, noTransition: false });
        }
        else {
            this.setState({ editing: true, noTransition: false });
            setTimeout(() => this.setState({ noTransition: true }), 300)
            if (this.inputRef.current != null) {
                // console.log('select')
                // let len = this.inputRef.current.value.length;
                // this.inputRef.current.focus();
                // this.inputRef.current.select();
                // this.inputRef.current.setSelectionRange(len, len);
            }
        }
    }

    componentDidUpdate() {
        this.refreshSize();
    }

    componentDidMount() {
        this.refreshSize();
        setTimeout(() => this.setState({ noTransition: false }), 100)
    }

    refreshSize() {
        if (this.measureRef.current != null) {
            if (this.state.changed) {
                this.setState({ boxWidth: this.measureRef.current.clientWidth, changed: false })
            }
        }
    }

    render() {
        return (
            <div className={`profile-editable-wrap ${this.state.editing ? 'editing' : ''} ${this.state.noTransition ? 'snap' : ''}`}>
                {(this.props.name || this.props.error) && (
                    <div className="profile-editable-title">
                        {this.props.name}
                    </div>
                )}
                <div className="profile-editable" >
                    <input ref={this.inputRef} onChange={this.onEdit} value={this.state.text} disabled={!this.state.editing} spellCheck={false} style={{ width: this.state.boxWidth + 10 }} />
                    <span ref={this.measureRef} className="size-measure">{this.state.text}</span>
                    <button onClick={this.onEditClicked}>
                        {
                            (() => {
                                return this.state.editing ? 'Save' : 'Edit';
                            })()
                        }
                    </button>
                </div>
            </div>
        )
    }
}

function PageWrap(props: { name: string, children: any, backClicked: () => void }) {
    return (
        <div className="page-wrap">
            <div className="page-mobile-title">
                <div onClick={props.backClicked} className="page-mobile-back-button material-icons">
                    arrow_back
                </div>
                <div className="title-text">{props.name}</div>
            </div>
            <Scroller>
                <div className="profile-page-padding">
                    {props.children}
                </div>
            </Scroller>
        </div>
    )
}

export default function MyProfile(props: { onCloseClicked: () => void }) {
    const [currPage, setCurrPage]: [Pages, any] = useState<Pages>(Pages.Account);
    const [loaded, setLoaded]: [boolean, any] = useState<boolean>(false);

    if (window.innerWidth < 768 && !loaded) {
        setCurrPage(Pages.None)
    }

    if (!loaded) setLoaded(true);

    function Link(props: { children: any, to: Pages }) {
        return (
            <div onClick={() => setCurrPage(props.to)} className={currPage == props.to ? 'active' : ''}>
                {props.children}
            </div>
        )
    }

    return (
        <div
            className={`fill ${currPage == Pages.None ? 'none-selected' : 'page-selected'}`}>
            <div className="profile-nav-side">
                <Scroller>
                    <div className="profile-nav-bar">
                        <div className="profile-nav-bar-inner">
                            <div className="profile-nav-group-title">GENERAL</div>
                            <Link to={Pages.Account}>
                                <div className="profile-nav-link"><span className="material-icons">person</span>Account</div>
                            </Link>
                            <Link to={Pages.Security}>
                                <div className="profile-nav-link"><span className="material-icons">vpn_key</span>Security</div>
                            </Link>
                            <div className="profile-nav-link" onClick={(() => props.onCloseClicked())}>Back...</div>
                        </div>
                    </div>
                </Scroller>
            </div>
            <div className="profile-page">
                <TransitionGroup>
                    <CSSTransition
                        key={currPage}
                        classNames="profile-fade"
                        timeout={10000}
                    >
                        {
                            (() => {
                                if (currPage == Pages.None) return <div></div>
                                if (currPage == Pages.Account) return (
                                    <PageWrap backClicked={() => setCurrPage(Pages.None)} name="Account">
                                        <Settings.Account />
                                    </PageWrap>
                                )
                                if (currPage == Pages.Security) return (
                                    <PageWrap backClicked={() => setCurrPage(Pages.None)} name="Security">
                                        <Settings.Account />
                                    </PageWrap>
                                )
                            })()
                        }
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    )
}
import React, { Component } from 'react';
import { useState } from "react";
import { useGlobal } from 'reactn';
import { LoggedInUserInfo } from "../../../shared-objects/UserInfo";
import { AppState } from "../utils/AppState";
import "./MyProfile.scss";
import { Scroller } from '../scroller/Scroller';
import { WebApi } from '../utils/ServerApi';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

enum Pages {
    Account,
    Security,
}

const Settings = {
    Account: (props: {}) => {
        const [user, setUser]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');
        const webapi = new WebApi();
        if (user == null) return null;
        return (
            <div className="info-box">
                <img src={webapi.getPfpUrl(user.id, 512)} />
            </div>
        )
    }
}

export default function MyProfile(props: { onCloseClicked: () => void }) {
    const [currPage, setCurrPage]: [Pages, any] = useState<Pages>(Pages.Account);
    function Link(props: { children: any, to: Pages }) {
        return (
            <div onClick={() => setCurrPage(props.to)} className={currPage == props.to ? 'active' : ''}>
                {props.children}
            </div>
        )
    }

    return (
        <div className="fill">
            <div className="nav-side">
                <Scroller>
                    <div className="nav-bar">
                        <div className="nav-bar-inner">
                            <div className="nav-group-title">GENERAL</div>
                            <Link to={Pages.Account}>
                                <div className="link">Account</div>
                            </Link>
                            <Link to={Pages.Security}>
                                <div className="link">Security</div>
                            </Link>
                            <div className="link" onClick={(() => props.onCloseClicked())}>Back...</div>
                        </div>
                    </div>
                </Scroller>
            </div>
            <div className="page-container">
                <Scroller>
                    <div className="page">

                        <TransitionGroup>
                            <CSSTransition
                                key={currPage}
                                classNames="fade"
                                timeout={400}
                            >
                                {
                                    (() => {
                                        if (currPage == Pages.Account) return <Settings.Account />
                                        if (currPage == Pages.Security) return <Settings.Account />
                                    })()
                                }
                            </CSSTransition>
                        </TransitionGroup>
                    </div>
                </Scroller>
            </div>
        </div>
    )
}
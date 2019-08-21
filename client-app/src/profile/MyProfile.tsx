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
            <div className="info-box">
                <img src={webapi.getPfpUrl(user.id, 512)} />
                <img src={webapi.getPfpUrl(user.id, 512)} />
                <img src={webapi.getPfpUrl(user.id, 512)} />
                <img src={webapi.getPfpUrl(user.id, 512)} />
                <img src={webapi.getPfpUrl(user.id, 512)} />
            </div>
        )
    }
}

export default function MyProfile(props: { onCloseClicked: () => void }) {
    const [currPage, setCurrPage]: [Pages, any] = useState<Pages>(Pages.None);
    function Link(props: { children: any, to: Pages }) {
        return (
            <div onClick={() => setCurrPage(props.to)} className={currPage == props.to ? 'active' : ''}>
                {props.children}
            </div>
        )
    }

    return (
        <div className={`fill ${currPage == Pages.None ? 'none-selected' : 'page-selected'}`}>
            <div className="profile-nav-side">
                <Scroller>
                    <div className="profile-nav-bar">
                        <div className="profile-nav-bar-inner">
                            <div className="profile-nav-group-title">GENERAL</div>
                            <Link to={Pages.Account}>
                                <div className="profile-nav-link">Account</div>
                            </Link>
                            <Link to={Pages.Security}>
                                <div className="profile-nav-link">Security</div>
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
                        timeout={400}
                    >
                        {
                            (() => {
                                if (currPage == Pages.None) return <div></div>
                                if (currPage == Pages.Account) return <Scroller><Settings.Account /></Scroller>
                                if (currPage == Pages.Security) return <Scroller><Settings.Account /></Scroller>
                            })()
                        }
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    )
}
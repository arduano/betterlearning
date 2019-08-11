import { LoggedInUserInfo } from '../../../shared-objects/UserInfo'
import { Component } from 'react';
import React from 'react';
import { Context } from 'istanbul-lib-report';

export interface AppState{
    signedInUser: LoggedInUserInfo | null
}

const appStateDefault: AppState = {
    signedInUser: null
}

const {Provider, Consumer} = React.createContext(appStateDefault);

export const AppStateProvider = Provider;
export const AppStateConsumer = Consumer;
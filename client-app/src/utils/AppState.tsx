import { LoggedInUserInfo } from '../../../shared-objects/UserInfo'
import { Component } from 'react';
import React from 'react';
import { Context } from 'istanbul-lib-report';

export interface AppState{
    signedInUser: LoggedInUserInfo | null
}
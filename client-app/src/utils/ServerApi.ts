import { UserInfo } from './../../../shared-objects/UserInfo';
import { PageComment } from './../../../shared-objects/PageComment';
import { AppState } from './AppState';
import { CourseState } from '../../../shared-objects/CourseState';
import { LoggedInUserInfo } from '../../../shared-objects/UserInfo';
import React from 'react';
import { useGlobal } from 'reactn';
import axios from 'axios';
import { PageData } from '../../../shared-objects/PageData';

export class WebApi {
    static urlBase = 'http://localhost:8080/';


    constructor() {
    }

    getAuthHeaders() {
        return { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    }

    //Returns token or throws error
    async login(name: string, pass: string) {
        let response = await axios.post(WebApi.urlBase + 'api1/login', { name, pass });
        return response.data.token;
    }

    async getCourse(id: string): Promise<CourseState> {
        let response = await axios.get(WebApi.urlBase + 'api1/course/' + id, { headers: this.getAuthHeaders() });
        return response.data as CourseState;
    }

    async getPage(cid: string, pid: string) {
        let response = await axios.get(WebApi.urlBase + `api1/page/${cid}/${pid}`, { headers: this.getAuthHeaders() });
        return response.data as PageData;
    }

    async getComments(pid: string) {
        let response = await axios.get(WebApi.urlBase + `api1/comments/${pid}`, { headers: this.getAuthHeaders() });
        return response.data as PageComment[];
    }

    async getUser(uid: string) {
        let response = await axios.get(WebApi.urlBase + `api1/user/${uid}`, { headers: this.getAuthHeaders() });
        return response.data as UserInfo;
    }

    async getMe() {
        let response = await axios.get(WebApi.urlBase + `api1/user/@me`, { headers: this.getAuthHeaders() });
        return response.data as LoggedInUserInfo;
    }
}
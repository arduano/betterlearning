import { MainState } from './../main/Main';
import React from 'react';
import axios from 'axios';

export class WebApi {
    static async getNavPages(): Promise<MainState> {
        let response = await axios.get('http://localhost:8080/course/1234');
        console.log(response);
        return response.data as MainState;
    }
}
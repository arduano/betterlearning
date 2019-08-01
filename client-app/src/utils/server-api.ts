import { MainState } from './../main/Main';
import React from 'react';

export class WebApi {
    static async getNavPages(): Promise<MainState> {
        return {
            courseName: 'Test Course',
            pages: [
                { name: 'Red', url: '/hsl/10/90/50' },
                { name: 'Green', url: '/hsl/120/100/40' },
                { name: 'Blue', url: '/rgb/33/150/243' },
                {
                    name: 'Link Folder', pages: [
                        { name: 'Red', url: '/hsl/10/90/50' },
                        { name: 'Green', url: '/hsl/120/100/40' },
                        { name: 'Blue', url: '/rgb/33/150/243' },
                        { name: 'Pink', url: '/rgb/240/98/146' },
                        { name: 'Long Page', url: '/longpage' }
                    ]
                },
                { name: 'Pink', url: '/rgb/240/98/146' },
            ]
        }
    }
}
import { PageData } from '../../../shared-objects/PageData';
import React from 'react';
import { HTMLPage } from './HTMLPage';
import { Scroller } from '../scroller/Scroller';

export class PageWrapper extends React.Component<{ data: Promise<PageData> }, { data: PageData | null }> {
    constructor(props: { data: Promise<PageData> }) {
        super(props)
        this.state = { data: null }
    }

    componentWillMount() {
        this.props.data.then(data => this.setState({ data }));
    }

    render() {
        if (this.state.data == null) {
            return <h1>LOADING...</h1>
        }
        else {
            console.log('rendering...');

            if (this.state != null)
                if (this.state.data.type == 'html') {
                    return <Scroller><HTMLPage {...this.state.data.data}/></Scroller>
                }
        }
    }
}
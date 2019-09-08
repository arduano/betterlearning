import { HTMLPageData } from "../../../shared-objects/PageData";
import React, { CSSProperties, RefObject, createRef } from "react";
import "./CommentStyling.scss";

const iframeStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none'
}

export class HTMLPage extends React.Component<HTMLPageData, {}>{
    constructor(props: HTMLPageData) {
        super(props)
        //this.shadowref = createRef<HTMLDivElement>();
        //this.shadowLoaded = this.shadowLoaded.bind(this);
    }

    //shadowref: RefObject<HTMLDivElement>;

    componentDidMount() {
        //if(this.shadowref.current == null) return;
        //this.shadowref.current.innerHTML = this.props.html;
        //let shadow = this.shadowref.current.attachShadow({mode: 'closed'});
        //shadow.innerHTML = this.props.html;
    }

    shadowLoaded() {
    }

    render() {
        return <div ref={r => { if (r != null) r.innerHTML = this.props.html }} onLoad={this.shadowLoaded}></div>
        //return (<iframe scrolling="no" style={iframeStyle} src={'data:text/html;charset=utf-8,' + encodeURI(this.props.html)} />)
    }
}
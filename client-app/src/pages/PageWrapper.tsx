import { PageData } from '../../../shared-objects/PageData';
import { PageComment } from '../../../shared-objects/PageComment';
import { UserInfo } from '../../../shared-objects/UserInfo';
import React, { useState } from 'react';
import { HTMLPage } from './HTMLPage';
import { Scroller } from '../scroller/Scroller';
import { WebApi } from '../utils/ServerApi';
import { resolveSoa } from 'dns';

export class PageWrapper extends React.Component<{ data: Promise<PageData> }, { data: PageData | null, comments: PageComment[] | null }> {
    constructor(props: { data: Promise<PageData> }) {
        super(props)
        this.state = { data: null, comments: null }
    }

    componentWillMount() {
        this.props.data.then(data => {
            this.setState({ data })
            let webapi = new WebApi();
            webapi.getComments(data.id).then(comments => this.setState({ comments }));
        });
    }

    render() {
        if (this.state.data == null) {
            return <h1>LOADING...</h1>
        }
        else {
            if (this.state != null) {
                let page = null;
                if (this.state.data.type == 'html') {
                    page = (<HTMLPage {...this.state.data.data} />)
                }

                let comments = null;

                if (this.state.comments != null) {
                    console.log(comments);
                    comments = this.state.comments.map((c, i) => {
                        if (this.state.data != null) {
                            return (
                                <CommentComponent comment={c} pageid={this.state.data.id} key={i} />
                            )
                        }
                    });
                }

                return (
                    <Scroller>
                        <div>
                            {page}
                        </div>
                        <div>
                            {comments}
                        </div>
                    </Scroller>
                )
            }
        }
    }
}

const CommentComponent = (props: { comment: PageComment, pageid: string }) => {
    const [user, setUser]: [UserInfo | null, any] = useState<UserInfo | null>(null);
    const [liked, setLike]: [boolean, any] = useState<boolean>(false);

    if (user == null) {
        new WebApi().getUser(props.comment.author).then(u => setUser(u));
    }

    const getDateString = (d: Date) => {
        d = new Date(d);
        return  d.getDay() + "/" + (d.getMonth() + 1) + "/" +  d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() 
    }

    return (
        <div className="comment-wrap">
            <div>
                <img className="comment-pfp" src={"/pfp.png"} />
            </div>
            <div className="comment-content">
                <div className="comment-user">
                    {user != null && user.name}
                    <span className="comment-date"> - {getDateString(props.comment.time)}</span>
                </div>
                <div>
                    {props.comment.content}
                </div>
                <div className="like-button">
                    <div className="like-count">{props.comment.likes}</div>
                    <div className="material-icons thumb-up">thumb_up</div>
                </div>
            </div>
        </div>
    )
}
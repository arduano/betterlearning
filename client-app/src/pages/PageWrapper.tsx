import { PageData } from '../../../shared-objects/PageData';
import { PageComment } from '../../../shared-objects/PageComment';
import { UserInfo, LoggedInUserInfo } from '../../../shared-objects/UserInfo';
import React, { useState } from 'react';
import { useGlobal } from 'reactn';
import { HTMLPage } from './HTMLPage';
import { Scroller } from '../scroller/Scroller';
import { WebApi } from '../utils/ServerApi';
import { resolveSoa } from 'dns';
import { AppState } from '../utils/AppState';
import * as ReactQuill from 'react-quill';
import '../../node_modules/react-quill/dist/quill.snow.css';
import './quill.comment.scss';
import { PageComments } from '../../../shared-objects/PageComments';
import { AssertionError } from 'assert';

var Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['Ubuntu', 'Raleway', 'Roboto'];
ReactQuill.Quill.register(Font, false);

interface WrapperState extends PageComments {
    data: PageData | null
}

export class PageWrapper extends React.Component<{ data: Promise<PageData> }, WrapperState> {
    constructor(props: { data: Promise<PageData> }) {
        super(props)
        this.state = { data: null, comments: undefined }
    }

    componentWillMount() {
        this.props.data.then(data => {
            this.setState({ data })
            let webapi = new WebApi();
            webapi.getComments(data.id).then(comments => this.setState({ ...comments }));
        });
    }

    reloadComments() {
        if (this.state.comments != null)
            this.setState({ comments: this.state.comments.map(c => c) });
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
                    comments = this.state.comments.sort((a, b) => (new Date(b.time).getTime() - new Date(a.time).getTime())).map((c, i) => {
                        if (this.state.data != null) {
                            return (
                                <CommentComponent comment={c} isReply={false} key={this.state.comments!.length - i} />
                            )
                        }
                    });
                }

                return (
                    <Scroller>
                        <div>
                            {page}
                        </div>
                        {this.state.comments != undefined && (
                            <div>
                                <CommentComposer isReply={false} pid={this.state.data.id} posted={(c) => {
                                    this.state.comments!.push({
                                        author: c.author,
                                        id: c.id,
                                        replies: [],
                                        time: new Date(c.time)
                                    });
                                    this.reloadComments();
                                }} />
                            </div>
                        )}
                        <div>
                            {comments}
                        </div>
                    </Scroller>
                )
            }
        }
    }
}

type BasicCommentProps = {
    id: string,
    author: string,
    time: Date,
    replies?: {
        id: string,
        author: string,
        time: Date,
    }[]
}

function CommentComponent(props: { comment: BasicCommentProps, isReply: boolean, fullComment?: PageComment }) {
    const [user, setUser]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');

    const [author, setAuthor]: [UserInfo | null, any] = useState<UserInfo | null>(null);
    const [comment, setComment]: [PageComment | null, any] = useState<PageComment | null>(null);
    const [liked, setLike]: [boolean, any] = useState<boolean>(false);
    const webapi = new WebApi();

    if (user != null && comment != null) {
        let _liked = comment.likes.includes(user.id);
        if (_liked != liked)
            setLike(_liked);
    }

    if (author == null || author.id != props.comment.author) {
        webapi.getUser(props.comment.author).then(u => setAuthor(u));
    }

    if (comment == null || comment.id != props.comment.id) {
        if (props.fullComment != undefined) {
            setComment(props.fullComment);
        }
        else {
            webapi.getComment(props.comment.id).then(c => setComment(c));
        }
    }

    const getDateString = (d: Date) => {
        d = new Date(d);
        return d.getDay() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    }

    const likeClicked = () => {
        if (user != null && comment != null) {
            if (comment.likes.includes(user.id)) {
                webapi.unlikeComment(props.comment.id).then(() => {
                    comment.likes.splice(comment.likes.indexOf(user.id), 1);
                    setLike(false);
                })
            }
            else {
                webapi.likeComment(props.comment.id).then(() => {
                    comment.likes.push(user.id);
                    setLike(true);
                })
            }
        }
    }

    return (
        <div className="comment-wrap">
            <div>
                <img className="comment-pfp" src={author != null ? webapi.getPfpUrl(author.id, 256) : ''} />
            </div>
            <div className="comment-content">
                <div className="comment-user">
                    {author != null && author.name}
                    <span className="comment-date"> - {getDateString(props.comment.time)}</span>
                </div>
                <div ref={(e: HTMLDivElement) => { if (comment != null && e != null) e.innerHTML = comment.content }}>
                </div>
                <div className={`like-button ${user != null && comment != null && comment.likes.includes(user.id) ? 'liked' : ''}`} onClick={likeClicked}>
                    <div className="like-count">{comment != null ? comment.likes.length : null}</div>
                    <div className="material-icons thumb-up">thumb_up</div>
                </div>
            </div>
        </div>
    )
}

function CommentComposer(props: { isReply: boolean, pid: string, comment?: string, posted: (comment: PageComment) => void }) {
    if (props.isReply && props.comment == undefined) throw new AssertionError();
    const [data, setData]: [string, any] = useState<string>("");

    function onPost() {
        if(data != "")
        new WebApi().postComment(props.pid, data).then((c) => {
            setData("");
            props.posted(c);
        });
    }

    return (
        <div className="compose-comment">
            <div>
                <ReactQuill.default theme="snow" value={data}
                    modules={{
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code', 'clean', 'image'],
                        ],
                    }}
                    onChange={(e) => { setData(e) }} />
            </div>
            <button className="post-button" onClick={onPost}>Post</button>
        </div>
    )
}
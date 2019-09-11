import React from 'react';
import './Login.scss';
import { AppState } from '../utils/AppState';
import { WebApi } from '../utils/ServerApi';
import { Redirect } from 'react-router';
import { LoggedInUserInfo } from '../../../shared-objects/UserInfo';
import { useGlobal } from 'reactn';

export function Login(props: {}) {
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        errorMessage: ''
    });

    let webapi = new WebApi();
    const [user, setUser]: [LoggedInUserInfo | null, any] = useGlobal<AppState>('signedInUser');

    const setError = (err: string) => {
        setValues({ ...values, errorMessage: err });
    };

    const onSubmit = async () => {
        if (values.username == '' || values.password == '') {
            setError('Enter a username and password');
            return;
        }
        try {
            var token = await webapi.login(values.username, values.password);
        }
        catch(error){
            if(error.response != null && error.response.status == 403){
                setError('Incorrect username/password');
                return;
            }
            setError('An error occured while logging in');
            return;
        }       
        console.log(token);
        localStorage.setItem('token', token);
        setError('');
    }

    if(localStorage.getItem('token') != null){
        return <Redirect to='/courses'/>
    }

    return (
        <div className="main">
            <div className="form-card">
                <div><h1>Welcome Back!</h1></div>
                <form>
                    <div>
                        <div className="form-item">
                            <div className="label">Username</div>
                            <input className="text username" onChange={e => setValues({ ...values, username: e.target.value })} type="email" autoComplete="off" spellCheck={false} />
                        </div>
                        <div className="form-item">
                            <div className="label">Password</div>
                            <input onKeyDown={e => { if (e.key == 'Enter') onSubmit() }} className="text password" onChange={e => setValues({ ...values, password: e.target.value })} type="password" autoComplete="off" spellCheck={false} />
                        </div>
                    </div>
                </form>
                <div className="form-item">
                    <button className="log-in" onClick={onSubmit}>
                        Log In
                    </button>
                </div>
                {
                    values.errorMessage != '' && (<div>{values.errorMessage}</div>)
                }
            </div>
        </div>
    );
}
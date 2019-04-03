import Cookies from 'universal-cookie';
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

export default (type, params) => {
    debugger;
    // called when the user attempts to log in
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        let data = {
            user: {
                email: username,
                password: password
            }
        }
        return fetch("https://muski.herokuapp.com/api/users/login", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .catch(error => {
                console.error('Error:', error);
                return Promise.reject();
            })
            .then(response => {
                if (response.user) {
                    const { token } = response.user
                    const cookies = new Cookies();
                    cookies.set('token', token);
                    return Promise.resolve();
                } else if (response.errors) {
                    //should add message
                    return Promise.reject()
                }
                return Promise.reject();
            });
    }
    // called when the user clicks on the logout button
    if (type === AUTH_LOGOUT) {
        const cookies = new Cookies();
        cookies.remove('token');
        return Promise.resolve();
    }
    // called when the API returns an error
    if (type === AUTH_ERROR) {
        const { status } = params;
        if (status === 401 || status === 403) {
            const cookies = new Cookies();
            cookies.remove('token');
            return Promise.reject();
        }
        return Promise.resolve();
    }
    // called when the user navigates to a new location
    if (type === AUTH_CHECK) {
        debugger;
        const cookies = new Cookies();
        const token = cookies.get('token');
        if (!token)
            return Promise.reject();

        return fetch("https://muski.herokuapp.com/api/user", {
            method: 'GET',
            headers: {
                'Authorization': "Token " + token
            }
        }).then(res => res.json())
            .catch(error => {
                console.error('Error:', error);
                return Promise.reject();
            })
            .then(response => {
                if (response.user) {
                    return Promise.resolve();
                } else if (response.errors) {
                    //should add message
                    return Promise.reject()
                }
                return Promise.reject();
            });
    }
    return Promise.reject('Unknown method');
};
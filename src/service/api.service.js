//import { useDispatch } from 'react-redux';

import { getLikeValue } from './posts.service';

const BASE_URL = process.env.REACT_APP_BASE_URL + '/api';

export const singUp = (email, password, userName) => {
    return fetch(BASE_URL + '/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userName }),
    });
};

export const getUserName = (userId, token) => {

     return fetch(BASE_URL + '/auth/userName/' + userId, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    }).then((response) => response.json());
};

export const getUserList = (token) => {

    return fetch(BASE_URL + '/auth/userList/', {
        method: 'GET',
       headers: {
           'Content-Type': 'application/json',
           Authorization: 'Bearer ' + token,
       },
   }).then((response) => response.json());
};

export const apiLogin = (login, password) => {
    return fetch(BASE_URL + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: login,
            password: password,
        }),
    }).then((response) => response.json());
};

export const getApiPosts = (token) => {
    return fetch(BASE_URL + '/post', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    }).then((response) => response.json());
};

export const creatPost = (token, data, file) => {

    let Body = null;
    const formData = new FormData();

    if (file) {
        formData.append('image', file);
    }

    formData.append('json', JSON.stringify({ text: data }));
    Body = formData;

    return fetch(BASE_URL + '/post', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token,
        },
        body: Body,
    }).then((response) => response.json());
};

export const updatePost = (token, data, file, idPost) => {
    let Body = null;
    const formData = new FormData();

    if (file) {
        formData.append('image', file);
    }

    formData.append('json', JSON.stringify({ text: data }));
    Body = formData;

    return fetch(BASE_URL + '/post/' + idPost, {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + token,
        },
        body: Body,
    }).then((response) => response.json());
};

export const deletPost = (user, post) => {

    return fetch(BASE_URL + '/post/' + post._id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token,
        },
    }).then((response) => response.json());
};

export const likePost = (user, post) => {
    return fetch(
        BASE_URL +
            '/post/like/?' +
            new URLSearchParams({
                id: post._id,
                like: getLikeValue(user, post),
            }),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token,
            },
        }
    ).then((response) => response.json());
};


import axios from 'axios';

import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_RESET,
    USER_GET_PROFILE_REQUEST,
    USER_GET_PROFILE_SUCCESS,
    USER_GET_PROFILE_FAIL,
    USER_GET_PROFILE_RESET,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_RESET,
} from '../constants/userConstants';
import { TODO_ADD_RESET, TODO_GET_RESET, TODO_EDIT_RESET, TODO_GET_ALL_RESET, TODO_DELETE_RESET } from '../constants/todoConstants';

export const register = (username, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('/api/user', { username, email, password }, config);

        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('/api/user/login', { email, password }, config);

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};

export const getProfile = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_GET_PROFILE_REQUEST });

        const {
            userLogin: { userInfo },
            userRegister: { userInfo: userInfoRegister },
        } = getState();
        const token = userInfo ? userInfo.token : userInfoRegister.token;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.get('/api/user', config);

        dispatch({ type: USER_GET_PROFILE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_GET_PROFILE_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};

export const updateProfile = (_id, username, password, image) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_REQUEST });

        const {
            userLogin: { userInfo },
            userRegister: { userInfo: userInfoRegister },
        } = getState();
        const token = userInfo ? userInfo.token : userInfoRegister.token;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.put('/api/user', { _id, username, password, image }, config);

        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};

export const logout = () => (dispatch) => {
    dispatch({ type: USER_REGISTER_RESET });
    dispatch({ type: USER_GET_PROFILE_RESET });
    dispatch({ type: USER_UPDATE_RESET });
    dispatch({ type: TODO_ADD_RESET });
    dispatch({ type: TODO_GET_RESET });
    dispatch({ type: TODO_EDIT_RESET });
    dispatch({ type: TODO_GET_ALL_RESET });
    dispatch({ type: TODO_DELETE_RESET });
    dispatch({ type: USER_LOGOUT });
    localStorage.removeItem('userInfo');
};
